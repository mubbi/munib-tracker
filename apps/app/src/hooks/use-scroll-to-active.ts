import { type RefObject, useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";

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
