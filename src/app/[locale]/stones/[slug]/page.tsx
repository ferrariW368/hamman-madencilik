import { notFound } from "next/navigation";
import { StoneDetail } from "@/components/v2/StoneDetail";
import { getLocalizedStoneName, getV2StoneBySlug } from "@/content/v2-stones";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export function generateStaticParams() { return [{ slug: "spider" }]; }
export default async function StoneDetailPage({ params }: { params: Promise<{ locale: PublishedLocale; slug: string }> }) { const { locale, slug } = await params; const stone = getV2StoneBySlug(slug); if (!stone) notFound(); return <StoneDetail locale={locale} name={getLocalizedStoneName(stone.name, locale)} messages={getMessages(locale).stonesExperience.detail} />; }
