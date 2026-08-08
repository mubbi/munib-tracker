import { type RefObject, useCallback, useEffect, useRef } from "react";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import { useWindowDimensions } from "react-native";

import { useObstructedBottomInset } from "@/hooks/use-content-bottom-inset";

/**
 * Scrolls a `ScrollView` so the card matching `activeKey` is brought into view.
 * Used to follow the currently-playing audio card (a Qur'an ayah, a name of
 * Allah). Cards register a native node via the returned `register` callback ref;
 * when the active key changes we measure the card and the scroll container in
 * window coordinates and animate to the card's content offset. Uses `measure()`
 * (cross-platform — `findNodeHandle` is not supported on web). Pausing does not
 * change `activeKey`, so the active card stays put.
 */
export function useScrollToActive(
  scrollRef: RefObject<ScrollView | null>,
  activeKey: string | null | undefined,
  offset = 96,
) {
  const nodes = useRef(new Map<string, View>());
  const scrollY = useRef(0);

  const register = useCallback(
    (key: string) => (node: View | null) => {
      if (node) nodes.current.set(key, node);
      else nodes.current.delete(key);
    },
    [],
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = event.nativeEvent.contentOffset?.y ?? 0;
  }, []);

  useEffect(() => {
    if (!activeKey) return;
    // Defer so freshly-mounted rows have a settled layout.
    const timer = setTimeout(() => {
      const node = nodes.current.get(activeKey);
      const scroll = scrollRef.current;
      // ScrollView's ref exposes scrollTo; measure lives on the host node.
      const scrollNode = scroll as unknown as View | null;
      if (!node?.measure || !scroll || !scrollNode?.measure) return;
      scrollNode.measure(
        (
          _sx: number,
          _sy: number,
          _sw: number,
          _sh: number,
          _spx: number,
          containerPageY: number,
        ) => {
          node.measure(
            (
              _cx: number,
              _cy: number,
              _cw: number,
              _ch: number,
              _cpx: number,
              cardPageY: number,
            ) => {
              const target = scrollY.current + (cardPageY - containerPageY) - offset;
              scroll.scrollTo({ y: Math.max(0, target), animated: true });
            },
          );
        },
      );
    }, 60);
    return () => clearTimeout(timer);
  }, [activeKey, scrollRef, offset]);

  return { register, onScroll };
}

/**
 * Horizontal sibling of {@link useScrollToActive} for chip / pill bars.
 * Centers the active chip in the viewport when `activeKey` is set (e.g. deep
 * link onto Maghrib/Witr after-salah filters). Pass `null` until the bar is
 * mounted so the effect re-runs after first layout.
 */
export function useScrollToActiveHorizontal(
  scrollRef: RefObject<ScrollView | null>,
  activeKey: string | null | undefined,
) {
  const nodes = useRef(new Map<string, View>());
  const scrollX = useRef(0);

  const register = useCallback(
    (key: string) => (node: View | null) => {
      if (node) nodes.current.set(key, node);
      else nodes.current.delete(key);
    },
    [],
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.current = event.nativeEvent.contentOffset?.x ?? 0;
  }, []);

  useEffect(() => {
    if (!activeKey) return;
    const timer = setTimeout(() => {
      const node = nodes.current.get(activeKey);
      const scroll = scrollRef.current;
      const scrollNode = scroll as unknown as View | null;
      if (!node?.measure || !scroll || !scrollNode?.measure) return;
      scrollNode.measure(
        (_sx: number, _sy: number, sw: number, _sh: number, spx: number, _spy: number) => {
          node.measure(
            (_cx: number, _cy: number, cw: number, _ch: number, cpx: number, _cpy: number) => {
              const chipLeftInContent = scrollX.current + (cpx - spx);
              const target = chipLeftInContent - (sw - cw) / 2;
              scroll.scrollTo({ x: Math.max(0, target), animated: true });
            },
          );
        },
      );
    }, 60);
    return () => clearTimeout(timer);
  }, [activeKey, scrollRef]);

  return { register, onScroll };
}

function isIndexInRange(index: number, itemCount: number | undefined): boolean {
  return index >= 0 && (itemCount == null || index < itemCount);
}

export type ScrollToActiveIndexConfig = {
  /** Distance from the top of the viewport to the active row (header inset). */
  viewOffset?: number;
  /**
   * Where in the viewport to place the row (0 = top, 1 = bottom).
   * When omitted, biases upward to clear the docked mini-player.
   */
  viewPosition?: number;
  /** Total data length — out-of-range indices are ignored. */
  itemCount?: number;
  /** For multi-column lists, average row height (not per-cell height). */
  numColumns?: number;
  /** Estimated `ListHeaderComponent` height for scroll recovery. */
  listHeaderHeight?: number;
};

/** Compute a viewPosition that keeps rows above the docked mini-player. */
export function useScrollFollowViewPosition(explicit?: number): number {
  const { height } = useWindowDimensions();
  const obstructed = useObstructedBottomInset();
  if (explicit != null) return explicit;
  if (height <= 0) return 0.35;
  return Math.max(0.22, Math.min(0.45, 0.5 - obstructed / height / 2));
}

/**
 * Virtualized sibling of {@link useScrollToActive} for lists rendered with a
 * `FlatList`. Rows are off-screen (unmounted) most of the time, so we can't
 * `measure()` them — instead we resolve `activeKey` to a **data index** and call
 * `scrollToIndex`. When the target row hasn't been laid out yet (common when
 * scrolling far into a virtualized list) `onScrollToIndexFailed` fires; we scroll
 * roughly toward it, then retry once layout catches up.
 */
export function useScrollToActiveIndex(
  listRef: RefObject<FlatList | null>,
  activeKey: string | null | undefined,
  indexForKey: (key: string) => number,
  config: ScrollToActiveIndexConfig = {},
) {
  const {
    viewOffset = 96,
    viewPosition: explicitViewPosition,
    itemCount,
    numColumns = 1,
    listHeaderHeight = 0,
  } = config;

  const viewPosition = useScrollFollowViewPosition(explicitViewPosition);

  const resolver = useRef(indexForKey);
  resolver.current = indexForKey;
  const countRef = useRef(itemCount);
  countRef.current = itemCount;
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollConfigRef = useRef({ viewOffset, viewPosition, numColumns, listHeaderHeight });
  scrollConfigRef.current = { viewOffset, viewPosition, numColumns, listHeaderHeight };

  const scrollToIndexSafe = useCallback(
    (index: number, animated: boolean) => {
      const list = listRef.current;
      if (!list || !isIndexInRange(index, countRef.current)) return;
      const { viewOffset: offset, viewPosition: position } = scrollConfigRef.current;
      try {
        list.scrollToIndex({ index, viewOffset: offset, viewPosition: position, animated });
      } catch {
        // RN web throws synchronously when the index is out of range.
      }
    },
    [listRef],
  );

  useEffect(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (!activeKey) return;
    const index = resolver.current(activeKey);
    if (!isIndexInRange(index, countRef.current)) return;
    // Always animated: a non-animated jump emits a single scroll event, and two
    // sparse events in a row trip VirtualizedList's naive "slow to update"
    // heuristic (dt > 500 between events) even on an idle JS thread.
    const timer = setTimeout(() => scrollToIndexSafe(index, true), 60);
    return () => clearTimeout(timer);
  }, [activeKey, scrollToIndexSafe]);

  useEffect(
    () => () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    },
    [],
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      const list = listRef.current;
      if (!list || !isIndexInRange(info.index, countRef.current)) return;
      const { numColumns: cols, listHeaderHeight: headerHeight } = scrollConfigRef.current;
      const row = Math.floor(info.index / cols);
      list.scrollToOffset({
        offset: headerHeight + row * info.averageItemLength,
        animated: false,
      });
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;
        scrollToIndexSafe(info.index, true);
      }, 80);
    },
    [listRef, scrollToIndexSafe],
  );

  return { onScrollToIndexFailed };
}

/** Scroll a `ScrollView` so `childRef` is visible (e.g. after a quick-action tap). */
export function scrollChildIntoView(
  scrollRef: RefObject<ScrollView | null>,
  childRef: RefObject<View | null>,
  scrollY: number,
  offset = 96,
) {
  const node = childRef.current;
  const scroll = scrollRef.current;
  const scrollNode = scroll as unknown as View | null;
  if (!node?.measure || !scroll || !scrollNode?.measure) return;
  scrollNode.measure(
    (_sx: number, _sy: number, _sw: number, _sh: number, _spx: number, containerPageY: number) => {
      node.measure(
        (_cx: number, _cy: number, _cw: number, _ch: number, _cpx: number, cardPageY: number) => {
          const target = scrollY + (cardPageY - containerPageY) - offset;
          scroll.scrollTo({ y: Math.max(0, target), animated: true });
        },
      );
    },
  );
}
