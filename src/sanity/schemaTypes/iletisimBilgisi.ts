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
  ],
  preview: { prepare: () => ({ title: "İletişim Bilgisi (tekil)" }) },
});
