import { I18nManager, StyleSheet, View } from "react-native";
import Animated, { type SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type ReadingProgressBarProps = {
  /** 0→1 reading progress driving the fill. */
  progress: SharedValue<number>;
  /** Localized label for assistive tech. */
  accessibilityLabel: string;
};

/**
 * A thin scroll-progress line that fills from the reading edge (left for LTR,
 * right for RTL) as the reader moves through long-form content. Rendered flush
 * beneath the header/toolbar so it reads as part of the top chrome.
 */
export function ReadingProgressBar({ progress, accessibilityLabel }: ReadingProgressBarProps) {
  const { colors, tokens } = useThemeTokens();

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: Math.min(1, Math.max(0, progress.value)) }],
  }));

  return (
    <View
      pointerEvents="none"
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, { backgroundColor: tokens.track }]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: colors.accent,
            transformOrigin: I18nManager.isRTL ? "100% 50%" : "0% 50%",
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    width: "100%",
    borderTopEndRadius: Radius.pill,
    borderBottomEndRadius: Radius.pill,
  },
});
