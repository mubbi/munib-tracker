import { forwardRef, type ReactNode, useCallback, useMemo } from "react";
import {
  type GestureResponderEvent,
  Platform,
  Pressable,
  type PressableAndroidRippleConfig,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { Springs } from "@/constants/motion";
import { Radius } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { blurActiveElement } from "@/lib/blur-active-element";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";

/**
 * Flex/content layout for the inner animated wrapper (icon + text stacks, gaps).
 * Deliberately excludes width/height — those must size the Pressable host so
 * percentage tiles (e.g. 2×2 quick-link grids) participate in the parent flex
 * row. Putting width on the inner alone left the host unconstrained and made
 * the tile background overflow its card.
 */
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
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
] as const satisfies readonly (keyof ViewStyle)[];

/**
 * Positioning that must live on the Android clip wrapper so margins/absolute
 * offsets aren't left on the Pressable inside the clip. Size/flex are duplicated
 * on both wrapper and Pressable so the touchable still fills the clip host.
 */
const CLIP_WRAPPER_POSITION_KEYS = [
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginStart",
  "marginEnd",
  "marginHorizontal",
  "marginVertical",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "start",
  "end",
  "zIndex",
  "elevation",
] as const satisfies readonly (keyof ViewStyle)[];

const CLIP_WRAPPER_KEYS = [
  ...RIPPLE_HOST_LAYOUT_KEYS,
  ...CLIP_WRAPPER_POSITION_KEYS,
] as const satisfies readonly (keyof ViewStyle)[];

const CORNER_RADIUS_KEYS = [
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "borderTopStartRadius",
  "borderTopEndRadius",
  "borderBottomStartRadius",
  "borderBottomEndRadius",
  "borderCurve",
] as const satisfies readonly (keyof ViewStyle)[];

/** Default corner radius for bounded Android ripples when the surface is unrounded. */
const DEFAULT_RIPPLE_RADIUS = Radius.md;

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
      // Box model + host-only size (width/height) so %-based tiles size correctly.
      hostStyle[key] = value;
      // Fixed pixel wells (topbar / Explore): also size the inner so centering and
      // absolute badges resolve against the well. Percentage widths stay host-only
      // so flex grids are not double-shrunk.
      if ((key === "width" || key === "height") && typeof value === "number") {
        innerStyle[key] = value;
      }
    }
  }
  return { hostStyle: hostStyle as ViewStyle, innerStyle: innerStyle as ViewStyle };
}

function pickStyleKeys(style: ViewStyle, keys: readonly (keyof ViewStyle)[]): ViewStyle {
  const out: Record<string, ViewStyle[keyof ViewStyle]> = {};
  for (const key of keys) {
    const value = style[key];
    if (value != null) out[key] = value;
  }
  return out as ViewStyle;
}

function omitStyleKeys(style: ViewStyle, keys: readonly (keyof ViewStyle)[]): ViewStyle {
  const skip = new Set<string>(keys as readonly string[]);
  const out: Record<string, ViewStyle[keyof ViewStyle]> = {};
  for (const [key, value] of Object.entries(style) as [
    keyof ViewStyle,
    ViewStyle[keyof ViewStyle],
  ][]) {
    if (value == null || skip.has(key)) continue;
    out[key] = value;
  }
  return out as ViewStyle;
}

/** Resolve a single radius for clip wrappers — prefers uniform `borderRadius`. */
function resolveRippleRadius(style: ViewStyle | undefined): number {
  if (!style) return DEFAULT_RIPPLE_RADIUS;
  if (typeof style.borderRadius === "number") return style.borderRadius;

  const corners = [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomLeftRadius,
    style.borderBottomRightRadius,
    style.borderTopStartRadius,
    style.borderTopEndRadius,
    style.borderBottomStartRadius,
    style.borderBottomEndRadius,
  ].filter((value): value is number => typeof value === "number");

  if (corners.length > 0) return Math.max(...corners);
  return DEFAULT_RIPPLE_RADIUS;
}

function hasExplicitCornerRadius(style: ViewStyle | undefined): boolean {
  if (!style) return false;
  if (typeof style.borderRadius === "number") return true;
  return CORNER_RADIUS_KEYS.some((key) => key !== "borderCurve" && typeof style[key] === "number");
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
  /**
   * Corner radius used to clip the Android ripple when `style` does not set one.
   * Defaults to `Radius.md` so unstyled rows/chips still match rounded surfaces.
   */
  rippleRadius?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * The app's universal touchable. Springs to `scaleTo` on press-in and settles
 * back on release, giving every interactive surface the same tactile, physical
 * feedback. On Android it additionally lays down a native Material ripple so
 * presses feel platform-native, not just scaled. Replaces ad-hoc
 * `opacity`/`transform` press states so motion stays consistent app-wide.
 * Honors reduced-motion automatically via Reanimated.
 *
 * Android ripples are masked to a rectangle by the platform drawable. RN's
 * `overflow: "hidden"` on the Pressable only clips *children*, not the ripple
 * drawn as background/foreground — so we wrap bounded ripples in a rounded
 * clip View (borderRadius + overflow hidden) that clips the whole Pressable.
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
    rippleRadius,
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

  const flatStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
  const { hostStyle, innerStyle } = splitRippleHostStyles(flatStyle);

  const boundedRipple =
    Platform.OS === "android" &&
    ripple !== false &&
    !rippleBorderless &&
    !(typeof ripple === "object" && ripple.borderless) &&
    !android_ripple?.borderless;

  const clipRadius = useMemo(() => {
    if (!boundedRipple) return undefined;
    if (typeof rippleRadius === "number") return rippleRadius;
    if (hasExplicitCornerRadius(flatStyle)) return resolveRippleRadius(flatStyle);
    return DEFAULT_RIPPLE_RADIUS;
  }, [boundedRipple, rippleRadius, flatStyle]);

  // Native Material ripple on Android. An explicit `android_ripple` prop or a
  // config passed via `ripple` always wins over the themed default.
  const androidRipple = useMemo<PressableAndroidRippleConfig | undefined>(() => {
    if (Platform.OS !== "android") return undefined;
    if (android_ripple) return android_ripple;
    if (ripple === false) return undefined;
    if (typeof ripple === "object") return ripple;
    return {
      color: rippleColor ?? tokens.ripple,
      borderless: rippleBorderless ?? false,
      // Foreground keeps the ripple above opaque children (icons, pills). The
      // outer clip wrapper is what rounds it — not `overflow` on this view.
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

  const useClipWrapper = boundedRipple && clipRadius != null;
  const cornerStyle = pickStyleKeys(hostStyle, CORNER_RADIUS_KEYS);
  const explicitCorners = hasExplicitCornerRadius(flatStyle);
  const roundedClipStyle: ViewStyle = {
    ...(explicitCorners ? cornerStyle : { borderRadius: clipRadius }),
    borderCurve: hostStyle.borderCurve ?? ("continuous" as const),
  };

  const layoutOnWrapper = useClipWrapper ? pickStyleKeys(hostStyle, CLIP_WRAPPER_KEYS) : null;
  const sizeOnPressable = useClipWrapper ? pickStyleKeys(hostStyle, RIPPLE_HOST_LAYOUT_KEYS) : null;

  const wrapperStyle = useClipWrapper
    ? ([layoutOnWrapper, roundedClipStyle, { overflow: "hidden" as const }] as StyleProp<ViewStyle>)
    : undefined;

  const pressableStyle = useClipWrapper
    ? ([
        omitStyleKeys(hostStyle, [...CLIP_WRAPPER_POSITION_KEYS, ...CORNER_RADIUS_KEYS]),
        sizeOnPressable,
        roundedClipStyle,
        // Transparent paint so Android still builds a hit target when the
        // surface color lives only on children (see sheet backdrop note).
        hostStyle.backgroundColor == null ? { backgroundColor: "transparent" } : null,
      ] as StyleProp<ViewStyle>)
    : hostStyle;

  const pressable = (
    <Pressable
      ref={ref}
      disabled={disabled}
      android_ripple={androidRipple}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={pressableStyle}
      {...rest}
    >
      <Animated.View style={[styles.inner, innerStyle, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );

  if (!useClipWrapper) return pressable;

  return <View style={wrapperStyle}>{pressable}</View>;
});

const styles = StyleSheet.create({
  // Stretch to the host's content width so column/card pressables fill their
  // lane. Do NOT set percentage width/height here — on native Yoga, `%` against
  // an auto-sized host can inflate the host to the nearest definite ancestor
  // (e.g. flex:1 screen), which stretched intro Buttons and the home hero/
  // seasonal banners to full-screen. Fixed pixel wells (Explore / hero chrome)
  // still get numeric width/height copied onto the inner via splitRippleHostStyles.
  inner: {
    alignSelf: "stretch",
  },
});
