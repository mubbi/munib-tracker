import { useCallback, useEffect, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { Spacing } from "@/constants/theme";

/**
 * Scroll-driven reader chrome: the compact reading toolbar appears once the
 * header card scrolls out of view, and the sticky tajweed swatch bar once the
 * in-list legend does. Owns the latest list offset (`scrollYRef`) so other
 * scroll consumers (resume tracking) read the same value.
 */
export function useReaderChromeVisibility(showTajweed: boolean) {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [tajweedBarVisible, setTajweedBarVisible] = useState(false);
  const headerCardHeightRef = useRef(0);
  const tajweedLegendBottomRef = useRef(0);
  const showTajweedRef = useRef(false);
  const scrollYRef = useRef(0);
  showTajweedRef.current = showTajweed;

  const onHeaderCardLayout = useCallback((event: LayoutChangeEvent) => {
    headerCardHeightRef.current = event.nativeEvent.layout.height;
  }, []);

  const onTajweedLegendLayout = useCallback((event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    const bottom = y + height;
    tajweedLegendBottomRef.current = bottom;
    const next = showTajweedRef.current && scrollYRef.current > Math.max(0, bottom - Spacing.four);
    setTajweedBarVisible((prev) => (prev === next ? prev : next));
  }, []);

  /** Stable — call from the list's `onScroll` with `contentOffset.y`. */
  const onScrollOffset = useCallback((y: number) => {
    scrollYRef.current = y;
    const threshold = Math.max(0, headerCardHeightRef.current - Spacing.four);
    const nextToolbar = y > threshold;
    setToolbarVisible((prev) => (prev === nextToolbar ? prev : nextToolbar));

    const legendBottom = tajweedLegendBottomRef.current;
    const nextTajweedBar =
      showTajweedRef.current && legendBottom > 0 && y > Math.max(0, legendBottom - Spacing.four);
    setTajweedBarVisible((prev) => (prev === nextTajweedBar ? prev : nextTajweedBar));
  }, []);

  useEffect(() => {
    if (!showTajweed) {
      setTajweedBarVisible(false);
      return;
    }
    const bottom = tajweedLegendBottomRef.current;
    if (bottom > 0 && scrollYRef.current > Math.max(0, bottom - Spacing.four)) {
      setTajweedBarVisible(true);
    }
  }, [showTajweed]);

  return {
    toolbarVisible,
    tajweedBarVisible,
    scrollYRef,
    onHeaderCardLayout,
    onTajweedLegendLayout,
    onScrollOffset,
  };
}
