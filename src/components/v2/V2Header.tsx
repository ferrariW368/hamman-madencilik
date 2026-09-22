"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { PublishedLocale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

const destinations = ["stones", "quarries", "projects", "events", "about", "contact"] as const;

export function V2Header({ locale, messages }: Readonly<{ locale: PublishedLocale; messages: Messages["foundation"] }>) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const alternateLocale: PublishedLocale = locale === "tr" ? "en" : "tr";
  const alternatePath = pathname.replace(/^\/(tr|en)(?=\/|$)/, `/${alternateLocale}`);

  return (
    <header className="border-b border-[color:var(--color-foundation-border)] bg-[color:var(--color-foundation-canvas)]">
      <Container className="flex min-h-20 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="font-[family-name:var(--font-display)] text-xl tracking-[0.12em] text-[color:var(--color-foundation-ink)]" onClick={() => setIsOpen(false)}>HAMMARBLE</Link>
        <div className="flex items-center gap-2 md:order-3">
          <Link href={alternatePath} lang={alternateLocale} className="inline-flex min-h-11 items-center border border-[color:var(--color-foundation-border)] px-3 text-xs font-medium tracking-[0.08em] text-[color:var(--color-foundation-ink)] hover:border-[color:var(--color-foundation-accent)]" aria-label={`${messages.languageLabel}: ${messages.localeNames[alternateLocale]}`}>{messages.localeNames[alternateLocale]}</Link>
          <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center border border-[color:var(--color-foundation-border)] text-xs font-medium tracking-[0.08em] text-[color:var(--color-foundation-ink)] md:hidden" aria-expanded={isOpen} aria-controls="v2-primary-navigation" aria-label={isOpen ? messages.closeMenuLabel : messages.openMenuLabel} onClick={() => setIsOpen((open) => !open)}>{isOpen ? "×" : "MENU"}</button>
        </div>
        <nav id="v2-primary-navigation" aria-label={messages.navigationLabel} className={cn("absolute inset-x-0 top-20 z-10 border-b border-[color:var(--color-foundation-border)] bg-[color:var(--color-foundation-surface)] md:static md:block md:border-0 md:bg-transparent", isOpen ? "block" : "hidden md:block")}>
          <Container className="py-4 md:px-0 md:py-0">
            <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
              {destinations.map((destination) => <li key={destination}><Link href={`/${locale}/${destination}`} onClick={() => setIsOpen(false)} className="flex min-h-11 items-center border-b border-[color:var(--color-foundation-border)] text-sm text-[color:var(--color-foundation-ink)] hover:text-[color:var(--color-foundation-accent)] md:min-h-0 md:border-0 md:text-xs md:font-medium md:tracking-[0.1em]">{messages.navigation[destination]}</Link></li>)}
            </ul>
          </Container>
        </nav>
      </Container>
    </header>
  );
}
