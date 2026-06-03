import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import YAML from "yaml";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDirectory, "..");
const contentRoot = path.join(workspaceRoot, "src", "content", "pages");

const locales = [
  "en",
  "de",
  "el",
  "es",
  "eu",
  "fr",
  "hr",
  "it",
  "pl",
  "pt",
  "sl",
  "ca",
];

const requiredTranslationFields = [
  "translatedAt",
  "translatedBy",
  "translationReviewedAt",
  "translationReviewedBy",
];

const strictStructureGroups = new Set([
  "page:home",
  "page:who-we-are",
  "page:resources",
  "page:resources/scientific-studies",
  "page:resources/psychedelic-substances-safety-legal-issues",
  "page:resources/faq-about-psychedelics",
  "page:resources/educational-material",
  "page:projects/partnerships-collaborations",
  "page:news",
]);

const migratedReadMoreMarkers = [
  "LIRE LA SUITE",
  "LEER MÁS",
  "LEER MAS",
  "LEGIR MÉS",
  "IRAKURRI GEHIAGO",
  "LEGGI DI PIÙ",
  "LEGGI DI PIU",
  "CZYTAJ WIĘCEJ",
  "CZYTAJ WIECEJ",
  "LER MAIS",
  "PREBERI VEČ",
  "PREBERI VEC",
  "PROČITAJ VIŠE",
  "PROCITAJ VISE",
  "ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ",
  "MEHR LESEN",
];

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }

    if (entry.name.endsWith(".mdx")) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function parseMdx(filePath, content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error(`Missing frontmatter: ${filePath}`);
  }

  return {
    frontmatter: YAML.parse(match[1]) ?? {},
    frontmatterRaw: match[1],
    body: content.slice(match[0].length),
  };
}

function relative(filePath) {
  return path.relative(workspaceRoot, filePath);
}

function componentSignature(body) {
  const imports = [...body.matchAll(/^import\s+([^;\n]+?)\s+from\s+["'][^"']+["'];?$/gm)]
    .map((match) => match[1].trim().replace(/\s+/g, " "))
    .sort();

  const components = [...body.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map(
    (match) => match[1],
  );

  const headings = [...body.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match) => ({
    depth: match[1].length,
    text: match[2].replace(/\s+/g, " ").trim(),
  }));

  return {
    imports,
    components,
    headingDepths: headings.map((heading) => heading.depth),
    readMoreCount: components.filter((component) => component === "ReadMore").length,
    accordionCount: components.filter((component) => component === "Accordion").length,
  };
}

function signaturesMatch(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function normalizeAssetUrls(value) {
  if (!Array.isArray(value)) return [];

  return value
    .flatMap((entry) => String(entry).split(/\s+-\s+/))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function hasDuplicatedAssetUrls(rawFrontmatter, data) {
  const assetLineHasConcatenatedValues = rawFrontmatter
    .split("\n")
    .some((line) => /^  - .*\/assets\/.*\s+-\s+\/assets\//.test(line));

  if (assetLineHasConcatenatedValues) {
    return true;
  }

  const assetUrls = normalizeAssetUrls(data.assetUrls);
  return new Set(assetUrls).size !== assetUrls.length;
}

const files = await collectFiles(contentRoot);
const pages = [];
const errors = [];
const warnings = [];

for (const file of files) {
  const content = await fs.readFile(file, "utf8");
  let parsed;

  try {
    parsed = parseMdx(file, content);
  } catch (error) {
    errors.push(String(error.message ?? error));
    continue;
  }

  const { frontmatter, frontmatterRaw, body } = parsed;
  const fileLabel = relative(file);

  for (const field of requiredTranslationFields) {
    if (!(field in frontmatter)) {
      errors.push(`${fileLabel}: missing ${field}`);
    }
  }

  if (frontmatter.translationReviewedAt !== "") {
    errors.push(`${fileLabel}: translationReviewedAt must remain empty`);
  }

  if (frontmatter.translationReviewedBy !== "") {
    errors.push(`${fileLabel}: translationReviewedBy must remain empty`);
  }

  if (hasDuplicatedAssetUrls(frontmatterRaw, frontmatter)) {
    errors.push(`${fileLabel}: duplicated or concatenated assetUrls`);
  }

  for (const marker of migratedReadMoreMarkers) {
    if (body.includes(marker) && !body.includes("<ReadMore")) {
      errors.push(`${fileLabel}: literal migrated read-more marker "${marker}"`);
      break;
    }
  }

  pages.push({
    file,
    fileLabel,
    frontmatter,
    body,
    signature: componentSignature(body),
  });
}

const byGroup = new Map();
for (const page of pages) {
  const group = page.frontmatter.translationGroup;
  if (!group) continue;
  if (!byGroup.has(group)) byGroup.set(group, []);
  byGroup.get(group).push(page);
}

for (const [group, groupPages] of byGroup) {
  if (group.startsWith("page:") || group.startsWith("generated:")) {
    const presentLocales = new Set(groupPages.map((page) => page.frontmatter.locale));
    for (const locale of locales) {
      if (!presentLocales.has(locale)) {
        errors.push(`${group}: missing locale ${locale}`);
      }
    }
  }

  if (!strictStructureGroups.has(group)) continue;

  const english = groupPages.find((page) => page.frontmatter.locale === "en");
  if (!english) {
    warnings.push(`${group}: no English source for strict structure comparison`);
    continue;
  }

  for (const page of groupPages) {
    if (page === english) continue;

    if (!signaturesMatch(page.signature, english.signature)) {
      errors.push(
        `${page.fileLabel}: structure signature differs from English source for ${group}`,
      );
    }
  }
}

console.log(`Audited ${files.length} MDX content pages.`);

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error("\nErrors:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Content i18n audit passed.");
