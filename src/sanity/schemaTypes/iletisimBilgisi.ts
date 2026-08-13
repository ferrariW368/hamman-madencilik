import { defineField, defineType } from "sanity";

export const iletisimBilgisi = defineType({
  name: "iletisimBilgisi",
  title: "İletişim Bilgisi",
  type: "document",
  fields: [
    defineField({ name: "santiyeAdresi", title: "Şantiye Adresi (Konya)", type: "text", rows: 2 }),
    defineField({ name: "ofisAdresi", title: "Ofis Adresi (Antalya)", type: "text", rows: 2 }),
    defineField({ name: "telefon", title: "Telefon", type: "string" }),
    defineField({ name: "eposta", title: "E-posta", type: "string" }),
    defineField({ name: "instagramUrl", title: "Instagram Linki", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook Linki", type: "url" }),
    defineField({ name: "xUrl", title: "X (Twitter) Linki", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube Linki", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "İletişim Bilgisi (tekil)" }) },
});
