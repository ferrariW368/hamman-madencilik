import type { Messages } from "./types";
export const enStonesExperience: Messages["stonesExperience"] = {
  collection: { label: "Stones", title: "Stones", description: "The material portfolio will be published here as verified records become available.", pendingPortfolio: "Portfolio verification is in progress.", detailsLink: "Inspect material", detailsPending: "Details pending verification", mediaPending: "Verified material media is not yet available" },
  detail: { label: "Stones", overview: "Material overview", overviewPending: "A verified description is not yet published.", inspection: "Surface inspection", surface: "Surface", block: "Block", mediaPending: "Verified media for this view is not yet published.", technical: "Technical information", technicalPending: "Verified technical information is not yet published.", quarry: "Quarry / source", quarryPending: "A verified quarry or source relationship is not yet published.", documents: "Documents", documentsPending: "Verified technical documents are not yet published.", inquiry: "Inquiry", inquiryDescription: "A direct inquiry path will be available here when verified contact channels are published.", inquiryLink: "Go to contact", backToCollection: "Back to stones" },
};
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
export const enHomeBody: Messages["homeBody"] = {
  sections: [
    { key: "stones", label: "01", title: "Stones", description: "Review verified material records and the Spider detail route.", linkLabel: "Explore stones" },
    { key: "quarries", label: "02", title: "Quarries", description: "Verified quarry locations and material relationships will appear here when published.", linkLabel: "Go to quarries" },
    { key: "projects", label: "03", title: "Projects", description: "References will be published after their scopes are verified.", linkLabel: "Go to projects" },
    { key: "events", label: "04", title: "Events", description: "Event records will appear here with verified dates and media.", linkLabel: "Go to events" },
    { key: "about", label: "05", title: "Heritage", description: "Company history will be published when verified source material is ready.", linkLabel: "Go to about" },
    { key: "contact", label: "06", title: "Contact", description: "A direct path will be available here when verified contact channels are published.", linkLabel: "Go to contact" },
  ],
};
export const en: Omit<Messages, "skeleton" | "homeBody" | "stonesExperience"> = { foundation: { accessibleName: "HAMMARBLE", navigationLabel: "Primary navigation", openMenuLabel: "Open menu", closeMenuLabel: "Close menu", languageLabel: "Language", localeNames: { tr: "Türkçe", en: "English" }, navigation: { stones: "Stones", quarries: "Quarries", projects: "Projects", events: "Events", about: "About", contact: "Contact" }, footer: { copyright: "Copyright" } } };
