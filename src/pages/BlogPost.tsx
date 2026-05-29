import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ArrowLeft, User, CalendarDays, List } from "lucide-react";
import { loadBlogPostBySlug, sectionsFromBlog, getPostCoverUrl } from "@/lib/content";
import { imageUrl } from "@/lib/sanity";
import type { BlogPostView } from "@/lib/cms-types";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const CAT_STYLE: Record<string, string> = {
  blog: "bg-blue-50 text-blue-800",
  vision: "bg-purple-50 text-purple-800",
  resource: "bg-amber-50 text-amber-800",
  agenda: "bg-gray-100 text-gray-700",
  county: "bg-green-50 text-green-800",
};

function SectionNav({ sections, activeId }: { sections: { id: string; title: string }[]; activeId: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-24 space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
        <List className="h-3.5 w-3.5" /> In this article
      </p>
      {sections.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => scrollTo(`section-${s.id}`)}
          className={cn(
            "block w-full text-left text-sm rounded-lg px-3 py-2 transition-smooth border-l-2",
            activeId === s.id
              ? "border-accent bg-accent/5 text-foreground font-medium"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <span className="text-xs text-muted-foreground mr-1.5">{i + 1}.</span>
          {s.title}
        </button>
      ))}
    </nav>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostView | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    loadBlogPostBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  const sections = post ? sectionsFromBlog(post) : [];

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id.replace("section-", ""));
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [post, sections]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-accent animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold">Article not found</h1>
          <Link to="/blog" className="inline-flex items-center gap-2 mt-6 text-accent font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const coverUrl = getPostCoverUrl(post) ?? (post.coverImage?.asset?._ref ? imageUrl(post.coverImage).width(1200).height(600).url() : null);

  return (
    <>
      <Helmet>
        <title>{post.title} — CFBUF Blog</title>
        <meta name="description" content={post.summary} />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Navbar />

        {coverUrl && (
          <div className="pt-16 md:pt-20">
            <div className="aspect-[21/9] max-h-[420px] overflow-hidden bg-muted">
              <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className={cn("container py-12 md:py-16", !coverUrl && "pt-28")}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-smooth mb-8">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <div className="grid lg:grid-cols-[1fr_240px] xl:grid-cols-[minmax(0,1fr)_260px] gap-10 lg:gap-16">
            <article>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 capitalize ${CAT_STYLE[post.category] ?? "bg-muted"}`}>
                {post.category}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">{post.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.summary}</p>
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                {(post.authorName || post.author?.name) && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-accent" />
                    {post.authorName ?? post.author?.name}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  {format(parseISO(post.publishedAt), "d MMMM yyyy")}
                </span>
              </div>

              <div className="mt-12 space-y-12">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={`section-${section.id}`}
                    className="scroll-mt-28"
                  >
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                      {section.title}
                    </h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">#{t}</span>
                  ))}
                </div>
              )}
            </article>

            <aside className="hidden lg:block">
              {sections.length > 1 && (
                <SectionNav sections={sections} activeId={activeSection} />
              )}
            </aside>
          </div>

          {/* Mobile section nav */}
          {sections.length > 1 && (
            <div className="lg:hidden mt-12 p-4 rounded-2xl bg-card border border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Jump to section</p>
              <div className="flex flex-wrap gap-2">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth" })}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-accent/10 transition-smooth"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
}
