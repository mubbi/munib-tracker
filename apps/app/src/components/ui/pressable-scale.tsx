import { forwardRef } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { Springs } from "@/constants/motion";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = Omit<PressableProps, "style"> & {
  /** Target scale while pressed. Lower = more pronounced. */
  scaleTo?: number;
  /** Fade slightly on press in addition to scaling. */
  dimOnPress?: boolean;
  /** Haptic fired on press-in. Pass `false` (default) for silent surfaces. */
  haptic?: HapticFeedback | false;
  style?: StyleProp<ViewStyle>;
};

/**
 * The app's universal touchable. Springs to `scaleTo` on press-in and settles
 * back on release, giving every interactive surface the same tactile, physical
 * feedback. Replaces ad-hoc `opacity`/`transform` press states so motion stays
 * consistent app-wide. Honors reduced-motion automatically via Reanimated.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  {
    children,
    scaleTo = 0.96,
    dimOnPress = false,
    haptic = false,
    style,
    onPressIn,
    onPressOut,
    disabled,
    ...rest
  },
  ref,
) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? scaleTo : 1, Springs.press) }],
    opacity: dimOnPress ? withSpring(pressed.value ? 0.88 : 1, Springs.press) : 1,
  }));

  const handlePressIn = (event: GestureResponderEvent) => {
    pressed.value = 1;
    if (haptic) triggerHaptic(haptic);
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    pressed.value = 0;
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      ref={ref}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
});
