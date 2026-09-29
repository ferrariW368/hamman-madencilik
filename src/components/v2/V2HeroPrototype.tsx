import Link from "next/link";
import type { PublishedLocale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { Container } from "./Container";
import { V2HeroMedia } from "./V2HeroMedia";

export function V2HeroPrototype({ locale, title, content }: Readonly<{ locale: PublishedLocale; title: string; content: Messages["heroPrototype"] }>) {
  return <section className="v2-hero relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-[color:var(--color-foundation-ink)] text-white" aria-labelledby="v2-hero-title">
    <V2HeroMedia alt={content.imageAlt} mobileAlt={content.mobileImageAlt} />
    <div className="v2-hero__scrim absolute inset-0" aria-hidden="true" />
    <Container className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-between py-8 md:py-12">
      <div className="flex items-start justify-between gap-6">
        <p className="v2-hero__eyebrow text-xs font-medium tracking-[0.16em] text-white/75">{content.eyebrow}</p>
        <p className="v2-hero__disclosure v2-hero__disclosure--ai max-w-56 text-end text-[0.62rem] leading-4 tracking-[0.08em] text-white/60">{content.imageDisclosure}</p>
        <p className="v2-hero__disclosure v2-hero__disclosure--mobile max-w-56 text-end text-[0.62rem] leading-4 tracking-[0.08em] text-white/70">{content.mobileImageDisclosure}</p>
      </div>

      <div className="v2-hero__identity max-w-2xl pb-[clamp(2rem,8vh,6rem)]">
        <p className="text-xs tracking-[0.12em] text-white/70">{content.status}</p>
        <h1 id="v2-hero-title" className="mt-4 font-[family-name:var(--font-display)] text-[clamp(3.5rem,11vw,9rem)] leading-[0.82] tracking-[0.08em]">{title}</h1>
        <p className="v2-hero__copy mt-8 max-w-md text-base leading-7 text-white/80 md:text-lg">{content.description}</p>
        <Link href={`/${locale}/stones`} className="v2-hero__cta mt-8 inline-flex min-h-11 items-center border-b border-white px-1 text-xs font-medium tracking-[0.1em] text-white hover:text-[#d7c79f]">{content.exploreStones}</Link>
      </div>

      <div className="v2-hero__scroll-cue flex items-center gap-3 border-t border-white/30 pt-4 text-[0.62rem] tracking-[0.16em] text-white/65" aria-hidden="true">
        <span>01</span><span className="h-px w-10 bg-white/50" /><span>↓</span>
      </div>
    </Container>
  </section>;
}
