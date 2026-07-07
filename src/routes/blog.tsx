import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Articles — Tozamile Sikhenjana" },
      { name: "description", content: "Insights on entrepreneurship, technology, self-learning, and building from Motherwell." },
      { property: "og:title", content: "Blog & Articles — New Era Dynasty" },
      { property: "og:description", content: "Writings on tech, business, and the township entrepreneurial journey." },
    ],
  }),
  component: Blog,
});

const posts = [
  { title: "How I taught myself to code from Motherwell", date: "Coming soon", tag: "Self-Learning", excerpt: "The mindset, tools, and daily discipline that turned a self-taught learner into a working engineer." },
  { title: "Why I registered New Era Dynasty in 2024", date: "Coming soon", tag: "Entrepreneurship", excerpt: "Formalising the vision — the reasoning, the paperwork, and the responsibility that comes with it." },
  { title: "Cybersecurity for small SA businesses", date: "Coming soon", tag: "Cybersecurity", excerpt: "The bare-minimum security posture every South African small business should have — in plain English." },
];

function Blog() {
  return (
    <PageShell eyebrow="Blog" title="Insights from the journey." intro="Writings on technology, self-learning, and building from the ground up in South Africa.">
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="glass rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-primary">{p.tag}</span>
              <span className="text-xs text-muted-foreground">{p.date}</span>
            </div>
            <h2 className="mt-4 font-display text-xl text-foreground">{p.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm text-primary">Notify me <ArrowRight className="h-4 w-4" /></Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
