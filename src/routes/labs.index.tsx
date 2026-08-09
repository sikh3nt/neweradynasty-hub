import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import {
  ArrowRight,
  Calculator,
  FileText,
  CandlestickChart,
  Truck,
  Boxes,
  ShieldCheck,
  Tv,
} from "lucide-react";

export const Route = createFileRoute("/labs/")({
  head: () => ({
    meta: [
      { title: "Labs — Try my software live | Tozamile Sikhenjana" },
      {
        name: "description",
        content:
          "Test the tools I have built — scientific calculator, CV builder, trading bot replay and more. Run them in your browser, nothing to install.",
      },
      { property: "og:title", content: "Labs — Live demos by New Era Dynasty" },
      {
        property: "og:description",
        content:
          "Interactive, in-browser demos of the software I build: calculators, CV tools, trading automation and civic tech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs" }],
  }),
  component: Labs,
});

type Demo = {
  icon: typeof Calculator;
  eyebrow: string;
  name: string;
  desc: string;
  tags: string[];
  to?: "/labs/calculator" | "/labs/cv-builder" | "/labs/amd-bot";
  status: "live" | "soon";
};

const demos: Demo[] = [
  {
    icon: Calculator,
    eyebrow: "Utility",
    name: "Scientific calculator",
    desc: "A full scientific calculator with trig, logs, exponents, factorials, memory and a degree/radian toggle — running exactly as built.",
    tags: ["Fully functional", "No sign-in"],
    to: "/labs/calculator",
    status: "live",
  },
  {
    icon: FileText,
    eyebrow: "Career tool",
    name: "CV / résumé builder",
    desc: "Fill in a guided form, pick a template and download a finished CV as PDF or Word. Everything stays in your browser.",
    tags: ["Fully functional", "PDF & DOC export"],
    to: "/labs/cv-builder",
    status: "live",
  },
  {
    icon: CandlestickChart,
    eyebrow: "Automation · Forex",
    name: "AMD trading bot replay",
    desc: "Replay market candles and watch the accumulation–manipulation–distribution engine mark setups, entries, exits and running P&L.",
    tags: ["Simulated market data", "Demo only"],
    to: "/labs/amd-bot",
    status: "live",
  },
  {
    icon: Truck,
    eyebrow: "Local delivery",
    name: "SwiftDrop",
    desc: "Describe an errand, set pickup and drop-off, get a live fee quote and follow a simulated driver through every stage.",
    tags: ["Interactive flow", "No real orders"],
    status: "soon",
  },
  {
    icon: Boxes,
    eyebrow: "Hospitality",
    name: "469 Premium bar stock tracker",
    desc: "Run a full stock count against par levels — opening, closing and wastage — then export the shift report as CSV.",
    tags: ["Interactive flow", "CSV export"],
    status: "soon",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Civic tech",
    name: "Civic FaceNet walkthrough",
    desc: "A guided concept walkthrough of the community safety system, including the panic-button flow. No biometric data is captured from visitors.",
    tags: ["Concept demo", "No face scanning"],
    status: "soon",
  },
  {
    icon: Tv,
    eyebrow: "Media & streaming",
    name: "Ndingubani TV",
    desc: "A preview of the branded live-streaming channel built for a client — hero stream, ticker, schedule strip and episode gallery.",
    tags: ["Client project", "Preview"],
    status: "soon",
  },
];

function Labs() {
  return (
    <PageShell
      eyebrow="Labs"
      title="Try my work, don't just read about it."
      intro="Every tool below runs in your browser. Nothing to download, nothing to install, and nothing you enter is saved anywhere."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {demos.map((d) => {
          const Icon = d.icon;
          return (
            <article key={d.name} className="glass-strong rounded-3xl p-6 md:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    d.status === "live"
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "glass text-muted-foreground"
                  }`}
                >
                  {d.status === "live" ? "Live" : "Coming soon"}
                </span>
              </div>
              <div className="mt-5 text-xs uppercase tracking-[0.25em] text-primary">
                {d.eyebrow}
              </div>
              <h2 className="mt-2 font-display text-2xl text-foreground">{d.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground flex-1">{d.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {d.tags.map((t) => (
                  <span key={t} className="rounded-full glass px-3 py-1 text-xs text-foreground">
                    {t}
                  </span>
                ))}
              </div>
              {d.to ? (
                <Link
                  to={d.to}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury"
                >
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
                  Demo in build
                </span>
              )}
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
