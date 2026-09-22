import { defineField, defineType, type SanityDocument } from "sanity";
export const quarry = defineType({ name: "quarry", title: "Quarry", type: "document", fields: [
  defineField({ name: "name", title: "Name", type: "localizedString", validation: (Rule) => Rule.required() }), defineField({ name: "slug", title: "Slug", type: "slug", options: { source: (document) => { const name = (document as SanityDocument & { name?: { en?: string; tr?: string } }).name; return name?.en || name?.tr || ""; } }, validation: (Rule) => Rule.required() }),
  defineField({ name: "coordinates", title: "Verified coordinates", type: "geopoint" }), defineField({ name: "media", title: "Media", type: "array", of: [{ type: "mediaImage" }] }), defineField({ name: "stones", title: "Associated stones", type: "array", of: [{ type: "reference", to: [{ type: "stone" }] }] }),
], preview: { select: { title: "name.en", subtitle: "name.tr" } } });
