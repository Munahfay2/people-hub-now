import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage Content",
  type: "document",
  icon: () => "🏠",
  fields: [
    defineField({
      name: "hero", title: "Hero Section",
      type: "object",
      fields: [
        { name: "headline",          title: "Main Headline",         type: "string" },
        { name: "subheadline",       title: "Sub-headline",          type: "text", rows: 3 },
        { name: "primaryButtonText", title: "Primary Button Text",   type: "string" },
        { name: "primaryButtonLink", title: "Primary Button Link",   type: "string" },
        {
          name: "stats", title: "Statistics",
          type: "array",
          of: [{
            type: "object",
            fields: [
              { name: "number", title: "Number (e.g. 1.8M)", type: "string" },
              { name: "label",  title: "Label (e.g. Population)", type: "string" },
            ],
          }],
        },
      ],
    }),
    defineField({
      name: "about", title: "About Section",
      type: "object",
      fields: [
        { name: "title",       title: "Title",         type: "string" },
        { name: "description", title: "Description",   type: "array", of: [{ type: "block" }] },
        { name: "mission",     title: "Mission",       type: "string" },
        { name: "vision",      title: "Vision",        type: "string" },
        { name: "values",      title: "Values",        type: "string" },
      ],
    }),
    defineField({
      name: "priorities", title: "8 Priority Items",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "number", title: "Number (01, 02…)", type: "string" },
          { name: "title",  title: "Priority Title",   type: "string" },
          { name: "body",   title: "Description",      type: "text", rows: 2 },
        ],
        preview: { select: { title: "title", subtitle: "number" } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage Content" }) },
});
