import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "./LocaleProvider";
import { V2LocalizedNotFound } from "./V2LocalizedNotFound";

describe("V2LocalizedNotFound", () => {
  it("renders Turkish V2 copy and route for tr", () => {
    render(<LocaleProvider locale="tr"><V2LocalizedNotFound /></LocaleProvider>);
    expect(screen.getByRole("heading", { name: "Sayfa bulunamadı" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ana sayfaya dön" })).toHaveAttribute("href", "/tr");
  });

  it("renders English V2 copy and route for en", () => {
    render(<LocaleProvider locale="en"><V2LocalizedNotFound /></LocaleProvider>);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/en");
  });
});
