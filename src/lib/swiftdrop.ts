export type ParcelSize = "small" | "medium" | "large";

export type DeliveryQuote = {
  distanceKm: number;
  baseFee: number;
  distanceFee: number;
  sizeFee: number;
  expressFee: number;
  surgeFee: number;
  tip: number;
  total: number;
  etaMinutes: number;
};

export type QuoteInput = {
  distanceKm: number;
  size: ParcelSize;
  express: boolean;
  /** Demand multiplier, 1 = normal, 1.4 = peak. */
  surge?: number;
  /** Optional driver tip in rand. */
  tip?: number;
};

const BASE_FEE = 25;
const PER_KM = 7.5;
const SIZE_FEE: Record<ParcelSize, number> = { small: 0, medium: 15, large: 35 };

/** Rounds to two decimals to avoid floating point noise in money values. */
function money(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Prices an errand the way the SwiftDrop quote engine does. */
export function quoteDelivery({
  distanceKm,
  size,
  express,
  surge = 1,
  tip = 0,
}: QuoteInput): DeliveryQuote {
  const distance = Math.max(0, distanceKm);
  const distanceFee = money(distance * PER_KM);
  const sizeFee = SIZE_FEE[size];
  const subtotal = BASE_FEE + distanceFee + sizeFee;
  const expressFee = express ? money(subtotal * 0.35) : 0;
  const surgeFee = money((subtotal + expressFee) * (Math.max(1, surge) - 1));
  const driverTip = money(Math.max(0, tip));
  const etaBase = 12 + distance * 3.2 + (size === "large" ? 6 : 0);

  return {
    distanceKm: distance,
    baseFee: BASE_FEE,
    distanceFee,
    sizeFee,
    expressFee,
    surgeFee,
    tip: driverTip,
    total: money(subtotal + expressFee + surgeFee + driverTip),
    etaMinutes: Math.max(10, Math.round(express ? etaBase * 0.65 : etaBase)),
  };
}


/** Formats an amount in rand with European-style decimal separators. */
export function formatRand(value: number): string {
  return `R ${value.toFixed(2).replace(".", ",")}`;
}

export type DeliveryStage = {
  key: string;
  label: string;
  detail: string;
};

export const deliveryStages: DeliveryStage[] = [
  { key: "matching", label: "Finding a driver", detail: "Broadcasting the job to drivers nearby." },
  { key: "accepted", label: "Driver accepted", detail: "Sipho is on the way to the pickup point." },
  { key: "pickup", label: "At pickup", detail: "Driver has arrived and is collecting the parcel." },
  { key: "enroute", label: "On the road", detail: "Parcel collected and moving to the drop-off." },
  { key: "arriving", label: "Arriving now", detail: "Driver is a few streets away from the drop-off." },
  { key: "delivered", label: "Delivered", detail: "Handover complete and proof of delivery captured." },
];

export type Driver = {
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  trips: number;
};

export const driverPool: Driver[] = [
  { name: "Sipho M.", vehicle: "Honda Ace 125", plate: "HXJ 042 EC", rating: 4.9, trips: 1284 },
  { name: "Naledi K.", vehicle: "VW Polo Vivo", plate: "KTR 771 EC", rating: 4.8, trips: 963 },
  { name: "Anele D.", vehicle: "Nissan NP200", plate: "LFB 318 EC", rating: 4.7, trips: 542 },
];

/** Picks a driver deterministically so the demo replays the same way for everyone. */
export function pickDriver(distanceKm: number, size: ParcelSize): Driver {
  if (size === "large") return driverPool[2];
  const index = Math.floor(distanceKm) % 2;
  return driverPool[index];
}

/** Plain-text proof of delivery a customer could share or keep. */
export function deliveryReceipt(params: {
  pickup: string;
  dropoff: string;
  quote: DeliveryQuote;
  driver: Driver;
  reference: string;
}): string {
  const { pickup, dropoff, quote, driver, reference } = params;
  return [
    "SwiftDrop — proof of delivery (demo)",
    `Reference: ${reference}`,
    `Pickup: ${pickup}`,
    `Drop-off: ${dropoff}`,
    `Distance: ${quote.distanceKm.toFixed(1).replace(".", ",")} km`,
    `Driver: ${driver.name} · ${driver.vehicle} · ${driver.plate}`,
    `Tip: ${formatRand(quote.tip)}`,
    `Total paid: ${formatRand(quote.total)}`,
    "This is a simulation. No delivery took place and no payment was taken.",
  ].join("\n");
}
