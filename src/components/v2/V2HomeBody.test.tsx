import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { V2HomeBody } from "./V2HomeBody";

describe("V2HomeBody", () => {
  it("keeps the locked Home Body order and locale-aware destinations", () => {
    const messages = getMessages("tr");
    render(<V2HomeBody locale="tr" content={messages.skeleton.home} hero={messages.heroPrototype} sections={messages.homeBody.sections} />);

    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual(["Taşlar", "Ocaklar", "Projeler", "Etkinlikler", "Miras", "İletişim"]);
    expect(screen.getByRole("link", { name: "Taşları incele" })).toHaveAttribute("href", "/tr/stones");
    expect(screen.getByRole("link", { name: "İletişim alanına git" })).toHaveAttribute("href", "/tr/contact");
    expect(screen.getByText("DEMO — doğrulanmış şirket görüntüsü kullanılmıyor")).toBeInTheDocument();
    expect(screen.getByText("AI-GENERATED konsept görsel — HAMMARBLE ocağını temsil etmez")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "HAMMARBLE / WEB PROTOTYPE" })).not.toBeInTheDocument();
    expect(screen.getByText("↓")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Yapay zekâ ile üretilmiş taş ocağı konsept görseli" })).toHaveAttribute("src", expect.stringContaining("ai-hero-quarry-approach-02-poster.jpg"));
    expect(screen.getByRole("img", { name: "HAMMARBLE ocak genel görünüm referans fotoğrafı" })).toHaveAttribute("src", expect.stringContaining("quarry-overview-cropped.jpg"));
    expect(screen.getByText("MOBİL REFERANS — proje sahibinin izin verdiği gerçek ocak fotoğrafı")).toBeInTheDocument();
    const video = document.querySelector("video");
    expect(video).toHaveAttribute("poster", "/media/ai/ai-hero-quarry-approach-02-poster.jpg");
    expect(video?.querySelector("source")).toHaveAttribute("src", "/media/ai/ai-hero-quarry-approach-02.mp4");
  });
});
