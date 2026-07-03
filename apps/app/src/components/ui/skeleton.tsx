import { useEffect } from "react";
import { type DimensionValue, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

/**
 * A gently pulsing placeholder for loading content. The slow opacity breathe
 * keeps loading states feeling serene rather than busy. Static under reduced
 * motion.
 */
export function Skeleton({ width = "100%", height = 16, radius = Radius.sm }: SkeletonProps) {
  const { tokens } = useThemeTokens();
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(reducedMotion ? 0.5 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [reducedMotion, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: 0.4 + pulse.value * 0.4 }));

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius, backgroundColor: tokens.track },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderCurve: "continuous",
  },
});
