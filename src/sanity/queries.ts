import { client } from "./client";

export type Hizmet = {
  _id: string;
  baslik: string;
  aciklama: string;
  gorselUrl: string | null;
  sira: number;
};

export type UrunKategorisi = {
  _id: string;
  baslik: string;
  detaylar: string;
  kullanimAlani: string | null;
  gorselUrl: string | null;
  sira: number;
};

export type SirketBilgisi = {
  profil: string;
  vizyon: string;
  misyon: string;
  degerler: string[];
  sertifikalar: string[];
  ekipMetni: string;
  tanitimUrunleri: UrunKategorisi[];
};

export type IletisimBilgisi = {
  santiyeAdresi: string;
  ofisAdresi: string;
  telefon: string;
  eposta: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  xUrl: string | null;
  youtubeUrl: string | null;
};

const HIZMET_QUERY = `*[_type == "hizmet"] | order(sira asc){
  _id, baslik, aciklama, "gorselUrl": gorsel.asset->url, sira
}`;

const URUN_QUERY = `*[_type == "urunKategorisi"] | order(sira asc){
  _id, baslik, detaylar, kullanimAlani, "gorselUrl": gorsel.asset->url, sira
}`;

const SIRKET_QUERY = `*[_type == "sirketBilgisi"][0]{
  profil, vizyon, misyon, degerler, sertifikalar, ekipMetni,
  tanitimUrunleri[]->{ _id, baslik, detaylar, kullanimAlani, "gorselUrl": gorsel.asset->url, sira }
}`;

const ILETISIM_QUERY = `*[_type == "iletisimBilgisi"][0]{
  santiyeAdresi, ofisAdresi, telefon, eposta, instagramUrl, facebookUrl, xUrl, youtubeUrl
}`;

export async function getHizmetler(): Promise<Hizmet[]> {
  return client.fetch(HIZMET_QUERY);
}

export async function getUrunler(): Promise<UrunKategorisi[]> {
  return client.fetch(URUN_QUERY);
}

export async function getSirketBilgisi(): Promise<SirketBilgisi | null> {
  return client.fetch(SIRKET_QUERY);
}

export async function getIletisimBilgisi(): Promise<IletisimBilgisi | null> {
  return client.fetch(ILETISIM_QUERY);
}
