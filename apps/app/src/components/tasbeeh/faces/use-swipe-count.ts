import { useRef } from "react";
import { usePanGesture } from "react-native-gesture-handler";

import { type DragState, swipeStep } from "@/lib/tasbeeh/bead-layout";

type Options = {
  /** False on TV, in previews and once the target is reached. */
  enabled: boolean;
  /** Distance (dp) along the counting direction that counts / undoes. */
  detent: number;
  /** Projects a pan translation onto the counting direction (forward = positive). */
  project: (translationX: number, translationY: number) => number;
  /** Something to undo (the count is above 0): reverse swipes do nothing otherwise. */
  canUndo: boolean;
  onCount: () => void;
  onUndo?: () => void;
  onGestureActive?: (active: boolean) => void;
  /** Lock the pan to one axis so the screen's vertical scroll keeps working. */
  axis: "x" | "y";
};

/**
 * Swipe-to-count for the directional faces (pebbles): forward past the detent
 * counts one, backward past it undoes one — at most one action per gesture, so
 * a long flick is still a single count. Taps keep working (the shell's tap
 * guard ignores the click a swipe may also produce). The pan only activates
 * along `axis`, so scrolling the screen the other way is never captured.
 */
export function useSwipeCount({
  enabled,
  detent,
  project,
  canUndo,
  onCount,
  onUndo,
  onGestureActive,
  axis,
}: Options) {
  const state = useRef<DragState>({ counted: false });
  const active: [number, number] = [-10, 10];
  const fail: [number, number] = [-14, 14];
  // Explicit keys: the Worklets plugin cannot workletize a spread config.
  return usePanGesture({
    runOnJS: true,
    enabled,
    activeOffsetX: axis === "x" ? active : undefined,
    failOffsetY: axis === "x" ? fail : undefined,
    activeOffsetY: axis === "y" ? active : undefined,
    failOffsetX: axis === "y" ? fail : undefined,
    onActivate: () => {
      state.current = { counted: false };
      onGestureActive?.(true);
    },
    onUpdate: (event) => {
      const action = swipeStep(
        state.current,
        project(event.translationX, event.translationY),
        detent,
        canUndo && onUndo != null,
      );
      if (action === "count") onCount();
      else if (action === "undo") onUndo?.();
    },
    onFinalize: () => {
      onGestureActive?.(false);
    },
  });
}
