import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the eyebrow, title, emphasis and description", () => {
    render(
      <Hero
        eyebrow="Konya & Antalya · 1985'ten Bu Yana"
        title="Doğanın taşına,"
        emphasis="ustanın dokunuşu."
        description="Mermer ocak işletmeciliğinden ihracata."
      />
    );

    expect(screen.getByText("Konya & Antalya · 1985'ten Bu Yana")).toBeInTheDocument();
    expect(screen.getByText("Doğanın taşına,")).toBeInTheDocument();
    expect(screen.getByText("ustanın dokunuşu.")).toBeInTheDocument();
    expect(screen.getByText("Mermer ocak işletmeciliğinden ihracata.")).toBeInTheDocument();
  });
});
