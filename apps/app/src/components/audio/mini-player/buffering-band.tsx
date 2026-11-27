import { useEffect } from "react";
import { type LayoutChangeEvent, StyleSheet } from "react-native";
import Reanimated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";

const BUFFER_SWEEP_MS = 1200;

/**
 * Continuous dual-band shimmer while audio is loading — runs on the UI thread.
 * Reduced motion: a static soft band across the track (no `withRepeat`).
 */
export function BufferingBand({ color, active }: { color: string; active: boolean }) {
  const trackWidth = useSharedValue(0);
  const phase = useSharedValue(0);
  const fade = useSharedValue(0);
  const reduceMotion = useHydrationSafeReducedMotion();

  // Keep the sweep running even when hidden so re-showing never restarts cold.
  useEffect(() => {
    if (reduceMotion) {
      phase.value = 0;
      return;
    }
    phase.value = 0;
    phase.value = withRepeat(
      withTiming(1, { duration: BUFFER_SWEEP_MS, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(phase);
  }, [phase, reduceMotion]);

  useEffect(() => {
    fade.value = withTiming(active ? 1 : 0, {
      duration: active ? 140 : 90,
      easing: Easing.out(Easing.quad),
    });
  }, [active, fade]);

  const band1Style = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) {
      return { opacity: 0, width: 0, transform: [{ translateX: 0 }] };
    }
    const bandW = Math.max(18, w * 0.28);
    const travel = w + bandW * 2;
    const p = phase.value % 1;
    return {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: bandW,
      backgroundColor: color,
      opacity: fade.value * 0.5,
      transform: [{ translateX: -bandW + p * travel }],
    };
  });

  const band2Style = useAnimatedStyle(() => {
    const w = trackWidth.value;
    if (w <= 0) {
      return { opacity: 0, width: 0, transform: [{ translateX: 0 }] };
    }
    const bandW = Math.max(18, w * 0.28);
    const travel = w + bandW * 2;
    const p = (phase.value + 0.5) % 1;
    return {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: bandW,
      backgroundColor: color,
      opacity: fade.value * 0.35,
      transform: [{ translateX: -bandW + p * travel }],
    };
  });

  const staticStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color,
    opacity: fade.value * 0.3,
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  return (
    <Reanimated.View
      style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
      onLayout={onLayout}
    >
      {reduceMotion ? (
        <Reanimated.View style={staticStyle} />
      ) : (
        <>
          <Reanimated.View style={band1Style} />
          <Reanimated.View style={band2Style} />
        </>
      )}
    </Reanimated.View>
  );
}
