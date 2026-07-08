import { Children, forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Durations } from "@/constants/motion";
import type { PagerViewHandle, PagerViewProps } from "./pager-view-types";

const SLIDE_EASING = Easing.out(Easing.cubic);

/**
 * Web-safe stand-in for `react-native-pager-view`. Only the active page (plus the
 * incoming/outgoing pair during a transition) is mounted. Imperative `setPage`
 * slides pages horizontally so footer next/previous feels like turning a leaf.
 */
const PagerView = forwardRef<PagerViewHandle, PagerViewProps>(
  ({ style, initialPage = 0, onPageSelected, children }, ref) => {
    const pages = Children.toArray(children);
    const pageCount = pages.length;
    const [index, setIndex] = useState(initialPage);
    const [transition, setTransition] = useState<{ from: number; to: number } | null>(null);
    const progress = useSharedValue(0);
    const pageWidth = useSharedValue(0);
    const slideSign = useSharedValue(1);
    const animatingRef = useRef(false);
    const indexRef = useRef(index);
    indexRef.current = index;

    const finishTransition = useCallback(
      (nextIndex: number) => {
        setIndex(nextIndex);
        setTransition(null);
        animatingRef.current = false;
        onPageSelected?.({ nativeEvent: { position: nextIndex } });
      },
      [onPageSelected],
    );

    const startTransition = useCallback(
      (target: number) => {
        const clamped = Math.max(0, Math.min(target, Math.max(0, pageCount - 1)));
        const from = indexRef.current;
        if (clamped === from && !animatingRef.current) return;

        if (pageWidth.value <= 0) {
          setIndex(clamped);
          indexRef.current = clamped;
          onPageSelected?.({ nativeEvent: { position: clamped } });
          return;
        }

        animatingRef.current = true;
        slideSign.value = clamped > from ? 1 : -1;
        setTransition({ from, to: clamped });
        progress.value = 0;
        progress.value = withTiming(
          1,
          { duration: Durations.base, easing: SLIDE_EASING },
          (finished) => {
            if (finished) runOnJS(finishTransition)(clamped);
          },
        );
      },
      [finishTransition, onPageSelected, pageCount, pageWidth, progress, slideSign],
    );

    useImperativeHandle(
      ref,
      () => ({
        setPage: startTransition,
      }),
      [startTransition],
    );

    const onLayout = useCallback(
      (event: LayoutChangeEvent) => {
        pageWidth.value = event.nativeEvent.layout.width;
      },
      [pageWidth],
    );

    const outgoingStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: slideSign.value * progress.value * pageWidth.value }],
    }));

    const incomingStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: slideSign.value * (progress.value - 1) * pageWidth.value }],
    }));

    const safeIndex = Math.max(0, Math.min(index, Math.max(0, pageCount - 1)));

    return (
      <View style={[styles.container, style]} onLayout={onLayout}>
        {transition ? (
          <>
            <Animated.View style={[styles.page, outgoingStyle]} pointerEvents="none">
              {pages[transition.from] ?? null}
            </Animated.View>
            <Animated.View style={[styles.page, incomingStyle]}>
              {pages[transition.to] ?? null}
            </Animated.View>
          </>
        ) : (
          (pages[safeIndex] ?? null)
        )}
      </View>
    );
  },
);

PagerView.displayName = "PagerView";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  page: {
    ...StyleSheet.absoluteFill,
  },
});

export default PagerView;
export type { PagerViewHandle, PagerViewProps } from "./pager-view-types";
