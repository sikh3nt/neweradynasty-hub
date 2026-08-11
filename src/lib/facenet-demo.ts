/**
 * Civic FaceNet demo engine.
 *
 * Everything here runs in the visitor's browser. A captured frame is reduced to
 * a small normalised numeric template (an "embedding") and the original pixels
 * are discarded, mirroring how the real system stores templates instead of
 * photographs. No image or template ever leaves the device.
 */

export type Frame = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export type Enrolment = {
  id: string;
  name: string;
  embedding: number[];
  enrolledAt: number;
};

export type MatchResult = {
  match: Enrolment | null;
  confidence: number;
  decision: "match" | "review" | "no-match";
};

/** Grid resolution of the template. 12x12 keeps it tiny and non-reversible. */
export const TEMPLATE_SIZE = 12;

/** Confidence at or above which the demo reports a match. */
export const MATCH_THRESHOLD = 0.86;

/** Confidence band that a human operator would review manually. */
export const REVIEW_THRESHOLD = 0.72;

/** Reduces a frame to a normalised, L2-scaled grayscale template. */
export function createEmbedding(frame: Frame): number[] {
  const side = Math.min(frame.width, frame.height);
  const offsetX = Math.floor((frame.width - side) / 2);
  const offsetY = Math.floor((frame.height - side) / 2);
  const cell = side / TEMPLATE_SIZE;
  const raw: number[] = [];

  for (let row = 0; row < TEMPLATE_SIZE; row += 1) {
    for (let column = 0; column < TEMPLATE_SIZE; column += 1) {
      let total = 0;
      let samples = 0;
      const startY = Math.floor(offsetY + row * cell);
      const endY = Math.floor(offsetY + (row + 1) * cell);
      const startX = Math.floor(offsetX + column * cell);
      const endX = Math.floor(offsetX + (column + 1) * cell);

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const index = (y * frame.width + x) * 4;
          const r = frame.data[index] ?? 0;
          const g = frame.data[index + 1] ?? 0;
          const b = frame.data[index + 2] ?? 0;
          total += 0.299 * r + 0.587 * g + 0.114 * b;
          samples += 1;
        }
      }

      raw.push(samples ? total / samples : 0);
    }
  }

  const mean = raw.reduce((sum, value) => sum + value, 0) / raw.length;
  const centred = raw.map((value) => value - mean);
  const norm = Math.sqrt(centred.reduce((sum, value) => sum + value * value, 0));
  return norm === 0 ? centred : centred.map((value) => value / norm);
}

/** Cosine similarity mapped into a 0–1 confidence score. */
export function compareEmbeddings(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += (a[i] ?? 0) * (b[i] ?? 0);
  }
  return Math.max(0, Math.min(1, (dot + 1) / 2));
}

/** Finds the closest enrolled resident and classifies the outcome. */
export function findMatch(embedding: number[], enrolments: Enrolment[]): MatchResult {
  let best: Enrolment | null = null;
  let bestScore = 0;

  enrolments.forEach((candidate) => {
    const score = compareEmbeddings(embedding, candidate.embedding);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  });

  const decision: MatchResult["decision"] =
    bestScore >= MATCH_THRESHOLD ? "match" : bestScore >= REVIEW_THRESHOLD ? "review" : "no-match";

  return {
    match: decision === "no-match" ? null : best,
    confidence: bestScore,
    decision,
  };
}

/** Rough exposure check so the demo can coach the visitor on lighting. */
export function frameBrightness(frame: Frame): number {
  let total = 0;
  let samples = 0;
  for (let index = 0; index < frame.data.length; index += 40) {
    const r = frame.data[index] ?? 0;
    const g = frame.data[index + 1] ?? 0;
    const b = frame.data[index + 2] ?? 0;
    total += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    samples += 1;
  }
  return samples ? total / samples : 0;
}

export function formatConfidence(value: number): string {
  return `${(value * 100).toFixed(1).replace(".", ",")} %`;
}
