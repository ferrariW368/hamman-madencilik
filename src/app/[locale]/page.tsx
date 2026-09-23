import type { PublishedLocale } from "@/i18n/config";
import { V2PageShell } from "@/components/v2/V2PageShell";
import { getMessages } from "@/i18n/messages";
export default async function LocaleHomePage({ params }: { params: Promise<{ locale: PublishedLocale }> }) {
  const { locale } = await params; const messages = getMessages(locale);
  return <V2PageShell locale={locale} content={messages.skeleton.home} />;
}
