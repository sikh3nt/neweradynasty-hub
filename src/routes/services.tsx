import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Code2, Rocket, Shield, Cpu, Palette, TrendingUp, Music4, Dumbbell } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Technology, Business, Creative | New Era Dynasty" },
      { name: "description", content: "Programming, website development, cybersecurity, AI, graphic design, trading, DJ & entertainment, boxing & kickboxing." },
      { property: "og:title", content: "Services — New Era Dynasty" },
      { property: "og:description", content: "Multidisciplinary services delivered with a founder's standard." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/services" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
          "Programming", "Website Development", "Cybersecurity", "Artificial Intelligence",
          "Graphic Design", "Trading", "DJ & Entertainment", "Boxing & Kickboxing",
        ].map((name, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name,
            provider: { "@id": "https://neweradynasty-hub.lovable.app/#organization" },
            areaServed: "ZA",
          },
        })),
      }),
    }],
  }),
  component: Services,
});

const services = [
  { icon: Code2, title: "Programming", desc: "Modern full-stack engineering — TypeScript, React, Node, Python, SQL. Clean, maintainable, and production-ready.", tech: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL"] },
  { icon: Rocket, title: "Website Development", desc: "High-conversion websites, web applications, and dashboards. SEO-ready, accessible, and beautifully designed.", tech: ["Next.js", "TanStack", "Tailwind", "Supabase"] },
  { icon: Shield, title: "Cybersecurity", desc: "Security audits, hardening, and secure architecture for small business and startups. Peace of mind first.", tech: ["OWASP", "Auth", "Pen-testing", "RLS"] },
  { icon: Cpu, title: "Artificial Intelligence", desc: "AI features, chatbots, automations, and intelligent workflows tailored to your business use-case.", tech: ["LLMs", "RAG", "Automation", "Agents"] },
  { icon: Palette, title: "Graphic Design", desc: "Brand identity, logos, print design, and digital creative — from concept to delivery.", tech: ["Branding", "Print", "Social", "UI"] },
  { icon: TrendingUp, title: "Trading", desc: "Disciplined market strategies, risk-first mindset, and education for aspiring traders.", tech: ["Forex", "Indices", "Risk", "Mentorship"] },
  { icon: Music4, title: "DJ & Entertainment", desc: "Curated sets and event entertainment — private, corporate, and community.", tech: ["Weddings", "Corporate", "Events"] },
  { icon: Dumbbell, title: "Boxing & Kickboxing", desc: "Coaching in discipline, resilience, and physical performance for youth and adults.", tech: ["Fitness", "Discipline", "Youth"] },
];

function Services() {
  return (
    <PageShell eyebrow="Services" title="Multidisciplinary. Uncompromising." intro="Every service is delivered with the same founder-led standard — regardless of scale.">
      <div className="grid gap-6 md:grid-cols-2">
        {services.map(({ icon: Icon, title, desc, tech }) => (
          <div key={title} className="glass rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <h2 className="font-display text-xl text-foreground">{title}</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tech.map((t) => <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">{t}</span>)}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Link to="/contact" search={{ service: title } as never} className="rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-xs font-medium text-primary-foreground">Request quote</Link>
              <Link to="/testimonials" className="text-xs text-primary hover:underline">Leave a review</Link>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
