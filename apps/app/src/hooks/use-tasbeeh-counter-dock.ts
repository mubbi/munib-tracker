import { useCallback, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  type View,
} from "react-native";

/** Fraction of the main counter that must be on screen before we hide the dock. */
const USABLE_VISIBLE_RATIO = 0.5;

/**
 * Measures whether the in-page tasbeeh counter is usable without scrolling.
 * When less than half of it is visible (long Arabic reading above it), expose a
 * floating bottom dock so the user can keep counting while reading.
 */
export function useTasbeehCounterDock() {
  const counterRef = useRef<View>(null);
  const { height: windowHeight } = useWindowDimensions();
  const [dockVisible, setDockVisible] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const rafRef = useRef<number | null>(null);

  const recompute = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      counterRef.current?.measureInWindow((_x, y, _w, h) => {
        if (h <= 0 || windowHeight <= 0) return;
        const visibleTop = Math.max(y, 0);
        const visibleBottom = Math.min(y + h, windowHeight);
        const visibleSpan = Math.max(0, visibleBottom - visibleTop);
        const usable = visibleSpan >= h * USABLE_VISIBLE_RATIO;
        setDockVisible(!usable);
        setHasMeasured(true);
      });
    });
  }, [windowHeight]);

  const onScroll = useCallback(
    (_event?: NativeSyntheticEvent<NativeScrollEvent>) => {
      recompute();
    },
    [recompute],
  );

  const onCounterLayout = useCallback(
    (_event?: LayoutChangeEvent) => {
      recompute();
    },
    [recompute],
  );

  return {
    counterRef,
    /** Only true after the first layout pass so we never flash the dock briefly. */
    dockVisible: hasMeasured && dockVisible,
    onScroll,
    onCounterLayout,
    recompute,
  };
}
