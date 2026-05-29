import { defineField, defineType } from "sanity";

export default defineType({
  name: "donationPage",
  title: "Donation Page",
  type: "document",
  icon: () => "💚",
  fields: [
    defineField({ name: "headline", title: "Page Headline", type: "string", initialValue: "Support Zero Poverty in Bungoma" }),
    defineField({ name: "description", title: "Intro Description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "impactStats", title: "Impact Statistics",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "number", title: "Number (e.g. 1,200)", type: "string" },
          { name: "label",  title: "Label (e.g. Families helped)", type: "string" },
        ],
        preview: { select: { title: "number", subtitle: "label" } },
      }],
    }),
    defineField({
      name: "charityWork", title: "Charity Work Highlights",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title",       type: "string", title: "Title" },
          { name: "description", type: "text",   title: "Description" },
          { name: "image",       type: "image",  title: "Photo", options: { hotspot: true } },
        ],
        preview: { select: { title: "title", media: "image" } },
      }],
    }),
    defineField({
      name: "localPayments", title: "M-Pesa / Local Payment Details",
      type: "object",
      fields: [
        { name: "paybill",       title: "Paybill Number",  type: "string" },
        { name: "accountNumber", title: "Account Number",  type: "string" },
        { name: "accountName",   title: "Account Name",    type: "string" },
        { name: "instructions",  title: "Instructions",    type: "text", rows: 4 },
      ],
    }),
    defineField({
      name: "internationalPayments", title: "International Payment Methods",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "method",  title: "Method (PayPal, Bank, etc.)", type: "string" },
          { name: "details", title: "Payment Details",             type: "array", of: [{ type: "block" }] },
          { name: "link",    title: "Payment Link (URL)",          type: "url" },
        ],
        preview: { select: { title: "method" } },
      }],
    }),
    defineField({
      name: "donationAmounts", title: "Suggested Donation Amounts",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "amount",      title: "Amount (KES)",  type: "number" },
          { name: "label",       title: "Label",         type: "string" },
          { name: "description", title: "What it does",  type: "string" },
        ],
        preview: { select: { title: "label", subtitle: "amount" } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "Donation Page" }) },
});
