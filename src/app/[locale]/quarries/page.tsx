import { V2PageShell } from "@/components/v2/V2PageShell";
import type { PublishedLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export default async function QuarriesPage({ params }: { params: Promise<{ locale: PublishedLocale }> }) {
  const { locale } = await params;
  const content = getMessages(locale).skeleton.quarries;

  return <V2PageShell locale={locale} content={content}>
    <section className="w-full border-t border-[color:var(--color-foundation-border)] pt-5" aria-label={content.regionLabel}>
      <p className="text-xs font-medium tracking-[0.08em] text-[color:var(--color-foundation-muted)]">{content.regionLabel}</p>
      <p className="mt-2 text-sm font-medium text-[color:var(--color-foundation-ink)]">{content.region}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--color-foundation-muted)]">{content.detailsPending}</p>
    </section>
  </V2PageShell>;
}
