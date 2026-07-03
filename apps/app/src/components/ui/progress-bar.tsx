import { useEffect } from "react";
import {
  type LayoutChangeEvent,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Springs } from "@/constants/motion";
import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ProgressBarProps = {
  /** Progress from 0 to 1. */
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ value, height = 8, color, trackColor, style }: ProgressBarProps) {
  const { colors, tokens } = useThemeTokens();
  const clamped = Math.min(1, Math.max(0, value));

  const trackWidth = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(clamped, Springs.gentle);
  }, [clamped, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: trackWidth.value * progress.value,
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      onLayout={onLayout}
      style={[
        styles.track,
        { height, borderRadius: height, backgroundColor: trackColor ?? tokens.track },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { height, borderRadius: height, backgroundColor: color ?? colors.accent },
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
  total: number;
  completed: number;
  color?: string;
  trackColor?: string;
};

export function SegmentedProgress({ total, completed, color, trackColor }: SegmentedProgressProps) {
  const { colors, tokens } = useThemeTokens();
  const segments = Array.from({ length: Math.max(0, total) });

  return (
    <View style={styles.segments}>
      {segments.map((_, index) => {
        const filled = index < completed;
        return (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static bar
            key={index}
            style={[styles.segment, { backgroundColor: trackColor ?? tokens.track }]}
          >
            {filled ? (
              <Animated.View
                entering={FadeIn.duration(240).delay(index * 45)}
                style={[styles.segmentFill, { backgroundColor: color ?? colors.accent }]}
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
    borderCurve: "continuous",
  },
  segments: {
    flexDirection: "row",
    gap: 3,
    width: "100%",
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  segmentFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.sm,
  },
});
