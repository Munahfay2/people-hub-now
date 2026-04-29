import farming from "@/assets/resource-farming.jpg";
import waterfall from "@/assets/resource-waterfall.jpg";
import mountain from "@/assets/resource-mountain.jpg";
import { Droplets, Wind, Wheat, Sprout, Beef, Mountain, Palette, Landmark } from "lucide-react";

const resources = [
  { icon: Droplets, title: "Waterfalls & Rivers", desc: "Nabuyole Falls alone can produce 5+ MW of hydropower. Plus year-round irrigation potential.", img: waterfall },
  { icon: Wind, title: "High-Speed Wind", desc: "Areas like Ee-Luucho are perfect for wind turbine installations.", img: null },
  { icon: Wheat, title: "Plenty of Foodstuffs", desc: "Maize, sorghum, beans, cassava, bananas, vegetables — all grown abundantly.", img: farming },
  { icon: Sprout, title: "Cash Crops", desc: "Sugarcane and tobacco lead, with potential in cotton, coffee, wheat and essential oils.", img: null },
  { icon: Beef, title: "Livestock Production", desc: "Dairy, poultry, pigs, sheep, goats and rabbits — strong commercial potential.", img: null },
  { icon: Mountain, title: "Tourist Attractions", desc: "Mt. Elgon, Chepkitale Forest, Kitum Caves, Chetambe Fort and Sang'alo Hills.", img: mountain },
  { icon: Palette, title: "Pottery Clay", desc: "Areas like Siumbwa near Kibabii have rich clay perfect for ceramic industries.", img: null },
  { icon: Landmark, title: "Rich Culture", desc: "Sikhebo, Khuswala kumuse, Chiunwa and traditional medicine knowledge worth preserving.", img: null },
];

export const Resources = () => (
  <section id="resources" className="py-24 md:py-32 bg-section-gradient">
    <div className="container">
      <div className="max-w-3xl mb-16">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Our Wealth</span>
        <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
          Resources waiting to be <em className="not-italic text-accent">unlocked</em>.
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {resources.map((r, i) => (
          <article
            key={r.title}
            className={`group relative overflow-hidden rounded-2xl bg-card border border-border shadow-soft hover:shadow-elegant transition-smooth ${
              i === 0 || i === 5 ? "lg:row-span-2" : ""
            }`}
          >
            {r.img && (
              <div className="aspect-[4/3] lg:aspect-auto lg:h-48 overflow-hidden">
                <img src={r.img} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
              </div>
            )}
            <div className="p-6">
              <r.icon className="h-7 w-7 text-accent mb-3" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);