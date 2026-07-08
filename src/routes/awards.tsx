import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Award, BadgeCheck, Trophy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Certifications — Tozamile Sikhenjana" },
      { name: "description", content: "Recognitions, certifications, and continuous learning milestones on the Dynasty journey." },
      { property: "og:title", content: "Awards & Certifications" },
      { property: "og:description", content: "A record of continuous learning and recognition." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/awards" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/awards" }],
  component: Awards,
});

const items = [
  { icon: BadgeCheck, title: "New Era Dynasty (Pty) Ltd", detail: "Registered SA company — 2024/0980819/07" },
  { icon: Trophy, title: "Multidisciplinary Founder", detail: "3 active ventures across tech, connectivity & lifestyle" },
  { icon: Sparkles, title: "Self-Taught Engineer", detail: "6+ years of continuous, self-directed learning" },
  { icon: Award, title: "Certifications", detail: "In-progress: web dev, cybersecurity fundamentals, AI/LLM tooling" },
];

function Awards() {
  return (
    <PageShell eyebrow="Awards & Certifications" title="Milestones, not medals." intro="A living record of certifications, milestones, and the discipline of continuous learning.">
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(({ icon: Icon, title, detail }) => (
          <div key={title} className="glass rounded-2xl p-6 flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-royal)] text-primary-foreground shadow-glow-gold"><Icon className="h-5 w-5" /></div>
            <div>
              <h2 className="font-display text-lg text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
