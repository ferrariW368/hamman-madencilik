import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders a link for each of the 5 main sections", () => {
    render(<Nav />);

    expect(screen.getByRole("link", { name: "HİZMETLER" })).toHaveAttribute("href", "/hizmetlerimiz");
    expect(screen.getByRole("link", { name: "ÜRÜNLER" })).toHaveAttribute("href", "/urunlerimiz");
    expect(screen.getByRole("link", { name: "ŞANTİYELER" })).toHaveAttribute("href", "/santiyelerimiz");
    expect(screen.getByRole("link", { name: "HAKKIMIZDA" })).toHaveAttribute("href", "/hakkimizda");
    expect(screen.getByRole("link", { name: "İLETİŞİM" })).toHaveAttribute("href", "/iletisim");
  });

  it("renders the company name linking home", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /HAMMAN/ })).toHaveAttribute("href", "/");
  });
});
