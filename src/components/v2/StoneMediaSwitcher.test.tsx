import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { StoneMediaSwitcher } from "./StoneMediaSwitcher";

describe("StoneMediaSwitcher", () => {
  it("defaults to Surface and supports an accessible Block switch", () => {
    render(<StoneMediaSwitcher messages={getMessages("en").stonesExperience.detail} />);
    const surface = screen.getByRole("button", { name: "Surface" });
    const block = screen.getByRole("button", { name: "Block" });
    expect(surface).toHaveAttribute("aria-pressed", "true");
    expect(block).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(block);
    expect(surface).toHaveAttribute("aria-pressed", "false");
    expect(block).toHaveAttribute("aria-pressed", "true");
  });
});
