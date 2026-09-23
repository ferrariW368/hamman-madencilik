import Link from "next/link";
import type { PublishedLocale } from "@/i18n/config";
import { Container } from "./Container";

type PageShellContent = Readonly<{ label: string; title: string; description: string }>;

export function V2PageShell({ content, children }: Readonly<{ locale: PublishedLocale; content: PageShellContent; children?: React.ReactNode }>) {
  return <main><Container className="py-16 md:py-24"><div className="max-w-[var(--container-reading)] border-s-2 border-[color:var(--color-foundation-accent)] ps-5"><p className="text-xs font-medium tracking-[0.14em] text-[color:var(--color-foundation-muted)]">{content.label}</p><h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-title)] text-[color:var(--color-foundation-ink)]">{content.title}</h1><p className="mt-5 text-base leading-7 text-[color:var(--color-foundation-muted)]">{content.description}</p>{children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}</div></Container></main>;
}

export function V2PageLink({ href, children }: Readonly<{ href: string; children: React.ReactNode }>) {
  return <Link href={href} className="inline-flex min-h-11 items-center border border-[color:var(--color-foundation-border)] px-4 text-xs font-medium tracking-[0.08em] text-[color:var(--color-foundation-ink)] hover:border-[color:var(--color-foundation-accent)]">{children}</Link>;
}
