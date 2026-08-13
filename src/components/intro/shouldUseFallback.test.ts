import { describe, it, expect } from "vitest";
import { shouldUseFallback } from "./shouldUseFallback";

describe("shouldUseFallback", () => {
  it("is false when motion is fine and WebGL is supported", () => {
    expect(shouldUseFallback({ prefersReducedMotion: false, hasWebGL: true })).toBe(false);
  });

  it("is true when reduced motion is preferred, even with WebGL", () => {
    expect(shouldUseFallback({ prefersReducedMotion: true, hasWebGL: true })).toBe(true);
  });

  it("is true when WebGL is unsupported, even without reduced motion", () => {
    expect(shouldUseFallback({ prefersReducedMotion: false, hasWebGL: false })).toBe(true);
  });

  it("is true when both conditions apply", () => {
    expect(shouldUseFallback({ prefersReducedMotion: true, hasWebGL: false })).toBe(true);
  });
});
