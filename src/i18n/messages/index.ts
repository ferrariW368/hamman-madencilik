import type { PublishedLocale } from "../config";
import { en, enSkeleton } from "./en";
import { tr, trSkeleton } from "./tr";
import type { Messages } from "./types";
const messages: Record<PublishedLocale, Messages> = { tr: { ...tr, skeleton: trSkeleton }, en: { ...en, skeleton: enSkeleton } };
export function getMessages(locale: PublishedLocale): Messages { return messages[locale]; }
export type { Messages } from "./types";
