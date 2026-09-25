import Link from "next/link";
import type { PublishedLocale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { Container } from "./Container";

export function V2HeroPrototype({ locale, title, content }: Readonly<{ locale: PublishedLocale; title: string; content: Messages["heroPrototype"] }>) {
  return <section className="border-b border-[color:var(--color-foundation-border)] bg-[color:var(--color-foundation-ink)] text-[color:var(--color-foundation-canvas)]" aria-labelledby="v2-hero-title">
    <Container className="grid min-h-[34rem] items-end gap-10 py-12 md:min-h-[42rem] md:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] md:py-16">
      <div className="relative overflow-hidden border border-white/20 bg-[#3a372e] p-6 md:p-10">
        <div className="absolute inset-x-0 top-0 h-1/3 border-b border-white/15 bg-[#504a3d]" aria-hidden="true" />
        <div className="absolute bottom-0 left-[12%] h-[58%] w-[33%] border border-white/15 bg-[#282720]" aria-hidden="true" />
        <div className="absolute bottom-0 right-[9%] h-[42%] w-[43%] border border-white/15 bg-[#625b4a]" aria-hidden="true" />
        <div className="relative flex min-h-[25rem] flex-col justify-between md:min-h-[31rem]">
          <p className="text-xs font-medium tracking-[0.14em] text-white/70">{content.eyebrow}</p>
          <div>
            <p className="text-xs tracking-[0.12em] text-white/70">{content.status}</p>
            <h1 id="v2-hero-title" className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-display)] tracking-[0.12em]">{title}</h1>
          </div>
        </div>
      </div>

      <div className="pb-1 md:pb-6">
        <p className="max-w-md text-base leading-7 text-white/75">{content.description}</p>
        <Link href={`/${locale}/stones`} className="mt-8 inline-flex min-h-11 items-center border-b border-white px-1 text-xs font-medium tracking-[0.1em] text-white hover:text-[#d7c79f]">{content.exploreStones}</Link>
        <ol className="mt-12 grid grid-cols-2 border-t border-white/20 sm:grid-cols-3" aria-label={content.eyebrow}>
          {content.stages.map((stage) => <li key={stage.label} className="border-b border-e border-white/20 p-3 last:border-e-0 sm:[&:nth-child(3n)]:border-e-0">
            <span className="block text-[0.65rem] tracking-[0.14em] text-white/55">{stage.label}</span>
            <span className="mt-2 block text-xs tracking-[0.08em]">{stage.title}</span>
          </li>)}
        </ol>
      </div>
    </Container>
  </section>;
}
