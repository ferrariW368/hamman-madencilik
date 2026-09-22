import { defineField, defineType, type SanityDocument } from "sanity";
export const event = defineType({ name: "event", title: "Event", type: "document", fields: [
  defineField({ name: "name", title: "Official event name", type: "localizedString", validation: (Rule) => Rule.required() }), defineField({ name: "slug", title: "Slug", type: "slug", options: { source: (document) => { const name = (document as SanityDocument & { name?: { en?: string; tr?: string } }).name; return name?.en || name?.tr || ""; } }, validation: (Rule) => Rule.required() }),
  defineField({ name: "startDate", title: "Verified start date", type: "date" }), defineField({ name: "endDate", title: "Verified end date", type: "date" }), defineField({ name: "media", title: "Media", type: "array", of: [{ type: "mediaImage" }] }),
], preview: { select: { title: "name.en", subtitle: "name.tr" } } });
