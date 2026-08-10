export type ParcelSize = "small" | "medium" | "large";

export type DeliveryQuote = {
  distanceKm: number;
  baseFee: number;
  distanceFee: number;
  sizeFee: number;
  expressFee: number;
  total: number;
  etaMinutes: number;
};

export type QuoteInput = {
  distanceKm: number;
  size: ParcelSize;
  express: boolean;
};

const BASE_FEE = 25;
const PER_KM = 7.5;
const SIZE_FEE: Record<ParcelSize, number> = { small: 0, medium: 15, large: 35 };

/** Rounds to two decimals to avoid floating point noise in money values. */
function money(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Prices an errand the way the SwiftDrop quote engine does. */
export function quoteDelivery({ distanceKm, size, express }: QuoteInput): DeliveryQuote {
  const distance = Math.max(0, distanceKm);
  const distanceFee = money(distance * PER_KM);
  const sizeFee = SIZE_FEE[size];
  const subtotal = BASE_FEE + distanceFee + sizeFee;
  const expressFee = express ? money(subtotal * 0.35) : 0;
  const etaBase = 12 + distance * 3.2 + (size === "large" ? 6 : 0);

  return {
    distanceKm: distance,
    baseFee: BASE_FEE,
    distanceFee,
    sizeFee,
    expressFee,
    total: money(subtotal + expressFee),
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
