import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { LabShell } from "@/components/labs/LabShell";
import {
  ArrowRight,
  BellRing,
  Camera,
  CheckCircle2,
  Lock,
  ScanFace,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  createEmbedding,
  findMatch,
  formatConfidence,
  frameBrightness,
  type Enrolment,
  type MatchResult,
} from "@/lib/facenet-demo";

export const Route = createFileRoute("/labs/civic-facenet")({
  head: () => ({
    meta: [
      { title: "Civic FaceNet demo — try the community safety flow | New Era Dynasty" },
      {
        name: "description",
        content:
          "Try the Civic FaceNet demo: guided onboarding, on-device face template enrolment and matching, plus a simulated panic-button alert. Nothing leaves your browser.",
      },
      { property: "og:title", content: "Civic FaceNet — live demo" },
      {
        property: "og:description",
        content:
          "Enrol a face template, run a match and trigger a simulated alert. All processing happens on your device and is deleted when you leave.",
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
      "Faces are converted into a numeric embedding. The original photograph is discarded, so there is no gallery of pictures to leak or misuse.",
    tags: ["Numeric embeddings", "No image storage"],
  },
  {
    icon: ScanFace,
    title: "3 · Match on request only",
    summary: "Nothing runs continuously — a match is triggered by an incident.",
    detail:
      "When a verified incident is logged, the index compares the incident embedding against enrolled residents and returns a confidence score for a human to review.",
    tags: ["Similarity index", "Human in the loop"],
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

const tour = [
  {
    title: "Welcome to the Civic FaceNet trial",
    body: "You are about to run the real flow, end to end, in your own browser. Everything below is a demo build: nothing is uploaded, stored on a server, or shared.",
  },
  {
    title: "Step 1 — read the flow",
    body: "The left column walks through how the live system works, from opt-in enrolment to committee oversight. Tap any step to read the detail.",
  },
  {
    title: "Step 2 — enrol a template",
    body: "Start the camera, give the entry a name and capture a frame. Your picture is converted into a small numeric template and the picture itself is thrown away.",
  },
  {
    title: "Step 3 — run a match",
    body: "Capture again to search the register. You will get a confidence score and one of three outcomes: match, needs human review, or no match.",
  },
  {
    title: "Step 4 — trigger an alert",
    body: "Finally, try the simulated panic button to see what a resident and the watch group would receive. Nothing is dispatched anywhere.",
  },
];

const fieldClass =
  "w-full rounded-xl border border-border bg-black/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-luxury";

type AuditEntry = { id: string; time: string; text: string };

function CivicFaceNetDemo() {
  const [active, setActive] = useState(0);
  const [panic, setPanic] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  const step = steps[active];
  const Icon = step.icon;

  const log = useCallback((text: string) => {
    setAudit((current) =>
      [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }),
          text,
        },
        ...current,
      ].slice(0, 8),
    );
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      log("Camera started on this device");
    } catch {
      setCameraError(
        "The camera could not be opened. Allow camera access in your browser, or try a different device.",
      );
    }
  };

  const capture = (): { embedding: number[]; brightness: number } | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    const side = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = side;
    canvas.height = side;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(
      video,
      (video.videoWidth - side) / 2,
      (video.videoHeight - side) / 2,
      side,
      side,
      0,
      0,
      side,
      side,
    );
    const frame = context.getImageData(0, 0, side, side);
    // The pixels are used once and never retained beyond this call.
    return { embedding: createEmbedding(frame), brightness: frameBrightness(frame) };
  };

  const handleEnrol = () => {
    const captured = capture();
    if (!captured) return;
    if (captured.brightness < 0.12) {
      log("Enrolment rejected — frame too dark, move into better light");
      return;
    }
    const entry: Enrolment = {
      id: `${Date.now()}`,
      name: name.trim() || `Resident ${enrolments.length + 1}`,
      embedding: captured.embedding,
      enrolledAt: Date.now(),
    };
    setEnrolments((current) => [...current, entry]);
    setName("");
    setResult(null);
    log(`Template enrolled for ${entry.name} — source frame discarded`);
  };

  const handleMatch = () => {
    const captured = capture();
    if (!captured) return;
    const outcome = findMatch(captured.embedding, enrolments);
    setResult(outcome);
    log(
      outcome.decision === "match"
        ? `Match returned: ${outcome.match?.name} at ${formatConfidence(outcome.confidence)}`
        : outcome.decision === "review"
          ? `Low confidence ${formatConfidence(outcome.confidence)} — referred for human review`
          : "No match found in the register",
    );
  };

  const clearAll = () => {
    setEnrolments([]);
    setResult(null);
    log("Register cleared — every template deleted from this browser");
  };

  return (
    <LabShell
      eyebrow="Live demo · Civic tech"
      title="Civic FaceNet."
      intro="Walk through the community safety flow, then run it yourself: enrol a face template, search the register and trigger a simulated alert."
      notice="Demo-only build. Face processing happens entirely on your device, the captured picture is discarded immediately, templates live in this page's memory only and disappear the moment you close or refresh the tab. Nothing is uploaded and no real responder is dispatched."
    >
      {tourStep !== null && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-md rounded-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.25em] text-primary">
                Walkthrough · {tourStep + 1} of {tour.length}
              </span>
              <button
                type="button"
                onClick={() => setTourStep(null)}
                className="text-muted-foreground hover:text-primary transition-luxury"
                aria-label="Close walkthrough"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 font-display text-2xl text-foreground">{tour[tourStep].title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{tour[tourStep].body}</p>
            <div className="mt-5 flex items-center gap-1.5">
              {tour.map((item, index) => (
                <span
                  key={item.title}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= tourStep ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {tourStep > 0 && (
                <button
                  type="button"
                  onClick={() => setTourStep(tourStep - 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setTourStep(tourStep === tour.length - 1 ? null : tourStep + 1)
                }
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
              >
                {tourStep === tour.length - 1 ? "Start the demo" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTourStep(null)}
                className="text-xs text-muted-foreground hover:text-primary transition-luxury"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setTourStep(0)}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury"
        >
          <ScanFace className="h-4 w-4" /> Replay the walkthrough
        </button>
        <span className="rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Demo mode · on-device only
        </span>
      </div>

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
              Face templates · runs on your device
            </div>
            <h2 className="mt-2 font-display text-2xl text-foreground">Try enrolment and matching</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Turn on your camera, enrol yourself as a resident, then run a search against the
              register. The captured frame is converted to a 144-value template and immediately
              discarded.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="relative overflow-hidden rounded-2xl border border-border bg-black/60 aspect-square">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`h-full w-full object-cover -scale-x-100 ${cameraOn ? "" : "opacity-0"}`}
                  />
                  {!cameraOn && (
                    <div className="absolute inset-0 grid place-items-center text-center px-6">
                      <p className="text-xs text-muted-foreground">
                        Camera is off. Nothing is captured until you start it.
                      </p>
                    </div>
                  )}
                  {cameraOn && (
                    <div className="pointer-events-none absolute inset-8 rounded-[40%] border border-primary/50" />
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {cameraOn ? (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                    >
                      <X className="h-4 w-4" /> Stop camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
                    >
                      <Camera className="h-4 w-4" /> Start camera
                    </button>
                  )}
                </div>
                {cameraError && (
                  <p className="mt-3 text-xs text-destructive">{cameraError}</p>
                )}
              </div>

              <div className="grid gap-4">
                <label>
                  <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Resident name
                  </span>
                  <input
                    className={fieldClass}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter a name for this template"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setConsent((value) => !value)}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-luxury ${
                    consent ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${consent ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    I consent to this demo processing a frame from my camera on my own device.
                  </span>
                </button>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!cameraOn || !consent}
                    onClick={handleEnrol}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury disabled:opacity-40"
                  >
                    <Users className="h-4 w-4" /> Enrol template
                  </button>
                  <button
                    type="button"
                    disabled={!cameraOn || !consent || enrolments.length === 0}
                    onClick={handleMatch}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-luxury disabled:opacity-40"
                  >
                    <ScanFace className="h-4 w-4" /> Run a match
                  </button>
                  {enrolments.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-destructive hover:text-destructive transition-luxury"
                    >
                      <Trash2 className="h-4 w-4" /> Delete all
                    </button>
                  )}
                </div>

                {result && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      result.decision === "match"
                        ? "border-primary/40 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <p>
                      {result.decision === "match"
                        ? `Match: ${result.match?.name}`
                        : result.decision === "review"
                          ? `Possible match: ${result.match?.name} — needs human review`
                          : "No match in the register"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Confidence {formatConfidence(result.confidence)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Register · {enrolments.length} template{enrolments.length === 1 ? "" : "s"}
                  </p>
                  <ul className="mt-2 grid gap-2">
                    {enrolments.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center justify-between rounded-xl glass px-3 py-2 text-xs text-foreground"
                      >
                        <span>{entry.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEnrolments((current) =>
                              current.filter((item) => item.id !== entry.id),
                            );
                            setResult(null);
                            log(`${entry.name} withdrew — template deleted`);
                          }}
                          className="text-muted-foreground hover:text-destructive transition-luxury"
                          aria-label={`Delete template for ${entry.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                    {enrolments.length === 0 && (
                      <li className="text-xs text-muted-foreground">
                        No templates yet. Enrol one to enable matching.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
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
              onClick={() => {
                setPanic(true);
                log("Panic alert simulated — audit entry written");
              }}
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

          <article className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.25em] text-primary">Audit log</div>
            <h2 className="mt-2 font-display text-2xl text-foreground">Every action is recorded</h2>
            <ul className="mt-4 grid gap-2">
              {audit.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl glass px-4 py-3 text-xs text-muted-foreground"
                >
                  <span className="text-foreground">{entry.time}</span> · {entry.text}
                </li>
              ))}
              {audit.length === 0 && (
                <li className="text-xs text-muted-foreground">
                  Nothing yet. Actions you take in this demo appear here, the way the oversight
                  committee would see them.
                </li>
              )}
            </ul>
          </article>
        </div>
      </div>
    </LabShell>
  );
}
