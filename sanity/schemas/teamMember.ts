import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  icon: () => "👤",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "role", title: "Role / Title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "photo", title: "Photo", type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({ name: "bio", title: "Short Biography", type: "text", rows: 4, validation: (R) => R.required() }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 99 }),
    defineField({ name: "isActive", title: "Show on website?", type: "boolean", initialValue: true }),
    defineField({ name: "joinedYear", title: "Year Joined", type: "number" }),
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
