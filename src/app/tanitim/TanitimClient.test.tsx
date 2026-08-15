import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// IntroScene is stubbed, not rendered. It mounts IntroCanvas, which imports
// three.js and asks for a WebGL context jsdom cannot give it — and none of that
// is what this test is about. The stub keeps the one edge that matters: it
// exposes `onFinish` so the fallback exit can still be exercised.
vi.mock("@/components/intro/IntroScene", () => ({
  IntroScene: ({ onFinish }: { onFinish: () => void }) => (
    <button type="button" onClick={onFinish}>
      finish
    </button>
  ),
}));

import { TanitimClient } from "./TanitimClient";

describe("TanitimClient", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  // `onFinish` is reached only from IntroFallback's "Ana Sayfaya Geç" button, and
  // for a reduced-motion or no-WebGL visitor it is the ONLY way off this route —
  // the WebGL path loops instead of ending, so those visitors never see
  // SkipButton either. Wiring it to anything other than the homepage, or not
  // wiring it at all, strands exactly the users the fallback exists to serve.
  it("navigates home from the fallback exit", () => {
    render(<TanitimClient sirket={null} urunler={[]} iletisim={null} />);

    fireEvent.click(screen.getByRole("button", { name: "finish" }));

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
