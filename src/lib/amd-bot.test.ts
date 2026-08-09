import { describe, expect, it } from "vitest";
import { DEFAULT_PARAMS, runSimulation, statsAt } from "./amd-bot";

describe("runSimulation", () => {
  it("is deterministic for a given seed", () => {
    expect(runSimulation(7).candles).toEqual(runSimulation(7).candles);
  });

  it("produces candles for every AMD phase", () => {
    const phases = new Set(runSimulation(7).candles.map((c) => c.phase));
    expect(phases).toContain("accumulation");
    expect(phases).toContain("manipulation");
    expect(phases).toContain("distribution");
  });

  it("keeps candle highs above lows", () => {
    for (const candle of runSimulation(11).candles) {
      expect(candle.high).toBeGreaterThanOrEqual(candle.low);
    }
  });

  it("closes every trade after its entry", () => {
    for (const trade of runSimulation(7).trades) {
      expect(trade.exitIndex).toBeGreaterThan(trade.entryIndex);
    }
  });
});

describe("statsAt", () => {
  it("reports nothing closed at the start", () => {
    const simulation = runSimulation(7);
    const stats = statsAt(simulation, 0);
    expect(stats.closed).toBe(0);
    expect(stats.balance).toBe(simulation.startingBalance);
  });

  it("counts every trade at the end of the replay", () => {
    const simulation = runSimulation(7);
    const stats = statsAt(simulation, simulation.candles.length - 1);
    expect(stats.closed).toBe(simulation.trades.length);
    expect(stats.wins + stats.losses).toBe(simulation.trades.length);
  });
});

describe("strategy parameters", () => {
  it("only trades the enabled sessions", () => {
    const simulation = runSimulation(7, 6, { ...DEFAULT_PARAMS, sessions: ["london"] });
    expect(simulation.trades.length).toBeGreaterThan(0);
    expect(simulation.trades.every((t) => t.session === "london")).toBe(true);
  });

  it("scales risk per trade", () => {
    const base = runSimulation(7, 6, { ...DEFAULT_PARAMS, riskPercent: 1 });
    const doubled = runSimulation(7, 6, { ...DEFAULT_PARAMS, riskPercent: 2 });
    expect(Math.abs(doubled.trades[0]!.pnl)).toBeCloseTo(Math.abs(base.trades[0]!.pnl) * 2, 1);
  });

  it("widens targets with the target multiplier", () => {
    const base = runSimulation(7, 6, DEFAULT_PARAMS);
    const wide = runSimulation(7, 6, { ...DEFAULT_PARAMS, targetMultiplier: 2 });
    expect(wide.trades[0]!.riskReward).toBeGreaterThan(base.trades[0]!.riskReward);
  });
});
