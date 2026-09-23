import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoneDetail } from "@/components/v2/StoneDetail";
import { getLocalizedStoneName, getV2StoneBySlug } from "@/content/v2-stones";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { createLocaleMetadata } from "@/lib/metadata";

type StoneDetailPageProps = { params: Promise<{ locale: PublishedLocale; slug: string }> };

export function generateStaticParams() { return [{ slug: "spider" }]; }

export async function generateMetadata({ params }: StoneDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  return getV2StoneBySlug(slug) ? createLocaleMetadata(locale, `stones/${slug}`) : {};
}

export default async function StoneDetailPage({ params }: StoneDetailPageProps) { const { locale, slug } = await params; const stone = getV2StoneBySlug(slug); if (!stone) notFound(); return <StoneDetail locale={locale} name={getLocalizedStoneName(stone.name, locale)} messages={getMessages(locale).stonesExperience.detail} />; }
