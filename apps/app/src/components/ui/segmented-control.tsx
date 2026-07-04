import { useEffect, useState } from "react";
import { I18nManager, type LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Springs } from "@/constants/motion";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";

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
  const { colors } = useThemeTokens();
  const [trackWidth, setTrackWidth] = useState(0);

  const count = options.length;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );
  const segmentWidth = trackWidth > 0 ? (trackWidth - PAD * 2 - GAP * (count - 1)) / count : 0;

  // In RTL the row of segments is mirrored, so the thumb must travel from the
  // opposite edge. We anchor it to the end (see thumb style) and flip the sign.
  const rtlSign = I18nManager.isRTL ? -1 : 1;

  const translateX = useSharedValue(0);
  useEffect(() => {
    translateX.value = withSpring(rtlSign * selectedIndex * (segmentWidth + GAP), Springs.gentle);
  }, [selectedIndex, segmentWidth, translateX, rtlSign]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  return (
    <View style={[styles.container, { backgroundColor: colors.muted }]} onLayout={onLayout}>
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            // Anchor to the leading edge for the writing direction so the
            // mirrored translateX lands the thumb under the selected segment.
            I18nManager.isRTL ? { right: PAD } : { left: PAD },
            { width: segmentWidth, backgroundColor: colors.card, pointerEvents: "none" },
            thumbStyle,
          ]}
        />
      ) : null}

      {options.map((option) => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) triggerHaptic("selection");
              onChange(option.id);
            }}
            style={styles.segment}
          >
            <ThemedText
              type="smallBold"
              style={{ color: selected ? colors.accent : colors.mutedForeground }}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: PAD,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: GAP,
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
