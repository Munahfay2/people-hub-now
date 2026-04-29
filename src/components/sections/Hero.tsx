import heroImg from "@/assets/hero-bungoma.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

export const Hero = () => (
  <section id="top" className="relative min-h-[100vh] flex items-center overflow-hidden">
    <img
      src={heroImg}
      alt="Mount Elgon and Bungoma County landscape at sunrise"
      width={1920}
      height={1080}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-hero-gradient" />
    <div className="container relative z-10 pt-28 pb-20 animate-fade-up">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur border border-primary-foreground/25 text-primary-foreground/95 text-sm mb-6">
        <MapPin className="h-3.5 w-3.5" /> Bungoma County · Western Kenya
      </div>
      <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[0.95] max-w-5xl">
        Centre for <em className="not-italic text-gold">Bungoma</em> United Front
      </h1>
      <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
        We unite communities, leaders and partners to develop Bungoma County —
        unlocking its rich resources, creating jobs, and building lasting prosperity.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button asChild variant="hero" size="lg">
          <a href="#about">Discover Our Mission <ArrowRight className="ml-1 h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outlineLight" size="lg">
          <a href="#issues">Voice Your Concerns</a>
        </Button>
      </div>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
        {[
          { n: "1.8M", l: "Population" },
          { n: "9", l: "Constituencies" },
          { n: "45", l: "Wards" },
          { n: "236", l: "Villages" },
        ].map((s) => (
          <div key={s.l} className="border-l-2 border-gold/70 pl-4">
            <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{s.n}</div>
            <div className="text-xs md:text-sm uppercase tracking-wider text-primary-foreground/70">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent z-[1]" />
  </section>
);