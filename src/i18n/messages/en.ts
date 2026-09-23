import type { Messages } from "./types";
export const enSkeleton: Messages["skeleton"] = {
  home: { label: "HAMMARBLE", title: "HAMMARBLE", description: "The V2 home page structure is under development." },
  stones: { label: "Stones", title: "Stones", description: "The current portfolio and material details will be added after verification.", spiderLink: "Spider detail" },
  spider: { label: "Stones", title: "Spider", description: "This is a neutral development-only detail route placeholder.", availabilityNotice: "Imagery, technical data, origin and sales information are not yet published.", backToStones: "Back to stones", contactLink: "Go to contact" },
  quarries: { label: "Quarries", title: "Quarries", description: "Quarry information will be added with verified locations and stone relationships." },
  projects: { label: "Projects", title: "Projects", description: "Project references and scopes will be added after verification." },
  events: { label: "Events", title: "Events", description: "Event records will be added with verified dates and media." },
  about: { label: "About", title: "About", description: "Company history and information will be added after verification." },
  contact: { label: "Contact", title: "Contact", description: "Verified contact channels and the form system are not yet published." },
  notFound: { label: "404", title: "Page not found", description: "The requested V2 page could not be found.", homeLink: "Return home" },
};
export const en: Omit<Messages, "skeleton"> = { foundation: { accessibleName: "HAMMARBLE", navigationLabel: "Primary navigation", openMenuLabel: "Open menu", closeMenuLabel: "Close menu", languageLabel: "Language", localeNames: { tr: "Türkçe", en: "English" }, navigation: { stones: "Stones", quarries: "Quarries", projects: "Projects", events: "Events", about: "About", contact: "Contact" }, footer: { copyright: "Copyright" } } };
