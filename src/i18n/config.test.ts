import { describe, expect, it } from "vitest";
import { getLocaleDirection, isPublishedLocale, publishedLocales } from "./config";

describe("locale configuration", () => {
  it("keeps the published V2 locales limited to Turkish and English", () => {
    expect(publishedLocales).toEqual(["tr", "en"]);
    expect(isPublishedLocale("zh")).toBe(false);
    expect(isPublishedLocale("ar")).toBe(false);
  });

  it("preserves Chinese LTR and Arabic RTL architecture before publication", () => {
    expect(getLocaleDirection("zh")).toBe("ltr");
    expect(getLocaleDirection("ar")).toBe("rtl");
  });
});
