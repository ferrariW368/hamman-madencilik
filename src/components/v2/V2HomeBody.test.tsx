import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { V2HomeBody } from "./V2HomeBody";

describe("V2HomeBody", () => {
  it("keeps the locked Home Body order and locale-aware destinations", () => {
    const messages = getMessages("tr");
    render(<V2HomeBody locale="tr" content={messages.skeleton.home} sections={messages.homeBody.sections} />);

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual(["Taşlar", "Ocaklar", "Projeler", "Etkinlikler", "Miras", "İletişim"]);
    expect(screen.getByRole("link", { name: "Taşları incele" })).toHaveAttribute("href", "/tr/stones");
    expect(screen.getByRole("link", { name: "İletişim alanına git" })).toHaveAttribute("href", "/tr/contact");
  });
});
