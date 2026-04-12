import { getCollection, type CollectionEntry } from "astro:content";

import {
  defaultLocale,
  locales,
  normalizeLocale,
  type SiteLocale,
} from "./i18n";

export type PageEntry = CollectionEntry<"pages">;

export function sortEntries(entries: PageEntry[]) {
  return [...entries].sort((left, right) => {
    const leftOrder = left.data.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.data.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    if (left.data.publishedAt && right.data.publishedAt) {
      return right.data.publishedAt.localeCompare(left.data.publishedAt);
    }

    return left.data.title.localeCompare(right.data.title);
  });
}

export async function getAllPages() {
  return sortEntries(await getCollection("pages", ({ data }) => !data.draft));
}

export async function getPagesByLocale(locale: string) {
  const normalizedLocale = normalizeLocale(locale);
  const pages = await getAllPages();
  return pages.filter((entry) => entry.data.locale === normalizedLocale);
}

export async function getPageBySlug(locale: string, slug: string) {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");
  const pages = await getAllPages();

  const exactMatch = pages.find(
    (entry) =>
      entry.data.locale === normalizedLocale && entry.data.slug === normalizedSlug,
  );

  if (exactMatch) {
    return exactMatch;
  }

  if (normalizedLocale !== defaultLocale) {
    return pages.find(
      (entry) =>
        entry.data.locale === defaultLocale && entry.data.slug === normalizedSlug,
    );
  }

  return undefined;
}

export async function getTopLevelPages(locale: string) {
  const normalizedLocale = normalizeLocale(locale);
  const pages = await getPagesByLocale(normalizedLocale);

  return pages.filter((entry) => {
    if (entry.data.pageType === "news-post") {
      return false;
    }

    if (!entry.data.slug) {
      return true;
    }

    return !entry.data.slug.includes("/");
  });
}

export async function getNewsPosts(
  locale: string,
  options?: {
    section?: string;
    limit?: number;
  },
) {
  const normalizedLocale = normalizeLocale(locale);
  const pages = await getPagesByLocale(normalizedLocale);

  const posts = pages.filter((entry) => entry.data.pageType === "news-post");
  const section = options?.section;
  const filtered = section
    ? posts.filter((entry) => entry.data.section === section)
    : posts;

  const sorted = sortEntries(filtered);

  if (typeof options?.limit === "number") {
    return sorted.slice(0, options.limit);
  }

  return sorted;
}

export async function getSectionPage(
  locale: string,
  slug: string,
): Promise<PageEntry | undefined> {
  return getPageBySlug(locale, slug);
}

export async function getAvailableLocalesForSlug(slug: string) {
  const pages = await getAllPages();
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");

  return pages
    .filter((entry) => entry.data.slug === normalizedSlug)
    .map((entry) => entry.data.locale)
    .filter((locale): locale is SiteLocale =>
      locales.includes(locale as SiteLocale),
    );
}
