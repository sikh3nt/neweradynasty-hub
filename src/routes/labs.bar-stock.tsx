import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LabShell } from "@/components/labs/LabShell";
import { Download, Minus, Plus, RotateCcw, TriangleAlert } from "lucide-react";
import {
  evaluateLine,
  starterStock,
  stockCsv,
  summariseStock,
  type StockLine,
} from "@/lib/bar-stock";
import { formatRand } from "@/lib/swiftdrop";

export const Route = createFileRoute("/labs/bar-stock")({
  head: () => ({
    meta: [
      { title: "Bar stock tracker demo — shift count & CSV export | New Era Dynasty" },
      {
        name: "description",
        content:
          "Run a live bar stock count against par levels, see variance and wastage in rand, then export the shift report as a CSV file.",
      },
      { property: "og:title", content: "469 Premium bar stock tracker — live demo" },
      {
        property: "og:description",
        content:
          "An in-browser stock count tool with par levels, variance in rand and CSV export, built by Tozamile Sikhenjana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/bar-stock" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/bar-stock" }],
  }),
  component: BarStockDemo,
});

const shifts = ["Thursday service", "Friday night", "Saturday night", "Sunday chill"];

function BarStockDemo() {
  const [lines, setLines] = useState<StockLine[]>(starterStock);
  const [shift, setShift] = useState(shifts[1]);

  const results = useMemo(() => lines.map(evaluateLine), [lines]);
  const totals = useMemo(() => summariseStock(lines), [lines]);

  const adjust = (id: string, key: "closing" | "wastage", delta: number): void => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, [key]: Math.max(0, line[key] + delta) } : line,
      ),
    );
  };

  const setValue = (id: string, key: "closing" | "wastage", value: number): void => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, [key]: Math.max(0, Number.isFinite(value) ? value : 0) } : line,
      ),
    );
  };

  const exportCsv = (): void => {
    const blob = new Blob([stockCsv(lines, shift)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `469-stock-${shift.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <LabShell
      eyebrow="Live demo · Hospitality"
      title="469 Premium bar stock tracker."
      intro="Count the bar the way a shift manager does: adjust closing stock and wastage, watch variance and value update in real time, then export the report."
      notice="Demo data only. Nothing you change here is saved or shared."
    >
      <div className="grid gap-6">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Shift
              </span>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="rounded-xl border border-border bg-black/40 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {shifts.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLines(starterStock)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
              >
                <RotateCcw className="h-4 w-4" /> Reset count
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {[
              { label: "Sales value", value: formatRand(totals.salesValue) },
              { label: "Wastage", value: formatRand(totals.wastageValue) },
              { label: "Variance", value: formatRand(totals.varianceValue) },
              { label: "Below par", value: `${totals.belowParCount} items` },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl glass px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-2 font-display text-xl text-foreground">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {results.map((line) => (
            <article key={line.id} className="glass-strong rounded-3xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg text-foreground">{line.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {line.category} · {line.unit} · par {line.par}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    line.variance === 0
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "border border-destructive/40 text-destructive"
                  }`}
                >
                  {line.variance === 0 ? "Balanced" : `${line.variance > 0 ? "+" : ""}${line.variance}`}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                {[
                  ["Opening", line.opening],
                  ["Received", line.received],
                  ["Sold", line.sold],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-xl glass py-2">
                    <p className="text-[10px] uppercase tracking-[0.15em]">{label}</p>
                    <p className="mt-1 text-sm text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {(["closing", "wastage"] as const).map((key) => (
                <div key={key} className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {key === "closing" ? "Closing count" : "Wastage"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease ${key} for ${line.name}`}
                      onClick={() => adjust(line.id, key, -1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={line[key]}
                      aria-label={`${key} for ${line.name}`}
                      onChange={(e) => setValue(line.id, key, Number(e.target.value))}
                      className="w-16 rounded-lg border border-border bg-black/40 px-2 py-1.5 text-center text-sm text-foreground outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      aria-label={`Increase ${key} for ${line.name}`}
                      onClick={() => adjust(line.id, key, 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">
                  Expected {line.expected} · variance value {formatRand(line.varianceValue)}
                </span>
                {line.belowPar && (
                  <span className="inline-flex items-center gap-1.5 text-destructive">
                    <TriangleAlert className="h-3.5 w-3.5" /> Below par — reorder
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </LabShell>
  );
}
