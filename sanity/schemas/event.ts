import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: () => "📅",
  fields: [
    defineField({ name: "title", title: "Event Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "date", title: "Start Date & Time", type: "datetime", validation: (R) => R.required() }),
    defineField({ name: "endDate", title: "End Date & Time (optional)", type: "datetime" }),
    defineField({ name: "location", title: "Location", type: "string", validation: (R) => R.required() }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "coverImage", title: "Cover Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "gallery", title: "Photo Gallery",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "image", title: "Photo", type: "image", options: { hotspot: true } },
          { name: "caption", title: "Caption", type: "string" },
        ],
        preview: { select: { media: "image", title: "caption" } },
      }],
    }),
    defineField({ name: "videoUrl", title: "Video URL (YouTube / Vimeo)", type: "url" }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: ["Community Forum", "Workshop", "Fundraiser", "Cultural", "Press Conference", "Other"] },
    }),
    defineField({
      name: "status", title: "Status", type: "string",
      options: { list: ["upcoming", "ongoing", "past"], layout: "radio" },
      initialValue: "upcoming",
    }),
    defineField({ name: "isFeatured", title: "Feature on homepage?", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "Date (newest first)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "coverImage" } },
});
