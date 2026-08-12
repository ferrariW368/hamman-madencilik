import { describe, it, expect } from "vitest";
import { hizmetler, urunler, sirketBilgisi, iletisimBilgisi } from "./seed-data";

describe("seed-data", () => {
  it("has exactly 7 hizmetler with sequential sira 1-7", () => {
    expect(hizmetler).toHaveLength(7);
    expect(hizmetler.map((h) => h.sira)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("has exactly 10 urunler with sequential sira 1-10", () => {
    expect(urunler).toHaveLength(10);
    expect(urunler.map((u) => u.sira)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("every hizmet has a non-empty baslik and aciklama", () => {
    for (const h of hizmetler) {
      expect(h.baslik.length).toBeGreaterThan(0);
      expect(h.aciklama.length).toBeGreaterThan(0);
    }
  });

  it("sirketBilgisi has 6 değerler and 6 sertifikalar", () => {
    expect(sirketBilgisi.degerler).toHaveLength(6);
    expect(sirketBilgisi.sertifikalar).toHaveLength(6);
  });

  it("iletisimBilgisi has both addresses populated", () => {
    expect(iletisimBilgisi.santiyeAdresi.length).toBeGreaterThan(0);
    expect(iletisimBilgisi.ofisAdresi.length).toBeGreaterThan(0);
  });
});
