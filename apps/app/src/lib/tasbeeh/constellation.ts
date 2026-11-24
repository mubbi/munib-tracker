/**
 * Night sky design (NF-3.19 v2): each count lights one star of a simple
 * constellation that completes at the end of the round. The stars sit along a
 * gentle meandering path with deterministic jitter, so the shape is stable and
 * never crosses itself badly. Pure geometry in a 0–1 box.
 */

import { unitHash } from "./rounds";

export interface StarPoint {
  x: number;
  y: number;
  /** Brightness class 0–2 once lit (varies the glow a little). */
  magnitude: number;
}

/** Margin kept free around the sky edge (the moon sits in the top end corner). */
const MARGIN = 0.1;

/**
 * `count` stars along a two-row serpentine across the sky: the path runs
 * along reading direction, drops, and comes back — like tracing a constellation.
 */
export function constellation(count: number, rtl: boolean): StarPoint[] {
  const n = Math.max(1, count);
  const stars: StarPoint[] = [];
  const rows = n <= 12 ? 2 : n <= 24 ? 3 : 4;
  const perRow = Math.ceil(n / rows);
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / perRow);
    const col = i - row * perRow;
    const forward = row % 2 === 0;
    const span = perRow > 1 ? col / (perRow - 1) : 0.5;
    const u = forward ? span : 1 - span;
    const jx = (unitHash(i, 3) - 0.5) * (0.5 / perRow);
    const jy = (unitHash(i, 5) - 0.5) * 0.09;
    // A soft wave keeps each row from looking ruled.
    const wave = Math.sin(u * Math.PI * 2 + row) * 0.035;
    const x = MARGIN + (1 - MARGIN * 2) * Math.min(1, Math.max(0, u + jx));
    const y = MARGIN + 0.12 + ((1 - MARGIN * 2 - 0.16) * (row + 0.5)) / rows + jy + wave;
    stars.push({
      x: rtl ? 1 - x : x,
      y,
      magnitude: Math.floor(unitHash(i, 7) * 3),
    });
  }
  return stars;
}

/** Faint background stars (decoration only, never counted). */
export function backgroundStars(count: number): Array<{ x: number; y: number; r: number }> {
  return Array.from({ length: count }, (_, i) => ({
    x: unitHash(i, 101),
    y: unitHash(i, 103),
    r: 0.35 + unitHash(i, 107) * 0.6,
  }));
}
