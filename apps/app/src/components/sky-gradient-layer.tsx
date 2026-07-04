import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";

type SkyGradientLayerProps = {
  gradient: ViewStyle;
  motionStyle?: AnimatedStyle<ViewStyle>;
  webMotionClass?: string;
  webMotionClassInner?: string;
};

/**
 * Motion wrapper for hero sky gradients. The transform runs on the outer shell
 * while the inner view keeps the static background image.
 */
export function SkyGradientLayer({ gradient, motionStyle }: SkyGradientLayerProps) {
  return (
    <Animated.View style={[styles.fill, motionStyle]}>
      <View style={[styles.fill, gradient]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
