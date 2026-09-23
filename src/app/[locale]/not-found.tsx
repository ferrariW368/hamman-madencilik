import { V2PageLink, V2PageShell } from "@/components/v2/V2PageShell";
import { defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export default function LocaleNotFound() { const messages = getMessages(defaultLocale).skeleton.notFound; return <V2PageShell locale={defaultLocale} content={messages}><V2PageLink href={`/${defaultLocale}`}>{messages.homeLink}</V2PageLink></V2PageShell>; }
