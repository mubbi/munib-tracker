import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useState } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { Springs } from "@/constants/motion";
import { Control, Opacity, Radius, Shadows, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  chartCoordinateStyle,
  segmentedThumbAnchor,
  segmentedThumbOffset,
  segmentedTrackDirection,
} from "@/lib/chart-rtl";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { isRTL, ltrControlViewProps } from "@/lib/rtl";

type SegmentOption<T extends string> = {
  id: T;
  label: string;
  /** Screen-reader label when the visible label needs context (defaults to `label`). */
  accessibilityLabel?: string;
  /** This segment is dimmed and ignores presses. */
  disabled?: boolean;
  /** Optional glyph before the label (e.g. reader layouts). Decorative — the label names it. */
  icon?: SymbolViewProps["name"];
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /**
   * Also report a press on the already-selected segment — for segments that
   * open something (e.g. "Custom" re-opens its target picker). Default false.
   */
  allowReselect?: boolean;
  /** Expose the track as a tab list (`tablist` / `tab`) instead of a radio group. */
  tabs?: boolean;
  /** Names the group for assistive tech (e.g. "Statistics period"). */
  accessibilityLabel?: string;
  /**
   * Read-only display of the selected value: segments are dimmed, ignore
   * presses and (on TV) are not D-pad focus stops, so they never look live.
   */
  disabled?: boolean;
};

const PAD = Spacing.one;
const GAP = Spacing.half;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  allowReselect = false,
  tabs = false,
  accessibilityLabel,
  disabled = false,
}: SegmentedControlProps<T>) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
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
    <TvFocusGuide trapFocusLeft trapFocusRight>
      <View
        {...ltrControlViewProps()}
        accessibilityRole={tabs ? "tablist" : "radiogroup"}
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.container,
          chartCoordinateStyle,
          { flexDirection: segmentedTrackDirection() },
          { backgroundColor: colors.muted },
          // TV: the D-pad focus ring + scale must not be clipped by the track.
          tv && styles.containerTv,
          disabled && styles.disabled,
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
          const off = disabled || !!option.disabled;
          return (
            <PressableScale
              key={option.id}
              accessibilityRole={tabs ? "tab" : "radio"}
              accessibilityLabel={option.accessibilityLabel}
              accessibilityState={
                tabs
                  ? off
                    ? { selected, disabled: true }
                    : { selected }
                  : off
                    ? { checked: selected, disabled: true }
                    : { checked: selected }
              }
              {...(off ? { disabled: true } : null)}
              {...(tv && disabled ? { focusable: false } : null)}
              haptic={false}
              scaleTo={0.98}
              rippleRadius={Radius.sm}
              onPress={() => {
                if (off) return;
                if (selected && !allowReselect) return;
                triggerHaptic("selection");
                onChange(option.id);
              }}
              style={[
                styles.segment,
                tv && styles.segmentTv,
                !disabled && option.disabled && styles.optionDisabled,
              ]}
            >
              <View style={styles.segmentContent}>
                {option.icon ? (
                  <SymbolView
                    name={option.icon}
                    size={tv ? TvLayout.bodyFontSize : 16}
                    tintColor={selected ? colors.accentText : colors.mutedForeground}
                  />
                ) : null}
                <ThemedText
                  type="smallBold"
                  numberOfLines={1}
                  style={[
                    styles.segmentLabel,
                    {
                      color: selected ? colors.foreground : colors.mutedForeground,
                      fontSize: tv ? TvLayout.bodyFontSize : undefined,
                    },
                  ]}
                >
                  {option.label}
                </ThemedText>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </TvFocusGuide>
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
  containerTv: {
    overflow: "visible",
  },
  disabled: {
    opacity: Opacity.disabled,
  },
  optionDisabled: {
    opacity: Opacity.disabled,
  },
  thumb: {
    position: "absolute",
    top: PAD,
    bottom: PAD,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    ...Shadows.sm,
  },
  segmentContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.oneHalf,
    maxWidth: "100%",
  },
  segmentLabel: { flexShrink: 1 },
  segment: {
    flex: 1,
    // 44pt / 48dp (Android): segments touch, so the size itself is the target.
    minHeight: Math.max(Control.md, Control.minTouch),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  segmentTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingVertical: Spacing.three,
  },
});
