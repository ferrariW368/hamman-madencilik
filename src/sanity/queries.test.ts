import { describe, it, expect, vi, beforeEach } from "vitest";
import { getHizmetler, getUrunler, getSirketBilgisi, getIletisimBilgisi, SirketBilgisi, IletisimBilgisi } from "./queries";
import { client } from "./client";

vi.mock("./client", () => ({
  client: { fetch: vi.fn() },
}));

describe("queries", () => {
  beforeEach(() => {
    vi.mocked(client.fetch).mockReset();
  });

  it("getHizmetler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Test Hizmet", aciklama: "...", gorselUrl: null, sira: 1 }];
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getHizmetler();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledTimes(1);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "hizmet"'));
  });

  it("getUrunler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Blok Mermer", detaylar: "...", kullanimAlani: null, gorselUrl: null, sira: 1 }];
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getUrunler();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "urunKategorisi"'));
  });

  it("getSirketBilgisi returns the fetched company info", async () => {
    const fake: SirketBilgisi = {
      profil: "Test profil",
      vizyon: "Test vizyon",
      misyon: "Test misyon",
      degerler: ["Değer 1", "Değer 2"],
      sertifikalar: ["Sertifika 1"],
      ekipMetni: "Test ekip metni",
    };
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getSirketBilgisi();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "sirketBilgisi"'));
  });

  it("getIletisimBilgisi returns the fetched contact info", async () => {
    const fake: IletisimBilgisi = {
      santiyeAdresi: "Test santiye adresi",
      ofisAdresi: "Test ofis adresi",
      telefon: "555-1234",
      eposta: "test@example.com",
    };
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getIletisimBilgisi();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "iletisimBilgisi"'));
  });
});
