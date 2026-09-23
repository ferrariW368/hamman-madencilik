import { notFound } from "next/navigation";
import { V2PageLink, V2PageShell } from "@/components/v2/V2PageShell";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export function generateStaticParams() { return [{ slug: "spider" }]; }
export default async function StoneDetailPage({ params }: { params: Promise<{ locale: PublishedLocale; slug: string }> }) { const { locale, slug } = await params; if (slug !== "spider") notFound(); const messages = getMessages(locale).skeleton.spider; return <V2PageShell locale={locale} content={messages}><p className="w-full text-sm leading-6 text-[color:var(--color-foundation-muted)]">{messages.availabilityNotice}</p><V2PageLink href={`/${locale}/stones`}>{messages.backToStones}</V2PageLink><V2PageLink href={`/${locale}/contact`}>{messages.contactLink}</V2PageLink></V2PageShell>; }
