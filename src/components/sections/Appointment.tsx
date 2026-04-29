import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  date: z.string().min(4),
  time: z.string().min(3),
  reason: z.string().trim().min(5).max(800),
});

export const Appointment = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      date: fd.get("date"),
      time: fd.get("time"),
      reason: fd.get("reason"),
    });
    if (!parsed.success) {
      toast({ title: "Please check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const d = parsed.data;
    const subject = `[Appointment Request] ${d.name} — ${d.date} ${d.time}`;
    const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nPreferred date: ${d.date}\nPreferred time: ${d.time}\n\nReason:\n${d.reason}`;
    window.location.href = `mailto:appointments@cfbuf.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Opening your email app", description: "We'll confirm your appointment shortly." });
    }, 600);
  };

  return (
    <section id="appointment" className="py-24 md:py-32">
      <div className="container">
        <div className="rounded-3xl overflow-hidden bg-earth-gradient shadow-elegant">
          <div className="grid lg:grid-cols-5">
            <div className="lg:col-span-2 p-8 md:p-12 text-primary-foreground">
              <CalendarCheck className="h-10 w-10 text-gold mb-6" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Sit With Us</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.05]">
                Book an <em className="not-italic text-gold">appointment</em>.
              </h2>
              <p className="mt-5 text-primary-foreground/85 leading-relaxed">
                Need to discuss a project, partnership opportunity or community proposal in person?
                Choose a time that works and we'll meet you.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-primary-foreground/85">
                <li>• Mon — Fri, 9:00am to 5:00pm</li>
                <li>• In-person, phone or video meeting</li>
                <li>• Free of charge</li>
              </ul>
            </div>
            <form onSubmit={onSubmit} className="lg:col-span-3 bg-background p-8 md:p-12 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ap-name">Full name</Label>
                  <Input id="ap-name" name="name" required maxLength={100} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="ap-phone">Phone</Label>
                  <Input id="ap-phone" name="phone" required type="tel" maxLength={30} placeholder="+254 ..." className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="ap-email">Email</Label>
                <Input id="ap-email" name="email" required type="email" maxLength={255} className="mt-1.5" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ap-date">Preferred date</Label>
                  <Input id="ap-date" name="date" required type="date" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="ap-time">Preferred time</Label>
                  <Input id="ap-time" name="time" required type="time" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="ap-reason">Reason for the meeting</Label>
                <Textarea id="ap-reason" name="reason" required rows={4} maxLength={800} className="mt-1.5 resize-none" />
              </div>
              <Button type="submit" variant="warm" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Opening email..." : "Request Appointment"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};