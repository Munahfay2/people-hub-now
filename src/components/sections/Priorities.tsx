const items = [
  { n: "01", title: "Constant Energy Supply", body: "Reduce blackouts through cogeneration, ethanol production and distributed renewables." },
  { n: "02", title: "Job Creation", body: "Attract investors and grow SMEs that put locals to work." },
  { n: "03", title: "Financial Empowerment", body: "Skills enhancement, market access and protection for local artisans and farmers." },
  { n: "04", title: "Infrastructure", body: "Better roads and affordable housing using interlocking bricks and modern technologies." },
  { n: "05", title: "Relevant Skills Training", body: "Practical, entrepreneurial training that meets real market needs." },
  { n: "06", title: "Partnerships", body: "Collaborate with KIRDI, Kibabii University and neighbouring counties." },
  { n: "07", title: "Waste Management", body: "Turn slaughterhouse, food and plastic waste into energy, fertilizer and value." },
  { n: "08", title: "Policy Re-evaluation", body: "Work with the Senator to revisit policies that block local production." },
];

export const Priorities = () => (
  <section id="priorities" className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold/20 blur-3xl" />
    <div className="container relative">
      <div className="max-w-3xl mb-16">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Immediate Needs</span>
        <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]">
          Eight priorities. <em className="not-italic text-gold">One united front.</em>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-primary-foreground/15 rounded-2xl overflow-hidden">
        {items.map((it) => (
          <div key={it.n} className="bg-primary p-7 hover:bg-primary-glow transition-smooth">
            <div className="font-display text-5xl font-bold text-gold/80 mb-4">{it.n}</div>
            <h3 className="font-display text-xl font-bold mb-2">{it.title}</h3>
            <p className="text-sm text-primary-foreground/75 leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);