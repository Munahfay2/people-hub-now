import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Calendar, MapPin, Clock, Filter, Play, Image as ImageIcon, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/queries";
import { loadEvents, getEventCoverUrl } from "@/lib/content";
import type { EventView } from "@/lib/cms-types";
import { imageUrl } from "@/lib/sanity";
import { format, parseISO, isFuture } from "date-fns";

// ── Demo content shown until Sanity is connected ──────────────────────────────
const DEMO_EVENTS: Event[] = [
  {
    _id: "1", title: "Bungoma County Community Forum",
    slug: { current: "community-forum-2025" },
    date: "2025-08-15T09:00:00Z", location: "Bungoma Town Hall, Moi Avenue",
    description: [], category: "Community Forum", isFeatured: true, status: "upcoming",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "2", title: "Agricultural Investment Workshop",
    slug: { current: "agri-workshop-2025" },
    date: "2025-09-02T08:00:00Z", location: "Kibabii University Conference Centre",
    description: [], category: "Workshop", isFeatured: false, status: "upcoming",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "3", title: "Youth Empowerment Summit",
    slug: { current: "youth-summit-2025" },
    date: "2025-06-10T09:00:00Z", location: "Kanduyi Grounds",
    description: [], category: "Community Forum", isFeatured: false, status: "past",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "4", title: "Nabuyole Falls Conservation Day",
    slug: { current: "conservation-day-2025" },
    date: "2025-05-20T07:00:00Z", location: "Nabuyole Falls, Webuye",
    description: [], category: "Cultural", isFeatured: false, status: "past",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "5", title: "Women in Leadership Forum",
    slug: { current: "women-leadership-2025" },
    date: "2025-10-05T09:00:00Z", location: "Bungoma Cultural Centre",
    description: [], category: "Community Forum", isFeatured: false, status: "upcoming",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "6", title: "Clean Bungoma Environmental Drive",
    slug: { current: "clean-bungoma-2025" },
    date: "2025-07-12T07:00:00Z", location: "Bungoma Town Centre",
    description: [], category: "Cultural", isFeatured: false, status: "upcoming",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
];

const CATEGORIES = ["All", "Community Forum", "Workshop", "Fundraiser", "Cultural", "Press Conference"];

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-green-100 text-green-800",
  ongoing:  "bg-yellow-100 text-yellow-800",
  past:     "bg-gray-100 text-gray-600",
};

function EventCard({ event }: { event: EventView }) {
  const dateObj = parseISO(event.date);
  const coverUrl = getEventCoverUrl(event);
  const imgSrc = coverUrl ?? imageUrl(event.coverImage).width(600).height(338).url();
  const hasRealImg = Boolean(coverUrl || event.coverImage?.asset?._ref);

  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-smooth flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {hasRealImg ? (
          <img src={imgSrc} alt={event.title} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10 flex flex-col items-center justify-center gap-2">
            <Calendar className="h-10 w-10 text-accent/50" />
            <span className="text-xs text-muted-foreground">No photo yet</span>
          </div>
        )}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[event.status] ?? "bg-muted text-muted-foreground"}`}>
          {event.status === "upcoming" ? "Upcoming" : event.status === "ongoing" ? "Live now" : "Past event"}
        </div>
        {event.videoUrl && (
          <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary/80 grid place-items-center">
            <Play className="h-4 w-4 text-primary-foreground fill-current" />
          </div>
        )}
        {event.gallery && event.gallery.length > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
            <ImageIcon className="h-3 w-3" /> {event.gallery.length}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">{event.category}</span>
        <h3 className="font-display font-bold text-foreground text-lg leading-tight mb-3 flex-1">{event.title}</h3>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent shrink-0" />
            <span>{format(dateObj, "EEEE, d MMMM yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <span>{format(dateObj, "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={`/events/${event.slug.current}`}>
              View details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

function CalendarView({ events }: { events: EventView[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventDates = new Set<number>(
    events
      .map((e) => {
        const d = parseISO(e.date);
        return d.getFullYear() === year && d.getMonth() === month ? d.getDate() : 0;
      })
      .filter(Boolean)
  );

  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="h-8 w-8 rounded-lg hover:bg-muted transition-smooth grid place-items-center">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-display font-bold text-foreground">{format(currentMonth, "MMMM yyyy")}</h3>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="h-8 w-8 rounded-lg hover:bg-muted transition-smooth grid place-items-center">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
            !day ? "" :
            eventDates.has(day) ? "bg-accent text-accent-foreground font-bold shadow-sm cursor-pointer" :
            "text-foreground hover:bg-muted transition-smooth"
          }`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export const Events = () => {
  const [events, setEvents]   = useState<EventView[]>(DEMO_EVENTS);
  const [filter, setFilter]   = useState<"all" | "upcoming" | "past">("all");
  const [category, setCategory] = useState("All");
  const [view, setView]       = useState<"grid" | "calendar">("grid");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadEvents(filter === "all" ? undefined : filter)
      .then((data) => { if (data.length > 0) setEvents(data); else setEvents(DEMO_EVENTS); })
      .catch(() => setEvents(DEMO_EVENTS))
      .finally(() => setLoading(false));
  }, [filter]);

  const displayed = events.filter((e) =>
    (filter  === "all"  || e.status === filter  || (filter === "upcoming" && e.status === "ongoing")) &&
    (category === "All" || e.category === category)
  );

  const featured = events.find((e) => e.isFeatured && e.status !== "past");

  return (
    <>
      <Helmet>
        <title>Events — CFBUF | Bungoma County</title>
        <meta name="description" content="Community forums, workshops, cultural events and fundraisers organised by CFBUF in Bungoma County." />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="bg-primary text-primary-foreground pt-28 pb-16">
          <div className="container">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Community Events</span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
              Where Bungoma <span className="text-accent">comes together.</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl leading-relaxed">
              Forums, workshops, cultural events and community gatherings — all in one place.
            </p>
          </div>
        </section>

        {/* Featured event */}
        {featured && (
          <section className="py-10 border-b border-border">
            <div className="container">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">Featured Event</p>
              <div className="rounded-3xl overflow-hidden bg-card border border-border shadow-elegant grid lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto overflow-hidden bg-muted min-h-[200px] flex items-center justify-center">
                  {(getEventCoverUrl(featured) || featured.coverImage?.asset?._ref) ? (
                    <img src={getEventCoverUrl(featured) ?? imageUrl(featured.coverImage).width(800).height(500).url()} alt={featured.title} className="w-full h-full object-cover" />
                  ) : (
                    <Calendar className="h-16 w-16 text-muted-foreground/20" />
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 self-start">{featured.category}</span>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-4">{featured.title}</h2>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" />{format(parseISO(featured.date), "EEEE, d MMMM yyyy 'at' h:mm a")}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" />{featured.location}</div>
                  </div>
                  <Button asChild size="lg" className="self-start">
                    <a href={`/events/${featured.slug.current}`}>View details <ArrowRight className="ml-2 h-4 w-4" /></a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters + grid */}
        <section className="py-12">
          <div className="container">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex gap-2 flex-wrap">
                {(["all","upcoming","past"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth capitalize ${
                      filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
                    }`}>{f === "all" ? "All events" : f}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {(["grid","calendar"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-2 rounded-lg text-sm capitalize transition-smooth ${view === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{v}</button>
                ))}
              </div>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mb-8 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
                    category === c ? "bg-accent text-accent-foreground border-accent" : "bg-background text-muted-foreground border-border hover:border-accent"
                  }`}>{c}</button>
              ))}
            </div>

            {/* Calendar or Grid */}
            {view === "calendar" ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div><CalendarView events={displayed} /></div>
                <div className="lg:col-span-2 space-y-3">
                  {displayed.filter(e => e.status !== "past").map((e) => (
                    <div key={e._id} className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-soft transition-smooth">
                      <div className="shrink-0 w-14 text-center">
                        <div className="text-2xl font-display font-bold text-accent">{format(parseISO(e.date), "d")}</div>
                        <div className="text-xs text-muted-foreground uppercase">{format(parseISO(e.date), "MMM")}</div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{e.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{e.location}</p>
                      </div>
                    </div>
                  ))}
                  {displayed.filter(e => e.status !== "past").length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No upcoming events in this view.</p>
                  )}
                </div>
              </div>
            ) : loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map((i) => <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[4/5]" />)}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No events found. Try a different filter.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((e) => <EventCard key={e._id} event={e} />)}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Events;
