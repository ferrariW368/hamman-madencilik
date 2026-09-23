"use client";

import { useState } from "react";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/cn";

export function StoneMediaSwitcher({ messages }: Readonly<{ messages: Messages["stonesExperience"]["detail"] }>) {
  const [view, setView] = useState<"surface" | "block">("surface");
  const viewLabel = view === "surface" ? messages.surface : messages.block;

  return <section aria-labelledby="stone-inspection-title" className="border-y border-[color:var(--color-foundation-border)] py-8 md:py-10"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><h2 id="stone-inspection-title" className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-foundation-ink)]">{messages.inspection}</h2><div role="group" aria-label={messages.inspection} className="flex w-full sm:w-auto"><button type="button" aria-pressed={view === "surface"} onClick={() => setView("surface")} className={cn("min-h-11 flex-1 border border-[color:var(--color-foundation-border)] px-4 text-xs font-medium tracking-[0.1em] sm:flex-none", view === "surface" ? "bg-[color:var(--color-foundation-ink)] text-[color:var(--color-foundation-surface)]" : "text-[color:var(--color-foundation-ink)]")}>{messages.surface}</button><button type="button" aria-pressed={view === "block"} onClick={() => setView("block")} className={cn("-ms-px min-h-11 flex-1 border border-[color:var(--color-foundation-border)] px-4 text-xs font-medium tracking-[0.1em] sm:flex-none", view === "block" ? "bg-[color:var(--color-foundation-ink)] text-[color:var(--color-foundation-surface)]" : "text-[color:var(--color-foundation-ink)]")}>{messages.block}</button></div></div><div className="mt-6 flex aspect-[16/9] items-end border border-dashed border-[color:var(--color-foundation-border)] bg-[color:var(--color-foundation-surface)] p-5 md:aspect-[2/1]"><p className="max-w-sm text-sm leading-6 text-[color:var(--color-foundation-muted)]"><span className="block text-xs font-medium tracking-[0.12em] text-[color:var(--color-foundation-ink)]">{viewLabel}</span>{messages.mediaPending}</p></div></section>;
}
