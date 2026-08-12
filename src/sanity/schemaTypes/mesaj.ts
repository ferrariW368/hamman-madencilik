import { defineField, defineType } from "sanity";

export const mesaj = defineType({
  name: "mesaj",
  title: "İletişim Formu Mesajı",
  type: "document",
  fields: [
    defineField({ name: "adSoyad", title: "Ad Soyad", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "eposta", title: "E-posta", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "konu", title: "Konu", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "mesaj", title: "Mesaj", type: "text", rows: 4 }),
    defineField({ name: "gonderimTarihi", title: "Gönderim Tarihi", type: "datetime" }),
  ],
  preview: { select: { title: "adSoyad", subtitle: "konu" } },
});
