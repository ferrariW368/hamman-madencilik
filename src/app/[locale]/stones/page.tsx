import { StoneCollection } from "@/components/v2/StoneCollection";
import { v2Stones } from "@/content/v2-stones";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
export default async function StonesPage({ params }: { params: Promise<{ locale: PublishedLocale }> }) { const { locale } = await params; return <StoneCollection locale={locale} stones={v2Stones} messages={getMessages(locale).stonesExperience.collection} />; }
