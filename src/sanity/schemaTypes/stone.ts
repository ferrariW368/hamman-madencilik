import { defineField, defineType, type SanityDocument } from "sanity";
export const stone = defineType({ name: "stone", title: "Stone", type: "document", fields: [
  defineField({ name: "name", title: "Name", type: "localizedString", validation: (Rule) => Rule.required() }), defineField({ name: "slug", title: "Slug", type: "slug", options: { source: (document) => { const name = (document as SanityDocument & { name?: { en?: string; tr?: string } }).name; return name?.en || name?.tr || ""; } }, validation: (Rule) => Rule.required() }),
  defineField({ name: "quarry", title: "Quarry", type: "reference", to: [{ type: "quarry" }] }), defineField({ name: "surfaceMedia", title: "Surface media", type: "array", of: [{ type: "mediaImage" }] }), defineField({ name: "blockMedia", title: "Block media", type: "array", of: [{ type: "mediaImage" }] }),
  defineField({ name: "technicalData", title: "Technical data", type: "array", of: [{ type: "technicalDatum" }] }), defineField({ name: "technicalDocuments", title: "Technical documents", type: "array", of: [{ type: "reference", to: [{ type: "technicalDocument" }] }] }),
], preview: { select: { title: "name.en", subtitle: "name.tr" } } });
