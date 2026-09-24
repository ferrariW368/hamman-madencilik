import Link from "next/link";
import type { PublishedLocale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { Container } from "./Container";

export function V2HomeBody({ locale, content, sections }: Readonly<{ locale: PublishedLocale; content: Messages["skeleton"]["home"]; sections: Messages["homeBody"]["sections"] }>) {
  return <main>
    <Container className="py-12 md:py-20">
      <div className="max-w-[var(--container-reading)] border-s-2 border-[color:var(--color-foundation-accent)] ps-5">
        <p className="text-xs font-medium tracking-[0.14em] text-[color:var(--color-foundation-muted)]">{content.label}</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display)] text-[color:var(--color-foundation-ink)]">{content.title}</h1>
        <p className="mt-5 text-base leading-7 text-[color:var(--color-foundation-muted)]">{content.description}</p>
      </div>

      <section className="mt-16 border-t border-[color:var(--color-foundation-border)]" aria-label={content.title}>
        {sections.map((section) => <article key={section.key} className="grid border-b border-[color:var(--color-foundation-border)] py-8 md:grid-cols-[6rem_minmax(0,1fr)_auto] md:items-end md:gap-8 md:py-12">
          <p className="text-xs tracking-[0.14em] text-[color:var(--color-foundation-muted)]">{section.label}</p>
          <div className="mt-5 md:mt-0"><h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[color:var(--color-foundation-ink)]">{section.title}</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[color:var(--color-foundation-muted)]">{section.description}</p></div>
          <Link href={`/${locale}/${section.key}`} className="mt-6 inline-flex min-h-11 w-fit items-center border-b border-[color:var(--color-foundation-ink)] text-xs font-medium tracking-[0.1em] text-[color:var(--color-foundation-ink)] hover:text-[color:var(--color-foundation-accent)] md:mt-0">{section.linkLabel}</Link>
        </article>)}
      </section>
    </Container>
  </main>;
}
