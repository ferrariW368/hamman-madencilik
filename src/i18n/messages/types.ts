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
};
