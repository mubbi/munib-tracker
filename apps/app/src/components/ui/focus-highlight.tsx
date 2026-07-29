import { forwardRef, type ReactNode, useEffect } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { Durations } from "@/constants/motion";
import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const HOLD_MS = 2500;
const FADE_MS = Durations.slow;

type FocusHighlightProps = {
  active: boolean;
  children: ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  borderColor?: string;
};

/**
 * Pulses a soft accent ring when `active` — used after deep-linking from seasonal
 * banners so the target card is obvious before the ring fades out.
 */
export const FocusHighlight = forwardRef<View, FocusHighlightProps>(function FocusHighlight(
  { active, children, style, borderRadius = Radius.lg, borderColor },
  ref,
) {
  const { colors } = useThemeTokens();
  const ringOpacity = useSharedValue(0);
  const resolvedBorder = borderColor ?? colors.accent;

  useEffect(() => {
    cancelAnimation(ringOpacity);
    if (!active) {
      ringOpacity.value = 0;
      return;
    }
    ringOpacity.value = 1;
    ringOpacity.value = withDelay(HOLD_MS, withTiming(0, { duration: FADE_MS }));
  }, [active, ringOpacity]);

  const ringStyle = useAnimatedStyle(() =>
    ringOpacity.value > 0 ? { opacity: ringOpacity.value } : { opacity: 0 },
  );

  return (
    <View ref={ref} style={[styles.wrap, { borderRadius }, style]}>
      {children}
      <Animated.View
        style={[
          styles.ring,
          { borderRadius, borderColor: resolvedBorder, pointerEvents: "none" },
          ringStyle,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
  },
  ring: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderCurve: "continuous",
  },
});
