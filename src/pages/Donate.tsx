import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { Heart, Smartphone, Globe, CreditCard, Building2, Check, Copy, ExternalLink, ChevronDown, ChevronUp, Users, Home, Sprout, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const PAYBILL = {
  number:        "123456",
  accountNumber: "CFBUF2025",
  accountName:   "Centre for Bungoma United Front",
  instructions: [
    "Go to M-Pesa on your phone",
    "Select 'Lipa na M-Pesa'",
    "Select 'Pay Bill'",
    "Enter Business No: 123456",
    "Enter Account No: CFBUF2025",
    "Enter the amount you wish to donate",
    "Enter your M-Pesa PIN and confirm",
  ],
};

const IMPACT_STATS = [
  { icon: Users,          number: "1,200+", label: "Families supported" },
  { icon: Home,           number: "45",     label: "Community projects" },
  { icon: Sprout,         number: "8",      label: "Agricultural programmes" },
  { icon: GraduationCap, number: "300+",   label: "Bursaries facilitated" },
];

const CHARITY_WORK = [
  { title: "Food Security Programme",   description: "Distributing drought-resistant seeds and training smallholder farmers across all 9 constituencies." },
  { title: "School Bursary Fund",        description: "Supporting bright but disadvantaged students from Form 1 through university with full bursaries." },
  { title: "Community Infrastructure",  description: "Rehabilitating boreholes, market sheds, and footbridges in underserved wards across the county." },
];

const AMOUNTS = [
  { amount: 500,   label: "KES 500",    description: "Buys seeds for one family" },
  { amount: 1000,  label: "KES 1,000",  description: "School supplies for a term" },
  { amount: 2500,  label: "KES 2,500",  description: "Funds a community meeting" },
  { amount: 5000,  label: "KES 5,000",  description: "One month of outreach" },
  { amount: 10000, label: "KES 10,000", description: "Full bursary for one term" },
  { amount: 0,     label: "Custom",     description: "Enter your own amount" },
];

const INTERNATIONAL = [
  { method: "PayPal",               icon: CreditCard,  description: "Fast, secure international transfer. Funds converted directly to our account.", link: "https://paypal.me/cfbuf",         color: "border-blue-200 bg-blue-50" },
  { method: "Bank Transfer (SWIFT)", icon: Building2,   description: "For larger donations, direct bank transfer. Contact us for full SWIFT details.", link: null,                             color: "border-border bg-muted/50" },
  { method: "Western Union",         icon: Globe,       description: "Send money in person or online to: Centre for Bungoma United Front, Bungoma, Kenya.", link: "https://westernunion.com", color: "border-yellow-200 bg-yellow-50" },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({ title: "Copied!", description: `"${text}" copied to clipboard.` });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} aria-label="Copy" className="h-7 w-7 rounded-md bg-muted hover:bg-secondary transition-smooth grid place-items-center">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );
}

export const Donate = () => {
  const [selected, setSelected]     = useState(1000);
  const [custom, setCustom]         = useState("");
  const [tab, setTab]               = useState<"local" | "international">("local");
  const [stepsOpen, setStepsOpen]   = useState(false);

  const finalAmount = selected === 0 ? Number(custom) || 0 : selected;

  return (
    <>
      <Helmet>
        <title>Donate — CFBUF | Umaskini Apana (Zero Poverty)</title>
        <meta name="description" content="Support CFBUF's work in Bungoma County. Donate via M-Pesa Paybill or international payment methods. Umaskini Apana — Zero Poverty." />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="bg-primary text-primary-foreground pt-28 pb-16">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-accent fill-current" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Donations & Positive Peace</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
              Help us reach <span className="text-accent">Umaskini Apana.</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/85 max-w-2xl leading-relaxed">
              Every contribution funds real programmes — bursaries, seeds, community infrastructure and advocacy for Bungoma's 1.8 million people.
            </p>
          </div>
        </section>

        {/* Impact stats */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-center font-display text-3xl font-bold text-foreground mb-10">Your donations at <span className="text-accent">work.</span></h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {IMPACT_STATS.map((s) => (
                <div key={s.label} className="p-6 rounded-2xl bg-card border border-border shadow-soft text-center hover:shadow-elegant transition-smooth">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 grid place-items-center mx-auto mb-3">
                    <s.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="font-display text-3xl font-bold text-foreground mb-1">{s.number}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {CHARITY_WORK.map((w) => (
                <div key={w.title} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <div className="h-1 w-10 rounded-full bg-accent mb-4" />
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation UI */}
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-start">

              {/* Amount selector */}
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">Choose an amount</h2>
                <p className="text-muted-foreground mb-6">All amounts in Kenyan Shillings (KES) unless paying internationally.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {AMOUNTS.map((d) => (
                    <button key={d.label} onClick={() => setSelected(d.amount)}
                      className={`p-4 rounded-xl border text-left transition-smooth ${
                        selected === d.amount
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-border bg-card hover:border-accent/50"
                      }`}>
                      <div className={`font-display font-bold text-lg ${selected === d.amount ? "text-accent" : "text-foreground"}`}>{d.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 leading-snug">{d.description}</div>
                    </button>
                  ))}
                </div>
                {selected === 0 && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Enter custom amount (KES)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-semibold">KES</span>
                      <input type="number" min={1} value={custom} onChange={(e) => setCustom(e.target.value)}
                        placeholder="e.g. 3000"
                        className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                )}
                {finalAmount > 0 && (
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <p className="text-sm text-muted-foreground">You are donating</p>
                    <p className="font-display text-2xl font-bold text-accent">KES {finalAmount.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Payment methods */}
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">How to pay</h2>
                <p className="text-muted-foreground mb-6">Choose your preferred payment method below.</p>

                {/* Tab switch */}
                <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
                  {(["local","international"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                        tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                      }`}>
                      {t === "local" ? <><Smartphone className="h-4 w-4" /> Local (M-Pesa)</> : <><Globe className="h-4 w-4" /> International</>}
                    </button>
                  ))}
                </div>

                {tab === "local" ? (
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
                      {/* Paybill header */}
                      <div className="bg-primary p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/10 grid place-items-center">
                          <Smartphone className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-xs text-primary-foreground/70 uppercase tracking-wider">Lipa na M-Pesa</div>
                          <div className="font-display font-bold text-primary-foreground text-xl">Paybill</div>
                        </div>
                      </div>
                      {/* Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between py-2.5 border-b border-border">
                          <span className="text-sm text-muted-foreground">Business No (Paybill)</span>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-foreground text-lg">{PAYBILL.number}</span>
                            <CopyBtn text={PAYBILL.number} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2.5 border-b border-border">
                          <span className="text-sm text-muted-foreground">Account No</span>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-foreground">{PAYBILL.accountNumber}</span>
                            <CopyBtn text={PAYBILL.accountNumber} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2.5">
                          <span className="text-sm text-muted-foreground">Account Name</span>
                          <span className="font-medium text-foreground text-sm text-right max-w-[60%]">{PAYBILL.accountName}</span>
                        </div>
                      </div>
                      {/* Step-by-step toggle */}
                      <button onClick={() => setStepsOpen(!stepsOpen)}
                        className="w-full flex items-center justify-between px-5 py-3 border-t border-border text-sm text-accent font-medium hover:bg-muted/50 transition-smooth">
                        Step-by-step instructions {stepsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {stepsOpen && (
                        <ol className="px-5 pb-5 space-y-2">
                          {PAYBILL.instructions.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="shrink-0 h-5 w-5 rounded-full bg-accent/10 text-accent text-xs font-bold grid place-items-center mt-0.5">{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">After paying you'll receive an M-Pesa confirmation SMS — keep it for your records.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {INTERNATIONAL.map((m) => (
                      <div key={m.method} className={`p-5 rounded-2xl border ${m.color}`}>
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-white border border-border grid place-items-center shrink-0">
                            <m.icon className="h-5 w-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-display font-bold text-foreground mb-1">{m.method}</div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                          </div>
                        </div>
                        {m.link ? (
                          <a href={m.link} target="_blank" rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                            Pay via {m.method} <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <Button asChild variant="outline" size="sm" className="mt-3">
                            <a href="/#contact">Contact us for details</a>
                          </Button>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground text-center">All international payments subject to applicable conversion fees.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center max-w-2xl mx-auto">
            <Heart className="h-10 w-10 text-accent fill-current mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Together we end poverty in <span className="text-accent">Bungoma.</span></h2>
            <p className="text-primary-foreground/80 leading-relaxed mb-8">Every shilling goes directly to community programmes. Join hundreds of supporters already making a difference.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="secondary" size="lg"><a href="/#contact">Get in touch</a></Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 text-primary-foreground hover:bg-white/10"><a href="/events">See our work</a></Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Donate;
