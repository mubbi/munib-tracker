/**
 * Rounds for the v2 counter designs (NF-3.19 P3): pebbles, finger counting,
 * the geometric rosette and the night sky each show one *round* at a time and
 * start the next round when it fills. Pure maths — the shell still owns the
 * count; a design only decides how many marks one round shows.
 */

import type { TasbeehDesignId, TasbeehFingerLayout } from "@munib-tracker/shared/types";

/** The round size for most designs: one third of 99, as on a 33-bead strand. */
export const ROUND_SIZE = 33;

/** Marks per round in each finger layout: fingertips of both hands, or right-hand joints. */
export const FINGER_ROUND: Record<TasbeehFingerLayout, number> = { tips: 10, joints: 15 };

/**
 * Marks one round shows, or `undefined` for designs that don't count in rounds
 * (the misbaha has its own strand model). A small target fills one round
 * exactly (target 10 ⇒ ten pebbles); bigger targets and ∞ repeat 33-rounds.
 */
export function roundSizeFor(
  design: TasbeehDesignId,
  target: number,
  appearance: { fingers: { layout: TasbeehFingerLayout } },
): number | undefined {
  switch (design) {
    case "fingers":
      return FINGER_ROUND[appearance.fingers.layout];
    case "pebbles":
    case "geometric":
    case "stars":
      return target > 0 && target <= ROUND_SIZE ? target : ROUND_SIZE;
    default:
      return undefined;
  }
}

export interface RoundState {
  /** Marks in a round. */
  size: number;
  /** 1-based round number. */
  lap: number;
  /** Marks done in this round, 0..size. A finished round stays full until the next count. */
  done: number;
}

export function roundState(count: number, size: number): RoundState {
  const safeSize = Math.max(1, Math.floor(size));
  const n = Math.max(0, Math.floor(count));
  if (n === 0) return { size: safeSize, lap: 1, done: 0 };
  const lap = Math.ceil(n / safeSize);
  return { size: safeSize, lap, done: n - (lap - 1) * safeSize };
}

/**
 * Whether the count that reaches `nextCount` closes a round that isn't the
 * last one (reaching the target is reported as completion instead).
 */
export function closesRound(nextCount: number, size: number, target: number): boolean {
  if (nextCount <= 0 || size <= 0 || nextCount % size !== 0) return false;
  return target <= 0 || nextCount < target;
}

/** Deterministic 0–1 value for an index (layout jitter that never changes between renders). */
export function unitHash(index: number, salt = 0): number {
  let h = (Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 7, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0;
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39) >>> 0;
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
}
