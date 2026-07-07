import { useCallback, useRef } from "react";
import { Platform, type ScrollView } from "react-native";

/**
 * On desktop web a horizontal `ScrollView` ignores the (vertical) mouse wheel
 * and can't be click-dragged, so the row looks frozen. This callback ref
 * translates a predominantly-vertical wheel gesture into horizontal scrolling.
 *
 * Returns a ref to spread onto a horizontal `ScrollView`. No-op on native.
 */
export function useHorizontalWheelScroll() {
  const cleanup = useRef<(() => void) | null>(null);

  return useCallback((scroll: ScrollView | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (Platform.OS !== "web" || !scroll) return;

    const node = (
      scroll as unknown as { getScrollableNode?: () => HTMLElement }
    ).getScrollableNode?.();
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      // Leave real horizontal/trackpad gestures and non-scrollable rows alone.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (node.scrollWidth <= node.clientWidth) return;
      node.scrollLeft += event.deltaY;
      event.preventDefault();
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    cleanup.current = () => node.removeEventListener("wheel", onWheel);
  }, []);
}
