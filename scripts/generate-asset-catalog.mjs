import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { XMLParser } from "fast-xml-parser";
import { load as loadHtml } from "cheerio";

import {
  ASSET_FOLDERS,
  buildLocalFilename,
  canonicalFilename,
  cleanFilenameStem,
  getExtension,
  getFilenameFromUrl,
  isMeaninglessName,
  isResponsiveVariant,
  resolveAssetFolder,
  scorePartnerFilenameMatch,
  slugify,
  stripExtension,
} from "./lib/asset-naming.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "..");
const manifestPath = path.join(workspaceRoot, "src", "data", "asset-manifest.json");
const xmlPath = path.join(workspaceRoot, "import", "psychedelicareeu.WordPress.2026-04-12.xml");
const catalogPath = path.join(workspaceRoot, "src", "data", "asset-catalog.json");

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: false,
  processEntities: true,
  isArray: (name) => ["item", "wp:postmeta", "category"].includes(name),
});

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parsePeopleFromMdx(content) {
  const peopleByUrl = new Map();

  for (const match of content.matchAll(/\{\s*name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g)) {
    peopleByUrl.set(match[2], {
      name: match[1],
      alt: match[1],
    });
  }

  return peopleByUrl;
}

function parsePartnersFromMdx(content) {
  return [...content.matchAll(/name:\s*"([^"]+)"/g)].map((match) => ({
    name: match[1],
    alt: `${match[1]} logo`,
  }));
}

function loadWordPressData(xml) {
  const parsed = parser.parse(xml);
  const items = ensureArray(parsed.rss?.channel?.item);

  const attachmentTitles = new Map();
  for (const item of items) {
    if (item["wp:post_type"] !== "attachment" || !item["wp:attachment_url"]) continue;
    attachmentTitles.set(item["wp:attachment_url"], String(item.title ?? "").trim());
  }

  const pagesByLink = new Map(
    items
      .filter((item) => item["wp:post_type"] === "page" && item.link)
      .map((item) => [item.link, item]),
  );

  return { attachmentTitles, pagesByLink };
}

function extractOrderedImageFilenames(html) {
  const $ = loadHtml(html ?? "", { decodeEntities: false });
  const seen = new Set();
  const filenames = [];

  $("img").each((_index, element) => {
    const src = $(element).attr("src");
    if (!src) return;

    const canonical = canonicalFilename(getFilenameFromUrl(src));
    if (seen.has(canonical)) return;

    seen.add(canonical);
    filenames.push(canonical);
  });

  return filenames;
}

function groupManifestUrls(manifest) {
  const groups = new Map();

  for (const assetUrl of Object.keys(manifest)) {
    const filename = getFilenameFromUrl(assetUrl);
    const canonical = canonicalFilename(filename);
    const refs = manifest[assetUrl];

    if (!groups.has(canonical)) {
      groups.set(canonical, {
        canonicalFilename: canonical,
        sourceUrl: null,
        variantUrls: [],
        refs,
      });
    }

    const group = groups.get(canonical);
    group.refs = group.refs ?? refs;

    if (isResponsiveVariant(filename) || filename !== canonical) {
      group.variantUrls.push(assetUrl);
    } else {
      group.sourceUrl = assetUrl;
      group.variantUrls.push(assetUrl);
    }
  }

  for (const group of groups.values()) {
    group.variantUrls = Array.from(new Set(group.variantUrls)).sort();
    if (!group.sourceUrl) {
      group.sourceUrl =
        group.variantUrls.find((url) => !isResponsiveVariant(getFilenameFromUrl(url))) ??
        group.variantUrls[0];
    }
  }

  return groups;
}

function chooseNamingSource(group, context) {
  const { canonicalFilename: filename, refs, sourceUrl } = group;
  const slug = refs?.[0]?.slug ?? "";
  const wpTitle = context.attachmentTitles.get(sourceUrl) ?? "";
  const extension = getExtension(filename);

  const person = context.peopleByUrl.get(sourceUrl) ??
    [...context.peopleByUrl.entries()].find(([url]) =>
      canonicalFilename(getFilenameFromUrl(url)) === filename,
    )?.[1];

  if (person) {
    return {
      stem: slugify(person.name),
      alt: person.alt,
      namingSource: "people-grid",
      meaninglessOriginalName: isMeaninglessName(filename) || isMeaninglessName(wpTitle),
    };
  }

  if (slug === "projects/partnerships-collaborations") {
    const partnerIndex = context.partnerImages.indexOf(filename);
    const partner =
      partnerIndex >= 0 ? context.partners[partnerIndex] : findPartnerByFilename(filename, context.partners);

    if (partner) {
      return {
        stem: `${slugify(partner.name)}-logo`,
        alt: partner.alt,
        namingSource: partnerIndex >= 0 ? "partner-grid-order" : "partner-name-match",
        meaninglessOriginalName: isMeaninglessName(filename) || isMeaninglessName(wpTitle),
      };
    }
  }

  if (slug === "" || slug === "home") {
    const homeIndex = context.homeImages.indexOf(filename);
    if (homeIndex >= 0) {
      if (extension === ".svg") {
        return {
          stem: `home-care-together-icon-${homeIndex + 1}`,
          alt: "Let's care together icon",
          namingSource: "home-page-order",
          meaninglessOriginalName: true,
        };
      }

      if (filename === "new.jpg" || cleanFilenameStem(filename) === "new") {
        return {
          stem: "home-care-together-hero",
          alt: "Let's care together",
          namingSource: "home-page-context",
          meaninglessOriginalName: true,
        };
      }
    }
  }

  const cleanedStem = cleanFilenameStem(filename);
  const titleStem = cleanFilenameStem(wpTitle);
  const meaningless = isMeaninglessName(filename) || isMeaninglessName(wpTitle);

  if (meaningless && titleStem && !isMeaninglessName(titleStem)) {
    return {
      stem: slugify(titleStem),
      alt: wpTitle,
      namingSource: "wordpress-title",
      meaninglessOriginalName: true,
    };
  }

  if (meaningless && cleanedStem && !isMeaninglessName(cleanedStem)) {
    return {
      stem: slugify(cleanedStem),
      alt: cleanedStem.replace(/-/g, " "),
      namingSource: "cleaned-filename",
      meaninglessOriginalName: true,
    };
  }

  if (meaningless && slug) {
    const pageLabel = slug.split("/").pop() || "page";
    return {
      stem: `${slugify(pageLabel)}-${slugify(cleanedStem || stripExtension(filename))}`,
      alt: wpTitle || cleanedStem || stripExtension(filename),
      namingSource: "page-slug-fallback",
      meaninglessOriginalName: true,
    };
  }

  return {
    stem: slugify(cleanedStem),
    alt: wpTitle || cleanedStem.replace(/-/g, " "),
    namingSource: "filename",
    meaninglessOriginalName: meaningless,
  };
}

function findPartnerByFilename(filename, partners) {
  const stem = cleanFilenameStem(filename);
  let bestMatch = null;
  let bestScore = 0;

  for (const partner of partners) {
    const score = scorePartnerFilenameMatch(stem, partner.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = partner;
    }
  }

  return bestScore >= 3 ? bestMatch : null;
}

async function main() {
  const [manifestRaw, xml, peopleMdx, partnersMdx] = await Promise.all([
    fs.readFile(manifestPath, "utf8"),
    fs.readFile(xmlPath, "utf8"),
    fs.readFile(path.join(workspaceRoot, "src", "content", "pages", "who-we-are", "en.mdx"), "utf8"),
    fs.readFile(
      path.join(workspaceRoot, "src", "content", "pages", "projects", "partnerships-collaborations", "en.mdx"),
      "utf8",
    ),
  ]);

  const manifest = JSON.parse(manifestRaw);
  const { attachmentTitles, pagesByLink } = loadWordPressData(xml);
  const peopleByUrl = parsePeopleFromMdx(peopleMdx);
  const partners = parsePartnersFromMdx(partnersMdx);
  const partnerImages = extractOrderedImageFilenames(
    pagesByLink.get("https://psychedelicare.eu/partners/")?.["content:encoded"],
  );
  const homeImages = extractOrderedImageFilenames(
    pagesByLink.get("https://psychedelicare.eu/")?.["content:encoded"],
  );

  const context = {
    attachmentTitles,
    peopleByUrl,
    partners,
    partnerImages,
    homeImages,
  };

  const groups = groupManifestUrls(manifest);
  const usedNamesByFolder = new Map(
    ASSET_FOLDERS.map((folder) => [folder, new Set()]),
  );
  const assets = [];
  const urlMap = {};

  for (const group of [...groups.values()].sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl))) {
    const naming = chooseNamingSource(group, context);
    const extension = getExtension(group.canonicalFilename);
    const slug = group.refs?.[0]?.slug ?? "";
    const folder = resolveAssetFolder({
      namingSource: naming.namingSource,
      slug,
      extension,
      filename: group.canonicalFilename,
    });
    const usedNames = usedNamesByFolder.get(folder) ?? new Set();
    usedNamesByFolder.set(folder, usedNames);
    const localFilename = buildLocalFilename(naming.stem, extension, usedNames);
    const localPath = `/assets/${folder}/${localFilename}`;

    const entry = {
      sourceUrl: group.sourceUrl,
      variantUrls: group.variantUrls,
      originalFilename: group.canonicalFilename,
      folder,
      localFilename,
      localPath,
      alt: naming.alt,
      slug,
      pageTitle: group.refs?.[0]?.title ?? "",
      meaninglessOriginalName: naming.meaninglessOriginalName,
      renamed: localFilename !== group.canonicalFilename,
      namingSource: naming.namingSource,
    };

    assets.push(entry);

    for (const variantUrl of group.variantUrls) {
      urlMap[variantUrl] = localPath;
    }
  }

  const renamedAssets = assets.filter((asset) => asset.renamed);
  const meaninglessAssets = assets.filter((asset) => asset.meaninglessOriginalName);

  const folderCounts = Object.fromEntries(ASSET_FOLDERS.map((folder) => [folder, 0]));
  for (const asset of assets) {
    folderCounts[asset.folder] += 1;
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    outputDirectory: "public/assets",
    folders: ASSET_FOLDERS,
    totals: {
      canonicalAssets: assets.length,
      renamed: renamedAssets.length,
      meaninglessOriginalNames: meaninglessAssets.length,
      mappedUrls: Object.keys(urlMap).length,
      byFolder: folderCounts,
    },
    assets,
    urlMap,
  };

  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  console.log(
    `Generated catalog for ${assets.length} canonical assets (${renamedAssets.length} renamed, ${meaninglessAssets.length} had meaningless original names).`,
  );
  console.log(`Wrote ${path.relative(workspaceRoot, catalogPath)}.`);

  console.log("\nBy folder:");
  for (const [folder, count] of Object.entries(folderCounts)) {
    if (count > 0) {
      console.log(`  ${folder}/: ${count}`);
    }
  }

  if (renamedAssets.length > 0) {
    console.log("\nRenamed assets:");
    for (const asset of renamedAssets) {
      console.log(
        `  ${asset.originalFilename} -> ${asset.folder}/${asset.localFilename} (${asset.namingSource})`,
      );
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
