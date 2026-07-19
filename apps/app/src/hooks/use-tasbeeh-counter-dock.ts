import { useCallback, useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  type View,
} from "react-native";

/** Min visible height of the main counter before we treat it as “on screen”. */
const VISIBLE_COUNTER_PX = 140;

/**
 * Measures whether the in-page tasbeeh counter is usable without scrolling.
 * When it is mostly below the fold (long Arabic reading above it), expose a
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
        const usable = visibleSpan >= Math.min(h, VISIBLE_COUNTER_PX);
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
