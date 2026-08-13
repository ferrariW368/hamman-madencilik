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
});
