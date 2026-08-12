import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LabShell } from "@/components/labs/LabShell";
import { Bike, Download, MapPin, Package, Play, RotateCcw, Star, Zap } from "lucide-react";
import { trackDemoEvent } from "@/lib/analytics";
import {
  deliveryReceipt,
  deliveryStages,
  formatRand,
  pickDriver,
  quoteDelivery,
  type ParcelSize,
} from "@/lib/swiftdrop";


export const Route = createFileRoute("/labs/swiftdrop")({
  head: () => ({
    meta: [
      { title: "SwiftDrop demo — local delivery app simulation | New Era Dynasty" },
      {
        name: "description",
        content:
          "Try the SwiftDrop delivery flow: describe an errand, get a live fee quote and follow a simulated driver from pickup to drop-off.",
      },
      { property: "og:title", content: "SwiftDrop — local delivery demo" },
      {
        property: "og:description",
        content:
          "A simulated errand-running app with live quoting and driver tracking, built by Tozamile Sikhenjana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/swiftdrop" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/swiftdrop" }],
  }),
  component: SwiftDropDemo,
});

const sizes: { id: ParcelSize; label: string; hint: string }[] = [
  { id: "small", label: "Small", hint: "Documents, keys, a takeaway order" },
  { id: "medium", label: "Medium", hint: "Grocery bag, shoebox, laptop" },
  { id: "large", label: "Large", hint: "Crate, appliance, bulk order" },
];

const fieldClass =
  "w-full rounded-xl border border-border bg-black/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-luxury";

const tipOptions = [0, 10, 20, 35];

function SwiftDropDemo() {
  const [pickup, setPickup] = useState("469 Premium, Kwazakhele");
  const [dropoff, setDropoff] = useState("Baywest Mall, Gqeberha");
  const [distance, setDistance] = useState(6);
  const [size, setSize] = useState<ParcelSize>("medium");
  const [express, setExpress] = useState(false);
  const [peak, setPeak] = useState(false);
  const [tip, setTip] = useState(10);
  const [stage, setStage] = useState(-1);

  const surge = peak ? 1.4 : 1;
  const quote = useMemo(
    () => quoteDelivery({ distanceKm: distance, size, express, surge, tip }),
    [distance, size, express, surge, tip],
  );
  const driver = useMemo(() => pickDriver(distance, size), [distance, size]);
  const reference = useMemo(
    () => `SD-${String(Math.round(distance * 100)).padStart(4, "0")}-${size.slice(0, 2).toUpperCase()}`,
    [distance, size],
  );

  useEffect(() => {
    if (stage < 0 || stage >= deliveryStages.length - 1) return;
    const timer = window.setTimeout(() => setStage((current) => current + 1), 1800);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const tracking = stage >= 0;
  const delivered = stage === deliveryStages.length - 1;
  const progress = tracking ? ((stage + 1) / deliveryStages.length) * 100 : 0;

  const requestDriver = (): void => {
    setStage(0);
    trackDemoEvent("demo_action", "swiftdrop", `request:${size}${express ? ":express" : ""}`);
  };

  const downloadReceipt = (): void => {
    const text = deliveryReceipt({ pickup, dropoff, quote, driver, reference });
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `swiftdrop-${reference.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    trackDemoEvent("export", "swiftdrop", "receipt");
  };



  return (
    <LabShell
      demo="swiftdrop"
      eyebrow="Live demo · Local delivery"
      title="SwiftDrop."
      intro="Describe an errand, watch the fee update as you change the job, then follow a driver through every stage of the delivery."
      notice="Simulated only. No real driver is dispatched and no payment is taken."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <h2 className="font-display text-2xl text-foreground">Book an errand</h2>

          <div className="mt-6 grid gap-4">
            <label>
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Pickup
              </span>
              <input
                className={fieldClass}
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Drop-off
              </span>
              <input
                className={fieldClass}
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </label>

            <div>
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Distance — {distance.toFixed(1).replace(".", ",")} km
              </span>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-primary"
                aria-label="Distance in kilometres"
              />
            </div>

            <div>
              <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Parcel size
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {sizes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSize(option.id)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-luxury ${
                      size === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="block text-sm text-foreground">{option.label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{option.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpress((value) => !value)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-luxury ${
                express ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Zap className="h-4 w-4 text-primary" /> Express priority
              </span>
              <span className="text-xs text-muted-foreground">
                {express ? "On · +35%" : "Off"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground">Your quote</h2>
            <dl className="mt-5 grid gap-2 text-sm">
              {[
                ["Base fee", quote.baseFee],
                [`Distance · ${distance.toFixed(1).replace(".", ",")} km`, quote.distanceFee],
                ["Parcel size", quote.sizeFee],
                ["Express", quote.expressFee],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-muted-foreground">
                  <dt>{label}</dt>
                  <dd>{formatRand(Number(value))}</dd>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-3 text-base text-foreground">
                <dt>Total</dt>
                <dd className="text-primary">{formatRand(quote.total)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Estimated arrival in about {quote.etaMinutes} minutes.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStage(0)}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
              >
                <Play className="h-4 w-4" /> Request driver
              </button>
              {tracking && (
                <button
                  type="button"
                  onClick={() => setStage(-1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              )}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
              <Bike className="h-4 w-4" /> Live tracking
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" /> {pickup}
              </span>
              <span className="inline-flex items-center gap-1.5 text-right">
                <MapPin className="h-3.5 w-3.5" /> {dropoff}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-black/40">
              <div
                className="h-2 rounded-full bg-[image:var(--gradient-royal)] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <ol className="mt-5 grid gap-3">
              {deliveryStages.map((item, index) => {
                const done = tracking && index <= stage;
                return (
                  <li key={item.key} className="flex gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        done ? "bg-primary" : "bg-border"
                      }`}
                    />
                    <div>
                      <p className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.label}
                      </p>
                      {done && <p className="text-xs text-muted-foreground">{item.detail}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>

            {!tracking && (
              <p className="mt-5 text-xs text-muted-foreground">
                Request a driver to start the simulated journey.
              </p>
            )}
          </div>
        </div>
      </div>
    </LabShell>
  );
}
