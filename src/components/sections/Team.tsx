import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import t1 from "@/assets/team-1.jpg";
import t2 from "@/assets/team-2.jpg";
import t3 from "@/assets/team-3.jpg";
import t4 from "@/assets/team-4.jpg";
import { Button } from "@/components/ui/button";

const fallbacks = [t1, t2, t3, t4];

type Member = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
};

export const Team = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id,name,role,bio,photo_url,display_order")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => setMembers((data as Member[]) ?? []));
  }, []);

  return (
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {members.map((m, i) => (
          <article key={m.id} className="group">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-soft">
              <img
                src={m.photo_url || fallbacks[i % fallbacks.length]}
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
                {m.bio && (
                  <p className="mt-2 text-xs text-primary-foreground/80 line-clamp-3">{m.bio}</p>
                )}
              </div>
            </div>
          </article>
        ))}
        <article className="group">
          <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 p-6 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-full bg-accent/15 grid place-items-center mb-4">
              <UserPlus className="h-7 w-7 text-accent" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">Join the Team</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Help us build a Bungoma free of poverty. Volunteer or apply for a role.
            </p>
            <Button asChild variant="hero" size="sm" className="mt-5">
              <Link to="/join">Apply now</Link>
            </Button>
          </div>
        </article>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-elegant bg-card border border-border mt-8">
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
};