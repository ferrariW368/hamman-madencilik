import type { Metadata } from "next";
import type { PublishedLocale } from "@/i18n/config";
const localeOpenGraphCodes: Record<PublishedLocale, string> = { tr: "tr_TR", en: "en_US" };
export function createLocaleMetadata(locale: PublishedLocale): Metadata {
  const languages = Object.fromEntries((["tr", "en"] as const).map((availableLocale) => [availableLocale, `/${availableLocale}`]));
  return { title: "HAMMARBLE", alternates: { canonical: `/${locale}`, languages }, openGraph: { locale: localeOpenGraphCodes[locale], title: "HAMMARBLE", type: "website", url: `/${locale}` } };
}
