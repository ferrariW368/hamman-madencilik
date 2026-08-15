import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IntroFallback } from "./IntroFallback";

describe("IntroFallback", () => {
  it("renders the company name and calls onContinue when clicked", () => {
    const onContinue = vi.fn();
    render(<IntroFallback onContinue={onContinue} />);

    expect(screen.getByText("Hamman Madencilik")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ana sayfaya geç/i }));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  // This is the only screen reduced-motion and no-WebGL visitors ever see on
  // /tanitim, and the company name was a <p>, so the route had no heading
  // element at all for exactly the audience most likely to be navigating by
  // headings. Pinned as a heading rather than as text so a revert is caught.
  it("gives the screen a top-level heading", () => {
    render(<IntroFallback onContinue={() => {}} />);

    expect(screen.getByRole("heading", { level: 1, name: "Hamman Madencilik" })).toBeInTheDocument();
  });
});
