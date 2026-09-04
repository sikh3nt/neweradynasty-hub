import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { SITE } from "@/lib/site";
import { Compass, Target, Heart, Users, Download } from "lucide-react";
import cvAsset from "@/assets/tozamile-cv.pdf.asset.json";
import { trackDemoEvent } from "@/lib/analytics";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Tozamile Sikhenjana | New Era Dynasty" },
      { name: "description", content: "The story behind Tozamile Sikhenjana, Founder & CEO of New Era Dynasty — a self-taught, multidisciplinary entrepreneur from Motherwell, Gqeberha." },
      { property: "og:title", content: "About Tozamile Sikhenjana" },
      { property: "og:description", content: "Founder & CEO of New Era Dynasty. From Motherwell to the world." },
          { property: "og:url", content: "https://neweradynasty-hub.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/about" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://neweradynasty-hub.lovable.app/about#person",
        name: "Tozamile Sikhenjana",
        jobTitle: "Founder & CEO",
        worksFor: { "@id": "https://neweradynasty-hub.lovable.app/#organization" },
        url: "https://neweradynasty-hub.lovable.app/about",
        address: { "@type": "PostalAddress", addressLocality: "Motherwell, Gqeberha", addressRegion: "Eastern Cape", addressCountry: "ZA" },
        email: "tozamilesikh3njana@proton.me",
        knowsAbout: ["Programming", "Web Development", "Cybersecurity", "Artificial Intelligence", "Graphic Design", "Trading", "Entrepreneurship"],
      }),
    }],
  }),
  component: About,
});

function About() {
  return (
    <PageShell eyebrow="About" title="A story of skill, business & legacy." intro="Born in Motherwell, Gqeberha — driven by the belief that discipline, self-learning, and community can build a dynasty that outlasts any single project.">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl text-foreground">My Story</h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            I grew up in Motherwell, a township on the outskirts of Gqeberha, Eastern Cape. Like many young South Africans,
            I learned early that opportunity is rarely handed over — it has to be built. I taught myself programming, design,
            cybersecurity, trading, and business through countless nights, YouTube tutorials, documentation, and stubborn practice.
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            In 2024 I formalised the vision as <span className="text-primary">New Era Dynasty</span> (Reg. {SITE.regNumber}) —
            a multidisciplinary brand that reflects everything I care about: technology, entrepreneurship, community, creativity,
            and discipline. It is not just a company; it is a legacy in motion.
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="font-display text-2xl text-foreground">Founder & CEO</h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            As Founder & CEO, my role is to protect the vision, uphold the standard, and open doors for the next generation of
            builders in South Africa. I lead every project personally and I hold every deliverable to the standard I would want as a client.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground">Company</dt><dd className="text-foreground">New Era Dynasty</dd></div>
            <div><dt className="text-muted-foreground">Registration</dt><dd className="text-foreground">{SITE.regNumber}</dd></div>
            <div><dt className="text-muted-foreground">Based in</dt><dd className="text-foreground">{SITE.location}</dd></div>
            <div><dt className="text-muted-foreground">Role</dt><dd className="text-foreground">Founder & CEO</dd></div>
          </dl>
        </div>
      </div>

      <section className="glass mt-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl p-8">
        <div>
          <h2 className="font-display text-2xl text-foreground">Thinking of hiring me?</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Download my full CV for a detailed view of my skills, experience, projects and
            qualifications — everything you need to decide with confidence.
          </p>
        </div>
        <a
          href={cvAsset.url}
          download="Tozamile-Sikhenjana-CV.pdf"
          onClick={() => trackDemoEvent("export", "cv", "cv-download-about")}
          className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow-gold"
        >
          <Download className="h-4 w-4" /> Download my CV (PDF)
        </a>
      </section>



      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Compass, title: "Leadership Philosophy", desc: "Lead by example. Serve the mission. Elevate the people around you." },
          { icon: Target, title: "Future Goals", desc: "Grow the Dynasty into a continental brand across tech, business, and community." },
          { icon: Heart, title: "Core Values", desc: "Integrity. Discipline. Excellence. Innovation. Community. Legacy." },
          { icon: Users, title: "Community Vision", desc: "Every skill I build is a doorway I want to open for another young African." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass rounded-2xl p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
            <div className="mt-4 font-display text-lg">{title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
