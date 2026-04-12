import { getAllPages, type PageEntry } from "./content";
import {
  defaultLocale,
  locales,
  localizePath,
  normalizeLocale,
  type SiteLocale,
} from "./i18n";
import { getUiCopy } from "./uiCopy";

type NavDefinition = {
  slug: string;
  fallbackLabel: string;
  children?: NavDefinition[];
};

export type ResolvedNavItem = {
  slug: string;
  label: string;
  href: string;
  children: ResolvedNavItem[];
};

export type LanguageOption = {
  locale: SiteLocale;
  code: string;
  nativeLabel: string;
  href: string;
  current: boolean;
};

type NavigationContext = {
  primaryItems: ResolvedNavItem[];
  utilityItems: ResolvedNavItem[];
  footerItems: ResolvedNavItem[];
  donateHref: string;
  languageOptions: LanguageOption[];
  currentLanguage: LanguageOption;
};

const NAVIGATION_STRUCTURE: NavDefinition[] = [
  { slug: "", fallbackLabel: "Home" },
  { slug: "who-we-are", fallbackLabel: "Who We Are" },
  {
    slug: "news",
    fallbackLabel: "Blog / News",
    children: [
      { slug: "news/events", fallbackLabel: "Events" },
      { slug: "news/national-news", fallbackLabel: "National News" },
      { slug: "news/reports", fallbackLabel: "Reports" },
      {
        slug: "news/social-media-publications",
        fallbackLabel: "Social Media Publications",
      },
      {
        slug: "news/newsletter-archive",
        fallbackLabel: "Newsletter Archive",
      },
    ],
  },
  {
    slug: "projects",
    fallbackLabel: "Projects",
    children: [
      { slug: "projects/eci", fallbackLabel: "ECI" },
      {
        slug: "projects/patients-community",
        fallbackLabel: "Patients Community",
      },
      {
        slug: "projects/partnerships-collaborations",
        fallbackLabel: "Partnerships & Collaborations",
      },
      {
        slug: "projects/testimonials-interviews",
        fallbackLabel: "Testimonials / Interviews",
      },
      { slug: "projects/impact-report", fallbackLabel: "Impact Report" },
    ],
  },
  {
    slug: "resources",
    fallbackLabel: "Resources",
    children: [
      {
        slug: "resources/scientific-studies",
        fallbackLabel: "Scientific Studies",
      },
      {
        slug: "resources/psychedelic-substances-safety-legal-issues",
        fallbackLabel: "Psychedelic Substances, Safety & Legal Issues",
      },
      {
        slug: "resources/faq-about-psychedelics",
        fallbackLabel: "FAQ About Psychedelics",
      },
      {
        slug: "resources/organisations-communities-initiatives",
        fallbackLabel: "Organisations, Communities & Initiatives",
      },
      {
        slug: "resources/educational-material",
        fallbackLabel: "Educational Material",
      },
      {
        slug: "resources/activist-packs",
        fallbackLabel: "Activist Packs",
      },
      {
        slug: "resources/media-press-kit",
        fallbackLabel: "Media / Press Kit",
      },
    ],
  },
  { slug: "legal", fallbackLabel: "Legal" },
  { slug: "privacy-policy", fallbackLabel: "Privacy Policy" },
];

const LOCALE_NAMES: Record<SiteLocale, string> = {
  en: "English",
  de: "Deutsch",
  el: "Ellinika",
  es: "Espanol",
  eu: "Euskara",
  fr: "Francais",
  hr: "Hrvatski",
  it: "Italiano",
  pl: "Polski",
  pt: "Portugues",
  sl: "Slovenscina",
  ca: "Catala",
};

function getPageLookupKey(locale: string, slug: string) {
  return `${locale}:${slug}`;
}

function resolvePage(
  pagesByKey: Map<string, PageEntry>,
  locale: SiteLocale,
  slug: string,
) {
  return (
    pagesByKey.get(getPageLookupKey(locale, slug)) ??
    pagesByKey.get(getPageLookupKey(defaultLocale, slug))
  );
}

function resolveItem(
  pagesByKey: Map<string, PageEntry>,
  locale: SiteLocale,
  definition: NavDefinition,
): ResolvedNavItem {
  const page = resolvePage(pagesByKey, locale, definition.slug);
  const label =
    definition.slug === ""
      ? getUiCopy(locale).homeLabel
      : page?.data.title ?? definition.fallbackLabel;

  return {
    slug: definition.slug,
    label,
    href: page
      ? localizePath(page.data.locale, page.data.slug)
      : localizePath(locale, definition.slug),
    children: (definition.children ?? []).map((child) =>
      resolveItem(pagesByKey, locale, child),
    ),
  };
}

function resolveLanguageOptions(
  pages: PageEntry[],
  pagesByKey: Map<string, PageEntry>,
  locale: SiteLocale,
  slug: string,
  translationGroup?: string,
) {
  const relatedPages = translationGroup
    ? pages.filter((entry) => entry.data.translationGroup === translationGroup)
    : pages.filter((entry) => entry.data.slug === slug);

  const options = locales
    .map((localeCode) => {
      const match =
        relatedPages.find((entry) => entry.data.locale === localeCode) ??
        (localeCode === locale
          ? resolvePage(pagesByKey, localeCode, slug)
          : undefined);

      if (!match) {
        return undefined;
      }

      return {
        locale: localeCode,
        code: localeCode.toUpperCase(),
        nativeLabel: LOCALE_NAMES[localeCode],
        href: localizePath(match.data.locale, match.data.slug),
        current: localeCode === locale,
      } satisfies LanguageOption;
    })
    .filter((option): option is LanguageOption => Boolean(option));

  return options;
}

export function isNavItemActive(currentSlug: string, itemSlug: string) {
  if (!itemSlug) {
    return currentSlug === "";
  }

  return currentSlug === itemSlug || currentSlug.startsWith(`${itemSlug}/`);
}

export async function buildNavigationContext(
  locale: string,
  slug: string,
  translationGroup?: string,
): Promise<NavigationContext> {
  const currentLocale = normalizeLocale(locale);
  const pages = await getAllPages();
  const pagesByKey = new Map(
    pages.map((entry) => [getPageLookupKey(entry.data.locale, entry.data.slug), entry]),
  );

  const items = NAVIGATION_STRUCTURE.map((definition) =>
    resolveItem(pagesByKey, currentLocale, definition),
  );
  const primaryItems = items.slice(0, 5);
  const utilityItems = items.slice(5);
  const languageOptions = resolveLanguageOptions(
    pages,
    pagesByKey,
    currentLocale,
    slug,
    translationGroup,
  );
  const currentLanguage =
    languageOptions.find((option) => option.current) ?? {
      locale: currentLocale,
      code: currentLocale.toUpperCase(),
      nativeLabel: LOCALE_NAMES[currentLocale],
      href: localizePath(currentLocale, slug),
      current: true,
    };
  const donatePage = resolvePage(pagesByKey, currentLocale, "donate");

  return {
    primaryItems,
    utilityItems,
    footerItems: items.filter((item) => item.slug !== ""),
    donateHref: donatePage
      ? localizePath(donatePage.data.locale, donatePage.data.slug)
      : localizePath(currentLocale, "donate"),
    languageOptions,
    currentLanguage,
  };
}
