// ─── GROQ Queries ────────────────────────────────────────────────────────────
// Returns Sanity data when configured, or null (pages use built-in fallbacks).

import { sanityFetch, type SanityImage, type PortableTextBlock } from "./sanity";

// ── Types ────────────────────────────────────────────────────────────────────

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photo: SanityImage;
  order: number;
};

export type Event = {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  endDate?: string;
  location: string;
  description: PortableTextBlock[];
  coverImage: SanityImage;
  gallery?: { image: SanityImage; caption?: string }[];
  videoUrl?: string;
  category: string;
  isFeatured: boolean;
  status: "upcoming" | "ongoing" | "past";
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  category: "blog" | "vision" | "resource" | "agenda" | "county";
  author?: TeamMember;
  publishedAt: string;
  coverImage?: SanityImage;
  summary: string;
  body: PortableTextBlock[];
  tags?: string[];
  isFeatured: boolean;
};

export type DonationPage = {
  headline: string;
  description: PortableTextBlock[];
  impactStats: { number: string; label: string }[];
  charityWork: { title: string; description: string; image?: SanityImage }[];
  localPayments: {
    paybill: string;
    accountNumber: string;
    accountName: string;
    instructions: string;
  };
  internationalPayments: {
    method: string;
    details: PortableTextBlock[];
    link?: string;
  }[];
  donationAmounts: { amount: number; label: string; description: string }[];
};

// ── Query functions (return null if Sanity not configured) ────────────────────

export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await sanityFetch<TeamMember[]>(
    `*[_type == "teamMember" && isActive == true] | order(order asc){ _id, name, role, bio, photo, order }`
  );
  return data ?? [];
}

export async function getEvents(filter?: "upcoming" | "past"): Promise<Event[]> {
  const statusFilter =
    filter === "upcoming" ? `&& status in ["upcoming","ongoing"]` :
    filter === "past"     ? `&& status == "past"` : "";
  const data = await sanityFetch<Event[]>(
    `*[_type == "event" ${statusFilter}] | order(date desc){ _id, title, slug, date, endDate, location, description, coverImage, gallery[]{ image, caption }, videoUrl, category, isFeatured, status }`
  );
  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return sanityFetch<Event>(
    `*[_type == "event" && slug.current == $slug][0]{ _id, title, slug, date, endDate, location, description, coverImage, gallery[]{ image, caption }, videoUrl, category, isFeatured, status }`,
    { slug }
  );
}

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  const catFilter = category ? `&& category == $category` : "";
  const data = await sanityFetch<BlogPost[]>(
    `*[_type == "blogPost" ${catFilter}] | order(publishedAt desc){ _id, title, slug, category, publishedAt, coverImage, summary, tags, isFeatured, author->{ _id, name, role, photo } }`,
    category ? { category } : {}
  );
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityFetch<BlogPost>(
    `*[_type == "blogPost" && slug.current == $slug][0]{ _id, title, slug, category, publishedAt, coverImage, summary, body, tags, isFeatured, author->{ _id, name, role, photo, bio } }`,
    { slug }
  );
}

export async function getDonationPage(): Promise<DonationPage | null> {
  return sanityFetch<DonationPage>(
    `*[_type == "donationPage"][0]{ headline, description, impactStats, charityWork[]{ title, description, image }, localPayments, internationalPayments, donationAmounts }`
  );
}
