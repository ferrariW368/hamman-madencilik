import { notFound } from "next/navigation";
import { isPublishedLocale } from "@/i18n/config";

export default async function LocaleMissingPage({ params }: { params: Promise<{ locale: string; missing: string[] }> }) {
  const { locale } = await params;
  if (!isPublishedLocale(locale)) notFound();
  notFound();
}
