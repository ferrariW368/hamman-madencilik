import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InfoPanel } from "./InfoPanel";

describe("InfoPanel", () => {
  it("renders the title and description", () => {
    render(<InfoPanel title="Blok Mermer" description="Ocaktan çıkarılan doğal bloklar." onClose={() => {}} />);

    expect(screen.getByText("Blok Mermer")).toBeInTheDocument();
    expect(screen.getByText("Ocaktan çıkarılan doğal bloklar.")).toBeInTheDocument();
  });

  it("renders neither a full-page link nor its label when fullPageHref is omitted", () => {
    render(<InfoPanel title="X" description="Y" onClose={() => {}} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText(/tüm sayfayı gör/i)).not.toBeInTheDocument();
  });

  it("renders a full-page link when fullPageHref is provided", () => {
    render(<InfoPanel title="X" description="Y" fullPageHref="/hakkimizda" onClose={() => {}} />);
    expect(screen.getByRole("link", { name: /tüm sayfayı gör/i })).toHaveAttribute("href", "/hakkimizda");
  });

  it("calls onClose when the Kapat button is clicked", () => {
    const onClose = vi.fn();
    render(<InfoPanel title="X" description="Y" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /kapat/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // jsdom performs no layout, so getBoundingClientRect here is all zeroes and
  // the tap target cannot be measured in this suite. The padding utility is
  // therefore what these pin: it is the whole fix, and dropping it is the
  // regression to catch. Real measurements at 375x812 in a browser: close
  // 66.9 x 40 CSS px and link 140.7 x 40, both clearing WCAG 2.5.8's 24 x 24 —
  // they were 42.9 x 16 and 140.7 x 16 before.
  it("gives the close control padding, so its tap target is bigger than the line box", () => {
    render(<InfoPanel title="X" description="Y" onClose={() => {}} />);

    expect(screen.getByRole("button", { name: /kapat/i }).className).toMatch(/(?:^|\s)p-[1-9]/);
  });

  it("gives the full-page link vertical padding, so its tap target is bigger than the line box", () => {
    render(<InfoPanel title="X" description="Y" fullPageHref="/hakkimizda" onClose={() => {}} />);

    expect(screen.getByRole("link", { name: /tüm sayfayı gör/i }).className).toMatch(
      /(?:^|\s)py-[1-9]/
    );
  });
});
