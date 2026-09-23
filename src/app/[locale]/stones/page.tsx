import { V2PageLink, V2PageShell } from "@/components/v2/V2PageShell";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export default async function StonesPage({ params }: { params: Promise<{ locale: PublishedLocale }> }) { const { locale } = await params; const messages = getMessages(locale).skeleton.stones; return <V2PageShell locale={locale} content={messages}><V2PageLink href={`/${locale}/stones/spider`}>{messages.spiderLink}</V2PageLink></V2PageShell>; }
