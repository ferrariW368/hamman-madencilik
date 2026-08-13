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
});
