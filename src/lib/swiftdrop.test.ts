import { describe, expect, it } from "vitest";
import { formatRand, pickDriver, quoteDelivery } from "./swiftdrop";

describe("quoteDelivery", () => {
  it("prices base plus distance plus size", () => {
    const quote = quoteDelivery({ distanceKm: 4, size: "medium", express: false });
    expect(quote.distanceFee).toBe(30);
    expect(quote.sizeFee).toBe(15);
    expect(quote.total).toBe(70);
    expect(quote.expressFee).toBe(0);
  });

  it("adds an express surcharge and shortens the eta", () => {
    const standard = quoteDelivery({ distanceKm: 6, size: "small", express: false });
    const express = quoteDelivery({ distanceKm: 6, size: "small", express: true });
    expect(express.total).toBeGreaterThan(standard.total);
    expect(express.etaMinutes).toBeLessThan(standard.etaMinutes);
  });

  it("never returns a negative distance", () => {
    expect(quoteDelivery({ distanceKm: -5, size: "large", express: false }).distanceKm).toBe(0);
  });
});

describe("formatRand", () => {
  it("uses a comma as the decimal separator", () => {
    expect(formatRand(70)).toBe("R 70,00");
  });
});

describe("surge, tips and drivers", () => {
  it("applies a surge multiplier on top of the fees", () => {
    const normal = quoteDelivery({ distanceKm: 5, size: "small", express: false });
    const peak = quoteDelivery({ distanceKm: 5, size: "small", express: false, surge: 1.5 });
    expect(peak.surgeFee).toBeCloseTo(normal.total * 0.5, 2);
    expect(peak.total).toBeGreaterThan(normal.total);
  });

  it("adds the tip to the total without changing the eta", () => {
    const quote = quoteDelivery({ distanceKm: 5, size: "small", express: false, tip: 20 });
    const base = quoteDelivery({ distanceKm: 5, size: "small", express: false });
    expect(quote.total).toBe(base.total + 20);
    expect(quote.etaMinutes).toBe(base.etaMinutes);
  });

  it("sends the bakkie driver for large parcels", () => {
    expect(pickDriver(4, "large").vehicle).toContain("NP200");
  });
});
