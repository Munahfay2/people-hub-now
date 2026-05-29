import type { BlogPost, Event } from "@/lib/queries";
import { getBlogPosts, getBlogPostBySlug, getEvents } from "@/lib/queries";
import { fetchCmsBlogs, fetchCmsBlogBySlug, fetchCmsEvents } from "@/lib/cms-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { BlogPostView, BlogSection, CmsBlogPost, CmsEvent, EventView } from "@/lib/cms-types";

export function cmsBlogToView(blog: CmsBlogPost): BlogPostView {
  return {
    _id: blog._id,
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    publishedAt: blog.publishedAt,
    summary: blog.summary,
    tags: blog.tags,
    isFeatured: blog.isFeatured,
    body: [],
    sections: blog.sections,
    coverImageUrl: blog.coverImageUrl,
    authorName: blog.authorName,
    author: blog.authorName
      ? { _id: "cms", name: blog.authorName, role: "CFBUF", bio: "", photo: { _type: "image", asset: { _ref: "", _type: "reference" } }, order: 0 }
      : undefined,
  };
}

export function cmsEventToView(event: CmsEvent): EventView {
  return {
    _id: event._id,
    title: event.title,
    slug: event.slug,
    date: event.date,
    endDate: event.endDate,
    location: event.location,
    description: [],
    descriptionText: event.description,
    category: event.category,
    status: event.status,
    isFeatured: event.isFeatured,
    videoUrl: event.videoUrl,
    coverImageUrl: event.coverImageUrl,
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  };
}

export async function loadBlogPosts(category?: string): Promise<BlogPostView[]> {
  if (isSupabaseConfigured) {
    const cms = await fetchCmsBlogs();
    if (cms.length > 0) {
      const views = cms.map(cmsBlogToView);
      return category && category !== "all"
        ? views.filter((p) => p.category === category)
        : views;
    }
  }
  const sanity = await getBlogPosts(category === "all" ? undefined : category);
  if (sanity.length > 0) return sanity;
  return [];
}

export async function loadBlogPostBySlug(slug: string): Promise<BlogPostView | null> {
  if (isSupabaseConfigured) {
    const cms = await fetchCmsBlogBySlug(slug);
    if (cms) return cmsBlogToView(cms);
  }
  return getBlogPostBySlug(slug);
}

export async function loadEvents(filter?: "upcoming" | "past"): Promise<EventView[]> {
  if (isSupabaseConfigured) {
    const cms = await fetchCmsEvents();
    if (cms.length > 0) {
      const views = cms.map(cmsEventToView);
      if (filter === "upcoming") return views.filter((e) => e.status === "upcoming" || e.status === "ongoing");
      if (filter === "past") return views.filter((e) => e.status === "past");
      return views;
    }
  }
  return getEvents(filter);
}

export function getPostCoverUrl(post: BlogPostView): string | null {
  if (post.coverImageUrl) return post.coverImageUrl;
  if (post.coverImage?.asset?._ref) return null;
  return null;
}

export function getEventCoverUrl(event: EventView): string | null {
  return event.coverImageUrl ?? null;
}

export function sectionsFromBlog(post: BlogPostView): BlogSection[] {
  if (post.sections && post.sections.length > 0) return post.sections;
  if (post.summary) {
    return [{ id: "intro", title: "Introduction", content: post.summary }];
  }
  return [];
}
