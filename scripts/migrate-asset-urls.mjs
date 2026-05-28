import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "..");
const catalogPath = path.join(workspaceRoot, "src", "data", "asset-catalog.json");

const TARGET_DIRECTORIES = [path.join(workspaceRoot, "src", "content")];

const EXTRA_URL_MAP = {
  "https://psychedelicare.eu/wp-content/uploads/2023/08/psychedelicareeu-logo.svg":
    "/assets/psychedelicareeu-logo.svg",
};

const REFERENCED_ASSET_PATTERN =
  /_Referenced image asset:_\s*\[[^\]]*\]\((https:\/\/psychedelicare\.eu\/wp-content\/uploads\/[^)]+)\)/g;

const WORDPRESS_URL_PATTERN =
  /https:\/\/psychedelicare\.eu\/wp-content\/uploads\/[^\s"'<>)\]]+/g;

function parseArgs(argv) {
  return {
    dryRun: argv.includes("--dry-run"),
  };
}

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }

    if (/\.(mdx?|astro|tsx?)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function buildAltByLocalPath(assets) {
  const altByLocalPath = new Map();

  for (const asset of assets) {
    if (asset.localPath && asset.alt) {
      altByLocalPath.set(asset.localPath, asset.alt);
    }
  }

  return altByLocalPath;
}

function resolveLocalPath(url, urlMap) {
  return urlMap[url] ?? EXTRA_URL_MAP[url] ?? null;
}

const ASSET_URLS_BLOCK_PATTERN = /^assetUrls:(?:\s*\[\])?(?:\n(?:  - .+\n)*)?/gm;

function dedupeAssetUrlsInFrontmatter(frontmatter) {
  const matches = [...frontmatter.matchAll(ASSET_URLS_BLOCK_PATTERN)];
  if (matches.length <= 1) {
    return frontmatter;
  }

  const lastMatch = matches.at(-1);
  let nextFrontmatter = frontmatter;

  for (const match of matches.slice(0, -1)) {
    nextFrontmatter = nextFrontmatter.replace(match[0], "");
  }

  return nextFrontmatter.replace(/\n{3,}/g, "\n\n").trimEnd();
}

function rebuildAssetUrlsFromCatalog(frontmatter, body, catalogAssets) {
  const slugMatch = frontmatter.match(/^slug:\s*(.*)$/m);
  const slug = slugMatch?.[1]?.trim().replace(/^"|"$/g, "") ?? "";

  const canonicalPaths = new Set();

  for (const asset of catalogAssets) {
    if (asset.slug === slug && asset.localPath) {
      canonicalPaths.add(asset.localPath);
    }
  }

  for (const match of body.matchAll(/(\/assets\/[^\s"'<>)\]]+)/g)) {
    canonicalPaths.add(match[1]);
  }

  const normalizedBlock =
    canonicalPaths.size > 0
      ? `assetUrls:\n${[...canonicalPaths].sort().map((value) => `  - ${value}`).join("\n")}`
      : "assetUrls: []";

  if (/^assetUrls:(?:\s*\[\])?(?:\n(?:  - .+\n)*)?/m.test(frontmatter)) {
    return frontmatter.replace(/^assetUrls:(?:\s*\[\])?(?:\n(?:  - .+\n)*)?/m, normalizedBlock);
  }

  return `${frontmatter.replace(/\n?$/, "\n")}${normalizedBlock}\n`;
}

function replaceWordPressUrls(content, urlMap, altByLocalPath, catalogAssets) {
  let replacements = 0;
  let unresolved = new Set();

  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  let frontmatter = "";
  let body = content;

  if (frontmatterMatch) {
    frontmatter = frontmatterMatch[1];
    body = content.slice(frontmatterMatch[0].length);
  }

  if (frontmatter) {
    frontmatter = dedupeAssetUrlsInFrontmatter(frontmatter);
    frontmatter = normalizeAssetUrlsFrontmatterBlock(frontmatter, urlMap);
  }

  let nextBody = body.replace(REFERENCED_ASSET_PATTERN, (_match, url) => {
    const localPath = resolveLocalPath(url, urlMap);
    if (!localPath) {
      unresolved.add(url);
      return _match;
    }

    replacements += 1;
    const alt = altByLocalPath.get(localPath) ?? "";
    return `![${alt}](${localPath})`;
  });

  nextBody = nextBody.replace(WORDPRESS_URL_PATTERN, (url) => {
    const localPath = resolveLocalPath(url, urlMap);
    if (!localPath) {
      unresolved.add(url);
      return url;
    }

    replacements += 1;
    return localPath;
  });

  if (frontmatter) {
    frontmatter = rebuildAssetUrlsFromCatalog(frontmatter, nextBody, catalogAssets);
  }

  const nextContent = frontmatterMatch
    ? `---\n${frontmatter}\n---\n${nextBody}`
    : nextBody;

  return { content: nextContent, replacements, unresolved };
}

function normalizeAssetUrlsFrontmatterBlock(frontmatter, urlMap) {
  const assetUrlsMatch = frontmatter.match(/^assetUrls:\n((?:  - .+\n)*)/m);
  if (!assetUrlsMatch) return frontmatter;

  const canonicalPaths = new Set();

  for (const line of assetUrlsMatch[1].split("\n")) {
    const value = line.replace(/^  - /, "").trim();
    if (!value || value === "[]") continue;

    if (value.startsWith("/assets/")) {
      canonicalPaths.add(value);
      continue;
    }

    const localPath = resolveLocalPath(value, urlMap);
    if (localPath) {
      canonicalPaths.add(localPath);
    }
  }

  const normalizedBlock =
    canonicalPaths.size > 0
      ? `assetUrls:\n${[...canonicalPaths].sort().map((value) => `  - ${value}`).join("\n")}`
      : "assetUrls: []";

  return frontmatter.replace(/^assetUrls:(?:\s*\[\])?(?:\n(?:  - .+\n)*)?/m, normalizedBlock);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  const urlMap = { ...catalog.urlMap, ...EXTRA_URL_MAP };
  const altByLocalPath = buildAltByLocalPath(catalog.assets ?? []);

  const files = (
    await Promise.all(TARGET_DIRECTORIES.map((directory) => collectFiles(directory)))
  ).flat();

  let changedFiles = 0;
  let totalReplacements = 0;
  const unresolvedUrls = new Set();

  for (const filePath of files) {
    const original = await fs.readFile(filePath, "utf8");
    const { content, replacements, unresolved } = replaceWordPressUrls(
      original,
      urlMap,
      altByLocalPath,
      catalog.assets ?? [],
    );

    for (const url of unresolved) {
      unresolvedUrls.add(url);
    }

    if (content === original) {
      continue;
    }

    changedFiles += 1;
    totalReplacements += replacements;

    if (!options.dryRun) {
      await fs.writeFile(filePath, content, "utf8");
    }

    console.log(`${options.dryRun ? "[dry-run] " : ""}${path.relative(workspaceRoot, filePath)} (${replacements} replacements)`);
  }

  console.log(
    `\n${options.dryRun ? "Would update" : "Updated"} ${changedFiles} files with ${totalReplacements} asset URL replacements.`,
  );

  if (unresolvedUrls.size > 0) {
    console.log(`\nUnresolved WordPress URLs (${unresolvedUrls.size}):`);
    for (const url of [...unresolvedUrls].sort()) {
      console.log(`  - ${url}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
