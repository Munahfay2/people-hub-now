import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquareHeart, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  location: z.string().trim().min(2, "Please enter your ward or village").max(100),
  category: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10, "Please share more detail (10+ chars)").max(1500),
});

const categories = ["Energy & Power", "Roads & Infrastructure", "Agriculture", "Healthcare", "Education", "Water", "Other"];

export const Issues = () => {
  const [category, setCategory] = useState(categories[0]);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      location: fd.get("location"),
      category,
      message: fd.get("message"),
    });
    if (!parsed.success) {
      toast({ title: "Please check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { name, location, message } = parsed.data;
    const subject = `[Issue] ${category} — from ${name}`;
    const body = `Name: ${name}\nLocation: ${location}\nCategory: ${category}\n\n${message}`;
    window.location.href = `mailto:info@cfbuf.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Opening your email app", description: "Your message is ready to send." });
    }, 600);
  };

  return (
    <section id="issues" className="py-24 md:py-32 bg-section-gradient">
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Speak Up</span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
            Your voice. <em className="not-italic text-accent">Our action.</em>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Got a concern, suggestion or local issue affecting your village or ward?
            Tell us — we listen, document, and follow up. This is what "Skiza Ground" means.
          </p>
          <div className="mt-8 p-6 rounded-2xl bg-card border border-border shadow-soft">
            <MessageSquareHeart className="h-7 w-7 text-accent mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every submission is reviewed by our outreach team. Where appropriate we connect issues to
              the right partners, leaders and forums. Anonymous submissions also welcome — just write
              "Anonymous" in the name field.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-elegant space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required maxLength={100} placeholder="Jane Wanjala" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="location">Ward / Village</Label>
              <Input id="location" name="location" required maxLength={100} placeholder="Kanduyi" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                    category === c
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background text-muted-foreground border-border hover:border-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="message">Tell us what's happening</Label>
            <Textarea id="message" name="message" required rows={6} maxLength={1500} placeholder="Describe the issue, where it's happening, and what would help..." className="mt-1.5 resize-none" />
          </div>
          <Button type="submit" variant="default" size="lg" className="w-full" disabled={submitting}>
            <Send className="mr-2 h-4 w-4" /> {submitting ? "Opening email..." : "Submit Concern"}
          </Button>
        </form>
      </div>
    </section>
  );
};