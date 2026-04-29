import t1 from "@/assets/team-1.jpg";
import t2 from "@/assets/team-2.jpg";
import t3 from "@/assets/team-3.jpg";
import t4 from "@/assets/team-4.jpg";
import { Play } from "lucide-react";

const team = [
  { img: t1, name: "Hon. James Wafula", role: "Founder & Chairperson" },
  { img: t2, name: "Grace Nasimiyu", role: "Director of Programs" },
  { img: t3, name: "Patrick Simiyu", role: "Community Liaison" },
  { img: t4, name: "Mercy Khasoa", role: "Outreach Coordinator" },
];

export const Team = () => (
  <section id="team" className="py-24 md:py-32">
    <div className="container">
      <div className="max-w-3xl mb-16">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Our People</span>
        <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
          The team behind <em className="not-italic text-accent">the front</em>.
        </h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Meet the dedicated leaders, organizers and volunteers working every day to develop Bungoma County.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {team.map((m) => (
          <article key={m.name} className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-soft">
              <img
                src={m.img}
                alt={m.name}
                width={768}
                height={896}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
                <div className="font-display font-bold text-lg">{m.name}</div>
                <div className="text-sm text-primary-foreground/80">{m.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-3xl overflow-hidden shadow-elegant bg-card border border-border">
        <div className="grid lg:grid-cols-5">
          <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Watch</span>
            <h3 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Our team in <em className="not-italic text-accent">action</em>.
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              See how CFBUF works on the ground — meeting communities, partnering with institutions
              and championing the development of Bungoma County.
            </p>
          </div>
          <div className="lg:col-span-3 relative bg-primary aspect-video lg:aspect-auto">
            <video
              controls
              poster="/placeholder.svg"
              className="w-full h-full object-cover"
              preload="none"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-80">
              <div className="h-16 w-16 rounded-full bg-accent/90 grid place-items-center shadow-warm">
                <Play className="h-7 w-7 text-accent-foreground fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);