import { useEffect, useRef, useState } from "react";

export function AnimatedStat({
  value,
  label,
  suffix = "+",
  icon,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const dur = 1600;
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(eased * value));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="glass rounded-2xl p-6 text-center transition-luxury hover:shadow-glow-gold">
      {icon && <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>}
      <div className="font-display text-4xl sm:text-5xl font-bold text-gold-gradient">
        {n}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="mt-2 text-xs sm:text-sm uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
