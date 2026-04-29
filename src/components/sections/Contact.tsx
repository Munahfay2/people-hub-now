import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const items = [
  { icon: MapPin, label: "Office", lines: ["Moi Avenue, Bungoma Town", "P.O. Box 1234 — 50200, Bungoma, Kenya"] },
  { icon: Phone, label: "Phone", lines: ["+254 712 000 000", "+254 733 000 000"] },
  { icon: Mail, label: "Email", lines: ["info@cfbuf.org", "appointments@cfbuf.org"] },
];

export const Contact = () => (
  <section id="contact" className="py-24 md:py-32 bg-section-gradient">
    <div className="container">
      <div className="max-w-3xl mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Get In Touch</span>
        <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
          Reach the <em className="not-italic text-accent">united front</em>.
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {items.map((c) => (
          <div key={c.label} className="p-7 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth">
            <div className="h-11 w-11 rounded-xl bg-warm-gradient grid place-items-center text-accent-foreground mb-4 shadow-warm">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{c.label}</div>
            {c.lines.map((l) => (
              <div key={l} className="font-display text-foreground font-semibold">{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6 p-7 rounded-2xl bg-primary text-primary-foreground">
        <div>
          <div className="font-display text-xl font-bold">Follow our work</div>
          <p className="text-sm text-primary-foreground/75 mt-1">Updates from communities across Bungoma.</p>
        </div>
        <div className="flex gap-3">
          {[Facebook, Twitter, Instagram].map((I, i) => (
            <a key={i} href="#" aria-label="Social link" className="h-11 w-11 rounded-xl bg-primary-foreground/10 hover:bg-gold hover:text-gold-foreground grid place-items-center transition-smooth">
              <I className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);