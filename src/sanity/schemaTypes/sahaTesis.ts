// src/sanity/schemaTypes/sahaTesis.ts
// NOTE: schema only, for Faz 2 (the globe). No documents are seeded against this
// type in Faz 1 — do not build any UI consuming it yet.
import { defineField, defineType } from "sanity";

export const sahaTesis = defineType({
  name: "sahaTesis",
  title: "Saha / Tesis (Faz 2)",
  type: "document",
  fields: [
    defineField({ name: "kod", title: "Kod", type: "string" }),
    defineField({ name: "sehir", title: "Şehir", type: "string" }),
    defineField({ name: "ulke", title: "Ülke", type: "string" }),
    defineField({ name: "enlem", title: "Enlem", type: "number" }),
    defineField({ name: "boylam", title: "Boylam", type: "number" }),
    defineField({ name: "kaynak", title: "Kaynak", type: "string" }),
    defineField({ name: "durum", title: "Durum", type: "string" }),
    defineField({ name: "not", title: "Not", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "sehir", subtitle: "kod" } },
});
