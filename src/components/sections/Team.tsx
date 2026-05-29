import { useState } from "react";
import { Play, Plus, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import t1 from "@/assets/team-1.jpg";
import t2 from "@/assets/team-2.jpg";
import t3 from "@/assets/team-3.jpg";
import t4 from "@/assets/team-4.jpg";

const team = [
  {
    img: t1,
    name: "Hon. JIM NDURUCHI",
    role: "Founder & Chairperson",
    bio: "Jim has dedicated over two decades to community development in Western Kenya. A visionary leader, he founded CFBUF to bring together diverse voices and unlock Bungoma County's economic potential through inclusive governance.",
  },
  {
    img: t2,
    name: "DR.PETER KHAKINA",
    role: "Director of Programs",
    bio: "Peter coordinates CFBUF's flagship programs across all nine constituencies. With a background in development economics, he ensures every initiative delivers measurable impact on the ground for Bungoma's communities.",
  },
  {
    img: t3,
    name: "Patrick Simiyu",
    role: "Community Liaison",
    bio: "Patrick is the bridge between CFBUF and the wards and villages of Bungoma. He facilitates listening forums, documents community concerns, and ensures grassroots voices shape every policy position the organisation takes.",
  },
  {
    img: t4,
    name: "Mercy Khasoa",
    role: "Outreach Coordinator",
    bio: "Mercy leads CFBUF's outreach across schools, markets and community centres. Her work on financial empowerment and skills training has directly improved livelihoods for hundreds of families across the county.",
  },
];

function TeamCard({ member }: { member: (typeof team)[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-soft">
        <img
          src={member.img}
          alt={member.name}
          width={768}
          height={896}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
          <div className="font-display font-bold text-lg">{member.name}</div>
          <div className="text-sm text-primary-foreground/80">{member.role}</div>
        </div>
      </div>

      {/* Biography section */}
      <div className="mt-3 px-1">
        <p className={`text-sm text-muted-foreground leading-relaxed transition-smooth ${expanded ? "" : "line-clamp-2"}`}>
          {member.bio}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-smooth"
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3" /> Show less</>
          ) : (
            <><ChevronDown className="h-3 w-3" /> Read more</>
          )}
        </button>
      </div>
    </article>
  );
}

function JoinTeamCard() {
  return (
    <article className="flex flex-col">
      <a
        href="#issues"
        className="group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed border-accent/40 bg-card hover:border-accent hover:bg-accent/5 transition-smooth flex flex-col items-center justify-center text-center p-6"
      >
        <div className="h-16 w-16 rounded-full bg-warm-gradient grid place-items-center shadow-warm mb-4 group-hover:scale-110 transition-smooth">
          <Plus className="h-8 w-8 text-accent-foreground" />
        </div>
        <div className="font-display font-bold text-foreground text-lg mb-2">Join the Team</div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Passionate about developing Bungoma? We'd love to have you with us.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          <UserPlus className="h-4 w-4" /> Apply now
        </span>
      </a>
      <div className="mt-3 px-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          We welcome volunteers, professionals and community champions who share our vision for a prosperous Bungoma County.
        </p>
      </div>
    </article>
  );
}

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
        {team.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
        <JoinTeamCard />
      </div>

      {/* Video feature */}
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
