import path from "node:path";

const MEANINGLESS_PATTERNS = [
  /^IMG[_-]?\d+/i,
  /^DSC[_-]?\d+/i,
  /^DCIM/i,
  /^screenshot[\s_-]?\d{4}[\s_-]?\d{2}[\s_-]?\d{2}/i,
  /^screen[\s-]?shot/i,
  /^whatsapp[\s-]?image/i,
  /^original-[0-9a-f-]{36}$/i,
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  /^\d{10,}$/,
  /\(copy\)/i,
  /\scopy(?=\.[^.]+$)/i,
  /^image[\s_-]?\d*$/i,
  /^photo[\s_-]?\d*$/i,
  /^picture[\s_-]?\d*$/i,
  /^untitled$/i,
  /^new$/i,
  /^web$/i,
  /^logo_v\d+$/i,
  /^logo-\d{4}$/i,
  /\d+x\d+/i,
  /^capture-de-ecran/i,
  /^snapshot/i,
];

export function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getFilenameFromUrl(assetUrl) {
  return new URL(assetUrl).pathname.split("/").pop() ?? "asset";
}

export function getExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ext || "";
}

export function stripExtension(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

export function canonicalFilename(filename) {
  return filename
    .replace(/-\d+x\d+(?=\.[^.]+$)/i, "")
    .replace(/-scaled(?=\.[^.]+$)/i, "")
    .replace(/-e\d{10,}(?=\.[^.]+$)/i, "");
}

export function isResponsiveVariant(filename) {
  return /-\d+x\d+\.[^.]+$/i.test(filename);
}

export function isMeaninglessName(filenameOrStem, { shortNameThreshold = 2 } = {}) {
  const stem = slugify(stripExtension(filenameOrStem).replace(/[-_]+/g, " "));
  const rawStem = stripExtension(filenameOrStem);

  if (!stem) return true;
  if (/^\d+$/.test(rawStem)) return true;
  if (rawStem.length <= shortNameThreshold && !/^[a-z]{2,4}$/i.test(rawStem)) {
    return true;
  }

  return MEANINGLESS_PATTERNS.some((pattern) => pattern.test(rawStem) || pattern.test(stem));
}

export function cleanFilenameStem(filename) {
  return stripExtension(filename)
    .replace(/-scaled$/i, "")
    .replace(/-\d+x\d+/gi, "")
    .replace(/-e\d{10,}$/i, "")
    .replace(/_\d{8,}/gi, "")
    .replace(/-\d+$/i, "")
    .replace(/\s*\(\d+\)$/g, "")
    .replace(/\s*\(copy\)$/gi, "")
    .replace(/[-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildLocalFilename(stem, extension, usedNames) {
  const normalizedExtension = extension.startsWith(".") ? extension : `.${extension}`;
  let base = slugify(stem) || "asset";
  let candidate = `${base}${normalizedExtension}`;
  let counter = 2;

  while (usedNames.has(candidate)) {
    candidate = `${base}-${counter}${normalizedExtension}`;
    counter += 1;
  }

  usedNames.add(candidate);
  return candidate;
}

export const ASSET_FOLDERS = ["people", "logos", "icons", "photos", "files"];

const DOWNLOADABLE_FILE_EXTENSIONS = new Set([".pdf", ".zip", ".doc", ".docx"]);

export function isDownloadableFile(extension) {
  return DOWNLOADABLE_FILE_EXTENSIONS.has(extension.toLowerCase());
}

export function resolveAssetFolder({ namingSource, slug, extension, filename }) {
  if (namingSource === "people-grid") {
    return "people";
  }

  if (namingSource === "partner-grid-order" || namingSource === "partner-name-match") {
    return "logos";
  }

  if (isDownloadableFile(extension)) {
    return "files";
  }

  if (namingSource === "home-page-order" && extension === ".svg") {
    return "icons";
  }

  if (slug === "projects/partnerships-collaborations") {
    return "logos";
  }

  return "photos";
}

export function tokenize(value) {
  return slugify(value)
    .split("-")
    .filter((token) => token.length > 2);
}

export function scorePartnerFilenameMatch(filenameStem, partnerName) {
  const fileTokens = tokenize(filenameStem);
  const partnerTokens = tokenize(partnerName);
  if (fileTokens.length === 0 || partnerTokens.length === 0) return 0;

  let score = 0;
  for (const fileToken of fileTokens) {
    if (partnerTokens.some((partnerToken) => partnerToken.includes(fileToken) || fileToken.includes(partnerToken))) {
      score += 2;
    }
  }

  const compactFile = fileTokens.join("");
  const compactPartner = partnerTokens.join("");
  if (compactFile && compactPartner.includes(compactFile)) score += 3;
  if (compactPartner && compactFile.includes(compactPartner)) score += 3;

  return score;
}
