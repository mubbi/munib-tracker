import { type RefObject, useCallback, useRef } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  type ScrollViewInstance,
  type ViewInstance,
} from "react-native";

import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";

/**
 * "Show results" for computed output that appears below the fold (G-81): scrolls
 * the target heading into view, then moves keyboard / screen-reader focus to it
 * so the result is announced instead of silently appearing. Attach `targetRef`
 * to an `accessible` wrapper around the results heading and call `reveal()`
 * after the results have rendered.
 */
export function useRevealOnShow(scrollRef?: RefObject<ScrollViewInstance | null>) {
  const targetRef = useRef<ViewInstance>(null);
  const reduceMotion = useHydrationSafeReducedMotion();

  const reveal = useCallback(() => {
    // Wait a frame so the results are laid out before measuring.
    setTimeout(() => {
      const target = targetRef.current;
      if (!target) return;
      if (Platform.OS === "web") {
        const el = target as unknown as HTMLElement;
        el.scrollIntoView?.({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        el.focus?.({ preventScroll: true });
        return;
      }
      const scroll = scrollRef?.current;
      const scrollNode = scroll ? findNodeHandle(scroll) : null;
      if (scroll && scrollNode != null) {
        target.measureLayout(
          scrollNode,
          (_x: number, y: number) =>
            scroll.scrollTo({ y: Math.max(0, y - 16), animated: !reduceMotion }),
          () => undefined,
        );
      }
      const node = findNodeHandle(target);
      if (node != null) AccessibilityInfo.setAccessibilityFocus(node);
    }, 0);
  }, [scrollRef, reduceMotion]);

  return { targetRef, reveal };
}
