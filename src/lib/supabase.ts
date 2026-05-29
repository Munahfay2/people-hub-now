import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// (no runtime debug logs)

export const isSupabaseConfigured =
  url.length > 0 &&
  anonKey.length > 0 &&
  !url.includes("your-project") &&
  anonKey !== "your_anon_key_here";

export const supabase: SupabaseClient = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder",
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// ── DB row types ──────────────────────────────────────────────────────────────

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  published_at: string;
  summary: string;
  tags: string[];
  is_featured: boolean;
  sections: unknown;
  cover_image_url: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  date: string;
  end_date: string | null;
  location: string;
  description: string;
  category: string;
  status: string;
  is_featured: boolean;
  video_url: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type SubmissionRow = {
  id: string;
  type: string;
  data: Record<string, string>;
  read: boolean;
  created_at: string;
};

export type VisitRow = {
  path: string;
  count: number;
  last_visited: string;
};
