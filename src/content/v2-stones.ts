import type { LocalizedString, Stone } from "@/types/v2-content";

export type StoneCollectionEntry = Pick<Stone, "id" | "name" | "slug"> & { verificationState: "DETAILS_PENDING" };

export const v2Stones: readonly StoneCollectionEntry[] = [
  { id: "spider", name: { tr: "Spider", en: "Spider" }, slug: "spider", verificationState: "DETAILS_PENDING" },
];

export function getLocalizedStoneName(name: LocalizedString, locale: "tr" | "en") {
  return name[locale] ?? name.en ?? name.tr ?? "";
}

export function getV2StoneBySlug(slug: string) {
  return v2Stones.find((stone) => stone.slug === slug);
}
