import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2Header } from "@/components/v2/V2Header";
import { LocaleProvider } from "@/components/v2/LocaleProvider";
import { getLocaleDirection, isPublishedLocale, publishedLocales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { createLocaleMetadata } from "@/lib/metadata";
import { inter, playfair } from "../fonts";
import "../globals.css";
type LocaleLayoutProps = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;
export function generateStaticParams() { return publishedLocales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> { const { locale } = await params; return isPublishedLocale(locale) ? createLocaleMetadata(locale) : {}; }
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) { const { locale } = await params; if (!isPublishedLocale(locale)) notFound(); const messages = getMessages(locale); return <html lang={locale} dir={getLocaleDirection(locale)} className={`${inter.variable} ${playfair.variable}`}><body className="font-[family-name:var(--font-body)]"><LocaleProvider locale={locale}><V2Header locale={locale} messages={messages.foundation} />{children}<V2Footer locale={locale} messages={messages.foundation} /></LocaleProvider></body></html>; }
