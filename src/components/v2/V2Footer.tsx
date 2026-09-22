import type { PublishedLocale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { Container } from "./Container";

export function V2Footer({ locale, messages }: Readonly<{ locale: PublishedLocale; messages: Messages["foundation"] }>) {
  return <footer className="border-t border-[color:var(--color-foundation-border)] bg-[color:var(--color-foundation-surface)]"><Container className="flex min-h-24 items-center justify-between gap-4 py-6 text-xs tracking-[0.08em] text-[color:var(--color-foundation-muted)]"><span className="font-[family-name:var(--font-display)] text-sm tracking-[0.12em] text-[color:var(--color-foundation-ink)]">HAMMARBLE</span><span lang={locale}>{messages.footer.copyright} © {new Date().getFullYear()}</span></Container></footer>;
}
