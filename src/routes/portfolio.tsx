import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ArrowRight, Network, Scissors, Building2 } from "lucide-react";
import solestride from "@/assets/solestride-logo.jpg.asset.json";
import aprilFront from "@/assets/april-concepts-front.png.asset.json";
import aprilBack from "@/assets/april-concepts-back.png.asset.json";
import ntsiki from "@/assets/ntsiki-community-project.png.asset.json";
import blackstylePoster from "@/assets/blackstyle-poster.png.asset.json";
import blackstylePamphlet from "@/assets/blackstyle-pamphlet.png.asset.json";
import blackstylePricing from "@/assets/blackstyle-pricing.png.asset.json";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Ventures & client work by Tozamile Sikhenjana" },
      { name: "description", content: "Ventures and client work by Tozamile Sikhenjana — New Era Dynasty, WireNet, Blackstyle Barbershop, and design work for SoleStride Emporium, April Concepts, and Ntsiki's Community Project." },
      { property: "og:title", content: "Portfolio — New Era Dynasty" },
      { property: "og:description", content: "Ventures in technology, connectivity, and lifestyle, plus brand and design work for clients across Gqeberha." },
    ],
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
];

const ventures = [
  {
    icon: Building2,
    name: "New Era Dynasty",
    tag: "Parent Brand · 2024/0980819/07",
    desc: "The umbrella brand for every discipline — technology, business consulting, creative direction, and community development. A South African brand with global intent.",
    highlights: ["Multidisciplinary practice", "Registered SA company", "Community-first", "Growing team"],
    gradient: "var(--gradient-royal)",
  },
  {
    icon: Network,
    name: "WireNet",
    tag: "Connectivity & Networking",
    desc: "Networking and connectivity solutions built for homes, businesses, and community spaces. WireNet aims to close the digital access gap where it matters most.",
    highlights: ["Fibre & wireless", "Business networks", "Site surveys", "Managed support"],
    gradient: "var(--gradient-quantum)",
  },
  {
    icon: Scissors,
    name: "Blackstyle Barbershop",
    tag: "Lifestyle & Grooming",
    desc: "A modern grooming experience rooted in township pride and professional standards — a physical embodiment of the Dynasty's commitment to community.",
    highlights: ["Signature cuts", "Grooming products", "Community hub", "Apprentice pipeline"],
    gradient: "linear-gradient(135deg, oklch(0.35 0.02 260), oklch(0.12 0.014 260))",
  },
];

function Portfolio() {
  return (
    <PageShell eyebrow="Business Portfolio" title="Ventures under the Dynasty." intro="Three brands. One vision. Each venture is a chapter in a longer story about building meaningful South African businesses.">
      <div className="grid gap-6">
        {ventures.map((v) => {
          const Icon = v.icon;
          return (
            <article key={v.name} className="relative overflow-hidden glass-strong rounded-3xl p-8 md:p-12">
              <div className="absolute inset-0 opacity-25" style={{ background: v.gradient }} />
              <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-royal)] text-primary-foreground shadow-glow-gold">
                  <Icon className="h-7 w-7" />
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
    </PageShell>
  );
}
