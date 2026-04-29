import { Eye, Target, Heart } from "lucide-react";

export const About = () => (
  <section id="about" className="py-24 md:py-32">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Who we are</span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
            Building a united, prosperous <em className="not-italic text-accent">Bungoma</em>.
          </h2>
          <div className="mt-8 inline-block px-5 py-3 bg-warm-gradient rounded-full text-accent-foreground font-display italic text-lg shadow-warm">
            Motto: "Skiza Ground"
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6 text-muted-foreground text-lg leading-relaxed">
          <p>
            Bungoma County sits in Western Kenya across <strong className="text-foreground">3,032 km²</strong> and
            is home to about <strong className="text-foreground">1.8 million people</strong>. Despite abundant
            natural resources — fertile land, rivers, waterfalls, wind, and culture — over 70% of residents still
            live in poverty.
          </p>
          <p>
            CFBUF exists to change that. We listen first, then act — connecting communities to opportunities,
            partners, and the policies that will unlock the County's true potential.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-6">
            {[
              { icon: Target, title: "Mission", body: "Develop Bungoma by providing a conducive investment environment." },
              { icon: Eye, title: "Vision", body: "The most developed County in Kenya." },
              { icon: Heart, title: "Values", body: "Integrity · Transparency · Accountability · Action." },
            ].map((c) => (
              <div key={c.title} className="p-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth">
                <c.icon className="h-6 w-6 text-accent mb-3" />
                <div className="font-display font-bold text-foreground mb-1">{c.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);