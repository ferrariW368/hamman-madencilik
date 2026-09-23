import type { PublishedLocale } from "../config";
import { en, enSkeleton, enStonesExperience } from "./en";
import { tr, trSkeleton, trStonesExperience } from "./tr";
import type { Messages } from "./types";
const messages: Record<PublishedLocale, Messages> = { tr: { ...tr, skeleton: trSkeleton, stonesExperience: trStonesExperience }, en: { ...en, skeleton: enSkeleton, stonesExperience: enStonesExperience } };
export function getMessages(locale: PublishedLocale): Messages { return messages[locale]; }
export type { Messages } from "./types";
