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
});
