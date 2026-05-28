const countryFlagCodes: Record<string, string> = {
  austria: "at",
  belgium: "be",
  canada: "ca",
  croatia: "hr",
  denmark: "dk",
  estonia: "ee",
  france: "fr",
  germany: "de",
  greece: "gr",
  ireland: "ie",
  italy: "it",
  latvia: "lv",
  malta: "mt",
  poland: "pl",
  portugal: "pt",
  romania: "ro",
  slovenia: "si",
  spain: "es",
  sweden: "se",
  switzerland: "ch",
  "the netherlands": "nl",
  "united kingdom": "gb",
};

export function getCountryFlagClasses(location: string) {
  const parts = location.split(/\s*[–—/,]\s*|\s+-\s+/);

  return parts
    .map((part) => countryFlagCodes[part.trim().toLowerCase()])
    .filter((code): code is string => Boolean(code))
    .map((code) => `fi fi-${code}`);
}
