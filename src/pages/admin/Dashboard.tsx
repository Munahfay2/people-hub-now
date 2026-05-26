import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Calendar, FileText, Heart, Settings } from "lucide-react";

const cards = [
  { icon: Users, title: "Team Members", desc: "Photos, names, bios", to: "/admin/team", phase: 2 },
  { icon: FileText, title: "Blog & Resources", desc: "Articles and news", to: "/admin/blog", phase: 3 },
  { icon: Calendar, title: "Events", desc: "Calendar & gallery", to: "/admin/events", phase: 4 },
  { icon: Heart, title: "Donations", desc: "Paybill & payment info", to: "/admin/donations", phase: 5 },
  { icon: Settings, title: "Site Content", desc: "Motto, hero copy, about", to: "/admin/content", phase: 2 },
];

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/admin" className="font-display font-bold text-foreground">CFBUF Admin</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage everything on your site from here.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div key={c.title} className="p-6 rounded-xl bg-card border border-border shadow-soft opacity-60">
              <c.icon className="h-7 w-7 text-accent mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
              <p className="text-xs uppercase tracking-wider text-accent mt-3">Coming in Phase {c.phase}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl bg-section-gradient border border-border">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Phase 1 complete ✓</h2>
          <p className="text-sm text-muted-foreground">
            Foundation is in place: admin login, role-based access, database, and editable site-content table.
            Next phase will unlock the Team Members editor and the public Join the Team form.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;