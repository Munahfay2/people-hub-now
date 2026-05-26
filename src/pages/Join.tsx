import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  interest_area: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more (min 10 chars)").max(2000),
});

const Join = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", interest_area: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Please fix the form", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("team_applications").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      interest_area: parsed.data.interest_area || null,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24">
        <div className="container max-w-2xl">
          <Link to="/" className="text-sm text-muted-foreground hover:text-accent">← Back to home</Link>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold text-foreground">Join the team</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Help us deliver <em className="text-accent not-italic">Umaskini Apana (Zero Poverty)</em> across Bungoma County.
          </p>

          {done ? (
            <div className="mt-10 p-8 rounded-2xl bg-card border border-border shadow-soft text-center">
              <CheckCircle2 className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground">Application received</h2>
              <p className="mt-2 text-muted-foreground">Thank you. Our team will get back to you shortly.</p>
              <Button asChild variant="outline" className="mt-6"><Link to="/">Back to site</Link></Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5 p-8 rounded-2xl bg-card border border-border shadow-soft">
              <div>
                <Label htmlFor="full_name">Full name *</Label>
                <Input id="full_name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={120} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
                </div>
              </div>
              <div>
                <Label htmlFor="interest_area">Area of interest</Label>
                <Input id="interest_area" placeholder="e.g. Volunteering, Programs, Outreach" value={form.interest_area} onChange={(e) => setForm({ ...form, interest_area: e.target.value })} maxLength={120} />
              </div>
              <div>
                <Label htmlFor="message">Why do you want to join? *</Label>
                <Textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Join;