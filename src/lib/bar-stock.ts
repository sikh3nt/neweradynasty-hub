export type StockLine = {
  id: string;
  name: string;
  category: string;
  unit: string;
  par: number;
  unitPrice: number;
  opening: number;
  received: number;
  sold: number;
  wastage: number;
  closing: number;
};

export type StockLineResult = StockLine & {
  expected: number;
  variance: number;
  varianceValue: number;
  belowPar: boolean;
};

/** Expected closing stock = opening + received - sold - wastage. */
export function expectedClosing(line: StockLine): number {
  return line.opening + line.received - line.sold - line.wastage;
}

/** Adds the derived variance figures used by the shift report. */
export function evaluateLine(line: StockLine): StockLineResult {
  const expected = expectedClosing(line);
  const variance = line.closing - expected;
  return {
    ...line,
    expected,
    variance,
    varianceValue: Math.round(variance * line.unitPrice * 100) / 100,
    belowPar: line.closing < line.par,
  };
}

export type StockTotals = {
  varianceValue: number;
  wastageValue: number;
  salesValue: number;
  belowParCount: number;
};

/** Rolls the individual lines up into the shift summary. */
export function summariseStock(lines: StockLine[]): StockTotals {
  return lines.reduce<StockTotals>(
    (totals, line) => {
      const result = evaluateLine(line);
      return {
        varianceValue: Math.round((totals.varianceValue + result.varianceValue) * 100) / 100,
        wastageValue: Math.round((totals.wastageValue + line.wastage * line.unitPrice) * 100) / 100,
        salesValue: Math.round((totals.salesValue + line.sold * line.unitPrice) * 100) / 100,
        belowParCount: totals.belowParCount + (result.belowPar ? 1 : 0),
      };
    },
    { varianceValue: 0, wastageValue: 0, salesValue: 0, belowParCount: 0 },
  );
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Builds the CSV a manager would email at the end of a shift. */
export function stockCsv(lines: StockLine[], shiftLabel: string): string {
  const header = [
    "Shift",
    "Item",
    "Category",
    "Unit",
    "Par",
    "Opening",
    "Received",
    "Sold",
    "Wastage",
    "Closing",
    "Expected",
    "Variance",
    "Variance value (R)",
  ];
  const rows = lines.map((line) => {
    const result = evaluateLine(line);
    return [
      shiftLabel,
      line.name,
      line.category,
      line.unit,
      line.par,
      line.opening,
      line.received,
      line.sold,
      line.wastage,
      line.closing,
      result.expected,
      result.variance,
      result.varianceValue.toFixed(2),
    ]
      .map(csvCell)
      .join(",");
  });
  return [header.join(","), ...rows].join("\n");
}

export const starterStock: StockLine[] = [
  { id: "hennessy", name: "Hennessy VS", category: "Cognac", unit: "750ml", par: 12, unitPrice: 620, opening: 14, received: 6, sold: 9, wastage: 0, closing: 11 },
  { id: "jameson", name: "Jameson", category: "Whiskey", unit: "750ml", par: 10, unitPrice: 340, opening: 12, received: 0, sold: 5, wastage: 1, closing: 6 },
  { id: "belaire", name: "Luc Belaire Rosé", category: "Sparkling", unit: "750ml", par: 8, unitPrice: 480, opening: 9, received: 4, sold: 6, wastage: 0, closing: 7 },
  { id: "savanna", name: "Savanna Dry", category: "Cider", unit: "330ml", par: 48, unitPrice: 32, opening: 60, received: 24, sold: 41, wastage: 2, closing: 40 },
  { id: "heineken", name: "Heineken", category: "Beer", unit: "330ml", par: 60, unitPrice: 30, opening: 72, received: 24, sold: 55, wastage: 0, closing: 39 },
  { id: "redbull", name: "Red Bull", category: "Mixer", unit: "250ml", par: 36, unitPrice: 28, opening: 40, received: 12, sold: 22, wastage: 1, closing: 29 },
];

export type ReorderSuggestion = {
  id: string;
  name: string;
  unit: string;
  shortfall: number;
  cost: number;
};

/** Suggests how much of each below-par line to reorder to get back to par. */
export function reorderSuggestions(lines: StockLine[]): ReorderSuggestion[] {
  return lines
    .map(evaluateLine)
    .filter((line) => line.belowPar)
    .map((line) => {
      const shortfall = line.par - line.closing;
      return {
        id: line.id,
        name: line.name,
        unit: line.unit,
        shortfall,
        cost: Math.round(shortfall * line.unitPrice * 100) / 100,
      };
    })
    .sort((a, b) => b.cost - a.cost);
}

/** Total rand needed to bring every below-par line back to par. */
export function reorderCost(lines: StockLine[]): number {
  return Math.round(reorderSuggestions(lines).reduce((sum, item) => sum + item.cost, 0) * 100) / 100;
}
