import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { IntroRedirectGate } from "./IntroRedirectGate";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

describe("IntroRedirectGate", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    replaceMock.mockClear();
  });

  it("redirects to /tanitim when the intro hasn't been seen", () => {
    render(<IntroRedirectGate />);
    expect(replaceMock).toHaveBeenCalledWith("/tanitim");
  });

  it("does not redirect when the intro has already been seen", () => {
    window.sessionStorage.setItem("hamman_intro_seen", "1");
    render(<IntroRedirectGate />);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renders nothing", () => {
    const { container } = render(<IntroRedirectGate />);
    expect(container).toBeEmptyDOMElement();
  });
});
