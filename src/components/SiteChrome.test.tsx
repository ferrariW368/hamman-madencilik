import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SiteChrome } from "./SiteChrome";

const pathnameMock = vi.fn<() => string>();
vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock(),
}));

function renderAt(pathname: string) {
  pathnameMock.mockReturnValue(pathname);
  return render(
    <SiteChrome>
      <nav>menü</nav>
    </SiteChrome>
  );
}

describe("SiteChrome", () => {
  beforeEach(() => {
    pathnameMock.mockReset();
  });

  it("renders its children on ordinary site routes", () => {
    renderAt("/");
    expect(screen.getByText("menü")).toBeInTheDocument();
  });

  it("renders its children on a nested site route", () => {
    renderAt("/urunlerimiz");
    expect(screen.getByText("menü")).toBeInTheDocument();
  });

  it("renders nothing on /tanitim", () => {
    const { container } = renderAt("/tanitim");
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing below /tanitim", () => {
    const { container } = renderAt("/tanitim/bolum");
    expect(container).toBeEmptyDOMElement();
  });

  it("does not treat a route that merely starts with the same characters as chromeless", () => {
    renderAt("/tanitimlar");
    expect(screen.getByText("menü")).toBeInTheDocument();
  });
});
