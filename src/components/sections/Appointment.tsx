import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, CheckCircle2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { submitPublicForm } from "@/lib/form-submit";

const schema = z.object({
  name:    z.string().trim().min(2, "Please enter your full name").max(100),
  phone:   z.string().trim().regex(/^[+\d\s\-()]{7,20}$/, "Please enter a valid phone number"),
  email:   z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  date:    z.string().min(1, "Please select a preferred date"),
  purpose: z.string().trim().min(5, "Please briefly describe the purpose (5+ characters)").max(500),
});

const PURPOSES = [
  "Investment enquiry",
  "Community issue",
  "Partnership proposal",
  "Media / Press",
  "Volunteer / Join team",
  "Other",
];

export const Appointment = () => {
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name:    fd.get("name"),
      phone:   fd.get("phone"),
      email:   fd.get("email") || "",
      date:    fd.get("date"),
      purpose: purpose + (fd.get("notes") ? ` — ${fd.get("notes")}` : ""),
    });
    if (!parsed.success) {
      toast({ title: "Please check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await submitPublicForm("appointment", {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || "Not provided",
        date: parsed.data.date,
        purpose: parsed.data.purpose,
      });
      setSubmitted(true);
      toast({ title: "Appointment requested!", description: "We'll confirm your booking within 24 hours." });
    } catch {
      toast({ title: "Submission failed", description: "Please try again or call us directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="appointment" className="py-24 md:py-32">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Book a Meeting</span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
            Let's sit down <em className="not-italic text-accent">and talk</em>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Whether you're an investor, a community leader, a journalist or someone who simply wants to
            contribute to Bungoma's future — we'd love to hear from you.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Office hours: Mon – Fri, 8 am – 5 pm",
              "Location: Bungoma Town, along Moi Avenue",
              "Confirmation within 24 hours",
            ].map((s) => (
              <div key={s} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-accent shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          <div className="bg-card border border-border rounded-2xl p-10 shadow-elegant flex flex-col items-center text-center">
            <CheckCircle2 className="h-14 w-14 text-accent mb-4" />
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Request received!</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We'll review your request and send a confirmation within 24 hours.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Book another</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" name="name" required maxLength={100} placeholder="Hon. James Barasa" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">Phone number *</Label>
                <Input id="phone" name="phone" required type="tel" maxLength={20} placeholder="+254 7XX XXX XXX" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email address (optional)</Label>
              <Input id="email" name="email" type="email" maxLength={200} placeholder="james@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="date">Preferred date *</Label>
              <Input id="date" name="date" type="date" required min={new Date().toISOString().split("T")[0]} className="mt-1.5" />
            </div>
            <div>
              <Label>Purpose of meeting *</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PURPOSES.map((p) => (
                  <button
                    key={p} type="button" onClick={() => setPurpose(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                      purpose === p
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-background text-muted-foreground border-border hover:border-accent"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Additional notes</Label>
              <Textarea id="notes" name="notes" rows={4} maxLength={500}
                placeholder="Any context that would help us prepare for the meeting…"
                className="mt-1.5 resize-none" />
            </div>
            <Button type="submit" variant="default" size="lg" className="w-full" disabled={submitting}>
              <Send className="mr-2 h-4 w-4" /> {submitting ? "Submitting…" : "Request Appointment"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};
