import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleDocumentAttributes } from "@/components/LocaleDocumentAttributes";
import { isPublishedLocale, publishedLocales } from "@/i18n/config";
import { createLocaleMetadata } from "@/lib/metadata";
type LocaleLayoutProps = Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>;
export function generateStaticParams() { return publishedLocales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> { const { locale } = await params; return isPublishedLocale(locale) ? createLocaleMetadata(locale) : {}; }
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) { const { locale } = await params; if (!isPublishedLocale(locale)) notFound(); return <><LocaleDocumentAttributes locale={locale} />{children}</>; }
