import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SkipButton } from "./SkipButton";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("SkipButton", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    pushMock.mockClear();
  });

  it("marks the intro as seen and navigates home when clicked", () => {
    render(<SkipButton />);

    fireEvent.click(screen.getByRole("button", { name: /atla/i }));

    expect(window.sessionStorage.getItem("hamman_intro_seen")).toBe("1");
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  // jsdom compiles no Tailwind and performs no layout, so contrast cannot be
  // measured here; these pin the two utilities that carry the fix, which is what
  // a regression would delete. The real numbers, measured in a browser against
  // the finished scene: cream #FBFAF7 on the cream sky #F5F2EC is 1.07:1 — the
  // state this shipped in — and cream on the ink/85 plate is 9.1:1 where the sky
  // behind it is cream, 13.1:1 over the grey mountain fog. The 9.1 figure is the
  // one that matters: it covers the 70% of the run this fix was made for.
  it("has an opaque background, so it stays legible over the cream stages", () => {
    render(<SkipButton />);

    expect(screen.getByRole("button", { name: /atla/i }).className).toMatch(
      /bg-\[color:var\(--color-stone-ink\)\]/
    );
  });

  // The only exit from the WebGL path, which loops rather than ending — so it
  // has to be operable and locatable by keyboard, and it had no focus treatment
  // at all.
  it("has a visible focus indicator for keyboard users", () => {
    render(<SkipButton />);

    expect(screen.getByRole("button", { name: /atla/i }).className).toMatch(
      /focus-visible:outline-\[color:var\(--color-stone-cream\)\]/
    );
  });
});
