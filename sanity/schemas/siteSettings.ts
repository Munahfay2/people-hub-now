import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string", initialValue: "CFBUF" }),
    defineField({ name: "motto", title: "Motto", type: "string", initialValue: "Umaskini Apana (Zero Poverty)" }),
    defineField({ name: "contactEmail", title: "Contact Email", type: "string" }),
    defineField({ name: "phone", title: "Phone Numbers", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "address", title: "Office Address", type: "text", rows: 3 }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        { name: "facebook",  title: "Facebook URL",  type: "url" },
        { name: "twitter",   title: "Twitter/X URL", type: "url" },
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "youtube",   title: "YouTube URL",   type: "url" },
      ],
    }),
    defineField({ name: "paybillNumber", title: "M-Pesa Paybill Number", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
