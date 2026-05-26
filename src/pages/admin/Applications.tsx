import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";

type App = {
  id: string; full_name: string; email: string; phone: string | null;
  interest_area: string | null; message: string; status: string; created_at: string;
};

const Applications = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("team_applications").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setApps((data as App[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("team_applications").update({ status }).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setApps(apps.map(a => a.id === id ? { ...a, status } : a));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase.from("team_applications").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    setApps(apps.filter(a => a.id !== id));
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center h-16">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
        </div>
      </header>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Join applications</h1>
        <p className="text-muted-foreground mb-8">{apps.length} total</p>

        {loading ? <p className="text-muted-foreground">Loading…</p> : apps.length === 0 ? (
          <div className="p-10 text-center rounded-xl bg-card border border-border text-muted-foreground">No applications yet.</div>
        ) : (
          <div className="space-y-4">
            {apps.map((a) => (
              <div key={a.id} className="p-6 rounded-xl bg-card border border-border shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{a.full_name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                      <a href={`mailto:${a.email}`} className="flex items-center gap-1 hover:text-accent"><Mail className="h-3 w-3" />{a.email}</a>
                      {a.phone && <a href={`tel:${a.phone}`} className="flex items-center gap-1 hover:text-accent"><Phone className="h-3 w-3" />{a.phone}</a>}
                      {a.interest_area && <span>Interest: {a.interest_area}</span>}
                    </div>
                  </div>
                  <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${a.status === 'new' ? 'bg-accent/15 text-accent' : a.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>{a.status}</span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-4">{a.message}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setStatus(a.id, 'reviewed')}>Mark reviewed</Button>
                  <Button size="sm" variant="hero" onClick={() => setStatus(a.id, 'accepted')}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(a.id, 'archived')}>Archive</Button>
                  <Button size="sm" variant="outline" className="text-destructive ml-auto" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{new Date(a.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Applications;