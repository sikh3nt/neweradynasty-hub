/**
 * AMD (Accumulation - Manipulation - Distribution) trading bot simulation.
 *
 * Everything here is deterministic, seeded, synthetic market data used for the
 * public in-browser demo. No live prices, no broker connection, no orders.
 */

export type Phase = "accumulation" | "manipulation" | "distribution";

export type Session = "asia" | "london" | "newYork";

export const SESSIONS: readonly Session[] = ["asia", "london", "newYork"] as const;

export const SESSION_LABELS: Record<Session, string> = {
  asia: "Asia",
  london: "London",
  newYork: "New York",
};

/** Demo-only strategy parameters exposed in the replay UI. */
export type BotParams = {
  /** Account risk per trade, as a percentage (e.g. 1 = 1%). */
  riskPercent: number;
  /** Multiplier applied to the stop-loss buffer beyond the sweep. */
  stopMultiplier: number;
  /** Multiplier applied to the base reward-to-risk of each target. */
  targetMultiplier: number;
  /** Sessions the bot is allowed to trade. */
  sessions: readonly Session[];
};

export const DEFAULT_PARAMS: BotParams = {
  riskPercent: 1,
  stopMultiplier: 1,
  targetMultiplier: 1,
  sessions: SESSIONS,
};

export type Candle = {
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
  phase: Phase;
  session: Session;
};

export type Trade = {
  id: number;
  side: "long" | "short";
  session: Session;
  entryIndex: number;
  entryPrice: number;
  stop: number;
  target: number;
  exitIndex: number;
  exitPrice: number;
  outcome: "win" | "loss";
  riskReward: number;
  pnl: number;
};

export type BotEvent = {
  index: number;
  kind: "range" | "sweep" | "entry" | "exit" | "skip";
  text: string;
};

export type Simulation = {
  candles: Candle[];
  trades: Trade[];
  events: BotEvent[];
  startingBalance: number;
  params: BotParams;
};

const STARTING_BALANCE = 10_000;

/** Small deterministic PRNG so every visitor replays the same session. */
function createRandom(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const round = (value: number): number => Math.round(value * 100000) / 100000;

export function runSimulation(seed = 7, cycles = 5, params: BotParams = DEFAULT_PARAMS): Simulation {
  const random = createRandom(seed);
  const riskFraction = params.riskPercent / 100;
  const candles: Candle[] = [];
  const trades: Trade[] = [];
  const events: BotEvent[] = [];

  let price = 1.0865;
  let balance = STARTING_BALANCE;

  let session: Session = SESSIONS[0]!;

  const push = (phase: Phase, open: number, close: number, wick: number): void => {
    const high = round(Math.max(open, close) + wick * random());
    const low = round(Math.min(open, close) - wick * random());
    candles.push({ index: candles.length, phase, session, open: round(open), close: round(close), high, low });
  };

  for (let cycle = 0; cycle < cycles; cycle += 1) {
    session = SESSIONS[cycle % SESSIONS.length]!;
    const sessionEnabled = params.sessions.includes(session);
    const bullish = random() > 0.45;
    const rangeHeight = 0.0035 + random() * 0.0018;
    const center = price;
    const rangeHigh = center + rangeHeight / 2;
    const rangeLow = center - rangeHeight / 2;

    // Accumulation: price coils inside a tight range.
    for (let i = 0; i < 14; i += 1) {
      const open = price;
      const close = rangeLow + random() * rangeHeight;
      push("accumulation", open, close, rangeHeight * 0.12);
      price = close;
    }
    events.push({
      index: candles.length - 1,
      kind: "range",
      text: `${SESSION_LABELS[session]} session · accumulation range mapped: ${rangeLow.toFixed(5)} – ${rangeHigh.toFixed(5)}`,
    });

    if (!sessionEnabled) {
      // Session filtered out: the bot observes the range but stands aside.
      events.push({
        index: candles.length - 1,
        kind: "skip",
        text: `${SESSION_LABELS[session]} session filtered off — no trade taken`,
      });
      for (let i = 0; i < 12; i += 1) {
        const open = price;
        const close = price + (random() - 0.5) * rangeHeight * 0.3;
        push("accumulation", open, close, rangeHeight * 0.1);
        price = close;
      }
      continue;
    }

    // Manipulation: liquidity sweep beyond the range, then a reclaim close.
    const sweepDepth = rangeHeight * (0.35 + random() * 0.25);
    const sweepLevel = bullish ? rangeLow - sweepDepth : rangeHigh + sweepDepth;
    push("manipulation", price, bullish ? sweepLevel + sweepDepth * 0.2 : sweepLevel - sweepDepth * 0.2, sweepDepth * 0.4);
    const sweepCandle = candles[candles.length - 1]!;
    if (bullish) sweepCandle.low = round(sweepLevel);
    else sweepCandle.high = round(sweepLevel);
    events.push({
      index: sweepCandle.index,
      kind: "sweep",
      text: `${bullish ? "Sell-side" : "Buy-side"} liquidity swept at ${sweepLevel.toFixed(5)}`,
    });

    const entry = bullish ? rangeLow + rangeHeight * 0.1 : rangeHigh - rangeHeight * 0.1;
    push("manipulation", sweepCandle.close, entry, sweepDepth * 0.25);
    const entryIndex = candles.length - 1;
    price = entry;

    const buffer = rangeHeight * 0.12 * params.stopMultiplier;
    const stop = bullish ? sweepLevel - buffer : sweepLevel + buffer;
    const risk = Math.abs(entry - stop);
    const riskReward = (2 + random()) * params.targetMultiplier;
    const target = bullish ? entry + risk * riskReward : entry - risk * riskReward;
    const win = random() > 0.32;
    const destination = win ? target : stop;

    events.push({
      index: entryIndex,
      kind: "entry",
      text: `${bullish ? "Long" : "Short"} entry ${entry.toFixed(5)} · stop ${stop.toFixed(5)} · target ${target.toFixed(5)}`,
    });

    // Distribution: price walks toward the target (or back into the stop).
    const legs = win ? 12 : 6;
    for (let i = 1; i <= legs; i += 1) {
      const open = price;
      const progress = i / legs;
      const noise = (random() - 0.5) * risk * 0.35;
      const close = i === legs ? destination : entry + (destination - entry) * progress + noise;
      push("distribution", open, close, risk * 0.2);
      price = close;
    }

    const exitIndex = candles.length - 1;
    const pnl = win ? balance * riskFraction * riskReward : -(balance * riskFraction);
    balance += pnl;

    trades.push({
      id: trades.length + 1,
      side: bullish ? "long" : "short",
      session,
      entryIndex,
      entryPrice: round(entry),
      stop: round(stop),
      target: round(target),
      exitIndex,
      exitPrice: round(destination),
      outcome: win ? "win" : "loss",
      riskReward: Math.round(riskReward * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
    });
    events.push({
      index: exitIndex,
      kind: "exit",
      text: `${win ? "Target hit" : "Stop hit"} at ${destination.toFixed(5)} · ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}`,
    });

    // Cool-down candles between cycles.
    for (let i = 0; i < 4; i += 1) {
      const open = price;
      const close = price + (random() - 0.5) * rangeHeight * 0.25;
      push("accumulation", open, close, rangeHeight * 0.1);
      price = close;
    }
  }

  return { candles, trades, events, startingBalance: STARTING_BALANCE, params };
}

export type Stats = {
  closed: number;
  wins: number;
  losses: number;
  winRate: number;
  pnl: number;
  balance: number;
  openTrade: Trade | null;
};

/** Stats for the replay position `index` (inclusive). */
export function statsAt(simulation: Simulation, index: number): Stats {
  const closed = simulation.trades.filter((t) => t.exitIndex <= index);
  const wins = closed.filter((t) => t.outcome === "win").length;
  const pnl = closed.reduce((sum, t) => sum + t.pnl, 0);
  const openTrade =
    simulation.trades.find((t) => t.entryIndex <= index && t.exitIndex > index) ?? null;

  return {
    closed: closed.length,
    wins,
    losses: closed.length - wins,
    winRate: closed.length === 0 ? 0 : Math.round((wins / closed.length) * 100),
    pnl: Math.round(pnl * 100) / 100,
    balance: Math.round((simulation.startingBalance + pnl) * 100) / 100,
    openTrade,
  };
}

/** European formatting: comma as decimal separator. */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
