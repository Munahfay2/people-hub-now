import type {
  BlogSection,
  CmsBlogPost,
  CmsEvent,
  FormSubmission,
  FormSubmissionType,
  PageVisit,
} from "./cms-types";
import { isSupabaseConfigured, supabase, type BlogRow, type EventRow, type SubmissionRow, type VisitRow } from "./supabase";
import { resolveMediaUrl } from "./supabase-storage";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function notify() {
  window.dispatchEvent(new CustomEvent("cfbuf-cms-update"));
}

export function subscribeCmsStore(listener: () => void) {
  const handler = () => listener();
  window.addEventListener("cfbuf-cms-update", handler);

  if (!isSupabaseConfigured) {
    return () => window.removeEventListener("cfbuf-cms-update", handler);
  }

  const channel = supabase
    .channel("cfbuf-cms")
    .on("postgres_changes", { event: "*", schema: "public", table: "blogs" }, handler)
    .on("postgres_changes", { event: "*", schema: "public", table: "events" }, handler)
    .on("postgres_changes", { event: "*", schema: "public", table: "form_submissions" }, handler)
    .on("postgres_changes", { event: "*", schema: "public", table: "page_visits" }, handler)
    .subscribe();

  return () => {
    window.removeEventListener("cfbuf-cms-update", handler);
    supabase.removeChannel(channel);
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function newId(): string {
  return crypto.randomUUID();
}

function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function rowToBlog(row: BlogRow): CmsBlogPost {
  return {
    _id: row.id,
    title: row.title,
    slug: { current: row.slug },
    category: row.category as CmsBlogPost["category"],
    publishedAt: row.published_at,
    summary: row.summary,
    tags: row.tags ?? [],
    isFeatured: row.is_featured,
    sections: (row.sections as BlogSection[]) ?? [],
    coverImageUrl: row.cover_image_url ?? undefined,
    authorName: row.author_name ?? undefined,
  };
}

function rowToEvent(row: EventRow): CmsEvent {
  return {
    _id: row.id,
    title: row.title,
    slug: { current: row.slug },
    date: row.date,
    endDate: row.end_date ?? undefined,
    location: row.location,
    description: row.description,
    category: row.category,
    status: row.status as CmsEvent["status"],
    isFeatured: row.is_featured,
    videoUrl: row.video_url ?? undefined,
    coverImageUrl: row.cover_image_url ?? undefined,
  };
}

function rowToSubmission(row: SubmissionRow): FormSubmission {
  return {
    id: row.id,
    type: row.type as FormSubmissionType,
    data: row.data ?? {},
    createdAt: row.created_at,
    read: row.read,
  };
}

function blogToRow(blog: CmsBlogPost, coverUrl?: string): Omit<BlogRow, "created_at" | "updated_at"> {
  return {
    id: isUuid(blog._id) ? blog._id : newId(),
    title: blog.title,
    slug: blog.slug.current || slugify(blog.title),
    category: blog.category,
    published_at: new Date(blog.publishedAt).toISOString(),
    summary: blog.summary,
    tags: blog.tags ?? [],
    is_featured: blog.isFeatured,
    sections: blog.sections,
    cover_image_url: coverUrl ?? blog.coverImageUrl ?? null,
    author_name: blog.authorName ?? null,
  };
}

function eventToRow(event: CmsEvent, coverUrl?: string): Omit<EventRow, "created_at" | "updated_at"> {
  return {
    id: isUuid(event._id) ? event._id : newId(),
    title: event.title,
    slug: event.slug.current || slugify(event.title),
    date: new Date(event.date).toISOString(),
    end_date: event.endDate ? new Date(event.endDate).toISOString() : null,
    location: event.location,
    description: event.description,
    category: event.category,
    status: event.status,
    is_featured: event.isFeatured,
    video_url: event.videoUrl ?? null,
    cover_image_url: coverUrl ?? event.coverImageUrl ?? null,
  };
}

// ── Blogs ─────────────────────────────────────────────────────────────────────

export async function fetchCmsBlogs(): Promise<CmsBlogPost[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("fetchCmsBlogs:", error.message);
    return [];
  }
  return (data as BlogRow[]).map(rowToBlog);
}

export async function fetchCmsBlogById(id: string): Promise<CmsBlogPost | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const { data, error } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();
  if (error || !data) return undefined;
  return rowToBlog(data as BlogRow);
}

export async function fetchCmsBlogBySlug(slug: string): Promise<CmsBlogPost | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const { data, error } = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return undefined;
  return rowToBlog(data as BlogRow);
}

export async function saveCmsBlog(blog: CmsBlogPost): Promise<CmsBlogPost> {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured");

  const coverUrl = await resolveMediaUrl(blog.coverImageUrl, "blogs");
  const row = blogToRow(
    { ...blog, slug: { current: blog.slug.current || slugify(blog.title) } },
    coverUrl
  );

  const { data, error } = await supabase
    .from("blogs")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(error.message);

  notify();
  return rowToBlog(data as BlogRow);
}

export async function deleteCmsBlog(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  notify();
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function fetchCmsEvents(): Promise<CmsEvent[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
  if (error) {
    console.error("fetchCmsEvents:", error.message);
    return [];
  }
  return (data as EventRow[]).map(rowToEvent);
}

export async function fetchCmsEventById(id: string): Promise<CmsEvent | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error || !data) return undefined;
  return rowToEvent(data as EventRow);
}

export async function saveCmsEvent(event: CmsEvent): Promise<CmsEvent> {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured");

  const coverUrl = await resolveMediaUrl(event.coverImageUrl, "events");
  const row = eventToRow(
    { ...event, slug: { current: event.slug.current || slugify(event.title) } },
    coverUrl
  );

  const { data, error } = await supabase
    .from("events")
    .upsert(row, { onConflict: "id" })
    .select()
    .single();

  if (error) throw new Error(error.message);

  notify();
  return rowToEvent(data as EventRow);
}

export async function deleteCmsEvent(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
  notify();
}

// ── Form submissions ──────────────────────────────────────────────────────────

export async function addFormSubmission(
  type: FormSubmissionType,
  data: Record<string, string>
): Promise<FormSubmission | null> {
  if (!isSupabaseConfigured) return null;

  const { data: row, error } = await supabase
    .from("form_submissions")
    .insert({ type, data })
    .select()
    .single();

  if (error) {
    console.error("addFormSubmission:", error.message);
    return null;
  }

  notify();
  return rowToSubmission(row as SubmissionRow);
}

export async function fetchFormSubmissions(type?: FormSubmissionType): Promise<FormSubmission[]> {
  if (!isSupabaseConfigured) return [];

  let query = supabase.from("form_submissions").select("*").order("created_at", { ascending: false });
  if (type) query = query.eq("type", type);

  const { data, error } = await query;
  if (error) {
    console.error("fetchFormSubmissions:", error.message);
    return [];
  }
  return (data as SubmissionRow[]).map(rowToSubmission);
}

export async function markSubmissionRead(id: string, read = true): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("form_submissions").update({ read }).eq("id", id);
  if (error) throw new Error(error.message);
  notify();
}

export async function deleteSubmission(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from("form_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  notify();
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function trackPageVisit(path: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const normalized = path.split("?")[0] || "/";
  const { error } = await supabase.rpc("increment_page_visit", { page_path: normalized });
  if (error) console.warn("trackPageVisit:", error.message);
}

export async function fetchPageVisits(): Promise<PageVisit[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("page_visits")
    .select("*")
    .order("count", { ascending: false });
  if (error) return [];
  return (data as VisitRow[]).map((v) => ({
    path: v.path,
    count: v.count,
    lastVisited: v.last_visited,
  }));
}

export async function fetchAnalyticsSummary() {
  const [visits, submissions, blogs, events] = await Promise.all([
    fetchPageVisits(),
    fetchFormSubmissions(),
    fetchCmsBlogs(),
    fetchCmsEvents(),
  ]);

  return {
    totalVisits: visits.reduce((s, v) => s + v.count, 0),
    uniquePages: visits.length,
    speakUpCount: submissions.filter((s) => s.type === "speak_up").length,
    appointmentCount: submissions.filter((s) => s.type === "appointment").length,
    unreadCount: submissions.filter((s) => !s.read).length,
    blogCount: blogs.length,
    eventCount: events.length,
    topPages: visits.slice(0, 8),
    recentSubmissions: submissions.slice(0, 6),
  };
}

