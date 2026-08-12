import { defineField, defineType } from "sanity";

export const urunKategorisi = defineType({
  name: "urunKategorisi",
  title: "Ürün Kategorisi",
  type: "document",
  fields: [
    defineField({ name: "baslik", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "detaylar", title: "Detaylar", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "kullanimAlani", title: "Kullanım Alanı", type: "text", rows: 2 }),
    defineField({ name: "gorsel", title: "Görsel", type: "image", options: { hotspot: true } }),
    defineField({ name: "sira", title: "Sıra", type: "number", validation: (Rule) => Rule.required() }),
  ],
  orderings: [{ title: "Sıra", name: "siraAsc", by: [{ field: "sira", direction: "asc" }] }],
  preview: { select: { title: "baslik", subtitle: "detaylar" } },
});
