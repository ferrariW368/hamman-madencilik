import type { Metadata } from "next";
import type { PublishedLocale } from "@/i18n/config";
const localeOpenGraphCodes: Record<PublishedLocale, string> = { tr: "tr_TR", en: "en_US" };
export function createLocaleMetadata(locale: PublishedLocale, pathname = ""): Metadata {
  const routePath = pathname.replace(/^\/+|\/+$/g, "");
  const localizedPath = (availableLocale: PublishedLocale) => `/${availableLocale}${routePath ? `/${routePath}` : ""}`;
  const languages = Object.fromEntries((["tr", "en"] as const).map((availableLocale) => [availableLocale, localizedPath(availableLocale)]));
  const canonical = localizedPath(locale);
  return { title: "HAMMARBLE", alternates: { canonical, languages }, openGraph: { locale: localeOpenGraphCodes[locale], title: "HAMMARBLE", type: "website", url: canonical } };
}
