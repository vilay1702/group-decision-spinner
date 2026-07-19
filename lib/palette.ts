import type { SpinOption } from "./types";

// Wheel-slice hues — content colors for the wheel itself (and confetti),
// distinct from the UI tokens in globals.css. Bright enough to read as a
// carnival wheel on the warm off-white brand background.
export const PALETTE = [
  "#FF6B6B",
  "#FFA94D",
  "#FFD43B",
  "#A9E34B",
  "#38D9A9",
  "#3BC9DB",
  "#4DABF7",
  "#748FFC",
  "#9775FA",
  "#DA77F2",
  "#F783AC",
  "#63E6BE",
] as const;

// Pick the least-used color that doesn't clash with the slice it will sit next to.
export function nextColor(existing: SpinOption[]): string {
  const counts = new Map<string, number>(PALETTE.map((c) => [c, 0]));
  for (const o of existing) {
    counts.set(o.color, (counts.get(o.color) ?? 0) + 1);
  }
  const lastColor = existing[existing.length - 1]?.color;
  const firstColor = existing[0]?.color;
  let best: string = PALETTE[0];
  let bestScore = Infinity;
  for (const c of PALETTE) {
    let score = (counts.get(c) ?? 0) * 10;
    if (c === lastColor) score += 5; // new slice sits after the last one
    if (c === firstColor) score += 5; // ...and wraps around to the first
    if (score < bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}
