import type { PublishedLocale } from "../config";
import { en } from "./en";
import { tr } from "./tr";
import type { Messages } from "./types";
const messages: Record<PublishedLocale, Messages> = { tr, en };
export function getMessages(locale: PublishedLocale): Messages { return messages[locale]; }
export type { Messages } from "./types";
