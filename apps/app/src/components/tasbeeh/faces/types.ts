import type { ResolvedTasbeehAppearance } from "@/lib/tasbeeh/designs";

export type { TasbeehDesignId } from "@munib-tracker/shared/types";

/**
 * The shared face contract (NF-3.19). Faces are visual only: the counter shell
 * owns the tap target, accessibility, the target limit, undo / reset, haptics,
 * sound and `onIncrement`. A face that has its own gesture (the misbaha drag)
 * asks to count through `onCount`, the same path a tap takes — and the one
 * hands-free voice counting (NF-3.20) will use.
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
  /** Optional: a face gesture is in progress — the shell ignores stage taps meanwhile. */
  onGestureActive?: (active: boolean) => void;
  /** Tabletop posture (foldables) — horizontal strand. */
  tabletop?: boolean;
  /** Small live preview in the style sheet: static, no gestures. */
  preview?: boolean;
}
