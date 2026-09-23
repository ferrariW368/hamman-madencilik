import { describe, expect, it } from "vitest";
import { getLocalizedStoneName, getV2StoneBySlug, v2Stones } from "./v2-stones";

describe("v2Stones", () => {
  it("exposes Spider as the only neutral foundation record", () => {
    expect(v2Stones).toHaveLength(1);
    expect(getV2StoneBySlug("spider")).toMatchObject({ slug: "spider", verificationState: "DETAILS_PENDING" });
    expect(getV2StoneBySlug("unknown")).toBeUndefined();
  });

  it("resolves Spider for both published locales", () => {
    const spider = getV2StoneBySlug("spider");
    expect(spider).toBeDefined();
    expect(getLocalizedStoneName(spider!.name, "tr")).toBe("Spider");
    expect(getLocalizedStoneName(spider!.name, "en")).toBe("Spider");
  });
});
