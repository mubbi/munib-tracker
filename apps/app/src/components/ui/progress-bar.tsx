import { useEffect } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Durations, Springs, Stagger } from "@/constants/motion";
import { Radius, Spacing } from "@/constants/theme";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  chartCoordinateStyle,
  progressFillTransformOrigin,
  progressSweepRtl,
  segmentProgressFilled,
} from "@/lib/chart-rtl";

type ProgressBarProps = {
  /** Progress from 0 to 1. */
  value: number;
  /**
   * What is progressing ("Khatm progress", "Fajr Qaza"). Spoken with the
   * percentage, so it must not repeat the number (F-53).
   */
  accessibilityLabel: string;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({
  value,
  accessibilityLabel,
  height = 8,
  color,
  trackColor,
  style,
}: ProgressBarProps) {
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useHydrationSafeReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));

  const progress = useSharedValue(0);
  const fillOrigin = progressFillTransformOrigin();

  useEffect(() => {
    // Reduced motion: progress fills jump to their value.
    progress.value = reducedMotion ? clamped : withSpring(clamped, Springs.gentle);
  }, [clamped, progress, reducedMotion]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      style={[
        styles.track,
        { height, borderRadius: height, backgroundColor: trackColor ?? tokens.track },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: color ?? colors.accent,
            transformOrigin: fillOrigin,
            borderTopStartRadius: height / 2,
            borderBottomStartRadius: height / 2,
            borderTopEndRadius: height / 2,
            borderBottomEndRadius: height / 2,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

/**
 * Segmented progress (ticked bars) matching the "daily activity" pattern in the
 * reference designs. Filled ticks cascade in left-to-right on mount for a subtle
 * sense of momentum.
 */
type SegmentedProgressProps = {
  /** What is progressing; spoken with "n of total", so no numbers here (F-53). */
  accessibilityLabel: string;
  total: number;
  completed: number;
  color?: string;
  trackColor?: string;
};

export function SegmentedProgress({
  accessibilityLabel,
  total,
  completed,
  color,
  trackColor,
}: SegmentedProgressProps) {
  const { colors, tokens } = useThemeTokens();
  const reducedMotion = useHydrationSafeReducedMotion();
  const rtl = progressSweepRtl();
  const clamped = Math.min(Math.max(0, completed), Math.max(0, total));
  const segments = Array.from({ length: Math.max(0, total) });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: Math.max(0, total), now: clamped }}
      style={[styles.segments, chartCoordinateStyle]}
    >
      {segments.map((_, index) => {
        const filled = segmentProgressFilled(index, total, clamped, rtl);
        const animIndex = rtl ? total - 1 - index : index;
        return (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static bar
            key={index}
            style={[styles.segment, { backgroundColor: trackColor ?? tokens.track }]}
          >
            {filled ? (
              <Animated.View
                entering={
                  reducedMotion
                    ? undefined
                    : FadeIn.duration(Durations.base).delay(animIndex * Stagger.base)
                }
                style={[
                  StyleSheet.absoluteFill,
                  styles.segmentFill,
                  { backgroundColor: color ?? colors.accent },
                ]}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    borderCurve: "continuous",
  },
  segments: {
    flexDirection: "row",
    gap: Spacing.one,
    width: "100%",
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  segmentFill: {
    borderRadius: Radius.sm,
  },
});
