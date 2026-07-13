import { forwardRef, type ReactNode, useCallback, useMemo } from "react";
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableAndroidRippleConfig,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type View,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { Springs } from "@/constants/motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";

const RIPPLE_INNER_LAYOUT_KEYS = [
  "flexDirection",
  "alignItems",
  "justifyContent",
  "alignContent",
  "flexWrap",
  "gap",
  "rowGap",
  "columnGap",
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "alignSelf",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
] as const satisfies readonly (keyof ViewStyle)[];

/** Flex participation on the ripple host so row/column children still expand. */
const RIPPLE_HOST_LAYOUT_KEYS = [
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "alignSelf",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
] as const satisfies readonly (keyof ViewStyle)[];

/** Keeps box model on the ripple host; flex layout lives on the inner wrapper. */
function splitRippleHostStyles(flatStyle: ViewStyle | undefined): {
  hostStyle: ViewStyle;
  innerStyle: ViewStyle;
} {
  if (!flatStyle) return { hostStyle: {}, innerStyle: {} };

  const hostStyle: Record<string, ViewStyle[keyof ViewStyle]> = {};
  const innerStyle: Record<string, ViewStyle[keyof ViewStyle]> = {};
  for (const [key, value] of Object.entries(flatStyle) as [
    keyof ViewStyle,
    ViewStyle[keyof ViewStyle],
  ][]) {
    if (value == null) continue;
    if ((RIPPLE_INNER_LAYOUT_KEYS as readonly string[]).includes(key)) {
      innerStyle[key] = value;
      if ((RIPPLE_HOST_LAYOUT_KEYS as readonly string[]).includes(key)) {
        hostStyle[key] = value;
      }
    } else {
      hostStyle[key] = value;
    }
  }
  return { hostStyle: hostStyle as ViewStyle, innerStyle: innerStyle as ViewStyle };
}

type PressableScaleProps = Omit<PressableProps, "style" | "children"> & {
  children?: ReactNode;
  /** Target scale while pressed. Lower = more pronounced. */
  scaleTo?: number;
  /** Fade slightly on press in addition to scaling. */
  dimOnPress?: boolean;
  /** Haptic fired on press-in. Pass `false` (default) for silent surfaces. */
  haptic?: HapticFeedback | false;
  /**
   * Native Android Material ripple. `true` (default) draws a themed bounded
   * ripple that clips to the surface's rounded corners; pass a config object to
   * customise, or `false` to disable (e.g. non-button containers). No-op on
   * iOS/web, where the spring scale is the press affordance.
   */
  ripple?: boolean | PressableAndroidRippleConfig;
  /** Overrides the default themed ripple tint. */
  rippleColor?: string;
  /** Circular, unbounded ripple — for icon-only / capsule controls. */
  rippleBorderless?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The app's universal touchable. Springs to `scaleTo` on press-in and settles
 * back on release, giving every interactive surface the same tactile, physical
 * feedback. On Android it additionally lays down a native Material ripple so
 * presses feel platform-native, not just scaled. Replaces ad-hoc
 * `opacity`/`transform` press states so motion stays consistent app-wide.
 * Honors reduced-motion automatically via Reanimated.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  {
    children,
    scaleTo = 0.96,
    dimOnPress = false,
    haptic = false,
    ripple = true,
    rippleColor,
    rippleBorderless,
    android_ripple,
    style,
    onPressIn,
    onPressOut,
    onPress,
    disabled,
    ...rest
  },
  ref,
) {
  const { tokens } = useThemeTokens();
  const pressed = useSharedValue(0);

  // Native Material ripple on Android. `foreground: true` clips the ripple to
  // the view's rounded outline (API 23+), so pills and cards ripple correctly
  // without an extra `overflow: "hidden"` wrapper. An explicit `android_ripple`
  // prop or a config passed via `ripple` always wins over the themed default.
  const androidRipple = useMemo<PressableAndroidRippleConfig | undefined>(() => {
    if (Platform.OS !== "android") return undefined;
    if (android_ripple) return android_ripple;
    if (ripple === false) return undefined;
    if (typeof ripple === "object") return ripple;
    return {
      color: rippleColor ?? tokens.ripple,
      borderless: rippleBorderless ?? false,
      foreground: true,
    };
  }, [android_ripple, ripple, rippleColor, rippleBorderless, tokens.ripple]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      // Release focus before the outgoing screen is aria-hidden on web.
      if (Platform.OS === "web") blurActiveElement();
      onPress?.(event);
    },
    [onPress],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? scaleTo : 1, Springs.press) }],
    opacity: dimOnPress ? withSpring(pressed.value ? 0.88 : 1, Springs.press) : 1,
  }));

  const handlePressIn = (event: GestureResponderEvent) => {
    pressed.value = 1;
    // All haptic props route through triggerHaptic (respects Settings toggle).
    if (haptic) triggerHaptic(haptic);
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    pressed.value = 0;
    onPressOut?.(event);
  };

  const flatStyle = StyleSheet.flatten(style);
  const { hostStyle, innerStyle } = splitRippleHostStyles(flatStyle);
  // Reanimated transforms on the same view as `android_ripple` prevent the ripple
  // from clipping to rounded corners on Android. Keep press scale on an inner
  // animated wrapper on every platform so layout/entrance animations on ancestors
  // never compete with the spring transform on this view.
  const rippleClipStyle =
    Platform.OS === "android" && androidRipple != null && !androidRipple.borderless
      ? ({ overflow: "hidden" } as const)
      : undefined;

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      android_ripple={androidRipple}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[hostStyle, rippleClipStyle]}
      {...rest}
    >
      <Animated.View style={[styles.inner, innerStyle, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  // Fill the host so column/card pressables stretch; shrink-wrapped hosts stay content-sized.
  inner: {
    alignSelf: "stretch",
  },
});
