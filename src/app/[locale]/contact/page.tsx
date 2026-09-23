import { V2PageShell } from "@/components/v2/V2PageShell";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export default async function ContactPage({ params }: { params: Promise<{ locale: PublishedLocale }> }) { const { locale } = await params; return <V2PageShell locale={locale} content={getMessages(locale).skeleton.contact} />; }
