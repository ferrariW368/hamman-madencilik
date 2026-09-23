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
};
