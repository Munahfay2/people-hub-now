import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Search, BookOpen, Eye, FileText, CalendarDays, MapPin, ArrowRight, User } from "lucide-react";
import type { BlogPost } from "@/lib/queries";
import { loadBlogPosts, getPostCoverUrl } from "@/lib/content";
import type { BlogPostView } from "@/lib/cms-types";
import { imageUrl } from "@/lib/sanity";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

const CATEGORIES = [
  { value: "all",      label: "All",               icon: BookOpen },
  { value: "blog",     label: "Blog Articles",     icon: FileText },
  { value: "vision",   label: "Vision Statements", icon: Eye },
  { value: "resource", label: "County Resources",  icon: MapPin },
  { value: "agenda",   label: "Agenda",            icon: CalendarDays },
  { value: "county",   label: "County Info",       icon: BookOpen },
];

const CAT_STYLE: Record<string, string> = {
  blog:     "bg-blue-50 text-blue-800",
  vision:   "bg-purple-50 text-purple-800",
  resource: "bg-amber-50 text-amber-800",
  agenda:   "bg-gray-100 text-gray-700",
  county:   "bg-green-50 text-green-800",
};

const DEMO_POSTS: BlogPost[] = [
  {
    _id: "1", title: "Why Bungoma's Waterfalls Can Power the County",
    slug: { current: "waterfalls-power-county" }, category: "resource",
    publishedAt: "2025-07-01T00:00:00Z",
    summary: "Nabuyole Falls alone has the potential to generate over 5MW of hydropower. Here's what that means for energy-starved Bungoma households and businesses.",
    body: [], isFeatured: true, tags: ["energy", "resources", "hydropower"],
  },
  {
    _id: "2", title: "CFBUF Vision 2030: Zero Poverty by the Decade",
    slug: { current: "vision-2030-zero-poverty" }, category: "vision",
    publishedAt: "2025-06-15T00:00:00Z",
    summary: "Our comprehensive vision for eradicating poverty in Bungoma County through investment, education, and community-led development over the next five years.",
    body: [], isFeatured: false, tags: ["vision", "poverty", "development"],
  },
  {
    _id: "3", title: "Agricultural Investment Opportunities in Bungoma",
    slug: { current: "agricultural-investment-bungoma" }, category: "blog",
    publishedAt: "2025-05-20T00:00:00Z",
    summary: "From sugarcane to essential oils, Bungoma's fertile soil offers remarkable returns for agri-investors. This guide covers the top opportunities.",
    body: [], isFeatured: false, tags: ["agriculture", "investment"],
  },
  {
    _id: "4", title: "Q3 2025 Community Engagement Agenda",
    slug: { current: "q3-2025-agenda" }, category: "agenda",
    publishedAt: "2025-05-01T00:00:00Z",
    summary: "The CFBUF quarterly agenda for July–September 2025, covering planned forums, community visits, partnerships, and policy submissions.",
    body: [], isFeatured: false, tags: ["agenda", "planning"],
  },
  {
    _id: "5", title: "Mount Elgon: Tourism Potential We Have Not Unlocked",
    slug: { current: "mount-elgon-tourism" }, category: "county",
    publishedAt: "2025-04-10T00:00:00Z",
    summary: "Kitum Caves, Chepkitale Forest, and Sang'alo Hills attract only a fraction of the visitors they could. What needs to change?",
    body: [], isFeatured: false, tags: ["tourism", "Mount Elgon"],
  },
  {
    _id: "6", title: "How Local Artisans Can Access County Markets",
    slug: { current: "artisan-county-markets" }, category: "resource",
    publishedAt: "2025-03-25T00:00:00Z",
    summary: "A practical guide for Bungoma artisans, potters, and craftspeople on accessing government procurement and county contracts.",
    body: [], isFeatured: false, tags: ["artisans", "market", "SME"],
  },
];

function PostCard({ post, featured }: { post: BlogPostView; featured?: boolean }) {
  const coverUrl = getPostCoverUrl(post);
  const hasImg = Boolean(coverUrl || post.coverImage?.asset?._ref);
  const catLabel = CATEGORIES.find((c) => c.value === post.category)?.label ?? post.category;

  if (featured) {
    return (
      <article className="group rounded-3xl overflow-hidden bg-card border border-border shadow-elegant grid lg:grid-cols-2">
        <div className="aspect-video lg:aspect-auto overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10 min-h-[200px] flex items-center justify-center">
          {hasImg ? (
            <img src={coverUrl ?? imageUrl(post.coverImage!).width(800).height(500).url()} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700" />
          ) : (
            <BookOpen className="h-20 w-20 text-primary/20" />
          )}
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <span className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-4 ${CAT_STYLE[post.category] ?? "bg-muted text-muted-foreground"}`}>{catLabel}</span>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4 leading-tight">{post.title}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{post.summary}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            {post.author && <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author.name}</span>}
            <span>{format(parseISO(post.publishedAt), "d MMM yyyy")}</span>
          </div>
          <Link to={`/blog/${post.slug.current}`} className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-smooth">
            Read article <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-smooth flex flex-col">
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        {hasImg ? (
          <img src={coverUrl ?? imageUrl(post.coverImage!).width(500).height(280).url()} alt={post.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700" />
        ) : (
          <BookOpen className="h-10 w-10 text-muted-foreground/20" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CAT_STYLE[post.category] ?? "bg-muted text-muted-foreground"}`}>{catLabel}</span>
          <span className="text-xs text-muted-foreground">{format(parseISO(post.publishedAt), "d MMM yyyy")}</span>
        </div>
        <h3 className="font-display font-bold text-foreground text-lg leading-tight mb-2 flex-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{post.summary}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">#{t}</span>
            ))}
          </div>
        )}
        <Link to={`/blog/${post.slug.current}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-smooth mt-auto">
          Read more <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export const Blog = () => {
  const [posts, setPosts]     = useState<BlogPostView[]>(DEMO_POSTS);
  const [category, setCategory] = useState("all");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    loadBlogPosts(category === "all" ? undefined : category)
      .then((data) => { if (data.length > 0) setPosts(data); else setPosts(DEMO_POSTS); })
      .catch(() => setPosts(DEMO_POSTS));
  }, [category]);

  const filtered = posts.filter((p) =>
    (category === "all" || p.category === category) &&
    (search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()))
  );
  const featured = filtered.find((p) => p.isFeatured);
  const rest     = filtered.filter((p) => p !== featured);

  return (
    <>
      <Helmet>
        <title>Blog & Resources — CFBUF | Bungoma County</title>
        <meta name="description" content="Articles, vision statements, county resources and agenda documents from the Centre for Bungoma United Front." />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="bg-primary text-primary-foreground pt-28 pb-16">
          <div className="container">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Blog & Resources</span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
              Knowledge for a <span className="text-accent">better Bungoma.</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl">
              Articles, vision statements, county resources and agenda documents — all in one place.
            </p>
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
              <input type="text" placeholder="Search articles and resources…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
          </div>
        </section>

        {/* Category tabs */}
        <div className="border-b border-border bg-background sticky top-16 md:top-20 z-40">
          <div className="container">
            <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
              {CATEGORIES.map((c) => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-smooth ${
                    category === c.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  }`}>
                  <c.icon className="h-3.5 w-3.5" /> {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        <section className="py-14">
          <div className="container space-y-10">
            {featured && !search && <PostCard post={featured} featured />}
            {rest.length === 0 && !featured ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No posts found. Try a different filter or search term.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((p) => <PostCard key={p._id} post={p} />)}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Blog;
