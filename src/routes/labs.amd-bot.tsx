import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { LabShell } from "@/components/labs/LabShell";
import { formatMoney, runSimulation, statsAt, type Candle } from "@/lib/amd-bot";

export const Route = createFileRoute("/labs/amd-bot")({
  head: () => ({
    meta: [
      { title: "AMD trading bot replay — live demo | New Era Dynasty" },
      {
        name: "description",
        content:
          "Watch a simulated accumulation–manipulation–distribution trading bot mark ranges, liquidity sweeps, entries, exits and running P&L. Demo only, no live trading.",
      },
      { property: "og:title", content: "AMD trading bot replay — try the demo" },
      {
        property: "og:description",
        content:
          "A chart replay of the AMD strategy engine with trade markers and a running P&L panel. Simulated data, no broker connection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/amd-bot" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/amd-bot" }],
  }),
  component: AmdBotDemo,
});

const phaseColor: Record<Candle["phase"], string> = {
  accumulation: "text-muted-foreground",
  manipulation: "text-destructive",
  distribution: "text-primary",
};

function AmdBotDemo() {
  const simulation = useMemo(() => runSimulation(7), []);
  const total = simulation.candles.length;
  const [cursor, setCursor] = useState(20);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(140);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCursor((prev) => {
        if (prev >= total - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, total]);

  const visible = simulation.candles.slice(0, cursor + 1);
  const window40 = visible.slice(-60);
  const stats = statsAt(simulation, cursor);
  const events = simulation.events.filter((e) => e.index <= cursor).slice(-6).reverse();

  const high = Math.max(...window40.map((c) => c.high));
  const low = Math.min(...window40.map((c) => c.low));
  const span = high - low || 1;
  const y = (value: number): number => 100 - ((value - low) / span) * 100;

  const width = Math.max(window40.length, 1) * 10;
  const last = visible[visible.length - 1]!;
  const open = stats.openTrade;

  return (
    <LabShell
      eyebrow="Live demo · Automation"
      title="AMD trading bot replay."
      intro="Replay a market session and watch the accumulation–manipulation–distribution engine map the range, catch the liquidity sweep, take the entry and manage the trade to target or stop."
      notice="Demo only. The candles are synthetic, seeded data generated in your browser — there is no broker connection, no live prices and no real money involved."
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-strong rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary">EURUSD · M15 (simulated)</div>
              <div className="mt-1 font-mono text-2xl text-foreground">{last.close.toFixed(5)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm text-primary-foreground hover:brightness-110 transition-luxury"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => setCursor((c) => Math.min(total - 1, c + 1))}
                aria-label="Step forward one candle"
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-primary transition-luxury"
              >
                <SkipForward className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCursor(20);
                  setPlaying(false);
                }}
                aria-label="Restart replay"
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-primary transition-luxury"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-black/60 p-3">
            <svg
              viewBox={`0 0 ${width} 100`}
              preserveAspectRatio="none"
              role="img"
              aria-label="Simulated candlestick chart with bot trade levels"
              className="h-64 w-full sm:h-80"
            >
              {open && (
                <>
                  <line x1="0" x2={width} y1={y(open.target)} y2={y(open.target)} stroke="currentColor" className="text-primary" strokeWidth="0.4" strokeDasharray="2 2" />
                  <line x1="0" x2={width} y1={y(open.entryPrice)} y2={y(open.entryPrice)} stroke="currentColor" className="text-foreground/60" strokeWidth="0.4" strokeDasharray="1 2" />
                  <line x1="0" x2={width} y1={y(open.stop)} y2={y(open.stop)} stroke="currentColor" className="text-destructive" strokeWidth="0.4" strokeDasharray="2 2" />
                </>
              )}
              {window40.map((candle, i) => {
                const x = i * 10 + 5;
                const up = candle.close >= candle.open;
                const top = y(Math.max(candle.open, candle.close));
                const bottom = y(Math.min(candle.open, candle.close));
                return (
                  <g key={candle.index} className={phaseColor[candle.phase]}>
                    <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke="currentColor" strokeWidth="0.5" />
                    <rect
                      x={x - 3}
                      y={top}
                      width="6"
                      height={Math.max(bottom - top, 0.6)}
                      fill={up ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="0.6"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-muted-foreground" /> Accumulation</span>
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-destructive" /> Manipulation</span>
            <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-primary" /> Distribution</span>
          </div>

          <label className="mt-5 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Replay position — candle {cursor + 1} of {total}
            <input
              type="range"
              min={20}
              max={total - 1}
              value={cursor}
              onChange={(event) => {
                setPlaying(false);
                setCursor(Number(event.target.value));
              }}
              className="mt-2 w-full accent-[oklch(0.82_0.14_85)]"
            />
          </label>

          <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Replay speed
            <input
              type="range"
              min={40}
              max={400}
              step={20}
              value={440 - speed}
              onChange={(event) => setSpeed(440 - Number(event.target.value))}
              className="mt-2 w-full accent-[oklch(0.82_0.14_85)]"
            />
          </label>
        </div>

        <div className="grid gap-6 content-start">
          <div className="glass-strong rounded-3xl p-6">
            <h2 className="font-display text-xl text-foreground">Performance</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Stat label="Balance" value={`$${formatMoney(stats.balance)}`} />
              <Stat
                label="Net P&L"
                value={`${stats.pnl >= 0 ? "+" : "−"}$${formatMoney(Math.abs(stats.pnl))}`}
                tone={stats.pnl >= 0 ? "up" : "down"}
              />
              <Stat label="Trades closed" value={String(stats.closed)} />
              <Stat label="Win rate" value={`${stats.winRate}%`} />
            </div>
            <div className="mt-4 rounded-2xl glass px-4 py-3 text-xs text-muted-foreground">
              {open
                ? `Open ${open.side} · entry ${open.entryPrice.toFixed(5)} · stop ${open.stop.toFixed(5)} · target ${open.target.toFixed(5)} (${open.riskReward}R)`
                : "No position open — the bot is waiting for the next accumulation range."}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6">
            <h2 className="font-display text-xl text-foreground">Bot log</h2>
            <ul className="mt-4 space-y-3">
              {events.length === 0 && (
                <li className="text-sm text-muted-foreground">Waiting for the first range to form…</li>
              )}
              {events.map((event) => (
                <li key={`${event.index}-${event.kind}`} className="text-sm">
                  <span className="mr-2 font-mono text-xs text-muted-foreground/60">#{event.index}</span>
                  <span
                    className={
                      event.kind === "exit"
                        ? "text-foreground"
                        : event.kind === "sweep"
                          ? "text-destructive"
                          : "text-primary"
                    }
                  >
                    {event.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-strong rounded-3xl p-6">
            <h2 className="font-display text-xl text-foreground">Closed trades</h2>
            <div className="mt-4 space-y-2">
              {simulation.trades
                .filter((t) => t.exitIndex <= cursor)
                .map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between rounded-xl glass px-3 py-2 text-sm">
                    <span className="uppercase tracking-[0.15em] text-xs text-muted-foreground">
                      #{trade.id} {trade.side}
                    </span>
                    <span className={trade.pnl >= 0 ? "text-primary" : "text-destructive"}>
                      {trade.pnl >= 0 ? "+" : "−"}${formatMoney(Math.abs(trade.pnl))}
                    </span>
                  </div>
                ))}
              {stats.closed === 0 && <p className="text-sm text-muted-foreground">Nothing closed yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </LabShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-mono text-lg ${
          tone === "up" ? "text-primary" : tone === "down" ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
