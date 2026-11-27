import { useLayoutEffect, useRef } from "react";
import { Easing, type SharedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { Durations } from "@/constants/motion";

const CURVES = {
  quad: Easing.out(Easing.quad),
  cubic: Easing.out(Easing.cubic),
} as const;

/**
 * Shared step animation for the faces: a 0 → 1 progress that runs once for a
 * single forward count (+1) and rests at 1 otherwise. Undo, reset, big jumps
 * and reduced motion snap straight to 1, so a face never animates backwards or
 * replays a whole round. A layout effect rewinds before paint, so a moving item
 * never flashes at its destination first.
 */
export function useForwardStep(
  count: number,
  { animate, curve = "quad" }: { animate: boolean; curve?: keyof typeof CURVES },
): SharedValue<number> {
  const step = useSharedValue(1);
  const prevCount = useRef(count);
  useLayoutEffect(() => {
    const delta = count - prevCount.current;
    prevCount.current = count;
    if (delta !== 1 || !animate) {
      step.value = 1;
      return;
    }
    step.value = 0;
    step.value = withTiming(1, { duration: Durations.slow, easing: CURVES[curve] });
  }, [count, step, animate, curve]);
  return step;
}
