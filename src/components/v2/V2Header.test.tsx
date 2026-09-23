import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getMessages } from "@/i18n/messages";
import { V2Header } from "./V2Header";

vi.mock("next/navigation", () => ({ usePathname: () => "/tr/stones/spider" }));

describe("V2Header", () => {
  it("links every primary destination under the active locale", () => {
    render(<V2Header locale="tr" messages={getMessages("tr").foundation} />);
    expect(screen.getByRole("link", { name: "Taşlar" })).toHaveAttribute("href", "/tr/stones");
    expect(screen.getByRole("link", { name: "Ocaklar" })).toHaveAttribute("href", "/tr/quarries");
    expect(screen.getByRole("link", { name: "Projeler" })).toHaveAttribute("href", "/tr/projects");
    expect(screen.getByRole("link", { name: "Etkinlikler" })).toHaveAttribute("href", "/tr/events");
    expect(screen.getByRole("link", { name: "Hakkımızda" })).toHaveAttribute("href", "/tr/about");
    expect(screen.getByRole("link", { name: "İletişim" })).toHaveAttribute("href", "/tr/contact");
  });

  it("preserves the current route when switching language", () => {
    render(<V2Header locale="tr" messages={getMessages("tr").foundation} />);
    expect(screen.getByRole("link", { name: "Dil: English" })).toHaveAttribute("href", "/en/stones/spider");
  });
});
