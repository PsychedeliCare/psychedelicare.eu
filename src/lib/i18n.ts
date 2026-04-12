export const defaultLocale = "en";

export const localeAliases = {
  "pt-pt": "pt",
} as const;

export const locales = [
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
] as const;

export type SiteLocale = (typeof locales)[number];

export function normalizeLocale(locale: string): SiteLocale {
  const normalized =
    locale in localeAliases
      ? localeAliases[locale as keyof typeof localeAliases]
      : locale;

  if (locales.includes(normalized as SiteLocale)) {
    return normalized as SiteLocale;
  }

  return defaultLocale;
}

export function isDefaultLocale(locale: string) {
  return normalizeLocale(locale) === defaultLocale;
}

export function localizePath(locale: string, slug: string) {
  const normalizedLocale = normalizeLocale(locale);
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");

  if (normalizedLocale === defaultLocale) {
    return normalizedSlug ? `/${normalizedSlug}` : "/";
  }

  return normalizedSlug ? `/${normalizedLocale}/${normalizedSlug}` : `/${normalizedLocale}`;
}
