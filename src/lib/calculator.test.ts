import { describe, expect, it } from "vitest";
import { evaluateExpression, formatResult } from "./calculator";

describe("evaluateExpression", () => {
  it("handles operator precedence", () => {
    expect(evaluateExpression("2+3*4")).toBe(14);
    expect(evaluateExpression("(2+3)*4")).toBe(20);
  });

  it("handles powers as right associative", () => {
    expect(evaluateExpression("2^3^2")).toBe(512);
  });

  it("handles unary minus", () => {
    expect(evaluateExpression("-5+2")).toBe(-3);
    expect(evaluateExpression("3*-2")).toBe(-6);
  });

  it("handles factorials", () => {
    expect(evaluateExpression("5!")).toBe(120);
    expect(evaluateExpression("3!+1")).toBe(7);
  });

  it("respects the angle mode for trig", () => {
    expect(evaluateExpression("sin(90)", "deg")).toBeCloseTo(1);
    expect(evaluateExpression("sin(0)", "rad")).toBeCloseTo(0);
  });

  it("supports logs, roots and constants", () => {
    expect(evaluateExpression("log(100)")).toBeCloseTo(2);
    expect(evaluateExpression("ln(e)")).toBeCloseTo(1);
    expect(evaluateExpression("sqrt(16)")).toBe(4);
    expect(evaluateExpression("pi")).toBeCloseTo(Math.PI);
  });

  it("throws readable errors", () => {
    expect(() => evaluateExpression("1/0")).toThrow(/divide by zero/);
    expect(() => evaluateExpression("(1+2")).toThrow(/Unbalanced/);
    expect(() => evaluateExpression("")).toThrow(/Nothing to calculate/);
  });
});

describe("formatResult", () => {
  it("uses a comma as the decimal separator", () => {
    expect(formatResult(1.5)).toBe("1,5");
    expect(formatResult(42)).toBe("42");
  });
});
