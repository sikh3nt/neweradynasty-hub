import { Star } from "lucide-react";

export function StarRating({ value, size = 16, interactive = false, onChange }: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        const el = (
          <Star
            style={{ width: size, height: size }}
            className={filled ? "fill-primary text-primary" : "text-muted-foreground/50"}
          />
        );
        return interactive ? (
          <button
            type="button"
            key={i}
            onClick={() => onChange?.(i)}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
            className="p-1 rounded hover:bg-muted transition-luxury"
          >
            {el}
          </button>
        ) : (
          <span key={i}>{el}</span>
        );
      })}
    </div>
  );
}
