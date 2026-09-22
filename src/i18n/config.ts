export const localeDefinitions = {
  tr: { code: "tr", direction: "ltr", published: true }, en: { code: "en", direction: "ltr", published: true },
  zh: { code: "zh", direction: "ltr", published: false }, ar: { code: "ar", direction: "rtl", published: false },
} as const;
export type Locale = keyof typeof localeDefinitions;
export type PublishedLocale = { [Key in Locale]: (typeof localeDefinitions)[Key]["published"] extends true ? Key : never }[Locale];
export const defaultLocale: PublishedLocale = "tr";
export const publishedLocales = Object.entries(localeDefinitions).filter(([, definition]) => definition.published).map(([locale]) => locale) as PublishedLocale[];
export function isPublishedLocale(value: string): value is PublishedLocale { return publishedLocales.includes(value as PublishedLocale); }
export function getLocaleDirection(locale: Locale) { return localeDefinitions[locale].direction; }
