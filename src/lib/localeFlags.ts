import type { SiteLocale } from "./i18n";

const localeFlagCodes: Record<SiteLocale, string> = {
  en: "gb",
  de: "de",
  el: "gr",
  es: "es",
  eu: "es-pv",
  fr: "fr",
  hr: "hr",
  it: "it",
  pl: "pl",
  pt: "pt",
  sl: "si",
  ca: "es-ct",
};

export function getLocaleFlagClass(locale: SiteLocale) {
  return `fi fi-${localeFlagCodes[locale]}`;
}
