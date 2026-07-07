import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — New Era Dynasty" },
      { name: "description", content: "Visual snapshots of the Dynasty — technology, entrepreneurship, community, and craft." },
      { property: "og:title", content: "Gallery — New Era Dynasty" },
      { property: "og:description", content: "Abstract visuals inspired by technology, business, networking, and community." },
    ],
  }),
  component: Gallery,
});

const gradients = [
  "var(--gradient-royal)",
  "var(--gradient-quantum)",
  "linear-gradient(135deg, oklch(0.4 0.03 260), oklch(0.15 0.014 260))",
  "linear-gradient(160deg, oklch(0.72 0.18 250 / 0.6), oklch(0.11 0.014 260))",
  "linear-gradient(135deg, oklch(0.82 0.14 85 / 0.55), oklch(0.13 0.014 260))",
  "linear-gradient(200deg, oklch(0.55 0.08 60 / 0.5), oklch(0.11 0.014 260))",
];
const labels = ["Code & Craft", "Business Growth", "Community", "Innovation", "Music & Culture", "Discipline"];

function Gallery() {
  return (
    <PageShell eyebrow="Gallery" title="Visual chapters of the Dynasty." intro="Abstract, tech-inspired visuals — mood boards for the work, the vision, and the journey.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gradients.map((g, i) => (
          <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-3xl glass">
            <div className="absolute inset-0 transition-luxury group-hover:scale-105" style={{ background: g }} />
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-primary">Chapter {i + 1}</div>
              <div className="mt-1 font-display text-2xl text-foreground">{labels[i]}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
