import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { submitForm } from "@/lib/formspree";

const schema = z.object({
  name:    z.string().trim().min(2, "Please enter your name").max(100),
  email:   z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().min(3, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message too short — add more detail").max(1500),
});

const CONTACTS = [
  { icon: Mail,    label: "Email",    value: "info@cfbuf.org",            href: "mailto:info@cfbuf.org" },
  { icon: Phone,   label: "Phone",    value: "+254 700 000 000",          href: "tel:+254700000000" },
  { icon: MapPin,  label: "Office",   value: "Moi Avenue, Bungoma Town",  href: "https://maps.google.com/?q=Bungoma+Town+Kenya" },
];

const SOCIALS = [
  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com/cfbuf" },
  { icon: Twitter,   label: "Twitter/X", href: "https://twitter.com/cfbuf" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/cfbuf" },
  { icon: Youtube,   label: "YouTube",   href: "https://youtube.com/@cfbuf" },
];

export const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name:    fd.get("name"),
      email:   fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast({ title: "Check your message", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await submitForm("contact", parsed.data);
      setSubmitted(true);
      toast({ title: "Message sent!", description: "We'll get back to you within 2 business days." });
    } catch {
      toast({ title: "Send failed", description: "Please email us directly at info@cfbuf.org", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-section-gradient">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Get in touch</span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
            We'd love to <em className="not-italic text-accent">hear from you</em>.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Partners, investors, community members, journalists — our door is always open.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {CONTACTS.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth group">
                <div className="h-10 w-10 rounded-xl bg-warm-gradient grid place-items-center shrink-0 shadow-warm group-hover:scale-110 transition-smooth">
                  <c.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{c.label}</div>
                  <div className="text-foreground font-medium">{c.value}</div>
                </div>
              </a>
            ))}

            {/* Social links */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Follow us</p>
              <div className="flex gap-3">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className="h-10 w-10 rounded-xl bg-card border border-border grid place-items-center text-muted-foreground hover:text-accent hover:border-accent transition-smooth shadow-soft">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full bg-card border border-border rounded-2xl p-10 shadow-elegant flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-accent mb-4" />
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message received!</h3>
                <p className="text-muted-foreground mb-6">We'll respond within 2 business days.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>Send another message</Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="c-name">Your name *</Label>
                    <Input id="c-name" name="name" required maxLength={100} placeholder="Jane Wanjala" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="c-email">Email address *</Label>
                    <Input id="c-email" name="email" type="email" required maxLength={200} placeholder="jane@example.com" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="c-subject">Subject *</Label>
                  <Input id="c-subject" name="subject" required maxLength={150} placeholder="Partnership proposal" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-message">Message *</Label>
                  <Textarea id="c-message" name="message" required rows={6} maxLength={1500}
                    placeholder="Tell us what's on your mind…" className="mt-1.5 resize-none" />
                </div>
                <Button type="submit" variant="default" size="lg" className="w-full" disabled={submitting}>
                  <Send className="mr-2 h-4 w-4" /> {submitting ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
