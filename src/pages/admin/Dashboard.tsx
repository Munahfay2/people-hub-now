import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Eye, FileText, CalendarDays, Inbox, ArrowRight, TrendingUp } from "lucide-react";
import { fetchAnalyticsSummary, subscribeCmsStore } from "@/lib/cms-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

const EMPTY_STATS = {
  totalVisits: 0,
  uniquePages: 0,
  speakUpCount: 0,
  appointmentCount: 0,
  unreadCount: 0,
  blogCount: 0,
  eventCount: 0,
  topPages: [] as { path: string; count: number }[],
  recentSubmissions: [] as { id: string; type: string; data: Record<string, string>; createdAt: string; read: boolean }[],
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchAnalyticsSummary();
    setStats(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    return subscribeCmsStore(() => { void refresh(); });
  }, [refresh]);

  const cards = [
    { label: "Total page visits", value: stats.totalVisits, icon: Eye, color: "text-blue-600" },
    { label: "Unique pages tracked", value: stats.uniquePages, icon: BarChart3, color: "text-purple-600" },
    { label: "Blog posts", value: stats.blogCount, icon: FileText, color: "text-primary" },
    { label: "Events", value: stats.eventCount, icon: CalendarDays, color: "text-accent" },
    { label: "Speak Up submissions", value: stats.speakUpCount, icon: Inbox, color: "text-green-600" },
    { label: "Meeting requests", value: stats.appointmentCount, icon: TrendingUp, color: "text-amber-600" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of traffic, content, and form responses (Supabase).</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-soft border-border/80">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-3xl font-display font-bold mt-1">{value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="font-display">Top pages</CardTitle>
            <CardDescription>Most visited routes on your site</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No visits recorded yet. Browse the public site to start tracking.</p>
            ) : (
              <ul className="space-y-3">
                {stats.topPages.map((p) => (
                  <li key={p.path} className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate mr-4">{p.path}</span>
                    <Badge variant="secondary">{p.count} visits</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Recent submissions</CardTitle>
              <CardDescription>
                {stats.unreadCount > 0 ? `${stats.unreadCount} unread` : "All caught up"}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/submissions">View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No form responses yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recentSubmissions.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-3 text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-medium capitalize">{s.type.replace("_", " ")}</p>
                      <p className="text-muted-foreground truncate">
                        {s.data.name ?? s.data.email ?? "Submission"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(parseISO(s.createdAt), "d MMM yyyy, h:mm a")}
                      </p>
                    </div>
                    {!s.read && <Badge className="shrink-0">New</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link to="/admin/blogs">Manage blogs</Link></Button>
        <Button variant="outline" asChild><Link to="/admin/events">Manage events</Link></Button>
      </div>
    </div>
  );
}
