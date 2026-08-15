import { describe, it, expect } from "vitest";
import { buildContactFaces } from "./contactCubeFaces";

describe("buildContactFaces", () => {
  it("returns an empty list when nothing is filled in", () => {
    expect(buildContactFaces({})).toEqual([]);
  });

  it("includes only email and phone when only those are filled", () => {
    const faces = buildContactFaces({ eposta: "info@hammanmadencilik.com.tr", telefon: "+90.532.151 42 37" });
    expect(faces).toEqual([
      { kind: "email", label: "E-posta", href: "mailto:info@hammanmadencilik.com.tr", external: false },
      { kind: "phone", label: "Telefon", href: "tel:+90.532.1514237", external: false },
    ]);
  });

  it("includes only the social platforms whose URL is filled in", () => {
    const faces = buildContactFaces({
      instagramUrl: "https://instagram.com/hammanmadencilik",
      xUrl: "https://x.com/hammanmadencilik",
      facebookUrl: null,
      youtubeUrl: null,
    });
    expect(faces.map((f) => f.kind)).toEqual(["instagram", "x"]);
    expect(faces[0]).toEqual({
      kind: "instagram",
      label: "Instagram",
      href: "https://instagram.com/hammanmadencilik",
      external: true,
    });
  });

  // Sanity documents predating Task 2 omit these fields entirely, and an editor can
  // clear one back to "", so falsy values of every shape must produce no face.
  it("skips fields that are empty strings, null or undefined", () => {
    expect(
      buildContactFaces({
        instagramUrl: "",
        facebookUrl: null,
        xUrl: undefined,
        eposta: "",
        telefon: "",
      })
    ).toEqual([]);
  });

  it("includes all six faces in a fixed order when everything is filled", () => {
    const faces = buildContactFaces({
      instagramUrl: "https://instagram.com/x",
      facebookUrl: "https://facebook.com/x",
      xUrl: "https://x.com/x",
      youtubeUrl: "https://youtube.com/x",
      eposta: "info@example.com",
      telefon: "+90 532 000 00 00",
    });
    // Deep-equal the whole array, not just the kinds. `external` is the field
    // that decides whether a click opens a new browser tab (window.open) or an
    // InfoPanel, and it was asserted for instagram only — so flipping it on
    // Facebook, X or YouTube shipped a green suite. The labels are user-visible
    // text on the cube faces and were equally unpinned. toEqual on an array is
    // positional, so this also keeps pinning the order the cube's face slots
    // depend on.
    expect(faces).toEqual([
      { kind: "instagram", label: "Instagram", href: "https://instagram.com/x", external: true },
      { kind: "facebook", label: "Facebook", href: "https://facebook.com/x", external: true },
      { kind: "x", label: "X", href: "https://x.com/x", external: true },
      { kind: "youtube", label: "YouTube", href: "https://youtube.com/x", external: true },
      { kind: "email", label: "E-posta", href: "mailto:info@example.com", external: false },
      { kind: "phone", label: "Telefon", href: "tel:+905320000000", external: false },
    ]);
  });
});
