import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";

type Member = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
};

const empty = { name: "", role: "", bio: "", photo_url: "", display_order: 0, is_active: true };

const TeamEditor = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(empty);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setMembers((data as Member[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadPhoto = async (file: File, memberId: string) => {
    const ext = file.name.split(".").pop();
    const path = `${memberId}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("team-photos").upload(path, file, { upsert: true });
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); return null; }
    const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveMember = async (m: Member) => {
    const { error } = await supabase.from("team_members").update({
      name: m.name, role: m.role, bio: m.bio, photo_url: m.photo_url,
      display_order: m.display_order, is_active: m.is_active,
    }).eq("id", m.id);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    setMembers(members.filter((m) => m.id !== id));
  };

  const createMember = async () => {
    if (!draft.name || !draft.role) return toast({ title: "Name and role required", variant: "destructive" });
    const { error } = await supabase.from("team_members").insert(draft);
    if (error) return toast({ title: "Create failed", description: error.message, variant: "destructive" });
    setDraft(empty); setCreating(false); load();
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <Button onClick={() => setCreating(!creating)} variant="hero" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add member
          </Button>
        </div>
      </header>

      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Team members</h1>

        {creating && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border shadow-soft space-y-4">
            <h2 className="font-display text-lg font-bold">New member</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
              <div><Label>Role *</Label><Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></div>
            </div>
            <div><Label>Bio</Label><Textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} /></div>
            <div><Label>Display order</Label><Input type="number" value={draft.display_order} onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })} /></div>
            <div className="flex gap-2"><Button onClick={createMember} variant="hero">Create</Button><Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button></div>
          </div>
        )}

        {loading ? <p className="text-muted-foreground">Loading…</p> : (
          <div className="space-y-4">
            {members.map((m) => (
              <div key={m.id} className="p-6 rounded-xl bg-card border border-border shadow-soft">
                <div className="grid md:grid-cols-[160px_1fr] gap-6">
                  <div>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">No photo</div>}
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-xs text-accent cursor-pointer hover:underline">
                      <Upload className="h-3 w-3" /> Upload photo
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const url = await uploadPhoto(f, m.id);
                        if (url) { setMembers(members.map(x => x.id === m.id ? { ...x, photo_url: url } : x)); await saveMember({ ...m, photo_url: url }); }
                      }} />
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div><Label>Name</Label><Input value={m.name} onChange={(e) => setMembers(members.map(x => x.id === m.id ? { ...x, name: e.target.value } : x))} /></div>
                      <div><Label>Role</Label><Input value={m.role} onChange={(e) => setMembers(members.map(x => x.id === m.id ? { ...x, role: e.target.value } : x))} /></div>
                    </div>
                    <div><Label>Bio</Label><Textarea rows={3} value={m.bio ?? ""} onChange={(e) => setMembers(members.map(x => x.id === m.id ? { ...x, bio: e.target.value } : x))} /></div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div><Label>Display order</Label><Input type="number" value={m.display_order} onChange={(e) => setMembers(members.map(x => x.id === m.id ? { ...x, display_order: Number(e.target.value) } : x))} /></div>
                      <div className="flex items-end gap-3"><Switch checked={m.is_active} onCheckedChange={(v) => setMembers(members.map(x => x.id === m.id ? { ...x, is_active: v } : x))} /><Label>Visible on site</Label></div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => saveMember(m)} variant="hero" size="sm">Save</Button>
                      <Button onClick={() => deleteMember(m.id)} variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default TeamEditor;