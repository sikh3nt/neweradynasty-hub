import { describe, expect, it } from "vitest";
import {
  compareEmbeddings,
  createEmbedding,
  findMatch,
  frameBrightness,
  TEMPLATE_SIZE,
  type Frame,
} from "./facenet-demo";

function makeFrame(fill: (x: number, y: number) => number, size = 48): Frame {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const value = fill(x, y);
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
      data[index + 3] = 255;
    }
  }
  return { data, width: size, height: size };
}

describe("facenet demo engine", () => {
  it("produces a fixed-length normalised template", () => {
    const embedding = createEmbedding(makeFrame((x, y) => (x * 3 + y * 5) % 255));
    expect(embedding).toHaveLength(TEMPLATE_SIZE * TEMPLATE_SIZE);
    const norm = Math.sqrt(embedding.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("scores identical frames near one and different frames lower", () => {
    const a = createEmbedding(makeFrame((x) => x * 5));
    const b = createEmbedding(makeFrame((x) => x * 5));
    const c = createEmbedding(makeFrame((x, y) => (y * 7) % 255));
    expect(compareEmbeddings(a, b)).toBeCloseTo(1, 5);
    expect(compareEmbeddings(a, c)).toBeLessThan(compareEmbeddings(a, b));
  });

  it("returns no match against an empty register", () => {
    const result = findMatch(createEmbedding(makeFrame(() => 120)), []);
    expect(result.decision).toBe("no-match");
    expect(result.match).toBeNull();
  });

  it("matches an enrolled template", () => {
    const embedding = createEmbedding(makeFrame((x, y) => (x * 4 + y) % 255));
    const result = findMatch(embedding, [
      { id: "1", name: "Resident", embedding, enrolledAt: 0 },
    ]);
    expect(result.decision).toBe("match");
    expect(result.match?.name).toBe("Resident");
  });

  it("measures brightness between zero and one", () => {
    expect(frameBrightness(makeFrame(() => 0))).toBeCloseTo(0, 2);
    expect(frameBrightness(makeFrame(() => 255))).toBeCloseTo(1, 2);
  });
});
