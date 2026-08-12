import { describe, it, expect, vi, beforeEach } from "vitest";
import { getHizmetler, getUrunler } from "./queries";
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
  });

  it("getUrunler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Blok Mermer", detaylar: "...", kullanimAlani: null, gorselUrl: null, sira: 1 }];
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getUrunler();

    expect(result).toEqual(fake);
  });
});
