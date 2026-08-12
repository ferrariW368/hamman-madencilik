import { defineField, defineType } from "sanity";

export const galeriGorseli = defineType({
  name: "galeriGorseli",
  title: "Galeri Görseli",
  type: "document",
  fields: [
    defineField({ name: "baslik", title: "Başlık", type: "string" }),
    defineField({ name: "gorsel", title: "Görsel", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "sira", title: "Sıra", type: "number" }),
  ],
  orderings: [{ title: "Sıra", name: "siraAsc", by: [{ field: "sira", direction: "asc" }] }],
  preview: { select: { title: "baslik", media: "gorsel" } },
});
