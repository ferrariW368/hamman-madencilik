import { describe, it, expect, vi, beforeEach } from "vitest";
import { getHizmetler, getUrunler, getSirketBilgisi, getIletisimBilgisi, SirketBilgisi, IletisimBilgisi } from "./queries";
import { client } from "./client";

vi.mock("./client", () => ({
  client: { fetch: vi.fn() },
}));

// Sanity's production fetch overloads expect transport metadata. The mocked
// boundary returns the domain values consumed by these query helpers instead.
const fetchMock = vi.mocked(client.fetch) as unknown as {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => void;
};

describe("queries", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it("getHizmetler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Test Hizmet", aciklama: "...", gorselUrl: null, sira: 1 }];
    fetchMock.mockResolvedValueOnce(fake);

    const result = await getHizmetler();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledTimes(1);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "hizmet"'));
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_id, baslik, aciklama, "gorselUrl": gorsel.asset->url, sira'));
  });

  it("getUrunler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Blok Mermer", detaylar: "...", kullanimAlani: null, gorselUrl: null, sira: 1 }];
    fetchMock.mockResolvedValueOnce(fake);

    const result = await getUrunler();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "urunKategorisi"'));
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_id, baslik, detaylar, kullanimAlani, "gorselUrl": gorsel.asset->url, sira'));
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
    fetchMock.mockResolvedValueOnce(fake);

    const result = await getSirketBilgisi();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "sirketBilgisi"'));
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('profil, vizyon, misyon, degerler, sertifikalar, ekipMetni'));
  });

  it("getIletisimBilgisi returns the fetched contact info", async () => {
    const fake: IletisimBilgisi = {
      santiyeAdresi: "Test santiye adresi",
      ofisAdresi: "Test ofis adresi",
      telefon: "555-1234",
      eposta: "test@example.com",
    };
    fetchMock.mockResolvedValueOnce(fake);

    const result = await getIletisimBilgisi();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('_type == "iletisimBilgisi"'));
    expect(client.fetch).toHaveBeenCalledWith(expect.stringContaining('santiyeAdresi, ofisAdresi, telefon, eposta'));
  });
});
