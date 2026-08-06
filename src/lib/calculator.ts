export type AngleMode = "deg" | "rad";

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: string }
  | { type: "func"; value: string }
  | { type: "paren"; value: "(" | ")" };

const FUNCTIONS = [
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "sin",
  "cos",
  "tan",
  "ln",
  "log",
  "sqrt",
  "exp",
  "abs",
] as const;

const PRECEDENCE: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
  "^": 3,
  "u-": 4,
  "!": 5,
};

const RIGHT_ASSOCIATIVE = new Set(["^", "u-"]);

/** Turns a raw expression string into tokens. Throws on unknown symbols. */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const source = input.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  let index = 0;

  const previous = (): Token | undefined => tokens[tokens.length - 1];
  const expectsValue = (): boolean => {
    const prev = previous();
    if (!prev) return true;
    if (prev.type === "num") return false;
    if (prev.type === "paren") return prev.value === "(";
    if (prev.type === "op") return prev.value !== "!";
    return true;
  };

  while (index < source.length) {
    const char = source[index] as string;

    if (/[0-9.]/.test(char)) {
      let literal = "";
      while (index < source.length && /[0-9.]/.test(source[index] as string)) {
        literal += source[index];
        index += 1;
      }
      const value = Number(literal);
      if (Number.isNaN(value)) throw new Error("Invalid number");
      tokens.push({ type: "num", value });
      continue;
    }

    const rest = source.slice(index);

    if (rest.startsWith("pi") || char === "π") {
      tokens.push({ type: "num", value: Math.PI });
      index += char === "π" ? 1 : 2;
      continue;
    }

    if (char === "e" && !/[a-z]/.test(source[index + 1] ?? "")) {
      tokens.push({ type: "num", value: Math.E });
      index += 1;
      continue;
    }

    const func = FUNCTIONS.find((name) => rest.startsWith(name));
    if (func) {
      tokens.push({ type: "func", value: func });
      index += func.length;
      continue;
    }

    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      index += 1;
      continue;
    }

    if ("+-*/^%!".includes(char)) {
      if (char === "-" && expectsValue()) tokens.push({ type: "op", value: "u-" });
      else tokens.push({ type: "op", value: char });
      index += 1;
      continue;
    }

    throw new Error(`Unexpected character "${char}"`);
  }

  return tokens;
}

function factorial(value: number): number {
  if (value < 0 || !Number.isInteger(value)) throw new Error("Factorial needs a whole number");
  if (value > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}

function applyFunction(name: string, value: number, angleMode: AngleMode): number {
  const toRadians = (v: number) => (angleMode === "deg" ? (v * Math.PI) / 180 : v);
  const fromRadians = (v: number) => (angleMode === "deg" ? (v * 180) / Math.PI : v);

  switch (name) {
    case "sin":
      return Math.sin(toRadians(value));
    case "cos":
      return Math.cos(toRadians(value));
    case "tan":
      return Math.tan(toRadians(value));
    case "asin":
      return fromRadians(Math.asin(value));
    case "acos":
      return fromRadians(Math.acos(value));
    case "atan":
      return fromRadians(Math.atan(value));
    case "sinh":
      return Math.sinh(value);
    case "cosh":
      return Math.cosh(value);
    case "tanh":
      return Math.tanh(value);
    case "ln":
      return Math.log(value);
    case "log":
      return Math.log10(value);
    case "sqrt":
      return Math.sqrt(value);
    case "exp":
      return Math.exp(value);
    case "abs":
      return Math.abs(value);
    default:
      throw new Error(`Unknown function "${name}"`);
  }
}

function applyOperator(operator: string, right: number, left: number): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) throw new Error("Cannot divide by zero");
      return left / right;
    case "%":
      return left % right;
    case "^":
      return Math.pow(left, right);
    default:
      throw new Error(`Unknown operator "${operator}"`);
  }
}

/** Evaluates a scientific expression. Throws a readable Error on bad input. */
export function evaluateExpression(input: string, angleMode: AngleMode = "deg"): number {
  if (!input.trim()) throw new Error("Nothing to calculate");

  const tokens = tokenize(input);
  const output: number[] = [];
  const operators: Token[] = [];

  const popOperator = (): void => {
    const token = operators.pop();
    if (!token) throw new Error("Unbalanced expression");
    if (token.type === "func") {
      const value = output.pop();
      if (value === undefined) throw new Error("Unbalanced expression");
      output.push(applyFunction(token.value, value, angleMode));
      return;
    }
    if (token.type !== "op") throw new Error("Unbalanced brackets");
    if (token.value === "u-") {
      const value = output.pop();
      if (value === undefined) throw new Error("Unbalanced expression");
      output.push(-value);
      return;
    }
    if (token.value === "!") {
      const value = output.pop();
      if (value === undefined) throw new Error("Unbalanced expression");
      output.push(factorial(value));
      return;
    }
    const right = output.pop();
    const left = output.pop();
    if (right === undefined || left === undefined) throw new Error("Unbalanced expression");
    output.push(applyOperator(token.value, right, left));
  };

  for (const token of tokens) {
    if (token.type === "num") {
      output.push(token.value);
      continue;
    }
    if (token.type === "func") {
      operators.push(token);
      continue;
    }
    if (token.type === "paren") {
      if (token.value === "(") {
        operators.push(token);
        continue;
      }
      while (operators.length > 0) {
        const top = operators[operators.length - 1] as Token;
        if (top.type === "paren" && top.value === "(") break;
        popOperator();
      }
      const open = operators.pop();
      if (!open || open.type !== "paren") throw new Error("Unbalanced brackets");
      const maybeFunc = operators[operators.length - 1];
      if (maybeFunc && maybeFunc.type === "func") popOperator();
      continue;
    }

    if (token.value === "!") {
      const value = output.pop();
      if (value === undefined) throw new Error("Factorial needs a value");
      output.push(factorial(value));
      continue;
    }

    while (operators.length > 0) {
      const top = operators[operators.length - 1] as Token;
      if (top.type === "paren") break;
      const topPrecedence = top.type === "func" ? 6 : (PRECEDENCE[top.value] ?? 0);
      const currentPrecedence = PRECEDENCE[token.value] ?? 0;
      const shouldPop = RIGHT_ASSOCIATIVE.has(token.value)
        ? topPrecedence > currentPrecedence
        : topPrecedence >= currentPrecedence;
      if (!shouldPop) break;
      popOperator();
    }
    operators.push(token);
  }

  while (operators.length > 0) {
    const top = operators[operators.length - 1] as Token;
    if (top.type === "paren") throw new Error("Unbalanced brackets");
    popOperator();
  }

  if (output.length !== 1) throw new Error("Incomplete expression");
  const result = output[0] as number;
  if (!Number.isFinite(result)) throw new Error("Result is out of range");
  return result;
}

/** Formats a result for the LCD display using European decimal notation. */
export function formatResult(value: number): string {
  const rounded = Number(value.toPrecision(12));
  const text =
    Math.abs(rounded) >= 1e12 || (Math.abs(rounded) < 1e-9 && rounded !== 0)
      ? rounded.toExponential(6)
      : String(rounded);
  return text.replace(".", ",");
}
