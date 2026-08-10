import { describe, expect, it } from "vitest";
import { formatRand, quoteDelivery } from "./swiftdrop";

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
