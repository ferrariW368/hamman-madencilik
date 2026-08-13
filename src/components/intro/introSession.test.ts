import { describe, it, expect, beforeEach } from "vitest";
import { hasSeenIntro, markIntroSeen } from "./introSession";

describe("introSession", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("returns false before markIntroSeen is called", () => {
    expect(hasSeenIntro()).toBe(false);
  });

  it("returns true after markIntroSeen is called", () => {
    markIntroSeen();
    expect(hasSeenIntro()).toBe(true);
  });

  it("returns false when the stored value is not exactly \"1\"", () => {
    window.sessionStorage.setItem("hamman_intro_seen", "true");
    expect(hasSeenIntro()).toBe(false);
  });
});
