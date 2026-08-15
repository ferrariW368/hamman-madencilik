import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// IntroScene is stubbed, not rendered. It mounts IntroCanvas, which imports
// three.js and asks for a WebGL context jsdom cannot give it — and none of that
// is what these tests are about. The stub keeps the one edge that matters: it
// exposes `onFinish` so the fallback exit can still be exercised.
vi.mock("@/components/intro/IntroScene", () => ({
  IntroScene: ({ onFinish }: { onFinish: () => void }) => (
    <button type="button" onClick={onFinish}>
      finish
    </button>
  ),
}));

import { TanitimClient } from "./TanitimClient";

function renderRoute() {
  return render(<TanitimClient sirket={null} urunler={[]} iletisim={null} />);
}

describe("TanitimClient", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    pushMock.mockClear();
  });

  // The behavioural fix this route exists to carry, and it had no coverage at
  // all: deleting the mount effect left the whole suite green.
  //
  // What it protects: the session flag means "this session has been shown the
  // intro", not "this session pressed one of two specific buttons". Setting it
  // only on the explicit exits left a live bounce-back — the intro's own
  // InfoPanel offers a plain <a href> to /hakkimizda with no onClick, and that
  // page's logo links to /, where IntroRedirectGate would throw the visitor
  // straight back into the intro they had just watched. Marking on arrival
  // closes that path, the back-button path and the typed-URL path together.
  //
  // Note there is no interaction in this test on purpose. Nothing is clicked;
  // mounting alone must be enough, which is precisely the property that
  // distinguishes the fix from what it replaced.
  it("marks the intro as seen on mount, with no interaction", () => {
    renderRoute();

    expect(window.sessionStorage.getItem("hamman_intro_seen")).toBe("1");
  });

  // Negative control: proves the assertion above is reading something this
  // component did, not a value left behind by an earlier test or by the
  // storage's default state.
  it("leaves the flag unset until it is mounted", () => {
    expect(window.sessionStorage.getItem("hamman_intro_seen")).toBeNull();

    renderRoute();

    expect(window.sessionStorage.getItem("hamman_intro_seen")).toBe("1");
  });

  // The fallback path's own exit keeps setting the flag independently of the
  // mount effect ("belt and braces" in the component's comment). If that call is
  // ever dropped as redundant, a reduced-motion or no-WebGL visitor whose mount
  // effect did not run lands on / with the flag unset and IntroRedirectGate
  // returns them to the intro — an unbreakable loop, hitting exactly the users
  // the fallback exists to serve. Cleared first so only the exit can set it.
  it("marks the intro as seen and navigates home from the fallback exit", () => {
    renderRoute();
    window.sessionStorage.clear();

    fireEvent.click(screen.getByRole("button", { name: "finish" }));

    expect(window.sessionStorage.getItem("hamman_intro_seen")).toBe("1");
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
