import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Save, GripVertical, ExternalLink, ImagePlus, List } from "lucide-react";
import type { BlogPost } from "@/lib/queries";
import type { BlogSection, CmsBlogPost } from "@/lib/cms-types";
import {
  deleteCmsBlog,
  fetchCmsBlogs,
  newId,
  saveCmsBlog,
  slugify,
  subscribeCmsStore,
} from "@/lib/cms-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: BlogPost["category"]; label: string }[] = [
  { value: "blog", label: "Blog Article" },
  { value: "vision", label: "Vision Statement" },
  { value: "resource", label: "County Resource" },
  { value: "agenda", label: "Agenda" },
  { value: "county", label: "County Information" },
];

function emptyBlog(): CmsBlogPost {
  const sectionId = newId();
  return {
    _id: newId(),
    title: "",
    slug: { current: "" },
    category: "blog",
    publishedAt: new Date().toISOString().slice(0, 16),
    summary: "",
    tags: [],
    isFeatured: false,
    sections: [{ id: sectionId, title: "Introduction", content: "" }],
    coverImageUrl: "",
    authorName: "",
  };
}

export default function BlogsAdmin() {
  const [posts, setPosts] = useState<CmsBlogPost[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CmsBlogPost>(emptyBlog());
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [isUnsavedDraft, setIsUnsavedDraft] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const loadPosts = async () => {
    const list = await fetchCmsBlogs();
    setPosts(list);
    return list;
  };

  useEffect(() => {
    loadPosts().then((list) => {
      if (list.length > 0 && !activeId) {
        setActiveId(list[0]._id);
        setDraft(list[0]);
        setTagsInput(list[0].tags.join(", "));
      }
    });
    return subscribeCmsStore(() => { void loadPosts(); });
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const found = posts.find((p) => p._id === activeId);
    if (found) {
      setDraft(found);
      setTagsInput(found.tags.join(", "));
      setIsUnsavedDraft(false);
    }
  }, [activeId, posts]);

  const selectPost = (post: CmsBlogPost) => {
    setActiveId(post._id);
    setDraft(post);
    setTagsInput(post.tags.join(", "));
  };

  const createNew = () => {
    const blog = emptyBlog();
    setDraft(blog);
    setActiveId(blog._id);
    setTagsInput("");
    setIsUnsavedDraft(true);
    setPosts((p) => [blog, ...p]);
  };

  const updateDraft = (patch: Partial<CmsBlogPost>) => {
    setDraft((d) => ({ ...d, ...patch }));
  };

  const updateSection = (id: string, patch: Partial<BlogSection>) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const addSection = () => {
    const section: BlogSection = { id: newId(), title: "New section", content: "" };
    setDraft((d) => ({ ...d, sections: [...d.sections, section] }));
    setTimeout(() => sectionRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const removeSection = (id: string) => {
    if (draft.sections.length <= 1) {
      toast({ title: "Cannot remove", description: "A blog needs at least one section.", variant: "destructive" });
      return;
    }
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== id) }));
  };

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please use an image under 2MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateDraft({ coverImageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.summary.trim()) {
      toast({ title: "Missing fields", description: "Title and summary are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const slug = draft.slug.current || slugify(draft.title);
      const saved = await saveCmsBlog({
        ...draft,
        slug: { current: slug },
        publishedAt: new Date(draft.publishedAt).toISOString(),
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setDraft(saved);
      setActiveId(saved._id);
      setIsUnsavedDraft(false);
      await loadPosts();
      toast({ title: "Blog saved", description: `"${saved.title}" is now live on the website.` });
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeId || isUnsavedDraft || !confirm("Delete this blog post permanently?")) return;
    try {
      await deleteCmsBlog(activeId);
      const remaining = await loadPosts();
      const next = remaining[0] ?? emptyBlog();
      setActiveId(remaining[0]?._id ?? null);
      setDraft(next);
      setTagsInput(next.tags?.join(", ") ?? "");
      toast({ title: "Blog deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Create and edit articles with section-based content.</p>
        </div>
        <Button onClick={createNew} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" /> New post
        </Button>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr_200px] xl:grid-cols-[240px_1fr_220px] gap-4 min-h-[calc(100vh-12rem)]">
        {/* Posts list sidebar */}
        <aside className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <List className="h-3.5 w-3.5" /> All posts ({posts.length})
            </p>
          </div>
          <ScrollArea className="flex-1 max-h-[70vh] lg:max-h-none">
            <ul className="p-2 space-y-1">
              {posts.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground text-center">No posts yet. Create one!</li>
              )}
              {posts.map((p) => (
                <li key={p._id}>
                  <button
                    type="button"
                    onClick={() => selectPost(p)}
                    className={cn(
                      "w-full text-left rounded-xl px-3 py-2.5 text-sm transition-smooth",
                      activeId === p._id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    <p className="font-medium line-clamp-2 leading-snug">{p.title || "Untitled"}</p>
                    <p className={cn("text-xs mt-0.5 capitalize", activeId === p._id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {p.category}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>

        {/* Editor */}
        <div className="bg-card border border-border rounded-2xl shadow-soft p-5 md:p-6 space-y-6 overflow-auto max-h-[75vh] lg:max-h-[calc(100vh-10rem)]">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Title *</Label>
              <Input className="mt-1.5 font-display text-lg" value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value, slug: { current: slugify(e.target.value) } })} />
            </div>
            <div>
              <Label>URL slug</Label>
              <Input className="mt-1.5 font-mono text-sm" value={draft.slug.current}
                onChange={(e) => updateDraft({ slug: { current: slugify(e.target.value) } })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={draft.category} onValueChange={(v) => updateDraft({ category: v as BlogPost["category"] })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Published date</Label>
              <Input type="datetime-local" className="mt-1.5" value={draft.publishedAt.slice(0, 16)}
                onChange={(e) => updateDraft({ publishedAt: e.target.value })} />
            </div>
            <div>
              <Label>Author name</Label>
              <Input className="mt-1.5" value={draft.authorName ?? ""} placeholder="Optional"
                onChange={(e) => updateDraft({ authorName: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Summary / excerpt *</Label>
              <Textarea className="mt-1.5 resize-none" rows={3} maxLength={300} value={draft.summary}
                onChange={(e) => updateDraft({ summary: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Tags (comma-separated)</Label>
              <Input className="mt-1.5" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                placeholder="energy, agriculture, bungoma" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={draft.isFeatured} onCheckedChange={(v) => updateDraft({ isFeatured: v })} />
              <Label>Feature this post on blog page</Label>
            </div>
          </div>

          <div>
            <Label>Cover image</Label>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:border-accent transition-smooth text-sm">
                <ImagePlus className="h-4 w-4" />
                Upload image
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </label>
              {draft.coverImageUrl && (
                <img src={draft.coverImageUrl} alt="" className="h-16 w-24 object-cover rounded-lg border" />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Content sections</h3>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add section
              </Button>
            </div>
            {draft.sections.map((section, idx) => (
              <div
                key={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                className="rounded-xl border border-border p-4 space-y-3 bg-muted/30 scroll-mt-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase">Section {idx + 1}</span>
                </div>
                <div>
                  <Label>Section title</Label>
                  <Input className="mt-1.5" value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })} />
                </div>
                <div>
                  <Label>Section content</Label>
                  <Textarea className="mt-1.5 min-h-[120px]" value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })} />
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                  onClick={() => removeSection(section.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove section
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button onClick={() => void handleSave()} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save post"}
            </Button>
            {draft.slug.current && (
              <Button variant="outline" asChild>
                <Link to={`/blog/${draft.slug.current}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" /> Preview
                </Link>
              </Button>
            )}
            {activeId && !isUnsavedDraft && (
              <Button variant="destructive" onClick={() => void handleDelete()}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
          </div>
        </div>

        {/* Section TOC sidebar */}
        <aside className="hidden lg:flex flex-col bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section navigator</p>
            <p className="text-sm text-muted-foreground mt-1">Jump to any part of this post</p>
          </div>
          <ScrollArea className="flex-1 p-3">
            <ul className="space-y-1">
              {draft.sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(s.id)}
                    className="w-full text-left text-sm rounded-lg px-3 py-2 hover:bg-muted transition-smooth line-clamp-2"
                  >
                    <span className="text-xs text-muted-foreground mr-1">{i + 1}.</span>
                    {s.title || "Untitled section"}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
          {draft.tags.length > 0 && (
            <div className="p-3 border-t border-border flex flex-wrap gap-1">
              {draft.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">#{t}</Badge>)}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
