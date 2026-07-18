import { useEffect, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Springs } from "@/constants/motion";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  chartCoordinateStyle,
  segmentedThumbAnchor,
  segmentedThumbOffset,
  segmentedTrackDirection,
} from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { isRTL, ltrControlViewProps } from "@/lib/rtl";

type SegmentOption<T extends string> = {
  id: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

const PAD = Spacing.half + 2;
const GAP = Spacing.half;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors, tokens } = useThemeTokens();
  const [trackWidth, setTrackWidth] = useState(0);

  const count = options.length;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );
  const segmentWidth = trackWidth > 0 ? (trackWidth - PAD * 2 - GAP * (count - 1)) / count : 0;

  // Native RTL mirrors absolute `left`/`translateX` while flex also reverses
  // segment order — the same double-flip that breaks chart knobs. Lock an LTR
  // coordinate plane, mirror segment order explicitly, and anchor the thumb to
  // the reading-direction start (right in RTL, left in LTR).
  const rtl = isRTL();
  const thumbTravel = segmentedThumbOffset(selectedIndex, segmentWidth, GAP, rtl);

  const translateX = useSharedValue(0);
  useEffect(() => {
    translateX.value = withSpring(thumbTravel, Springs.gentle);
  }, [thumbTravel, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  return (
    <View
      {...ltrControlViewProps()}
      style={[
        styles.container,
        chartCoordinateStyle,
        { flexDirection: segmentedTrackDirection() },
        { backgroundColor: colors.muted },
      ]}
      onLayout={onLayout}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            segmentedThumbAnchor(PAD, rtl),
            { width: segmentWidth, backgroundColor: tokens.segmentThumb, pointerEvents: "none" },
            thumbStyle,
          ]}
        />
      ) : null}

      {options.map((option) => {
        const selected = option.id === value;
        return (
          <PressableScale
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            haptic={false}
            scaleTo={0.98}
            rippleRadius={Radius.sm}
            onPress={() => {
              if (!selected) triggerHaptic("selection");
              onChange(option.id);
            }}
            style={styles.segment}
          >
            <ThemedText
              type="smallBold"
              style={{ color: selected ? colors.foreground : colors.mutedForeground }}
            >
              {option.label}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "stretch",
    padding: PAD,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: GAP,
    overflow: "hidden",
  },
  thumb: {
    position: "absolute",
    top: PAD,
    bottom: PAD,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    ...Shadows.sm,
  },
  segment: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
