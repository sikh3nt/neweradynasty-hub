import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Compass, Eye, Diamond, Flag, Users, Briefcase, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "Vision, Mission & Values — New Era Dynasty" },
      { name: "description", content: "The mission, vision, core values, future goals, and community development commitments behind New Era Dynasty." },
      { property: "og:title", content: "Vision & Values — New Era Dynasty" },
      { property: "og:description", content: "Purpose over profit. Legacy over shortcuts." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/vision" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/vision" }],
  component: Vision,
});

const blocks = [
  { icon: Compass, title: "My Mission", body: "To build technology, businesses, and creative work that lift South African communities — starting from Motherwell and reaching outward." },
  { icon: Eye, title: "My Vision", body: "A future where young Africans see entrepreneurship, engineering, and creativity as birthrights — not exceptions." },
  { icon: Diamond, title: "Core Values", body: "Integrity. Discipline. Excellence. Innovation. Community. Legacy." },
  { icon: Flag, title: "Future Goals", body: "Grow New Era Dynasty into a continental multidisciplinary brand across technology, connectivity, and lifestyle." },
  { icon: Users, title: "Community Development", body: "Reinvest into apprenticeships, mentorship, and access — every business under the Dynasty must give back." },
  { icon: Briefcase, title: "Entrepreneurship", body: "Build businesses that create dignity — for founders, employees, and the communities they operate in." },
  { icon: GraduationCap, title: "Lifelong Learning", body: "Never stop learning. Skills compound. Discipline compounds. So does impact." },
];

function Vision() {
  return (
    <PageShell eyebrow="Vision" title="Purpose over profit. Legacy over shortcuts.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blocks.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass rounded-2xl p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-4 font-display text-lg text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
