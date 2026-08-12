import { defineField, defineType } from "sanity";

export const hizmet = defineType({
  name: "hizmet",
  title: "Hizmet",
  type: "document",
  fields: [
    defineField({ name: "baslik", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "aciklama", title: "Açıklama", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "gorsel", title: "Görsel", type: "image", options: { hotspot: true } }),
    defineField({ name: "sira", title: "Sıra", type: "number", validation: (Rule) => Rule.required() }),
  ],
  orderings: [{ title: "Sıra", name: "siraAsc", by: [{ field: "sira", direction: "asc" }] }],
  preview: { select: { title: "baslik", subtitle: "aciklama" } },
});
