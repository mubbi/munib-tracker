/**
 * Pebbles / date pits design (NF-3.19 v2, D16): each count moves one pit or
 * pebble from the start dish to the end dish. Pure geometry — slots are packed
 * with a sunflower (phyllotaxis) spiral so a dish of any size looks natural,
 * with deterministic jitter so nothing shifts between renders.
 */

import type { TasbeehPebbleItem } from "@munib-tracker/shared/types";

import { unitHash } from "./rounds";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export interface Point {
  x: number;
  y: number;
}

export interface PebbleSlot extends Point {
  /** Degrees; pits lie at varied angles, stones barely turn. */
  rotate: number;
  /** Size factor, ~0.88–1.12. */
  scale: number;
  /** Index into the item's tone list. */
  tone: number;
}

export interface Dish {
  cx: number;
  cy: number;
  /** Inner (usable) half-axes. */
  rx: number;
  ry: number;
}

export interface PebbleGeometry {
  width: number;
  height: number;
  /** Where uncounted items wait (the reading-start side). */
  source: Dish;
  /** Where counted items collect (the reading-end side). */
  counted: Dish;
  /** Item length along its long axis. */
  item: number;
}

/** Dish half-axes as a share of the dish box: the rim is drawn outside the usable area. */
const DISH_FILL = 0.8;

/**
 * Two dishes side by side, source at the reading start (left in LTR, right in
 * RTL). `capacity` is the round size; items shrink so a full dish never overflows.
 */
export function pebbleGeometry(
  width: number,
  height: number,
  capacity: number,
  rtl: boolean,
): PebbleGeometry {
  const gap = width * 0.06;
  const dishW = (width - gap) / 2;
  const rx = (dishW / 2) * DISH_FILL;
  const ry = (height / 2) * DISH_FILL;
  const startX = dishW / 2;
  const endX = width - dishW / 2;
  const cy = height / 2;
  // Each item occupies ~55% of its share of the ellipse area.
  const share = (Math.PI * rx * ry) / Math.max(1, capacity);
  const item = Math.max(4, Math.min(Math.sqrt(share * 0.55) * 1.25, ry * 0.9));
  const left: Dish = { cx: startX, cy, rx, ry };
  const right: Dish = { cx: endX, cy, rx, ry };
  return {
    width,
    height,
    source: rtl ? right : left,
    counted: rtl ? left : right,
    item,
  };
}

/**
 * Slot `index` of `capacity` inside a dish. Slot 0 sits at the centre and the
 * spiral grows outward, so a filling dish fills from the middle.
 */
export function pebbleSlot(
  dish: Dish,
  index: number,
  capacity: number,
  item: TasbeehPebbleItem,
  salt = 0,
): PebbleSlot {
  const n = Math.max(1, capacity);
  const i = Math.max(0, Math.min(n - 1, index));
  const radius = Math.sqrt((i + 0.5) / n);
  const angle = i * GOLDEN_ANGLE + salt * 0.7;
  const jitter = (unitHash(i, salt) - 0.5) * 0.12;
  // Keep a half-item margin from the rim.
  const r = Math.min(0.86, radius * 0.86 + jitter);
  return {
    x: dish.cx + Math.cos(angle) * r * dish.rx,
    y: dish.cy + Math.sin(angle) * r * dish.ry,
    rotate:
      item === "pits"
        ? Math.round(unitHash(i, salt + 11) * 180)
        : Math.round((unitHash(i, salt + 11) - 0.5) * 30),
    scale: 0.88 + unitHash(i, salt + 23) * 0.24,
    tone: Math.floor(unitHash(i, salt + 31) * 4),
  };
}

/**
 * Which slots are filled for a round: the source keeps the first
 * `size - done` slots; the counted dish holds `done`. The item that moved last
 * leaves source slot `size - done` and lands in counted slot `done - 1`.
 */
export function pebbleOccupancy(
  size: number,
  done: number,
): { source: number; counted: number; moving: { from: number; to: number } | null } {
  const counted = Math.max(0, Math.min(size, done));
  return {
    source: size - counted,
    counted,
    moving: counted > 0 ? { from: size - counted, to: counted - 1 } : null,
  };
}

/** Linear move with a gentle lift, so the item arcs over the dish rims. Worklet-safe. */
export function pebbleArc(from: Point, to: Point, t: number, lift: number): Point {
  "worklet";
  const p = Math.max(0, Math.min(1, t));
  return {
    x: from.x + (to.x - from.x) * p,
    y: from.y + (to.y - from.y) * p - Math.sin(Math.PI * p) * lift,
  };
}

/** Item colours (material data, exempt from the theme-colour rule like misbaha beads). */
export interface PebbleTone {
  base: string;
  highlight: string;
  shadow: string;
}

export const PEBBLE_TONES: Record<TasbeehPebbleItem, readonly PebbleTone[]> = {
  // Date pits: warm browns with a darker groove.
  pits: [
    { base: "#7A5233", highlight: "#A97C55", shadow: "#4A2F1B" },
    { base: "#6B4529", highlight: "#9A6D47", shadow: "#3F2716" },
    { base: "#85603F", highlight: "#B48B62", shadow: "#523620" },
    { base: "#704A2D", highlight: "#A2774F", shadow: "#44291A" },
  ],
  // River stones: greys and sand.
  stones: [
    { base: "#8D8A84", highlight: "#BDBAB3", shadow: "#56534E" },
    { base: "#A39A8B", highlight: "#CFC7B8", shadow: "#6A6255" },
    { base: "#77797A", highlight: "#A8AAAB", shadow: "#46484A" },
    { base: "#9C8F7E", highlight: "#C9BDAA", shadow: "#62584B" },
  ],
};

/** Box for one item: pits are elongated ovals, stones nearly round. */
export function pebbleBox(
  item: TasbeehPebbleItem,
  length: number,
): { width: number; height: number } {
  return item === "pits"
    ? { width: length, height: length * 0.52 }
    : { width: length * 0.9, height: length * 0.74 };
}
