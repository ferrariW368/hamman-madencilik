export type Messages = {
  foundation: {
    accessibleName: string;
    navigationLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    languageLabel: string;
    localeNames: Record<"tr" | "en", string>;
    navigation: { stones: string; quarries: string; projects: string; events: string; about: string; contact: string };
    footer: { copyright: string };
  };
  skeleton: {
    home: { label: string; title: string; description: string };
    stones: { label: string; title: string; description: string; spiderLink: string };
    spider: { label: string; title: string; description: string; availabilityNotice: string; backToStones: string; contactLink: string };
    quarries: { label: string; title: string; description: string };
    projects: { label: string; title: string; description: string };
    events: { label: string; title: string; description: string };
    about: { label: string; title: string; description: string };
    contact: { label: string; title: string; description: string };
    notFound: { label: string; title: string; description: string; homeLink: string };
  };
  homeBody: {
    sections: readonly { key: "stones" | "quarries" | "projects" | "events" | "about" | "contact"; label: string; title: string; description: string; linkLabel: string }[];
  };
  stonesExperience: {
    collection: { label: string; title: string; description: string; pendingPortfolio: string; detailsLink: string; detailsPending: string; mediaPending: string };
    detail: { label: string; overview: string; overviewPending: string; inspection: string; surface: string; block: string; mediaPending: string; technical: string; technicalPending: string; quarry: string; quarryPending: string; documents: string; documentsPending: string; inquiry: string; inquiryDescription: string; inquiryLink: string; backToCollection: string };
  };
};
