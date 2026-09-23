import { describe, expect, it } from "vitest";
import { createLocaleMetadata } from "./metadata";

describe("createLocaleMetadata", () => {
  it.each([
    ["tr", "stones", "/tr/stones", "/en/stones"],
    ["en", "stones", "/tr/stones", "/en/stones"],
    ["tr", "stones/spider", "/tr/stones/spider", "/en/stones/spider"],
    ["en", "stones/spider", "/tr/stones/spider", "/en/stones/spider"],
  ] as const)("maps %s %s to equivalent localized routes", (locale, pathname, trPath, enPath) => {
    const metadata = createLocaleMetadata(locale, pathname);

    expect(metadata.alternates).toMatchObject({
      canonical: locale === "tr" ? trPath : enPath,
      languages: { tr: trPath, en: enPath },
    });
    expect(metadata.openGraph).toMatchObject({ url: locale === "tr" ? trPath : enPath });
  });
});
