import { defineField, defineType, type SanityDocument } from "sanity";
export const project = defineType({ name: "project", title: "Project", type: "document", fields: [
  defineField({ name: "name", title: "Name", type: "localizedString", validation: (Rule) => Rule.required() }), defineField({ name: "slug", title: "Slug", type: "slug", options: { source: (document) => { const name = (document as SanityDocument & { name?: { en?: string; tr?: string } }).name; return name?.en || name?.tr || ""; } }, validation: (Rule) => Rule.required() }),
  defineField({ name: "scope", title: "Verified HAMMARBLE scope", type: "localizedText" }), defineField({ name: "stones", title: "Stones used", type: "array", of: [{ type: "reference", to: [{ type: "stone" }] }] }), defineField({ name: "media", title: "Media", type: "array", of: [{ type: "mediaImage" }] }),
], preview: { select: { title: "name.en", subtitle: "name.tr" } } });
