import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { LabShell } from "@/components/labs/LabShell";
import { evaluateExpression, formatResult, type AngleMode } from "@/lib/calculator";

export const Route = createFileRoute("/labs/calculator")({
  head: () => ({
    meta: [
      { title: "Scientific calculator — free online tool | New Era Dynasty" },
      {
        name: "description",
        content:
          "A free scientific calculator with trigonometry, logarithms, exponents, factorials and memory. Runs in your browser, built by Tozamile Sikhenjana.",
      },
      { property: "og:title", content: "Scientific calculator — try it free" },
      {
        property: "og:description",
        content:
          "Trig, logs, exponents, factorials and memory keys, with a degree and radian toggle. No sign-in needed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/calculator" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/calculator" }],
  }),
  component: CalculatorDemo,
});

type Key = {
  label: string;
  insert?: string;
  action?: "clear" | "back" | "equals" | "mplus" | "mminus" | "mr" | "mc";
  tone?: "fn" | "op" | "accent" | "memory";
  wide?: boolean;
};

const keys: Key[] = [
  { label: "MC", action: "mc", tone: "memory" },
  { label: "MR", action: "mr", tone: "memory" },
  { label: "M+", action: "mplus", tone: "memory" },
  { label: "M−", action: "mminus", tone: "memory" },
  { label: "AC", action: "clear", tone: "accent" },

  { label: "sin", insert: "sin(", tone: "fn" },
  { label: "cos", insert: "cos(", tone: "fn" },
  { label: "tan", insert: "tan(", tone: "fn" },
  { label: "ln", insert: "ln(", tone: "fn" },
  { label: "log", insert: "log(", tone: "fn" },

  { label: "asin", insert: "asin(", tone: "fn" },
  { label: "acos", insert: "acos(", tone: "fn" },
  { label: "atan", insert: "atan(", tone: "fn" },
  { label: "√", insert: "sqrt(", tone: "fn" },
  { label: "x!", insert: "!", tone: "fn" },

  { label: "(", insert: "(", tone: "fn" },
  { label: ")", insert: ")", tone: "fn" },
  { label: "π", insert: "pi", tone: "fn" },
  { label: "e", insert: "e", tone: "fn" },
  { label: "xʸ", insert: "^", tone: "op" },

  { label: "7", insert: "7" },
  { label: "8", insert: "8" },
  { label: "9", insert: "9" },
  { label: "⌫", action: "back", tone: "op" },
  { label: "÷", insert: "/", tone: "op" },

  { label: "4", insert: "4" },
  { label: "5", insert: "5" },
  { label: "6", insert: "6" },
  { label: "%", insert: "%", tone: "op" },
  { label: "×", insert: "*", tone: "op" },

  { label: "1", insert: "1" },
  { label: "2", insert: "2" },
  { label: "3", insert: "3" },
  { label: "eˣ", insert: "exp(", tone: "fn" },
  { label: "−", insert: "-", tone: "op" },

  { label: "0", insert: "0" },
  { label: ",", insert: "." },
  { label: "|x|", insert: "abs(", tone: "fn" },
  { label: "=", action: "equals", tone: "accent" },
  { label: "+", insert: "+", tone: "op" },
];

const toneClass: Record<NonNullable<Key["tone"]> | "num", string> = {
  num: "bg-white/[0.04] text-foreground hover:bg-white/[0.09]",
  fn: "bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.07]",
  op: "bg-primary/10 text-primary hover:bg-primary/20",
  accent: "bg-[image:var(--gradient-royal)] text-primary-foreground hover:brightness-110",
  memory: "bg-white/[0.02] text-xs text-muted-foreground hover:text-primary hover:bg-white/[0.07]",
};

function CalculatorDemo() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [memory, setMemory] = useState(0);

  const compute = useCallback(
    (source: string): number | null => {
      try {
        return evaluateExpression(source, angleMode);
      } catch {
        return null;
      }
    },
    [angleMode],
  );

  const press = (key: Key): void => {
    setError(null);

    if (key.insert !== undefined) {
      setExpression((prev) => prev + key.insert);
      return;
    }

    switch (key.action) {
      case "clear":
        setExpression("");
        setResult("0");
        return;
      case "back":
        setExpression((prev) => prev.slice(0, -1));
        return;
      case "equals": {
        try {
          const value = evaluateExpression(expression, angleMode);
          setResult(formatResult(value));
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Invalid expression");
        }
        return;
      }
      case "mplus": {
        const value = compute(expression);
        if (value !== null) setMemory((prev) => prev + value);
        return;
      }
      case "mminus": {
        const value = compute(expression);
        if (value !== null) setMemory((prev) => prev - value);
        return;
      }
      case "mr":
        setExpression((prev) => prev + String(memory));
        return;
      case "mc":
        setMemory(0);
        return;
      default:
        return;
    }
  };

  return (
    <LabShell
      demo="calculator"
      eyebrow="Live demo · Utility"
      title="Scientific calculator."
      intro="The full calculator, running here exactly as built. Trigonometry, logarithms, exponents, factorials and memory keys, with a degree and radian toggle."
      notice="Nothing you type is stored or sent anywhere — the whole calculator runs inside your browser."
    >
      <div className="mx-auto max-w-md">
        <div className="glass-strong rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-border p-1">
              {(["deg", "rad"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAngleMode(mode)}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] transition-luxury ${
                    angleMode === mode
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <span
              className={`text-xs tracking-[0.2em] ${memory !== 0 ? "text-primary" : "text-muted-foreground/40"}`}
            >
              M {memory !== 0 ? formatResult(memory) : "—"}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-black/60 border border-border px-4 py-5 text-right font-mono">
            <input
              value={expression}
              onChange={(event) => {
                setExpression(event.target.value);
                setError(null);
              }}
              placeholder="0"
              aria-label="Calculator expression"
              spellCheck={false}
              className="w-full bg-transparent text-right text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/40"
            />
            <div className="mt-2 text-3xl sm:text-4xl text-primary break-all">
              {error ? "Error" : result}
            </div>
            {error && <div className="mt-2 text-xs text-destructive">{error}</div>}
          </div>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {keys.map((key) => (
              <button
                key={key.label}
                type="button"
                onClick={() => press(key)}
                className={`h-12 rounded-xl border border-border/60 text-sm font-medium transition-luxury ${
                  toneClass[key.tone ?? "num"]
                }`}
              >
                {key.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Tip: you can also type straight into the expression line — try{" "}
          <code className="text-primary">sqrt(16)+3!</code>.
        </p>
      </div>
    </LabShell>
  );
}
