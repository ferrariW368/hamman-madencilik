import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServiceStrip } from "./ServiceStrip";

const items = [
  { _id: "1", baslik: "Mermer Ocak İşletmeciliği" },
  { _id: "2", baslik: "Blok & Plaka Üretimi" },
  { _id: "3", baslik: "Lojistik & İhracat" },
  { _id: "4", baslik: "ÇED & Sürdürülebilirlik" },
  { _id: "5", baslik: "Beşinci Hizmet" },
];

describe("ServiceStrip", () => {
  it("renders only the first 4 items, numbered 01-04", () => {
    render(<ServiceStrip items={items} />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(screen.queryByText("05")).not.toBeInTheDocument();
    expect(screen.getByText("Mermer Ocak İşletmeciliği")).toBeInTheDocument();
    expect(screen.queryByText("Beşinci Hizmet")).not.toBeInTheDocument();
  });
});
