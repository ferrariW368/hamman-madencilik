"use client";

import { createContext, useContext } from "react";
import type { PublishedLocale } from "@/i18n/config";

const LocaleContext = createContext<PublishedLocale | null>(null);

export function LocaleProvider({ locale, children }: Readonly<{ locale: PublishedLocale; children: React.ReactNode }>) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error("V2 locale context is unavailable.");
  return locale;
}
