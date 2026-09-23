"use client";

import { getMessages } from "@/i18n/messages";
import { V2PageLink, V2PageShell } from "./V2PageShell";
import { useLocale } from "./LocaleProvider";

export function V2LocalizedNotFound() {
  const locale = useLocale();
  const messages = getMessages(locale).skeleton.notFound;
  return <V2PageShell locale={locale} content={messages}><V2PageLink href={`/${locale}`}>{messages.homeLink}</V2PageLink></V2PageShell>;
}
