import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { useCmsAuth } from "@/contexts/CmsAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const { isAuthenticated, login, loading, configured } = useCmsAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      navigate("/admin");
    } else {
      toast({
        title: "Sign in failed",
        description: result.error ?? "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow/30 to-accent/40 opacity-90" />
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">CFBUF</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-4 leading-tight">
            Cloud-powered <span className="text-accent">content studio</span>
          </h1>
          <p className="mt-6 text-primary-foreground/80 max-w-md text-lg leading-relaxed">
            Blogs, events, and form responses — stored securely in Supabase.
          </p>
        </div>
        <div className="relative z-10 flex gap-6 text-sm text-primary-foreground/70">
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-accent" /> Supabase Auth</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">Sign in to CMS</h2>
            <p className="text-muted-foreground mt-2">Use your Supabase admin account.</p>
          </div>

          {!configured && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Supabase not configured</AlertTitle>
              <AlertDescription>
                Add <code className="text-xs">VITE_SUPABASE_URL</code> and{" "}
                <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> to <code className="text-xs">.env.local</code>,
                then run <code className="text-xs">supabase/schema.sql</code> in your project SQL editor.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10" placeholder="admin@cfbuf.org" disabled={!configured} />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10" placeholder="••••••••" disabled={!configured} />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting || !configured || loading}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
