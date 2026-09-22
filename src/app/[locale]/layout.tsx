import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleDocumentAttributes } from "@/components/LocaleDocumentAttributes";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2Header } from "@/components/v2/V2Header";
import { isPublishedLocale, publishedLocales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { createLocaleMetadata } from "@/lib/metadata";
type LocaleLayoutProps = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;
export function generateStaticParams() { return publishedLocales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> { const { locale } = await params; return isPublishedLocale(locale) ? createLocaleMetadata(locale) : {}; }
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) { const { locale } = await params; if (!isPublishedLocale(locale)) notFound(); const messages = getMessages(locale); return <><LocaleDocumentAttributes locale={locale} /><V2Header locale={locale} messages={messages.foundation} />{children}<V2Footer locale={locale} messages={messages.foundation} /></>; }
