import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog / Resource",
  type: "document",
  icon: () => "📝",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({
      name: "category", title: "Category", type: "string",
      options: { list: [
        { title: "Blog Article",       value: "blog" },
        { title: "Vision Statement",   value: "vision" },
        { title: "County Resource",    value: "resource" },
        { title: "Agenda",             value: "agenda" },
        { title: "County Information", value: "county" },
      ], layout: "radio" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "teamMember" }] }),
    defineField({ name: "publishedAt", title: "Published Date", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({
      name: "coverImage", title: "Cover Image", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({ name: "summary", title: "Summary / Excerpt", type: "text", rows: 3, validation: (R) => R.required().max(300) }),
    defineField({ name: "body", title: "Body Content", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "isFeatured", title: "Feature this post?", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "Published (newest)", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});
