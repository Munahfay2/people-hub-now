import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import siteSettings    from "./schemas/siteSettings";
import teamMember      from "./schemas/teamMember";
import event           from "./schemas/event";
import blogPost        from "./schemas/blogPost";
import donationPage    from "./schemas/donationPage";
import homepage        from "./schemas/homepage";

export default defineConfig({
  name: "cfbuf-studio",
  title: "CFBUF Content Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "YOUR_PROJECT_ID",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("🏠 Homepage").child(S.document().schemaType("homepage").documentId("homepage")),
            S.listItem().title("⚙️ Site Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.listItem().title("👥 Team Members").child(S.documentTypeList("teamMember")),
            S.listItem().title("📅 Events").child(S.documentTypeList("event")),
            S.listItem().title("📝 Blog & Resources").child(S.documentTypeList("blogPost")),
            S.listItem().title("💚 Donation Page").child(S.document().schemaType("donationPage").documentId("donationPage")),
          ]),
    }),
    visionTool(), // lets editors preview GROQ queries
  ],

  schema: {
    types: [siteSettings, teamMember, event, blogPost, donationPage, homepage],
  },
});
