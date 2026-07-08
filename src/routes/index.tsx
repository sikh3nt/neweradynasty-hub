import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Rocket, Cpu, Code2, Shield, Palette, TrendingUp, Music4, Dumbbell, Briefcase, Users, GraduationCap, Sparkles, Star, Quote } from "lucide-react";
import { AnimatedStat } from "@/components/site/AnimatedStat";
import { StarRating } from "@/components/site/StarRating";
import { SITE } from "@/lib/site";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Review = {
  id: string; full_name: string; company: string | null; service_received: string | null;
  rating: number; body: string; avatar_url: string | null; verified: boolean; featured: boolean;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tozamile Sikhenjana — Founder & CEO of New Era Dynasty" },
      { name: "description", content: "Multidisciplinary entrepreneur from Motherwell, Gqeberha. Technology, business, community. Founder of New Era Dynasty, WireNet, and Blackstyle Barbershop." },
      { property: "og:title", content: "Tozamile Sikhenjana — Founder & CEO of New Era Dynasty" },
      { property: "og:description", content: "Multidisciplinary entrepreneur from Motherwell, Gqeberha. Technology, business, community. Founder of New Era Dynasty, WireNet, and Blackstyle Barbershop." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/" }],
  component: Home,
});

const services = [
  { icon: Code2, title: "Programming", desc: "Full-stack engineering across modern languages and frameworks." },
  { icon: Rocket, title: "Website Development", desc: "Premium sites & web apps that convert and scale." },
  { icon: Shield, title: "Cybersecurity", desc: "Hardening, audits, and secure-by-design implementations." },
  { icon: Cpu, title: "Artificial Intelligence", desc: "AI features, automations, and intelligent workflows." },
  { icon: Palette, title: "Graphic Design", desc: "Brand identity, print, and digital creative direction." },
  { icon: TrendingUp, title: "Trading", desc: "Disciplined market strategies and educational insights." },
  { icon: Music4, title: "DJ & Entertainment", desc: "Curated sets and event entertainment across SA." },
  { icon: Dumbbell, title: "Boxing & Kickboxing", desc: "Discipline, resilience, and performance coaching." },
];

const timeline = [
  { year: "Motherwell", title: "The Beginning", desc: "Grew up in Motherwell, Gqeberha — where hustle meets heart." },
  { year: "Self-Taught", title: "Years of Learning", desc: "Programming, design, business, security, trading — all self-taught with discipline." },
  { year: "2023", title: "First Ventures", desc: "Launched Blackstyle Barbershop and started serving the community." },
  { year: "2024", title: "New Era Dynasty", desc: "Registered New Era Dynasty (2024/0980819/07) — one brand, many disciplines." },
  { year: "2024+", title: "WireNet", desc: "Founded WireNet — connecting people, businesses, and infrastructure." },
  { year: "Today", title: "One Legacy", desc: "Building technology, business, and community impact from South Africa to the world." },
];

function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    supabase.from("reviews").select("id, full_name, company, service_received, rating, body, avatar_url, verified, featured")
      .eq("status", "approved").order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => setReviews((data ?? []) as Review[]));
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden hero-bg pt-32 sm:pt-40 pb-24">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl float-slow" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl float-slow" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Founder · CEO · Multidisciplinary
          </div>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.98]">
            <span className="text-foreground">Tozamile</span>{" "}
            <span className="text-gold-gradient">Sikhenjana</span>
          </h1>
          <p className="mt-6 max-w-3xl font-display text-xl sm:text-2xl md:text-3xl text-silver/90 italic">
            "{SITE.slogan}"
          </p>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
            Founder & CEO of <span className="text-primary">New Era Dynasty</span> — a multidisciplinary technology and business brand
            building innovation, entrepreneurship, and community impact from Motherwell, Gqeberha to the world.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury">
              Explore the Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:border-primary transition-luxury">
              Start a project
            </Link>
            <a href="/cv/Tozamile-Sikhenjana-CV.pdf" download className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:border-primary hover:text-primary transition-luxury">
              Download CV
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <AnimatedStat value={3} label="Businesses Founded" icon={<Briefcase className="h-5 w-5" />} />
          <AnimatedStat value={25} label="Projects Completed" icon={<Rocket className="h-5 w-5" />} />
          <AnimatedStat value={12} label="Technologies Learned" icon={<Cpu className="h-5 w-5" />} />
          <AnimatedStat value={6} label="Years Self-Learning" icon={<GraduationCap className="h-5 w-5" />} />
          <AnimatedStat value={8} label="Services Offered" icon={<Sparkles className="h-5 w-5" />} />
          <AnimatedStat value={5} label="Ongoing Projects" icon={<Users className="h-5 w-5" />} />
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28">
        <SectionHeader eyebrow="Disciplines" title="One brand. Many disciplines." intro="A multidisciplinary practice built on technology, business, creativity, and discipline — each service delivered with the standard of a growing SA-born global brand." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group glass rounded-2xl p-6 transition-luxury hover:shadow-glow-gold hover:-translate-y-1">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-[image:var(--gradient-royal)] group-hover:text-primary-foreground transition-luxury">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-5 font-display text-xl text-foreground">{title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">See all services <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28">
        <SectionHeader eyebrow="The Journey" title="From Motherwell to the World" intro="An interactive journey through the milestones that shaped the Dynasty." />
        <div className="mt-14 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[image:var(--gradient-royal)] opacity-60" />
          <div className="grid gap-10">
            {timeline.map((t, i) => (
              <div key={t.year} className={`relative grid md:grid-cols-2 gap-6 md:gap-16 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}>
                <div className="pl-12 md:pl-0 md:text-right md:pr-8">
                  <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-widest text-primary">{t.year}</div>
                </div>
                <div className="pl-12 md:pl-8 relative">
                  <span className="absolute -left-1 md:left-[-9px] top-2 h-4 w-4 rounded-full bg-[image:var(--gradient-royal)] shadow-glow-gold pulse-glow" />
                  <div className="glass rounded-2xl p-6">
                    <div className="font-display text-xl text-foreground">{t.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28">
        <SectionHeader eyebrow="Portfolio" title="Building the Dynasty" intro="A growing portfolio of ventures spanning technology, connectivity, and lifestyle." />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            { name: "New Era Dynasty", tag: "Parent Brand", desc: "A multidisciplinary technology & business brand.", gradient: "var(--gradient-royal)" },
            { name: "WireNet", tag: "Connectivity", desc: "Networking, connectivity and infrastructure for communities.", gradient: "var(--gradient-quantum)" },
            { name: "Blackstyle Barbershop", tag: "Lifestyle", desc: "A modern grooming experience rooted in township pride.", gradient: "linear-gradient(135deg, oklch(0.4 0.02 260), oklch(0.15 0.014 260))" },
          ].map((p) => (
            <Link key={p.name} to="/portfolio" className="group relative overflow-hidden rounded-3xl glass p-8 transition-luxury hover:shadow-elegant hover:-translate-y-1">
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-luxury" style={{ background: p.gradient }} />
              <div className="relative">
                <div className="text-xs uppercase tracking-[0.25em] text-primary">{p.tag}</div>
                <div className="mt-4 font-display text-3xl text-foreground">{p.name}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-sm text-primary">Explore <ArrowRight className="h-4 w-4" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28">
        <SectionHeader eyebrow="Testimonials" title="Trusted by clients & community" intro="Verified reviews from clients and collaborators." />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(reviews.length ? reviews : placeholderReviews).map((r) => (
            <div key={r.id} className="glass rounded-2xl p-6">
              <Quote className="h-6 w-6 text-primary" />
              <p className="mt-3 text-sm text-foreground leading-relaxed">{r.body}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    {r.full_name}
                    {r.verified && <span className="text-[10px] uppercase tracking-widest rounded-full bg-primary/15 text-primary px-2 py-0.5">Verified</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{r.company ?? r.service_received}</div>
                </div>
                <StarRating value={r.rating} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/testimonials" className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold">Leave a review</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-28">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-16 text-center">
          <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl text-foreground">Build the next chapter with the Dynasty.</h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">Whether it's technology, business, or creative work — let's turn your idea into a legacy.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="rounded-full bg-[image:var(--gradient-royal)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold">Start a project</Link>
              <Link to="/auth" className="rounded-full border border-border px-6 py-3 text-sm hover:border-primary">Client Portal</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</div>
      <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl text-foreground">{title}</h2>
      {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
    </div>
  );
}

const placeholderReviews: Review[] = [
  { id: "1", full_name: "Sample Client", company: "Local Business", service_received: "Website Development", rating: 5, body: "Reviews from real clients will appear here once approved from the admin dashboard.", avatar_url: null, verified: false, featured: false },
];
