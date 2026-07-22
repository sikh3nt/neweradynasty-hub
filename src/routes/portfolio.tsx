import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ArrowRight, Network, Scissors, Building2, TrendingUp, CandlestickChart, Clock, Newspaper } from "lucide-react";
import solestride from "@/assets/solestride-logo.jpg.asset.json";
import aprilFront from "@/assets/april-concepts-front.png.asset.json";
import aprilBack from "@/assets/april-concepts-back.png.asset.json";
import ntsiki from "@/assets/ntsiki-community-project.png.asset.json";
import blackstylePoster from "@/assets/blackstyle-poster.png.asset.json";
import blackstylePamphlet from "@/assets/blackstyle-pamphlet.png.asset.json";
import blackstylePricing from "@/assets/blackstyle-pricing.png.asset.json";
import wirenetLogo from "@/assets/wirenet-logo.png.asset.json";
import nedPyramid from "@/assets/new-era-dynasty-pyramid.jpg.asset.json";
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
    tag: "Parent Brand · 2024/0980819/07",
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
              {["3-candle setup", "Liquidity sweep", "Break of structure", "Body {'>'} wick"].map((t) => (
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
