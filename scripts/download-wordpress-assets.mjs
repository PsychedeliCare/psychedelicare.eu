import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ASSET_FOLDERS } from "./lib/asset-naming.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "..");
const defaultCatalogPath = path.join(workspaceRoot, "src", "data", "asset-catalog.json");
const defaultOutputDirectory = path.join(workspaceRoot, "public", "assets");
const obsoleteOutputDirectory = path.join(workspaceRoot, "public", "wp-content");

function parseArgs(argv) {
  const options = {
    catalogPath: defaultCatalogPath,
    outputDirectory: defaultOutputDirectory,
    concurrency: 8,
    force: false,
    dryRun: false,
    cleanStale: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--no-clean-stale") {
      options.cleanStale = false;
      continue;
    }

    if (arg === "--catalog") {
      options.catalogPath = path.resolve(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--output") {
      options.outputDirectory = path.resolve(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--concurrency") {
      options.concurrency = Number.parseInt(argv[index + 1] ?? "8", 10);
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isFinite(options.concurrency) || options.concurrency < 1) {
    throw new Error("--concurrency must be a positive integer");
  }

  return options;
}

function printHelp() {
  console.log(`Download WordPress assets using src/data/asset-catalog.json

Usage:
  pnpm generate-asset-catalog
  pnpm download-assets [options]

Options:
  --catalog <path>      Asset catalog JSON (default: src/data/asset-catalog.json)
  --output <path>       Output directory (default: public/assets)
  --concurrency <n>     Parallel downloads (default: 8)
  --force               Re-download files even if they already exist
  --no-clean-stale      Keep obsolete flat downloads from earlier runs
  --dry-run             Print planned downloads without fetching files
  --help, -h            Show this help message
`);
}

function validateCatalog(catalog) {
  if (!catalog?.assets || !Array.isArray(catalog.assets) || catalog.assets.length === 0) {
    throw new Error("Catalog is empty or missing an assets array.");
  }

  for (const asset of catalog.assets) {
    if (!asset.sourceUrl || !asset.localFilename || !asset.localPath) {
      throw new Error("Catalog asset is missing sourceUrl, localFilename, or localPath.");
    }

    if (!asset.folder || !ASSET_FOLDERS.includes(asset.folder)) {
      throw new Error(
        `Catalog asset "${asset.localFilename}" has invalid folder "${asset.folder ?? ""}". Regenerate the catalog.`,
      );
    }

    const expectedPath = `/assets/${asset.folder}/${asset.localFilename}`;
    if (asset.localPath !== expectedPath) {
      throw new Error(
        `Catalog asset "${asset.localFilename}" has mismatched localPath. Regenerate the catalog.`,
      );
    }
  }
}

function formatAssetLabel(asset) {
  return `${asset.folder}/${asset.localFilename}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function removeStaleFlatDownloads(outputDirectory, planned) {
  let removed = 0;

  for (const asset of planned) {
    const flatPath = path.join(outputDirectory, asset.localFilename);
    const nestedPath = path.join(outputDirectory, asset.folder, asset.localFilename);

    if (flatPath === nestedPath || !(await fileExists(flatPath))) {
      continue;
    }

    await fs.unlink(flatPath);
    removed += 1;
    console.log(`removed stale ${path.relative(workspaceRoot, flatPath)}`);
  }

  return removed;
}

async function removeObsoleteWordPressMirror() {
  if (!(await fileExists(obsoleteOutputDirectory))) {
    return false;
  }

  await fs.rm(obsoleteOutputDirectory, { recursive: true, force: true });
  console.log(`removed obsolete ${path.relative(workspaceRoot, obsoleteOutputDirectory)}/`);
  return true;
}

async function downloadAsset(assetUrl, destinationPath, retries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(assetUrl, {
        redirect: "follow",
        headers: {
          "User-Agent": "psychedelicare.eu-asset-migration/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.mkdir(path.dirname(destinationPath), { recursive: true });
      await fs.writeFile(destinationPath, buffer);
      return buffer.byteLength;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw lastError;
}

async function runWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker()),
  );

  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  try {
    await fs.access(options.catalogPath);
  } catch {
    throw new Error(
      `Asset catalog not found at ${path.relative(workspaceRoot, options.catalogPath)}. Run "pnpm generate-asset-catalog" first.`,
    );
  }

  const catalog = JSON.parse(await fs.readFile(options.catalogPath, "utf8"));
  validateCatalog(catalog);

  const planned = catalog.assets
    .map((asset) => ({
      ...asset,
      destinationPath: path.join(options.outputDirectory, asset.folder, asset.localFilename),
    }))
    .sort((a, b) => {
      const folderCompare = a.folder.localeCompare(b.folder);
      return folderCompare !== 0 ? folderCompare : a.localFilename.localeCompare(b.localFilename);
    });

  const invalidUrls = planned.filter(({ sourceUrl }) => {
    try {
      const url = new URL(sourceUrl);
      return url.protocol !== "https:" || url.hostname !== "psychedelicare.eu";
    } catch {
      return true;
    }
  });

  if (invalidUrls.length > 0) {
    throw new Error(
      `Catalog contains ${invalidUrls.length} invalid or unexpected URLs. Aborting.`,
    );
  }

  console.log(`Catalog: ${path.relative(workspaceRoot, options.catalogPath)}`);
  console.log(`Output:  ${path.relative(workspaceRoot, options.outputDirectory)}/`);
  console.log(`Assets:  ${planned.length}`);

  if (catalog.totals?.byFolder) {
    console.log("Folders:");
    for (const folder of ASSET_FOLDERS) {
      const count = catalog.totals.byFolder[folder] ?? 0;
      if (count > 0) {
        console.log(`  ${folder}/: ${count}`);
      }
    }
  }

  if (options.dryRun) {
    for (const asset of planned) {
      console.log(`${asset.sourceUrl} -> ${path.relative(workspaceRoot, asset.destinationPath)}`);
    }
    console.log(`Dry run complete. ${planned.length} assets would be downloaded.`);
    return;
  }

  if (options.cleanStale) {
    const removedFlat = await removeStaleFlatDownloads(options.outputDirectory, planned);
    const removedMirror = await removeObsoleteWordPressMirror();
    if (removedFlat > 0 || removedMirror) {
      console.log("");
    }
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let totalBytes = 0;
  const failures = [];

  const results = await runWithConcurrency(planned, options.concurrency, async (asset) => {
    const { sourceUrl, destinationPath } = asset;
    const label = formatAssetLabel(asset);

    if (!options.force && (await fileExists(destinationPath))) {
      skipped += 1;
      console.log(`skip  ${label}`);
      return { status: "skipped", sourceUrl, destinationPath, label };
    }

    try {
      const bytes = await downloadAsset(sourceUrl, destinationPath);
      downloaded += 1;
      totalBytes += bytes;
      console.log(`saved ${label} (${bytes} bytes)`);
      return { status: "downloaded", sourceUrl, destinationPath, label, bytes };
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ sourceUrl, destinationPath, label, message });
      console.error(`fail  ${label}: ${message}`);
      return { status: "failed", sourceUrl, destinationPath, label, message };
    }
  });

  const reportPath = path.join(workspaceRoot, "src", "data", "asset-download-report.json");
  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        catalogPath: path.relative(workspaceRoot, options.catalogPath),
        outputDirectory: path.relative(workspaceRoot, options.outputDirectory),
        totals: {
          assets: planned.length,
          downloaded,
          skipped,
          failed,
          bytes: totalBytes,
          byFolder: catalog.totals?.byFolder ?? {},
        },
        failures,
        results,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `\nDone. ${downloaded} downloaded, ${skipped} skipped, ${failed} failed (${totalBytes} bytes).`,
  );
  console.log(`Report written to ${path.relative(workspaceRoot, reportPath)}.`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
