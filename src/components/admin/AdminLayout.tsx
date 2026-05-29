import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";
import { useCmsAuth } from "@/contexts/CmsAuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/blogs", label: "Blog Posts", icon: FileText },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/submissions", label: "Form Responses", icon: Inbox },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-smooth",
              isActive
                ? "bg-accent text-accent-foreground shadow-warm"
                : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout() {
  const { isAuthenticated, email, logout, loading } = useCmsAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-accent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <aside className="hidden lg:flex w-64 flex-col bg-primary text-primary-foreground shrink-0">
        <div className="p-6 border-b border-primary-foreground/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">CFBUF</p>
          <h1 className="font-display text-xl font-bold mt-1">Content Studio</h1>
          <p className="text-xs text-primary-foreground/60 mt-1 truncate">{email}</p>
        </div>
        <NavItems />
        <div className="mt-auto p-4 space-y-2 border-t border-primary-foreground/10">
          <Button variant="ghost" size="sm" className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> View website
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between gap-4 px-4 py-3 bg-primary text-primary-foreground border-b border-primary-foreground/10">
          <div>
            <p className="text-xs text-accent font-semibold uppercase tracking-wider">CFBUF CMS</p>
            <p className="font-display font-bold">Content Studio</p>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="text-primary-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-primary border-none text-primary-foreground">
              <div className="p-6">
                <p className="font-display font-bold text-lg">Menu</p>
              </div>
              <NavItems onNavigate={() => setOpen(false)} />
              <div className="p-4 mt-auto">
                <Button variant="ghost" className="w-full text-primary-foreground" onClick={() => { void logout(); setOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
