import { useEffect, useState } from "react";
import { Plus, Trash2, Save, CalendarDays, ImagePlus } from "lucide-react";
import type { CmsEvent } from "@/lib/cms-types";
import type { Event } from "@/lib/queries";
import {
  deleteCmsEvent,
  fetchCmsEvents,
  newId,
  saveCmsEvent,
  slugify,
  subscribeCmsStore,
} from "@/lib/cms-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const EVENT_CATEGORIES = ["Community Forum", "Workshop", "Fundraiser", "Cultural", "Press Conference", "Other"];
const STATUSES: Event["status"][] = ["upcoming", "ongoing", "past"];

function emptyEvent(): CmsEvent {
  return {
    _id: newId(),
    title: "",
    slug: { current: "" },
    date: new Date().toISOString().slice(0, 16),
    location: "",
    description: "",
    category: "Community Forum",
    status: "upcoming",
    isFeatured: false,
    coverImageUrl: "",
    videoUrl: "",
  };
}

export default function EventsAdmin() {
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CmsEvent>(emptyEvent());
  const [saving, setSaving] = useState(false);
  const [isUnsavedDraft, setIsUnsavedDraft] = useState(false);

  const loadEvents = async () => {
    const list = await fetchCmsEvents();
    setEvents(list);
    return list;
  };

  useEffect(() => {
    loadEvents().then((list) => {
      if (list.length > 0 && !activeId) {
        setActiveId(list[0]._id);
        setDraft(list[0]);
      }
    });
    return subscribeCmsStore(() => { void loadEvents(); });
  }, []);

  useEffect(() => {
    const found = events.find((e) => e._id === activeId);
    if (found) {
      setDraft(found);
      setIsUnsavedDraft(false);
    }
  }, [activeId, events]);

  const selectEvent = (e: CmsEvent) => {
    setActiveId(e._id);
    setDraft(e);
  };

  const createNew = () => {
    const ev = emptyEvent();
    setDraft(ev);
    setActiveId(ev._id);
    setIsUnsavedDraft(true);
    setEvents((list) => [ev, ...list]);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Max 2MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, coverImageUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.location.trim()) {
      toast({ title: "Missing fields", description: "Title and location are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const saved = await saveCmsEvent({
        ...draft,
        slug: { current: draft.slug.current || slugify(draft.title) },
        date: new Date(draft.date).toISOString(),
        endDate: draft.endDate ? new Date(draft.endDate).toISOString() : undefined,
      });
      setDraft(saved);
      setActiveId(saved._id);
      setIsUnsavedDraft(false);
      await loadEvents();
      toast({ title: "Event saved", description: `"${saved.title}" is now on the events page.` });
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeId || isUnsavedDraft || !confirm("Delete this event?")) return;
    try {
      await deleteCmsEvent(activeId);
      const remaining = await loadEvents();
      setActiveId(remaining[0]?._id ?? null);
      setDraft(remaining[0] ?? emptyEvent());
      toast({ title: "Event deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">Schedule and update community events.</p>
        </div>
        <Button onClick={createNew}><Plus className="h-4 w-4 mr-2" /> New event</Button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-4 min-h-[60vh]">
        <aside className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
          <div className="p-3 border-b flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" /> Events ({events.length})
          </div>
          <ScrollArea className="max-h-[60vh]">
            <ul className="p-2 space-y-1">
              {events.map((e) => (
                <li key={e._id}>
                  <button type="button" onClick={() => selectEvent(e)}
                    className={cn("w-full text-left rounded-xl px-3 py-2.5 text-sm transition-smooth",
                      activeId === e._id ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                    <p className="font-medium line-clamp-2">{e.title || "Untitled"}</p>
                    <p className={cn("text-xs mt-0.5 capitalize", activeId === e._id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {e.status}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>

        <div className="bg-card border border-border rounded-2xl shadow-soft p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Event title *</Label>
              <Input className="mt-1.5" value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: { current: slugify(e.target.value) } })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input className="mt-1.5 font-mono text-sm" value={draft.slug.current}
                onChange={(e) => setDraft({ ...draft, slug: { current: slugify(e.target.value) } })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start date & time *</Label>
              <Input type="datetime-local" className="mt-1.5" value={draft.date.slice(0, 16)}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </div>
            <div>
              <Label>End date (optional)</Label>
              <Input type="datetime-local" className="mt-1.5" value={draft.endDate?.slice(0, 16) ?? ""}
                onChange={(e) => setDraft({ ...draft, endDate: e.target.value || undefined })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Location *</Label>
              <Input className="mt-1.5" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as Event["status"] })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Video URL</Label>
              <Input className="mt-1.5" value={draft.videoUrl ?? ""} placeholder="YouTube / Vimeo"
                onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea className="mt-1.5 min-h-[140px]" value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={draft.isFeatured} onCheckedChange={(v) => setDraft({ ...draft, isFeatured: v })} />
              <Label>Feature on homepage</Label>
            </div>
          </div>

          <div>
            <Label>Cover image</Label>
            <label className="mt-2 cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed text-sm">
              <ImagePlus className="h-4 w-4" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
            {draft.coverImageUrl && <img src={draft.coverImageUrl} alt="" className="mt-2 h-20 rounded-lg border" />}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => void handleSave()} disabled={saving}>
              <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save event"}
            </Button>
            {activeId && !isUnsavedDraft && (
              <Button variant="destructive" onClick={() => void handleDelete()}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
