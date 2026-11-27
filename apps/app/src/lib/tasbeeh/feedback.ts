/**
 * Tasbeeh feedback table (NF-3.19): one pure mapping from a counting event to
 * the haptic pattern and the sound it plays, for every design. The counter
 * shell dispatches it — haptics always through `triggerHaptic()` (so the global
 * haptics toggle still applies), sound through the tasbeeh sound engine.
 */

import type { TasbeehDesignId, TasbeehHapticsLevel } from "@munib-tracker/shared/types";

import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";

import { type StrandModel, strandCountEvent } from "./bead-layout";
import { getDesign, type ResolvedTasbeehAppearance, strandModelFor } from "./designs";
import { closesRound, roundSizeFor } from "./rounds";
import type { TasbeehSoundKind } from "./sound-packs";

/**
 * - `bead`: an ordinary count
 * - `spacer`: the count that moves a spacer bead (11/22 of 33, 33/66 of 99)
 * - `lap`: a looping strand finished a round
 * - `milestone`: every 33 on designs counted without looking (Focus / Night)
 * - `complete`: the target was reached
 * - `limit`: a tap after the target (nothing is counted)
 * - `undo`: a face gesture took one count back (reverse swipe) — a light
 *   haptic and the bead click, like the bead sliding back
 */
export type TasbeehFeedbackEvent =
  | "bead"
  | "spacer"
  | "lap"
  | "milestone"
  | "complete"
  | "limit"
  | "undo";

export interface TasbeehFeedback {
  /** Played in order, a short beat apart (`medium` ×2 for laps and milestones). */
  haptics: HapticFeedback[];
  sound: TasbeehSoundKind | null;
}

const SUBTLE: Record<TasbeehFeedbackEvent, HapticFeedback[]> = {
  bead: ["light"],
  spacer: ["medium"],
  lap: ["medium", "medium"],
  milestone: ["medium", "medium"],
  complete: ["success"],
  limit: ["light"],
  undo: ["light"],
};

/** Rich: Android tick / detent primitives where the platform has them (selection / medium elsewhere). */
const RICH: Record<TasbeehFeedbackEvent, HapticFeedback[]> = {
  bead: ["tick"],
  spacer: ["detent"],
  lap: ["detent", "detent"],
  milestone: ["detent", "detent"],
  complete: ["success"],
  limit: ["tick"],
  undo: ["tick"],
};

const SOUND: Record<TasbeehFeedbackEvent, TasbeehSoundKind | null> = {
  bead: "bead",
  spacer: "spacer",
  lap: "spacer",
  milestone: "spacer",
  complete: "complete",
  limit: null,
  undo: "bead",
};

/** Haptics + sound for an event. `level: "off"` silences tasbeeh haptics only (sound is its own toggle). */
export function feedbackFor(
  _design: TasbeehDesignId,
  event: TasbeehFeedbackEvent,
  level: TasbeehHapticsLevel,
): TasbeehFeedback {
  const haptics = level === "off" ? [] : level === "rich" ? RICH[event] : SUBTLE[event];
  return { haptics: [...haptics], sound: SOUND[event] };
}

/** Pulse spacing (ms) between the haptics of one event. */
export const HAPTIC_PULSE_GAP_MS = 110;

/** Milestone cadence for designs counted without looking. */
export const MILESTONE_EVERY = 33;

/**
 * Classifies the count that reaches `nextCount` (completion is reported
 * separately when the target is reached). The misbaha reads its strand; Focus /
 * Night marks every 33; the round-based v2 designs (pebbles, fingers, rosette,
 * night sky) mark the end of each round that isn't the last; others count
 * plain beads.
 */
export function countEventFor(
  design: TasbeehDesignId,
  nextCount: number,
  strand?: StrandModel,
  round?: { size: number; target: number },
): Exclude<TasbeehFeedbackEvent, "complete" | "limit" | "undo"> {
  if (getDesign(design).milestones && nextCount > 0 && nextCount % MILESTONE_EVERY === 0) {
    return "milestone";
  }
  if (design === "misbaha" && strand) return strandCountEvent(strand, nextCount);
  if (round && closesRound(nextCount, round.size, round.target)) return "lap";
  return "bead";
}

/**
 * {@link countEventFor} for a resolved appearance: builds the misbaha strand and
 * the round size the face draws, so the counter shell and the style sheet's
 * demo classify a count the same way.
 */
export function countEventForAppearance(
  appearance: Pick<ResolvedTasbeehAppearance, "design" | "misbaha" | "fingers">,
  nextCount: number,
  target: number,
): Exclude<TasbeehFeedbackEvent, "complete" | "limit" | "undo"> {
  const strand =
    appearance.design === "misbaha" ? strandModelFor(appearance.misbaha, target) : undefined;
  const size = roundSizeFor(appearance.design, target, appearance);
  return countEventFor(appearance.design, nextCount, strand, size ? { size, target } : undefined);
}

/**
 * Plays a haptic pattern through `triggerHaptic()` (so the global haptics
 * toggle applies): the first pulse at once, the rest {@link HAPTIC_PULSE_GAP_MS} apart.
 */
export function playHapticPattern(pattern: readonly HapticFeedback[]): void {
  pattern.forEach((haptic, index) => {
    if (index === 0) triggerHaptic(haptic);
    else setTimeout(() => triggerHaptic(haptic), index * HAPTIC_PULSE_GAP_MS);
  });
}
