import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ArrowRight, Network, Scissors, Building2, TrendingUp, CandlestickChart, Clock, Newspaper, Palette, Github, Code2, FlaskConical } from "lucide-react";
import grafxLogo from "@/assets/grafx-logo.png.asset.json";
import solestride from "@/assets/solestride-logo.jpg.asset.json";
import aprilFront from "@/assets/april-concepts-front.png.asset.json";
import aprilBack from "@/assets/april-concepts-back.png.asset.json";
import ntsiki from "@/assets/ntsiki-community-project.png.asset.json";
import blackstylePoster from "@/assets/blackstyle-poster.png.asset.json";
import blackstylePamphlet from "@/assets/blackstyle-pamphlet.png.asset.json";
import blackstylePricing from "@/assets/blackstyle-pricing.png.asset.json";
import wirenetLogo from "@/assets/wirenet-logo-transparent.png.asset.json";
import nedPyramid from "@/assets/new-era-dynasty-pyramid-transparent.png.asset.json";
import blackstyleLogo from "@/assets/blackstyle-logo.jpg.asset.json";
import ghostPoster from "@/assets/ghost-poster.jpg.asset.json";
import oneTreatPoster from "@/assets/one-treat-poster.jpg.asset.json";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Ventures & Client Work | Tozamile Sikhenjana" },
      { name: "description", content: "Ventures and brand/design work by Tozamile Sikhenjana — New Era Dynasty, WireNet, Blackstyle Barbershop, and client projects across Gqeberha." },
      { property: "og:title", content: "Portfolio — New Era Dynasty" },
      { property: "og:description", content: "Ventures in technology, connectivity, and lifestyle, plus brand and design work for clients across Gqeberha." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/portfolio" }],
  }),
  component: Portfolio,
});

const clientWork = [
  {
    name: "SoleStride Emporium",
    tag: "Logo Design · Sneaker Label",
    desc: "Custom gothic-blackletter logo lockup for an independent sneaker label, built around a vibrant paint-splash sneaker illustration and concentric ring motif.",
    images: [{ src: solestride.url, alt: "SoleStride Emporium logo design" }],
  },
  {
    name: "April Concepts",
    tag: "Brand Collateral · Business Cards",
    desc: "Two-sided business card system for a licensed private investigations firm. Monochrome silhouette identity, PSIRA credentialing, and clear service hierarchy.",
    images: [
      { src: aprilFront.url, alt: "April Concepts business card — front" },
      { src: aprilBack.url, alt: "April Concepts business card — back" },
    ],
  },
  {
    name: "Ntsiki's Community Project",
    tag: "Logo Design · Ongoing Admin",
    desc: "Full identity and continuing administrative support for a non-profit lifting youth and families. Uplifted hands and gradient wordmark carrying the tagline: “Making a difference, today & tomorrow.”",
    images: [{ src: ntsiki.url, alt: "Ntsiki's Community Project logo with slogan" }],
  },
  {
    name: "Black Style Barbershop",
    tag: "Marketing Design · Posters, Pamphlets & Pricing",
    desc: "Retro-inspired marketing suite for a Motherwell barbershop — social posters, an editorial pamphlet series, and an in-shop pricing menu that ties the room together.",
    images: [
      { src: blackstylePoster.url, alt: "Black Style Barbershop retro poster" },
      { src: blackstylePamphlet.url, alt: "Black Style Barbershop digital pamphlet" },
      { src: blackstylePricing.url, alt: "Black Style Barbershop pricing menu" },
    ],
  },
  {
    name: "Ghost (iGhostLasego)",
    tag: "Artist Poster · New Era Dynasty",
    desc: "Promotional artist poster for Ghost under the New Era Dynasty banner — cinematic lighting, chromed typography, and clear booking and social handles for a Gqeberha-based performer.",
    images: [{ src: ghostPoster.url, alt: "Ghost artist promotional poster" }],
  },
  {
    name: "One Treat At A Time",
    tag: "Poster Design · Small Business",
    desc: "Poster for a Summerstrand treat brand — teal and coral palette, playful product framing, and clear pricing and contact hierarchy for at-a-glance ordering.",
    images: [{ src: oneTreatPoster.url, alt: "One Treat At A Time poster with pricing and contact" }],
  },
];

const ventures = [
  {
    icon: Building2,
    logo: nedPyramid.url,
    name: "New Era Dynasty",
    tag: "Parent Brand · 2024/080819/07",
    desc: "The umbrella brand for every discipline — technology, business consulting, creative direction, and community development. A South African brand with global intent.",
    highlights: ["Multidisciplinary practice", "Registered SA company", "Community-first", "Growing team"],
    gradient: "var(--gradient-royal)",
  },
  {
    icon: Network,
    logo: wirenetLogo.url,
    name: "WireNet",
    tag: "Connectivity & Networking",
    desc: "Networking and connectivity solutions built for homes, businesses, and community spaces. WireNet aims to close the digital access gap where it matters most.",
    highlights: ["Fibre & wireless", "Business networks", "Site surveys", "Managed support"],
    gradient: "var(--gradient-quantum)",
  },
  {
    icon: Scissors,
    logo: blackstyleLogo.url,
    name: "Blackstyle Barbershop",
    tag: "Lifestyle & Grooming",
    desc: "A modern grooming experience rooted in township pride and professional standards — a physical embodiment of the Dynasty's commitment to community.",
    highlights: ["Signature cuts", "Grooming products", "Community hub", "Apprentice pipeline"],
    gradient: "linear-gradient(135deg, oklch(0.35 0.02 260), oklch(0.12 0.014 260))",
  },
  {
    icon: Palette,
    logo: grafxLogo.url,
    name: "GraFX",
    tag: "Graphic Design",
    desc: "A graphic design venture producing logos, posters, and brand visuals — covering everything from identity design to print-ready marketing materials for individuals and small businesses.",
    highlights: ["Logo Design", "Posters", "Branding", "Print Design"],
    gradient: "linear-gradient(135deg, oklch(0.45 0.14 250), oklch(0.16 0.03 250))",
  },
];

const softwareProjects: {
  eyebrow: string;
  name: string;
  desc: string;
  tags: string[];
  github?: string;
  demo?: "/labs/calculator" | "/labs/cv-builder" | "/labs/amd-bot" | "/labs/ndingubani-tv";
}[] = [
  {
    eyebrow: "Automation · Forex",
    name: "AMD Trading Bot",
    desc: "A full-stack automated trading system for IC Markets running a custom AMD (Accumulation–Manipulation–Distribution) strategy. An MQL5 Expert Advisor handles execution, a Python Flask bridge server manages logic and signal processing, and a React Native Android app gives full remote control over trades and performance from a phone.",
    tags: ["MQL5", "Python / Flask", "React Native", "Live trading"],
    github: "https://github.com/sikh3nt/amd-trading-bot",
    demo: "/labs/amd-bot",
  },
  {
    eyebrow: "Civic Tech · Concept Build",
    name: "Civic FaceNet",
    desc: "A technical concept for a community facial-recognition alert system, designed to flag wanted persons near public cameras and notify local police in real time. Built on accessible hardware using OpenCV, DeepFace, and FAISS for fast facial matching, with POPIA compliance and a formal law-enforcement MOU treated as non-negotiable prerequisites before real-world deployment.",
    tags: ["Python", "OpenCV", "DeepFace", "FAISS", "Compliance-first"],
    github: "https://github.com/sikh3nt/civic-facenet",
  },
  {
    eyebrow: "Web App · Local Delivery",
    name: "SwiftDrop",
    desc: "An on-demand local delivery app for food, groceries, pharmacy runs, and custom errands. Users describe what they need, set pickup and drop-off points, and get a live fee quote with step-by-step order tracking. Supports cash, card, mobile money, and crypto payment options, plus full order history.",
    tags: ["React", "Live tracking", "Multi-payment"],
  },
  {
    eyebrow: "Internal Tool · Hospitality",
    name: "469 Premium Bar Stock Tracker",
    desc: "An operations tool built for weekend bar service, tracking opening, closing, and wastage counts by category against par levels. Runs on a shared live sheet so the whole team works off the same numbers, with CSV export and print-ready reports.",
    tags: ["React", "Live shared data", "CSV export"],
  },
  {
    eyebrow: "Web App · Utility",
    name: "Scientific Calculator",
    desc: "A precision-instrument-styled scientific calculator with full trig, log, exponent, factorial, and memory functions — degree/radian toggle included. Built as a standalone web app with a hardware-inspired LCD interface.",
    tags: ["HTML/CSS/JS", "LCD-style UI"],
    demo: "/labs/calculator",
  },
  {
    eyebrow: "Web App · Career Tool",
    name: "CV / Résumé Builder",
    desc: "A self-serve résumé builder — fill out a guided form, choose from multiple professional templates, and download the finished résumé as a PDF or editable Word document. Built so anyone can create a polished CV without design experience.",
    tags: ["JavaScript", "Multi-template", "PDF/DOC export"],
    demo: "/labs/cv-builder",
  },
  {
    eyebrow: "Client Project · Media & Streaming",
    name: "Ndingubani TV",
    desc: "A branded live-streaming channel website built for a client, designed around an identity and heritage storytelling concept (\u201CNdingubani\u201D — \u201CWho am I?\u201D). Features an autoplaying live-stream hero, a news-style announcement ticker, a schedule strip, and an episode gallery for catching up on past broadcasts — all built mobile-first for viewers arriving via shared social links.",
    tags: ["HTML/CSS/JS", "Live streaming", "Client work"],
    demo: "/labs/ndingubani-tv",
  },
];

function Portfolio() {
  return (
    <PageShell eyebrow="Portfolio" title="Ventures & client work." intro="Three brands under the Dynasty, plus selected identity and marketing work for clients across Gqeberha.">
      <div className="grid gap-6">
        {ventures.map((v) => {
          const Icon = v.icon;
          return (
            <article key={v.name} className="relative overflow-hidden glass-strong rounded-3xl p-8 md:p-12">
              <div className="absolute inset-0 opacity-25" style={{ background: v.gradient }} />
              <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-black/60 border border-border overflow-hidden shadow-glow-gold">
                  {v.logo ? (
                    <img src={v.logo} alt={`${v.name} logo`} loading="lazy" className="h-full w-full object-contain p-2" />
                  ) : (
                    <Icon className="h-7 w-7 text-primary" />
                  )}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-primary">{v.tag}</div>
                  <h2 className="mt-2 font-display text-3xl md:text-4xl text-foreground">{v.name}</h2>
                  <p className="mt-4 text-muted-foreground max-w-2xl">{v.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {v.highlights.map((h) => (
                      <span key={h} className="rounded-full glass px-3 py-1 text-xs text-foreground">{h}</span>
                    ))}
                  </div>
                </div>
                <Link to="/contact" className="hidden md:inline-flex shrink-0 items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury">
                  Enquire <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* TRADING — Skills & Strategies */}
      <div className="mt-20">
        <div className="mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> Trading · Skill Proof
          </div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-foreground">Swing trading — strategies I run live.</h2>
          <p className="mt-4 text-muted-foreground">
            A disciplined swing-trading practice combining technical setups with fundamental catalysts.
            I sit at the charts daily, watch the news feed, and only take setups where the technicals
            and the macro story agree.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <CandlestickChart className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-foreground">Candle Range Theory + Turtle Body Soup</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Two setups that pair together. Mark the high and low of the first candle as the range.
              Wait for the second candle to close inside that range. When the third candle opens and breaks
              the structure of candle two — up or down, depending on where liquidity was swept — that's the
              trigger to look for an optimal entry. A clean turtle <em>body</em> soup delivers the highest
              probability; a turtle <em>wick</em> soup is lower conviction and sized accordingly.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["3-candle setup", "Liquidity sweep", "Break of structure", "Body > wick"].map((t) => (
                <span key={t} className="rounded-full glass px-3 py-1 text-xs text-foreground">{t}</span>
              ))}
            </div>
          </article>

          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-foreground">Quasimodo (QML) — Reversals</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              A reversal pattern built on a shifted high/low structure. Price prints a high and a low,
              sweeps liquidity, then reverses through the neckline — that's the QML shift. Same DNA as
              the candle range theory: both live off reversal moves, which is exactly what a swing trader
              wants to catch.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Reversal", "Neckline break", "Swing bias", "Higher timeframe confirm"].map((t) => (
                <span key={t} className="rounded-full glass px-3 py-1 text-xs text-foreground">{t}</span>
              ))}
            </div>
          </article>

          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-foreground">7·1·4 Method (Session Bias)</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Daily bias tool on the 5-minute chart, Monday to Friday. Mark the 1&nbsp;o'clock candle and
              the 2&nbsp;o'clock candle with horizontal lines. The direction from 1&nbsp;→&nbsp;2 tells you
              the play from 2&nbsp;→&nbsp;3 — price reverses that leg. Down into 2? Bias flips up.
              Up into 2? Bias flips down. Simple, repeatable, and it keeps you on the right side of the
              afternoon session.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["5-min chart", "Mon–Fri", "Session reversal", "Horizontal levels"].map((t) => (
                <span key={t} className="rounded-full glass px-3 py-1 text-xs text-foreground">{t}</span>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 glass rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Newspaper className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl text-foreground">News & Event Trading</h3>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-3xl">
            Technicals only get you halfway. I trade high-impact events — ISM Manufacturing PMI, PPI, CPI,
            and NFP — pairing the release with the same reversal setups above to find optimal entries into
            the volatility spike, not against it.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["ISM PMI", "PPI", "CPI", "NFP", "FOMC-aware"].map((t) => (
              <span key={t} className="rounded-full glass px-3 py-1 text-xs text-foreground">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* SOFTWARE & APPS */}
      <div className="mt-20">
        <div className="mb-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
            <Code2 className="h-3.5 w-3.5" /> Software &amp; Apps · Built Solo
          </div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-foreground">Tech I've built.</h2>
          <p className="mt-4 text-muted-foreground">
            Independent builds across trading automation, civic tech, and everyday tools — full-stack, self-taught, shipped.
          </p>
        </div>

        <div className="mb-10 inline-flex max-w-3xl items-start gap-2 rounded-2xl glass px-4 py-3 text-xs sm:text-sm text-muted-foreground">
          <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>Built across two workflows: rapid app development in Lovable, and hand-coded projects in Python, MQL5, and React — hosted on GitHub.</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {softwareProjects.map((p) => (
            <article key={p.name} className="glass-strong rounded-3xl p-6 md:p-8 flex flex-col">
              <div className="text-xs uppercase tracking-[0.25em] text-primary">{p.eyebrow}</div>
              <h3 className="mt-2 font-display text-2xl text-foreground">{p.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground flex-1">{p.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full glass px-3 py-1 text-xs text-foreground">{t}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {p.demo && (
                  <Link
                    to={p.demo}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
                  >
                    <FlaskConical className="h-4 w-4" /> Try it live
                  </Link>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury"
                  >
                    <Github className="h-4 w-4" /> View on GitHub
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>


      <div className="mt-20">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.25em] text-primary">Client Work</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-foreground">Selected brand & design projects.</h2>
          <p className="mt-4 text-muted-foreground">A snapshot of identity, collateral, and marketing work delivered for independent businesses and community organisations.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {clientWork.map((w) => (
            <article key={w.name} className="glass-strong rounded-3xl overflow-hidden flex flex-col">
              <div className={`grid gap-2 p-4 bg-black/40 ${w.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {w.images.map((img) => (
                  <div key={img.src} className="aspect-square rounded-2xl overflow-hidden bg-black grid place-items-center">
                    <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="text-xs uppercase tracking-[0.25em] text-primary">{w.tag}</div>
                <h3 className="mt-2 font-display text-2xl text-foreground">{w.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground flex-1">{w.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-5 py-2.5 text-sm text-primary hover:bg-primary/20 transition-luxury">
            Commission a project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
