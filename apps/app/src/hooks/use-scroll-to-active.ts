import { type RefObject, useCallback, useEffect, useRef } from "react";
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";

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
 * Virtualized sibling of {@link useScrollToActive} for lists rendered with a
 * `FlatList`. Rows are off-screen (unmounted) most of the time, so we can't
 * `measure()` them — instead we resolve `activeKey` to a **data index** and call
 * `scrollToIndex`. When the target row hasn't been laid out yet (common when
 * scrolling far into a virtualized list) `onScrollToIndexFailed` fires; we scroll
 * roughly toward it, then retry once layout catches up.
 *
 * `indexForKey(activeKey)` returns the row's index in the FlatList `data`, or -1
 * when the key isn't in the list. `viewOffset` mirrors the pixel padding the
 * ScrollView variant left above the active card (header inset).
 */
export function useScrollToActiveIndex(
  listRef: RefObject<FlatList | null>,
  activeKey: string | null | undefined,
  indexForKey: (key: string) => number,
  viewOffset = 96,
) {
  // Keep the latest resolver without re-running the scroll effect on each render.
  const resolver = useRef(indexForKey);
  resolver.current = indexForKey;

  useEffect(() => {
    if (!activeKey) return;
    const index = resolver.current(activeKey);
    if (index < 0) return;
    // Defer so a freshly-mounted list has a settled layout before we scroll.
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({ index, viewOffset, animated: true });
    }, 60);
    return () => clearTimeout(timer);
  }, [activeKey, listRef, viewOffset]);

  // Pass to FlatList: recover when the target row isn't measured yet.
  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      const list = listRef.current;
      if (!list) return;
      // Nudge toward the row using the average item height, then retry once the
      // rows around it have mounted and their real offsets are known.
      list.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
      setTimeout(() => {
        list.scrollToIndex({ index: info.index, viewOffset, animated: true });
      }, 80);
    },
    [listRef, viewOffset],
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
