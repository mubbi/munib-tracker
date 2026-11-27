import type { ResolvedTasbeehAppearance } from "@/lib/tasbeeh/designs";

export type { TasbeehDesignId } from "@munib-tracker/shared/types";

/**
 * The shared face contract (NF-3.19). Faces are visual only: the counter shell
 * owns the tap target, accessibility, the target limit, undo / reset, haptics,
 * sound and `onIncrement`. A face that has its own gesture (the misbaha drag,
 * the pebbles swipe) asks to count through `onCount`, the same path a tap takes
 * (and hands-free voice counting, NF-3.20), and to take one back through
 * `onUndo`, the same path as the Undo button.
 */
export interface TasbeehFaceProps {
  /** displayCount (already clamped to the target). */
  count: number;
  /** 0 = ∞. */
  target: number;
  complete: boolean;
  /** Stage box from the shell (TV / tabletop aware). */
  size: number;
  tv: boolean;
  reduceMotion: boolean;
  appearance: ResolvedTasbeehAppearance;
  /** Face asks to count; the shell enforces the limit, haptics, sound and onIncrement. */
  onCount: (event: "bead" | "spacer") => void;
  /**
   * Optional: a reverse swipe asks to undo one count — the Undo button's path
   * (never below 0; the shell adds the light haptic and click). Absent → the
   * face's gestures only ever count.
   */
  onUndo?: () => void;
  /** Optional: a face gesture is in progress — the shell ignores stage taps meanwhile. */
  onGestureActive?: (active: boolean) => void;
  /** Tabletop posture (foldables) — horizontal strand. */
  tabletop?: boolean;
  /** Small live preview in the style sheet: static, no gestures. */
  preview?: boolean;
}
