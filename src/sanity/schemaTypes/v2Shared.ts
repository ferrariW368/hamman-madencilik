import { defineField, defineType } from "sanity";

const localeFields = [
  defineField({ name: "tr", title: "Turkish", type: "string" }), defineField({ name: "en", title: "English", type: "string" }),
  defineField({ name: "zh", title: "Chinese", type: "string" }), defineField({ name: "ar", title: "Arabic", type: "string" }),
];
export const localizedString = defineType({ name: "localizedString", title: "Localized string", type: "object", fields: localeFields });
export const localizedText = defineType({ name: "localizedText", title: "Localized text", type: "object", fields: localeFields.map((field) => ({ ...field, type: "text", rows: 4 })) });
export const mediaProvenance = defineType({ name: "mediaProvenance", title: "Media provenance and rights", type: "object", fields: [
  defineField({ name: "assetClass", title: "Asset class", type: "string", options: { list: ["REAL", "AI_GENERATED", "TEMPORARY", "ARCHIVE"] }, validation: (Rule) => Rule.required() }),
  defineField({ name: "source", title: "Source", type: "string" }), defineField({ name: "sourceDate", title: "Source date", type: "date" }), defineField({ name: "provenanceNotes", title: "Provenance notes", type: "text", rows: 3 }),
  defineField({ name: "usageRights", title: "Usage rights", type: "string", options: { list: ["OWNED", "PERMITTED", "UNKNOWN"] }, validation: (Rule) => Rule.required() }),
  defineField({ name: "rightsSource", title: "Rights evidence", type: "string" }), defineField({ name: "rightsNotes", title: "Rights notes", type: "text", rows: 3 }),
  defineField({ name: "approvalStatus", title: "Approval status", type: "string", options: { list: ["PENDING", "APPROVED", "REJECTED"] }, validation: (Rule) => Rule.required() }),
] });
export const mediaImage = defineType({ name: "mediaImage", title: "Image with provenance", type: "object", fields: [
  defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }), defineField({ name: "alt", title: "Alt text", type: "localizedString" }),
  defineField({ name: "provenance", title: "Provenance and rights", type: "mediaProvenance", validation: (Rule) => Rule.required() }),
] });
export const mediaDocument = defineType({ name: "mediaDocument", title: "Document with provenance", type: "object", fields: [
  defineField({ name: "file", title: "File", type: "file", validation: (Rule) => Rule.required() }), defineField({ name: "title", title: "Title", type: "localizedString" }),
  defineField({ name: "provenance", title: "Provenance and rights", type: "mediaProvenance", validation: (Rule) => Rule.required() }),
] });
export const technicalDatum = defineType({ name: "technicalDatum", title: "Technical datum", type: "object", fields: [
  defineField({ name: "key", title: "Stable key", type: "string", validation: (Rule) => Rule.required() }), defineField({ name: "label", title: "Label", type: "localizedString" }),
  defineField({ name: "canonicalValue", title: "Canonical value", type: "number" }), defineField({ name: "canonicalUnit", title: "Canonical unit", type: "string" }),
  defineField({ name: "testMethod", title: "Verified test method", type: "string" }), defineField({ name: "sourceDocument", title: "Source document", type: "reference", to: [{ type: "technicalDocument" }] }),
] });
export const technicalDocument = defineType({ name: "technicalDocument", title: "Technical document", type: "document", fields: [
  defineField({ name: "title", title: "Title", type: "localizedString", validation: (Rule) => Rule.required() }), defineField({ name: "document", title: "Document", type: "mediaDocument", validation: (Rule) => Rule.required() }),
], preview: { select: { title: "title.en" } } });
