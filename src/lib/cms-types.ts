import type { BlogPost, Event } from "@/lib/queries";

export type BlogSection = {
  id: string;
  title: string;
  content: string;
};

export type CmsBlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  category: BlogPost["category"];
  publishedAt: string;
  summary: string;
  tags: string[];
  isFeatured: boolean;
  sections: BlogSection[];
  coverImageUrl?: string;
  authorName?: string;
};

export type CmsEvent = {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  endDate?: string;
  location: string;
  description: string;
  category: string;
  status: Event["status"];
  isFeatured: boolean;
  videoUrl?: string;
  coverImageUrl?: string;
};

export type FormSubmissionType = "speak_up" | "appointment";

export type FormSubmission = {
  id: string;
  type: FormSubmissionType;
  data: Record<string, string>;
  createdAt: string;
  read: boolean;
};

export type PageVisit = {
  path: string;
  count: number;
  lastVisited: string;
};

export type CmsStore = {
  blogs: CmsBlogPost[];
  events: CmsEvent[];
  submissions: FormSubmission[];
  visits: PageVisit[];
};

export type BlogPostView = BlogPost & {
  sections?: BlogSection[];
  coverImageUrl?: string;
  authorName?: string;
};

export type EventView = Event & {
  descriptionText?: string;
  coverImageUrl?: string;
};
