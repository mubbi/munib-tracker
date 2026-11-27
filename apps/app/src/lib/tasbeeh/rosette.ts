/**
 * Geometric rosette design (NF-3.19 v2): a 12-point star (girih) inside a ring
 * of petals; each count fills one petal. A 33-petal round, repeated for 99 and
 * looping for ∞. Pure geometry around (0, 0) with radius 1 — the face scales it.
 */

export interface UnitPoint {
  x: number;
  y: number;
}

/** Radii of the petal ring (inner tip, shoulders, outer tip) and the star. */
export const ROSETTE_RADII = {
  petalInner: 0.6,
  petalShoulder: 0.79,
  petalOuter: 0.97,
  star: 0.5,
  frame: 0.56,
} as const;

function polar(radius: number, angle: number): UnitPoint {
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

/**
 * Centre angle of petal `index` of `count`: from 12 o'clock, clockwise in
 * LTR and anticlockwise in RTL, so the fill travels with reading direction.
 */
export function petalAngle(index: number, count: number, rtl: boolean): number {
  const step = (Math.PI * 2) / Math.max(1, count);
  return -Math.PI / 2 + (rtl ? -1 : 1) * (index + 0.5) * step;
}

/** One kite-shaped petal: inner tip, shoulder, outer tip, shoulder. */
export function petalPolygon(index: number, count: number, rtl: boolean): UnitPoint[] {
  const n = Math.max(1, count);
  const mid = petalAngle(index, n, rtl);
  // Shoulders stop a little short of the neighbours, leaving a thin seam.
  const half = (Math.PI / n) * 0.86;
  const { petalInner, petalShoulder, petalOuter } = ROSETTE_RADII;
  return [
    polar(petalInner, mid),
    polar(petalShoulder, mid - half),
    polar(petalOuter, mid),
    polar(petalShoulder, mid + half),
  ];
}

/**
 * Star polygon {points/step} as alternating outer and inner vertices — {12/5}
 * is the classic twelve-point girih star, {8/3} the eight-point one.
 */
export function starPolygon(points: number, step: number, radius: number): UnitPoint[] {
  const inner =
    (radius * Math.cos((Math.PI * step) / points)) / Math.cos((Math.PI * (step - 1)) / points);
  const out: UnitPoint[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    out.push(polar(i % 2 === 0 ? radius : inner, angle));
  }
  return out;
}

/** Points scaled into an SVG `points` attribute around (cx, cy). */
export function toSvgPoints(
  points: readonly UnitPoint[],
  cx: number,
  cy: number,
  scale: number,
): string {
  return points
    .map((p) => `${(cx + p.x * scale).toFixed(2)},${(cy + p.y * scale).toFixed(2)}`)
    .join(" ");
}
