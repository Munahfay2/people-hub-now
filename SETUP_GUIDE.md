# CFBUF Website — Setup & Deployment Guide

## Quick Start (Development)

```bash
npm install
npm run dev
```

The site runs with **fallback/demo content** immediately — no CMS needed to see pages.

---

## Step 1 — Connect Sanity CMS (one-time)

1. Create a free account at [sanity.io](https://sanity.io)
2. Run `npm create sanity@latest` inside the `/sanity` folder, or create a project at sanity.io/manage
3. Copy your **Project ID** from the Sanity dashboard
4. Create a `.env.local` file in the root (copy from `.env.example`):
   ```
   VITE_SANITY_PROJECT_ID=paste_your_project_id_here
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-01-01
   ```
5. Deploy the Sanity Studio:
   ```bash
   cd sanity
   npm install
   npm run deploy
   ```
   Your editors can now log in at `https://cfbuf.sanity.studio`

6. In Sanity Studio, click **Site Settings** → fill in the motto, contacts, paybill, socials → Publish.
7. Add your team members, events, blog posts, donation details — all from the Studio UI.

---

## Step 2 — Supabase CMS (blogs, events, forms, analytics)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL Editor (see `supabase/README.md`)
3. Create an admin user: **Authentication → Users → Add user**
4. Copy `.env.example` to `.env.local` and add:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG...
   VITE_WEB3FORMS_ACCESS_KEY=your_key   # optional email alerts
   ```
5. `npm run dev` → open **http://localhost:8080/admin/login**

All blogs, events, form submissions, and page visits are stored in Supabase. Cover images upload to Supabase Storage.

## Step 3 — Connect Formspree (contact / join team only)

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create forms for Join Team and Contact if needed
3. Add the form IDs to `.env.local`:
   ```
   VITE_FORMSPREE_JOIN_TEAM=xxxxxxxx
   VITE_FORMSPREE_CONTACT=xxxxxxxx
   ```

---

## Step 4 — Deploy to Vercel (recommended, free)

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → Import the repo
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Click **Deploy** — done. Vercel auto-deploys on every push.

---

## How editors use Sanity Studio

| Task | Steps |
|------|-------|
| Add event | Studio → Events → New Event → fill fields → Publish |
| Edit team member | Studio → Team Members → click member → edit → Publish |
| Update Paybill | Studio → Donation Page → Local Payments → edit → Publish |
| Write blog post | Studio → Blog & Resources → New Post → write → Publish |
| Change motto | Studio → Site Settings → Motto field → Publish |

No developer needed for any of the above.

---

## File structure

```
src/
├── lib/
│   ├── sanity.ts          Sanity client + image builder
│   ├── queries.ts         All GROQ data-fetching functions
│   └── formspree.ts       Form submission helper
├── pages/
│   ├── Index.tsx          Homepage
│   ├── Events.tsx         Events + calendar
│   ├── Blog.tsx           Blog & resources
│   └── Donate.tsx         Donations + payments
├── components/sections/   All homepage sections
sanity/
├── sanity.config.ts       Studio configuration
└── schemas/               Content type definitions
```

---

## Adding a new page

1. Create `src/pages/NewPage.tsx`
2. Add schema to `sanity/schemas/` if new content type needed
3. Add query to `src/lib/queries.ts`
4. Add route in `src/App.tsx`:
   ```tsx
   const NewPage = lazy(() => import("./pages/NewPage"));
   <Route path="/new-page" element={<NewPage />} />
   ```
5. Add nav link in `src/components/sections/Navbar.tsx`
