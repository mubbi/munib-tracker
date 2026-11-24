/**
 * Sliding-bead misbaha geometry (NF-3.19). Pure, worklet-safe math: the face
 * keeps one Reanimated `progress` shared value (the count, animating between
 * integers) and every visible bead derives its position from it here.
 *
 * Model. A strand is a repeating sequence of *items* — beads, spacer beads
 * (_fasil_) and the leader bead (_imam_). Each count moves one *unit* (a bead
 * plus any spacer or imam that follows it) from the uncounted group across a gap
 * into the counted group. Item positions are path offsets (dp along the thread):
 * uncounted items stack back from `gapStart`, counted items stack on from
 * `gapEnd`, and the moving item crosses the gap. Only a window of about 20
 * items around the gap is ever drawn.
 */

import type { TasbeehStrandLayout, TasbeehStrandSize } from "@munib-tracker/shared/types";

export type StrandItemKind = "bead" | "spacer" | "imam";

export interface StrandSpec {
  /** Beads on the strand (not counting spacers or the imam). */
  beads: 33 | 99;
  /** 100-mode: the imam bead is the 100th count (99 beads + imam). */
  imamCounts: boolean;
  /** Custom / ∞ targets (or a target larger than the strand): the strand repeats with a lap counter. */
  loop: boolean;
}

export interface StrandModel extends StrandSpec {
  /** Counts per lap (beads, plus the imam when it counts). */
  unitsPerLap: number;
  /** Items per lap (beads + spacers + imam). */
  itemsPerLap: number;
  kinds: StrandItemKind[];
  /** First item index of each unit within a lap. */
  unitStart: number[];
  /** Items moved by each unit (1, or 2 when a spacer / the imam rides along). */
  unitSize: number[];
  /** True for units whose move carries a spacer (the 11/22 or 33/66 boundary). */
  spacerUnit: boolean[];
}

/** Bead indices (0-based) followed by a spacer: after the 11th and 22nd of 33, 33rd and 66th of 99. */
export function spacerAfter(beads: 33 | 99): number[] {
  return beads === 33 ? [10, 21] : [32, 65];
}

/**
 * Strand size for a target. Auto: 33 → 33, 99 → 99, 100 → 99 with the imam as
 * the 100th, anything else (custom or ∞) → a looping 33.
 */
export function resolveStrand(strand: TasbeehStrandSize, target: number): StrandSpec {
  if (strand === "auto") {
    if (target === 33) return { beads: 33, imamCounts: false, loop: false };
    if (target === 99) return { beads: 99, imamCounts: false, loop: false };
    if (target === 100) return { beads: 99, imamCounts: true, loop: false };
    return { beads: 33, imamCounts: false, loop: true };
  }
  if (target === strand) return { beads: strand, imamCounts: false, loop: false };
  if (strand === 99 && target === 100) return { beads: 99, imamCounts: true, loop: false };
  return { beads: strand, imamCounts: false, loop: true };
}

/** `spacers: false` (the "Off" spacer option) leaves the fasil beads off the strand. */
export function buildStrand(spec: StrandSpec, opts: { spacers?: boolean } = {}): StrandModel {
  const spacers = new Set(opts.spacers === false ? [] : spacerAfter(spec.beads));
  const kinds: StrandItemKind[] = [];
  const unitStart: number[] = [];
  const unitSize: number[] = [];
  const spacerUnit: boolean[] = [];
  for (let bead = 0; bead < spec.beads; bead++) {
    unitStart.push(kinds.length);
    kinds.push("bead");
    let size = 1;
    const hasSpacer = spacers.has(bead);
    if (hasSpacer) {
      kinds.push("spacer");
      size++;
    }
    const last = bead === spec.beads - 1;
    if (last && !spec.imamCounts) {
      kinds.push("imam");
      size++;
    }
    unitSize.push(size);
    spacerUnit.push(hasSpacer);
  }
  if (spec.imamCounts) {
    unitStart.push(kinds.length);
    kinds.push("imam");
    unitSize.push(1);
    spacerUnit.push(false);
  }
  return {
    ...spec,
    unitsPerLap: unitStart.length,
    itemsPerLap: kinds.length,
    kinds,
    unitStart,
    unitSize,
    spacerUnit,
  };
}

/** Kind of the absolute item `a`, or `null` when it does not exist (before the start / past a finite strand). */
export function itemKind(model: StrandModel, a: number): StrandItemKind | null {
  if (a < 0) return null;
  if (!model.loop && a >= model.itemsPerLap) return null;
  return model.kinds[a % model.itemsPerLap] ?? null;
}

/** Completed laps (loop strands only). */
export function lapOf(model: StrandModel, count: number): number {
  if (!model.loop || count <= 0) return 0;
  return Math.floor(count / model.unitsPerLap);
}

export type StrandCountEvent = "bead" | "spacer" | "lap";

/** What the count that *reaches* `nextCount` moved: a plain bead, a spacer boundary, or a full lap. */
export function strandCountEvent(model: StrandModel, nextCount: number): StrandCountEvent {
  if (nextCount <= 0) return "bead";
  if (model.loop && nextCount % model.unitsPerLap === 0) return "lap";
  const unit = (nextCount - 1) % model.unitsPerLap;
  if (!model.loop && nextCount > model.unitsPerLap) return "bead";
  return model.spacerUnit[unit] ? "spacer" : "bead";
}

/**
 * Continuous item progress `Q` for a continuous count `P` — how many items have
 * crossed the gap. Worklet.
 */
export function itemProgress(
  unitsPerLap: number,
  itemsPerLap: number,
  unitStart: readonly number[],
  unitSize: readonly number[],
  loop: boolean,
  P: number,
): number {
  "worklet";
  if (P <= 0) return 0;
  if (!loop && P >= unitsPerLap) return itemsPerLap;
  const whole = Math.floor(P);
  const lap = Math.floor(whole / unitsPerLap);
  const unit = whole - lap * unitsPerLap;
  const frac = P - whole;
  return lap * itemsPerLap + unitStart[unit] + frac * unitSize[unit];
}

/** {@link itemProgress} for a built model (non-worklet convenience). */
export function itemProgressFor(model: StrandModel, P: number): number {
  return itemProgress(
    model.unitsPerLap,
    model.itemsPerLap,
    model.unitStart,
    model.unitSize,
    model.loop,
    P,
  );
}

/**
 * Path offset (dp) of absolute item `a` at item progress `Q`. Uncounted items
 * stack back from `gapStart`, counted items on from `gapEnd`; the crossing item
 * interpolates. Continuous in `Q`. Worklet.
 */
export function itemOffset(
  a: number,
  Q: number,
  gapStart: number,
  gapEnd: number,
  pitch: number,
): number {
  "worklet";
  if (a >= Q) return gapStart - (a - Q) * pitch;
  if (a <= Q - 1) return gapEnd + (Q - 1 - a) * pitch;
  return gapStart + (Q - a) * (gapEnd - gapStart);
}

export interface StrandGeometry {
  layout: TasbeehStrandLayout;
  width: number;
  height: number;
  /** Bead diameter (dp). */
  bead: number;
  /** Centre-to-centre spacing (dp). */
  pitch: number;
  /** Total thread length (dp). */
  length: number;
  gapStart: number;
  gapEnd: number;
  rtl: boolean;
}

/** Most items drawn at once (plan: about 20). */
export const MAX_VISIBLE_ITEMS = 20;

/** Gap the moving bead crosses, in pitches. */
const GAP_PITCHES = 2.4;

/** Thread length for a layout in a `width × height` stage. */
export function pathLength(
  layout: TasbeehStrandLayout,
  width: number,
  height: number,
  bead: number,
): number {
  const g = arcGeometry(layout, width, height, bead);
  return g.length;
}

type ArcGeometry = { cx: number; cy: number; r: number; phi: number; length: number };

function arcGeometry(
  layout: TasbeehStrandLayout,
  width: number,
  height: number,
  bead: number,
): ArcGeometry {
  "worklet";
  const margin = bead;
  if (layout === "loop") {
    const r = Math.max(bead, Math.min(width, height) / 2 - margin);
    return { cx: width / 2, cy: height / 2, r, phi: Math.PI, length: 2 * Math.PI * r };
  }
  // Circular arcs: exact arc length, so beads keep an even pitch.
  const vertical = layout === "arc";
  const chord = (vertical ? height : width) - margin * 2;
  const half = Math.max(1, chord / 2);
  const sag = Math.max(1, (vertical ? width : height) * (vertical ? 0.1 : 0.08));
  const r = (half * half + sag * sag) / (2 * sag);
  const phi = Math.asin(Math.min(1, half / r));
  if (vertical) {
    const x0 = width * 0.34;
    return { cx: x0 - sag + r, cy: height / 2, r, phi, length: 2 * phi * r };
  }
  const y0 = height * 0.36;
  return { cx: width / 2, cy: y0 + sag - r, r, phi, length: 2 * phi * r };
}

/** Builds the geometry (gap position, pitch, length) for one stage. */
export function strandGeometry(
  layout: TasbeehStrandLayout,
  width: number,
  height: number,
  bead: number,
  rtl = false,
): StrandGeometry {
  const length = pathLength(layout, width, height, bead);
  // Even spacing, but never so tight that more than ~20 items would be drawn.
  const pitch = Math.max(bead * 1.06, length / (MAX_VISIBLE_ITEMS - 2));
  const centre = layout === "arc" ? length * 0.46 : length / 2;
  const gap = pitch * GAP_PITCHES;
  return {
    layout,
    width,
    height,
    bead,
    pitch,
    length,
    gapStart: centre - gap / 2,
    gapEnd: centre + gap / 2,
    rtl: layout === "horizontal" ? rtl : false,
  };
}

export type PathPoint = { x: number; y: number /** Tangent, radians from +x. */; angle: number };

/**
 * Screen point (centre) for a path offset. Arc hangs vertically on the start
 * side; horizontal sags gently and runs right-to-left in RTL; loop circles the
 * count with the gap at the top. Worklet.
 */
export function pathPoint(
  layout: TasbeehStrandLayout,
  s: number,
  width: number,
  height: number,
  bead: number,
  rtl: boolean,
): PathPoint {
  "worklet";
  const g = arcGeometry(layout, width, height, bead);
  if (layout === "loop") {
    // s = 0 at the bottom, clockwise: up the left side, over the top, down the right.
    const theta = Math.PI / 2 + s / g.r;
    return {
      x: g.cx + g.r * Math.cos(theta),
      y: g.cy + g.r * Math.sin(theta),
      angle: theta + Math.PI / 2,
    };
  }
  const phi = -g.phi + s / g.r;
  if (layout === "arc") {
    return {
      x: g.cx - g.r * Math.cos(phi),
      y: g.cy + g.r * Math.sin(phi),
      angle: Math.atan2(Math.cos(phi), Math.sin(phi)),
    };
  }
  const x = g.cx + g.r * Math.sin(phi);
  const angle = Math.atan2(-Math.sin(phi), Math.cos(phi));
  return rtl
    ? { x: width - x, y: g.cy + g.r * Math.cos(phi), angle: Math.PI - angle }
    : { x, y: g.cy + g.r * Math.cos(phi), angle };
}

/** SVG `d` for the thread, sampled along the path. */
export function threadPath(geometry: StrandGeometry, samples = 48): string {
  const { layout, width, height, bead, length, rtl } = geometry;
  const parts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const s = (i / samples) * length;
    const p = pathPoint(layout, s, width, height, bead, rtl);
    parts.push(`${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  return layout === "loop" ? `${parts.join(" ")} Z` : parts.join(" ");
}

/**
 * Absolute item indices worth rendering for an integer `count` (the target the
 * spring is heading to): every item whose offset lands on the thread at either
 * end of the animation, capped at {@link MAX_VISIBLE_ITEMS}.
 */
export function visibleItems(
  model: StrandModel,
  geometry: StrandGeometry,
  count: number,
): number[] {
  const { pitch, gapStart, gapEnd, length } = geometry;
  const before = Math.ceil((gapStart + pitch / 2) / pitch);
  const after = Math.ceil((length - gapEnd + pitch / 2) / pitch);
  const q = itemProgressFor(model, Math.max(0, count));
  const first = Math.floor(q) - after - 2;
  const last = Math.ceil(q) + before + 1;
  const out: number[] = [];
  for (let a = first; a <= last; a++) {
    if (itemKind(model, a) !== null) out.push(a);
  }
  // Keep the items nearest the gap when the window is too wide.
  while (out.length > MAX_VISIBLE_ITEMS) {
    const head = Math.abs(out[0] - q);
    const tail = Math.abs(out[out.length - 1] - q);
    if (head >= tail) out.shift();
    else out.pop();
  }
  return out;
}

/** Opacity for an offset: fades items in/out over half a pitch at the thread ends. Worklet. */
export function edgeOpacity(s: number, length: number, pitch: number): number {
  "worklet";
  const fade = pitch / 2;
  if (s < 0 || s > length) return 0;
  const head = Math.min(1, s / fade);
  const tail = Math.min(1, (length - s) / fade);
  return Math.max(0, Math.min(head, tail));
}

/** Detent for a drag, as a fraction of the bead pitch (plan: 60%). */
export const DRAG_DETENT = 0.6;

/**
 * Projects a pan translation onto the counting direction for a layout: down the
 * hanging arc, along the reading direction for horizontal (right-to-left in RTL),
 * and clockwise (rightwards) over the top of the loop.
 */
export function projectDrag(
  layout: TasbeehStrandLayout,
  translationX: number,
  translationY: number,
  rtl: boolean,
): number {
  "worklet";
  if (layout === "arc") return translationY;
  if (layout === "horizontal") return rtl ? -translationX : translationX;
  return translationX;
}

export type DragState = { counted: boolean };

/**
 * One pan update. Returns the visual drag fraction (0–1 of one count, never
 * negative — dragging back never subtracts) and whether this update crosses the
 * detent. A gesture counts at most once: after it has counted, further
 * movement is ignored until a new gesture starts.
 */
export function dragStep(
  state: DragState,
  distance: number,
  geometry: Pick<StrandGeometry, "pitch" | "gapStart" | "gapEnd">,
): { fraction: number; count: boolean } {
  if (state.counted) return { fraction: 0, count: false };
  const forward = Math.max(0, distance);
  const travel = Math.max(1, geometry.gapEnd - geometry.gapStart);
  if (forward >= DRAG_DETENT * geometry.pitch) {
    state.counted = true;
    return { fraction: 0, count: true };
  }
  return { fraction: Math.min(0.95, forward / travel), count: false };
}
