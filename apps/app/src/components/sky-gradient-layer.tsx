import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";

/** Gradient layers are drawn larger than the hero so drift transforms reveal shifting colour. */
const GRADIENT_OVERSCAN = 1.4;

type SkyGradientLayerProps = {
  gradient: ViewStyle;
  motionStyle?: AnimatedStyle<ViewStyle>;
  webMotionClass?: string;
  webMotionClassInner?: string;
};

/**
 * Motion wrapper for hero sky gradients. A fixed clip shell masks the hero while
 * the oversized inner layer drifts underneath for full-banner parallax.
 */
export function SkyGradientLayer({ gradient, motionStyle }: SkyGradientLayerProps) {
  return (
    <View style={[styles.fill, styles.clip]}>
      <Animated.View style={[styles.overscan, motionStyle]}>
        <View style={[styles.overscanFill, gradient]} />
      </Animated.View>
    </View>
  );
}

const overscanInset = `${((1 - GRADIENT_OVERSCAN) / 2) * 100}%`;

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  clip: {
    overflow: "hidden",
  },
  overscan: {
    position: "absolute",
    width: `${GRADIENT_OVERSCAN * 100}%`,
    height: `${GRADIENT_OVERSCAN * 100}%`,
    left: overscanInset,
    top: overscanInset,
  },
  overscanFill: {
    flex: 1,
  },
});
