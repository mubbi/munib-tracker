/**
 * Finger counting design (NF-3.19 v2): a line-art hand that marks the next
 * fingertip or finger joint on each count. A visual aid for the Sunnah method
 * (Abu Dawud 1501 — see docs/proofs/tasbeeh-designs.md); the user's own finger
 * method is just as valid. Pure geometry in a 100 × 120 unit box per hand, palm
 * facing the viewer, fingers up. Hands are physical, so RTL does not mirror them.
 */

import type { TasbeehFingerLayout } from "@munib-tracker/shared/types";

export const HAND_BOX = { width: 100, height: 120 } as const;

export type FingerId = "thumb" | "index" | "middle" | "ring" | "little";
export type HandSide = "right" | "left";

export interface FingerShape {
  id: FingerId;
  /** Base centre (where the finger meets the palm) and tip centre. */
  base: { x: number; y: number };
  tip: { x: number; y: number };
  /** Finger width. */
  width: number;
}

/** Right hand, palm towards the viewer: thumb on the viewer's right. */
const RIGHT_FINGERS: readonly FingerShape[] = [
  { id: "little", base: { x: 27, y: 62 }, tip: { x: 22, y: 30 }, width: 12 },
  { id: "ring", base: { x: 41, y: 58 }, tip: { x: 39, y: 15 }, width: 13 },
  { id: "middle", base: { x: 55, y: 57 }, tip: { x: 55, y: 9 }, width: 13.5 },
  { id: "index", base: { x: 69, y: 59 }, tip: { x: 72, y: 17 }, width: 13 },
  { id: "thumb", base: { x: 75, y: 93 }, tip: { x: 90, y: 64 }, width: 13 },
];

/** Palm outline (right hand), a rounded quadrilateral path in unit coordinates. */
const RIGHT_PALM =
  "M 20 62 Q 20 54 28 54 L 74 54 Q 82 56 82 66 L 82 100 Q 80 116 62 117 L 38 117 Q 21 116 20 100 Z";

function mirrorX(x: number): number {
  return HAND_BOX.width - x;
}

export function fingersFor(side: HandSide): FingerShape[] {
  if (side === "right") return RIGHT_FINGERS.map((f) => ({ ...f }));
  return RIGHT_FINGERS.map((f) => ({
    ...f,
    base: { x: mirrorX(f.base.x), y: f.base.y },
    tip: { x: mirrorX(f.tip.x), y: f.tip.y },
  }));
}

/** Palm path for a hand (the left hand mirrors the right). */
export function palmPath(side: HandSide): string {
  if (side === "right") return RIGHT_PALM;
  return RIGHT_PALM.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x: string, y: string) => {
    return `${mirrorX(Number(x))} ${y}`;
  });
}

/** Point `t` of the way from a finger's tip (0) to its base (1). */
export function alongFinger(finger: FingerShape, t: number): { x: number; y: number } {
  return {
    x: finger.tip.x + (finger.base.x - finger.tip.x) * t,
    y: finger.tip.y + (finger.base.y - finger.tip.y) * t,
  };
}

/** Finger length in unit space. */
export function fingerLength(finger: FingerShape): number {
  return Math.hypot(finger.base.x - finger.tip.x, finger.base.y - finger.tip.y);
}

/** Rotation (degrees) that turns an upright capsule onto the finger's axis. */
export function fingerAngle(finger: FingerShape): number {
  return (Math.atan2(finger.tip.x - finger.base.x, finger.base.y - finger.tip.y) * 180) / Math.PI;
}

export interface FingerSpot {
  side: HandSide;
  finger: FingerId;
  /** 0 = fingertip; 1–2 further joints towards the palm (joints layout). */
  segment: number;
  /** Centre in the hand's unit box. */
  x: number;
  y: number;
}

const ORDER: readonly FingerId[] = ["thumb", "index", "middle", "ring", "little"];

/**
 * The counting spots in order.
 * - `tips`: the right hand's five fingertips (thumb → little finger), then the
 *   left hand's — 10 per round.
 * - `joints`: the right hand only, each finger tip → base over its three
 *   segments — 15 per round.
 */
export function fingerSpots(layout: TasbeehFingerLayout): FingerSpot[] {
  const spots: FingerSpot[] = [];
  const sides: HandSide[] = layout === "tips" ? ["right", "left"] : ["right"];
  for (const side of sides) {
    const fingers = fingersFor(side);
    for (const id of ORDER) {
      const finger = fingers.find((f) => f.id === id) as FingerShape;
      const segments = layout === "tips" ? [0] : [0, 1, 2];
      for (const segment of segments) {
        // Segment centres at 1/6, 1/2 and 5/6 of the finger; a tip sits just inside the end.
        const t = layout === "tips" ? 0.1 : (segment * 2 + 1) / 6;
        const p = alongFinger(finger, t);
        spots.push({ side, finger: id, segment, x: p.x, y: p.y });
      }
    }
  }
  return spots;
}

/** Crease positions (0–1 from the tip) drawn on each finger in the joints layout. */
export const JOINT_CREASES = [1 / 3, 2 / 3] as const;

/** Hands drawn for a layout, in the order they appear on screen (left to right). */
export function handsFor(layout: TasbeehFingerLayout): HandSide[] {
  return layout === "tips" ? ["left", "right"] : ["right"];
}
