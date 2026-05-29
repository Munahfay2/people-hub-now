# CFBUF Supabase Setup

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Wait for the database to finish provisioning.

## 2. Run the database schema

1. Open **SQL Editor** in your Supabase dashboard.
2. Paste the full contents of [`schema.sql`](./schema.sql).
3. Click **Run**.

This creates tables (`blogs`, `events`, `form_submissions`, `page_visits`), RLS policies, storage bucket `media`, and the `increment_page_visit` function.

## 3. Create an admin user

1. Go to **Authentication → Users → Add user**.
2. Choose **Create new user**, enter email and password.
3. Enable **Auto Confirm User** (for development).
4. Use these credentials at `/admin/login`.

## 4. Configure the app

Copy `.env.example` to `.env.local` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Find both values under **Project Settings → API**.

Optional:

```env
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
```

## 5. Restart the dev server

```bash
npm run dev
```

Visit **http://localhost:8080/admin/login**.

## Security notes

- The **anon key** is safe in the frontend; Row Level Security restricts what anonymous users can do.
- Only **authenticated** users (your admin account) can create/edit blogs and events.
- Anyone can submit Speak Up / Book Meeting forms (insert only).
- Page visits are incremented via a secure database function.

## Storage

Cover images uploaded in the CMS are stored in the `media` bucket and served via public URLs.
