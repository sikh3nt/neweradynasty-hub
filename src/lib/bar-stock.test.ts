import { describe, expect, it } from "vitest";
import { evaluateLine, starterStock, stockCsv, summariseStock, type StockLine } from "./bar-stock";

const line: StockLine = {
  id: "test",
  name: "Test bottle",
  category: "Spirits",
  unit: "750ml",
  par: 5,
  unitPrice: 100,
  opening: 10,
  received: 5,
  sold: 6,
  wastage: 1,
  closing: 7,
};

describe("evaluateLine", () => {
  it("computes expected closing and the variance value", () => {
    const result = evaluateLine(line);
    expect(result.expected).toBe(8);
    expect(result.variance).toBe(-1);
    expect(result.varianceValue).toBe(-100);
    expect(result.belowPar).toBe(false);
  });

  it("flags stock below par", () => {
    expect(evaluateLine({ ...line, closing: 2 }).belowPar).toBe(true);
  });
});

describe("summariseStock", () => {
  it("totals sales, wastage and variance", () => {
    const totals = summariseStock([line, { ...line, id: "b", closing: 1, wastage: 0 }]);
    expect(totals.salesValue).toBe(1200);
    expect(totals.wastageValue).toBe(100);
    expect(totals.belowParCount).toBe(1);
  });
});

describe("stockCsv", () => {
  it("writes a header and one row per item", () => {
    const csv = stockCsv(starterStock, "Friday night");
    expect(csv.split("\n")).toHaveLength(starterStock.length + 1);
    expect(csv).toContain("Hennessy VS");
    expect(csv.startsWith("Shift,Item,Category")).toBe(true);
  });
});
