import type { PublishedLocale } from "@/i18n/config";
import { V2HomeBody } from "@/components/v2/V2HomeBody";
import { getMessages } from "@/i18n/messages";
export default async function LocaleHomePage({ params }: { params: Promise<{ locale: PublishedLocale }> }) {
  const { locale } = await params; const messages = getMessages(locale);
  return <V2HomeBody locale={locale} content={messages.skeleton.home} sections={messages.homeBody.sections} />;
}
