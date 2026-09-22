import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export default async function LocaleHomePage({ params }: { params: Promise<{ locale: PublishedLocale }> }) {
  const { locale } = await params; const messages = getMessages(locale);
  return <main className="mx-auto w-full max-w-[80rem] px-6 py-12 md:px-10" aria-label={messages.foundation.accessibleName}><h1 className="sr-only">{messages.foundation.accessibleName}</h1></main>;
}
