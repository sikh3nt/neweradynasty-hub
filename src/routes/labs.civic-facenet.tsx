import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LabShell } from "@/components/labs/LabShell";
import { ArrowRight, BellRing, Lock, ScanFace, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/labs/civic-facenet")({
  head: () => ({
    meta: [
      { title: "Civic FaceNet walkthrough — community safety concept | New Era Dynasty" },
      {
        name: "description",
        content:
          "A guided walkthrough of the Civic FaceNet community safety concept, including the panic-button flow. No cameras, no scanning, no data captured.",
      },
      { property: "og:title", content: "Civic FaceNet — concept walkthrough" },
      {
        property: "og:description",
        content:
          "See how the community safety system is designed to work, step by step, with privacy and consent built in.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/civic-facenet" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/civic-facenet" }],
  }),
  component: CivicFaceNetDemo,
});

type Step = {
  icon: typeof ScanFace;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
};

const steps: Step[] = [
  {
    icon: Users,
    title: "1 · Opt-in enrolment",
    summary: "Residents choose to join at a community meeting.",
    detail:
      "Enrolment happens in person with a signed consent form. A resident can withdraw at any time, and withdrawal deletes their record rather than archiving it.",
    tags: ["Written consent", "Right to withdraw"],
  },
  {
    icon: Lock,
    title: "2 · Template, not photographs",
    summary: "The system stores a mathematical template, never an image.",
    detail:
      "Faces are converted into a numeric embedding using DeepFace. The original photograph is discarded, so there is no gallery of pictures to leak or misuse.",
    tags: ["DeepFace embeddings", "No image storage"],
  },
  {
    icon: ScanFace,
    title: "3 · Match on request only",
    summary: "Nothing runs continuously — a match is triggered by an incident.",
    detail:
      "When a verified incident is logged, a FAISS index compares the incident embedding against enrolled residents and returns a confidence score for a human to review.",
    tags: ["FAISS index", "Human in the loop"],
  },
  {
    icon: BellRing,
    title: "4 · Panic button",
    summary: "A resident triggers an alert from their phone.",
    detail:
      "The alert carries a location and a short description to the neighbourhood watch group and the nearest responder, with an audit entry written for every dispatch.",
    tags: ["Location share", "Audit trail"],
  },
  {
    icon: ShieldCheck,
    title: "5 · Oversight and review",
    summary: "Every search is logged and reviewed by the committee.",
    detail:
      "A monthly report lists who searched, why, and what the outcome was. Unexplained searches suspend the operator's access until the committee reviews it.",
    tags: ["POPIA-minded", "Monthly reporting"],
  },
];

function CivicFaceNetDemo() {
  const [active, setActive] = useState(0);
  const [panic, setPanic] = useState(false);
  const step = steps[active];
  const Icon = step.icon;

  return (
    <LabShell
      eyebrow="Concept walkthrough · Civic tech"
      title="Civic FaceNet."
      intro="A step-by-step walkthrough of how the community safety system is designed to work, from opt-in enrolment through to oversight."
      notice="This is a concept walkthrough. Your camera is never accessed, no face scanning happens here and nothing about you is captured."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <ol className="grid gap-3">
          {steps.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-luxury ${
                  index === active
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="block text-sm text-foreground">{item.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{item.summary}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="grid gap-6">
          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 font-display text-2xl text-foreground">{step.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{step.detail}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {step.tags.map((tag) => (
                <span key={tag} className="rounded-full glass px-3 py-1 text-xs text-foreground">
                  {tag}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((current) => (current + 1) % steps.length)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury"
            >
              Next step <ArrowRight className="h-4 w-4" />
            </button>
          </article>

          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.25em] text-primary">
              Panic button · simulated
            </div>
            <h2 className="mt-2 font-display text-2xl text-foreground">Try the alert flow</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Press the button to see what a resident and the watch group would see. Nothing is sent
              anywhere.
            </p>
            <button
              type="button"
              onClick={() => setPanic(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-destructive px-6 py-3 text-sm font-medium text-destructive-foreground hover:brightness-110 transition-luxury"
            >
              <BellRing className="h-4 w-4" /> Trigger simulated alert
            </button>

            {panic && (
              <div className="mt-6 grid gap-3">
                {[
                  "Alert received · 22:14 · Kwazakhele Ward 24",
                  "Location shared with 3 nearby responders",
                  "Watch group notified on the community channel",
                  "Audit entry written — reviewable by the oversight committee",
                ].map((entry) => (
                  <p
                    key={entry}
                    className="rounded-xl glass px-4 py-3 text-xs text-muted-foreground"
                  >
                    {entry}
                  </p>
                ))}
                <button
                  type="button"
                  onClick={() => setPanic(false)}
                  className="w-fit rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                >
                  Reset
                </button>
              </div>
            )}
          </article>
        </div>
      </div>
    </LabShell>
  );
}
