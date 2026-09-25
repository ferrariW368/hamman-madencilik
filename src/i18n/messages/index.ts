import type { PublishedLocale } from "../config";
import { en, enHeroPrototype, enHomeBody, enSkeleton, enStonesExperience } from "./en";
import { tr, trHeroPrototype, trHomeBody, trSkeleton, trStonesExperience } from "./tr";
import type { Messages } from "./types";
const messages: Record<PublishedLocale, Messages> = { tr: { ...tr, skeleton: trSkeleton, homeBody: trHomeBody, heroPrototype: trHeroPrototype, stonesExperience: trStonesExperience }, en: { ...en, skeleton: enSkeleton, homeBody: enHomeBody, heroPrototype: enHeroPrototype, stonesExperience: enStonesExperience } };
export function getMessages(locale: PublishedLocale): Messages { return messages[locale]; }
export type { Messages } from "./types";
