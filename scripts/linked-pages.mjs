/** @typedef {import("../src/lib/i18n").SiteLocale} SiteLocale */

/** Slugs from import/sitemap.md plus pages linked from navigation and CTAs. */
const STATIC_LINKED_SLUGS = new Set([
  "",
  "who-we-are",
  "news",
  "news/events",
  "news/national-news",
  "news/reports",
  "news/social-media-publications",
  "news/newsletter-archive",
  "projects",
  "projects/eci",
  "projects/patients-community",
  "projects/partnerships-collaborations",
  "projects/testimonials-interviews",
  "projects/impact-report",
  "resources",
  "resources/scientific-studies",
  "resources/psychedelic-substances-safety-legal-issues",
  "resources/faq-about-psychedelics",
  "resources/organisations-communities-initiatives",
  "resources/educational-material",
  "resources/activist-packs",
  "resources/media-press-kit",
  "legal",
  "privacy-policy",
  "donate",
  "join-the-psychedelicare-association",
]);

const NEWS_SECTION_SLUGS = new Set([
  "news",
  "news/events",
  "news/national-news",
  "news/reports",
  "news/social-media-publications",
  "news/newsletter-archive",
]);

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

const localeSet = new Set(locales);

/** @param {string} pathname */
export function slugFromPathname(pathname) {
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

  if (segments.length > 0 && localeSet.has(segments[0])) {
    segments.shift();
  }

  return segments.join("/");
}

/** @param {string} slug */
export function isLinkedSlug(slug) {
  if (STATIC_LINKED_SLUGS.has(slug)) {
    return true;
  }

  if (slug.startsWith("news/") && !NEWS_SECTION_SLUGS.has(slug)) {
    return true;
  }

  return false;
}

/** @param {string} pathname */
export function isLinkedPathname(pathname) {
  return isLinkedSlug(slugFromPathname(pathname));
}

/** @param {string} url */
export function isLinkedPageUrl(url) {
  try {
    return isLinkedPathname(new URL(url).pathname);
  } catch {
    return false;
  }
}
