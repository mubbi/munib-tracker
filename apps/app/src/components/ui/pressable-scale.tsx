import {
  createContext,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type AccessibilityState,
  type GestureResponderEvent,
  type MouseEvent,
  Platform,
  Pressable,
  type PressableAndroidRippleConfig,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewInstance,
  type ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { forgetTvFocus, noteTvFocus, type TvFocusHandle } from "@/components/ui/tv-focus-memory";
import { inAppLinkPress } from "@/components/web/web-link-press";
import { Springs } from "@/constants/motion";
import { Opacity, Radius, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";

/**
 * TV focus enlarge. Android TV buttons grow ~1.1× on focus; a fixed factor
 * either under-sells small tiles or pushes wide rows past their gutters, so the
 * default adapts to the control's width: at most {@link TV_FOCUS_MAX_SCALE},
 * and never more than {@link TV_FOCUS_MAX_GROW} of total extra width (half per
 * side — inside the 20dp grid gutter). Callers can still pin `tvFocusScale`.
 */
const TV_FOCUS_MAX_SCALE = 1.08;
const TV_FOCUS_MAX_GROW = tvDp(20);
/** Before the first layout pass (width unknown). */
const TV_FOCUS_FALLBACK_SCALE = 1.04;

/**
 * True below a `PressableScale` that renders as a `<button>` on web. A nested
 * pressable must not also default to `role="button"`: react-native-web would
 * emit `<button>` inside `<button>` (invalid HTML, swallowed clicks).
 */
const InsideWebButtonContext = createContext(false);

/** Adaptive TV focus scale for a control `width` layout units wide. */
export function tvAdaptiveFocusScale(width: number): number {
  "worklet";
  if (!(width > 0)) return TV_FOCUS_FALLBACK_SCALE;
  return 1 + Math.min(TV_FOCUS_MAX_SCALE - 1, TV_FOCUS_MAX_GROW / width);
}

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
  // A uniform border eats into the host's content box; the inner must match that
  // box, or it overflows bottom/end and centred content (icons) sits off-centre.
  const borderInset = typeof flatStyle.borderWidth === "number" ? flatStyle.borderWidth * 2 : 0;
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
        innerStyle[key] = Math.max(0, value - borderInset);
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
  /**
   * TV: scale while D-pad focused. Defaults to a width-adaptive value (~1.08 on
   * tiles and buttons, smaller on full-width rows). Pass `1` for reading blocks
   * / wide prose so text does not shift under the focus ring.
   */
  tvFocusScale?: number;
  /** Alias of {@link tvFocusScale} (design-system name); `tvFocusScale` wins if both are set. */
  focusScale?: number;
  /**
   * Dim to `Opacity.disabled` while `disabled` (default `true`). An explicit
   * `opacity` in `style` always wins, so callers that manage their own dimming
   * are never double-dimmed.
   */
  dimWhenDisabled?: boolean;
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
  /**
   * Web only: the in-app route this control opens (e.g. `/quran/1`). Renders a
   * real `<a href>` with `role="link"` so search engines can crawl the link and
   * Ctrl/Cmd/middle-click opens a new tab; a plain click still runs `onPress`
   * (client-side navigation, default prevented). Ignored on native / TV, and
   * dropped inside another web button/link (nested interactive HTML is invalid).
   */
  href?: string;
  style?: StyleProp<ViewStyle>;
};

/** Writes `node` to a forwarded ref (callback or object). */
function assignRef<T>(ref: ForwardedRef<T>, node: T | null): void {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

/**
 * TV: reports this control's focus to `tv-focus-memory` so a `Sheet` opened
 * from it can hand focus back on close. Returns the host ref callback.
 */
function useTvFocusMemory(tv: boolean, forwarded: ForwardedRef<ViewInstance>) {
  const host = useRef<ViewInstance | null>(null);
  const mounted = useRef(true);
  const handle = useMemo<TvFocusHandle>(
    () => ({
      focus: () => (host.current as { focus?: () => void } | null)?.focus?.(),
      isMounted: () => mounted.current && host.current != null,
    }),
    [],
  );
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      forgetTvFocus(handle);
    };
  }, [handle]);
  const setRef = useCallback(
    (node: ViewInstance | null) => {
      host.current = node;
      assignRef(forwarded, node);
    },
    [forwarded],
  );
  const onFocused = useCallback(() => {
    if (tv) noteTvFocus(handle);
  }, [tv, handle]);
  return { setRef, onFocused };
}

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
 *
 * Interaction-state contract (docs/design-system.md § Interaction states):
 * - **Role**: defaults to `accessibilityRole="button"` when `onPress` /
 *   `onLongPress` is set and the caller passed no `role` / `accessibilityRole`
 *   (except directly inside another web `<button>`).
 * - **Disabled**: dims to `Opacity.disabled` and merges
 *   `accessibilityState.disabled`; no hover, ripple, haptic or press.
 * - **Focus**: never blurs on press — web focus stays on the control after an
 *   in-place action. Route changes release focus in `WebNavigationFocusManager`.
 *   TV draws a `tokens.focusRing` border grown outward + an adaptive scale.
 * - **Hover**: web and native pointer devices (iPad trackpad, Android mouse).
 */
export const PressableScale = forwardRef<ViewInstance, PressableScaleProps>(function PressableScale(
  {
    children,
    scaleTo = 0.96,
    tvFocusScale: tvFocusScaleProp,
    focusScale,
    dimWhenDisabled = true,
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
    onFocus,
    onBlur,
    onLayout,
    onHoverIn,
    onHoverOut,
    disabled,
    accessibilityState,
    accessibilityRole,
    role,
    href,
    ...rest
  },
  ref,
) {
  const { tokens } = useThemeTokens();
  const pressed = useSharedValue(0);
  const focused = useSharedValue(0);
  const layoutWidth = useSharedValue(0);
  const reducedMotion = useHydrationSafeReducedMotion();
  const tv = isTV();
  const web = Platform.OS === "web";
  const insideWebButton = useContext(InsideWebButtonContext);
  // Native pointer hover (iPad trackpad, Android mouse). Web reads `hovered`
  // from react-native-web's Pressable state instead.
  const [nativeHovered, setNativeHovered] = useState(false);
  const tvFocusScale = tvFocusScaleProp ?? focusScale;
  const tvFocusMemory = useTvFocusMemory(tv, ref);

  const interactive = Boolean(onPress || rest.onLongPress);
  // Web anchor: `href` turns the host into `<a href>` (react-native-web emits an
  // anchor for any View with `href`) — never inside another button/link.
  const webHref = web && !tv && href && !insideWebButton && !disabled ? href : undefined;
  const explicitRole = accessibilityRole != null || role != null;
  const resolvedRole = webHref
    ? ("link" as const)
    : (accessibilityRole ??
      (!explicitRole && interactive && !(web && insideWebButton)
        ? ("button" as const)
        : undefined));
  const resolvedWebRole = webHref ? ("link" as const) : role;
  const rendersWebButton =
    web && (Boolean(webHref) || resolvedRole === "button" || role === "button");
  // Plain click → caller's onPress (in-app navigation) with the browser's full
  // page load prevented; modified clicks fall through to the browser.
  const handlePress = useMemo(() => {
    if (!webHref || !onPress) return onPress;
    return (event: GestureResponderEvent) => {
      inAppLinkPress(() => onPress(event))(event);
    };
  }, [webHref, onPress]);

  // Disabled always wins. An explicit `disabled={false}` still reports
  // `disabled: false` (as RN's Pressable did) unless the caller set the state
  // itself — e.g. a TV bound that stays focusable but reports disabled.
  const mergedAccessibilityState: AccessibilityState | undefined = disabled
    ? { ...accessibilityState, disabled: true }
    : disabled === false && accessibilityState?.disabled == null
      ? { ...accessibilityState, disabled: false }
      : accessibilityState;

  const flatStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
  const { hostStyle, innerStyle } = splitRippleHostStyles(flatStyle);

  // TV remotes don't use Material ripples; the Android clip wrapper's
  // overflow:hidden also clips the D-pad focus scale and footer labels.
  const boundedRipple =
    !tv &&
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
    if (tv || Platform.OS !== "android") return undefined;
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
  }, [tv, android_ripple, ripple, rippleColor, rippleBorderless, tokens.ripple]);

  // No blur here (E-01 / F-41): blurring on every press threw keyboard focus
  // to <body> after in-place actions (toggles, steppers, sheets). Focus is
  // released only when the focused route changes — see WebNavigationFocusManager.

  const animatedStyle = useAnimatedStyle(() => {
    const nextScale = pressed.value
      ? scaleTo
      : tv && !reducedMotion && focused.value
        ? (tvFocusScale ?? tvAdaptiveFocusScale(layoutWidth.value))
        : 1;
    return {
      transform: [{ scale: withSpring(nextScale, Springs.press) }],
      opacity: dimOnPress ? withSpring(pressed.value ? 0.88 : 1, Springs.press) : 1,
    };
  });

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

  const handleHoverIn = (event: MouseEvent) => {
    if (!web && !tv) setNativeHovered(true);
    onHoverIn?.(event);
  };

  const handleHoverOut = (event: MouseEvent) => {
    if (!web && !tv) setNativeHovered(false);
    onHoverOut?.(event);
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

  // Fully transparent fills drop Fabric taps inside Modals (Cancel looks
  // pressed; onPress never fires). Near-invisible paint restores the target.
  const paintedHostStyle: ViewStyle =
    hostStyle.backgroundColor == null || hostStyle.backgroundColor === "transparent"
      ? { ...hostStyle, backgroundColor: "rgba(0,0,0,0.002)" }
      : hostStyle;

  // On TV, never clip the pressable host — focus scale + thicker ring need room.
  // Corner rounding still applies via borderRadius on the host background.
  const tvHostStyle: ViewStyle = tv
    ? { ...paintedHostStyle, overflow: "visible" }
    : paintedHostStyle;

  const wrapperStyle = useClipWrapper
    ? ([layoutOnWrapper, roundedClipStyle, { overflow: "hidden" as const }] as StyleProp<ViewStyle>)
    : undefined;

  const pressableStyle = useClipWrapper
    ? ([
        omitStyleKeys(paintedHostStyle, [...CLIP_WRAPPER_POSITION_KEYS, ...CORNER_RADIUS_KEYS]),
        sizeOnPressable,
        roundedClipStyle,
      ] as StyleProp<ViewStyle>)
    : tvHostStyle;

  const restingBorderWidth = typeof flatStyle?.borderWidth === "number" ? flatStyle.borderWidth : 0;
  const hasPaintedBackground =
    hostStyle.backgroundColor != null && hostStyle.backgroundColor !== "transparent";

  const disabledDim: ViewStyle | null =
    disabled && dimWhenDisabled && flatStyle?.opacity == null
      ? { opacity: Opacity.disabled }
      : null;

  const pressable = (
    <Pressable
      ref={tvFocusMemory.setRef}
      // `undefined` when enabled: RN's Pressable writes `disabled` over
      // `accessibilityState.disabled`, which would erase a caller's soft-disabled
      // state (TV bounds stay focusable but report disabled).
      disabled={disabled ? true : undefined}
      accessibilityRole={resolvedRole}
      role={resolvedWebRole}
      accessibilityState={mergedAccessibilityState}
      android_ripple={androidRipple}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onFocus={(event) => {
        if (tv) {
          focused.value = 1;
          tvFocusMemory.onFocused();
        }
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (tv) focused.value = 0;
        onBlur?.(event);
      }}
      onLayout={
        tv
          ? (event) => {
              layoutWidth.value = event.nativeEvent.layout.width;
              onLayout?.(event);
            }
          : onLayout
      }
      style={(state) => {
        const isFocused = Boolean((state as { focused?: boolean }).focused);
        // Grow the ring outward (negative margin) so labels/footers keep their
        // padding instead of being eaten by an inward borderWidth increase.
        const ringDelta = Math.max(0, TvLayout.focusRingWidth - restingBorderWidth);
        const focusRing: ViewStyle | null =
          tv && isFocused
            ? {
                borderWidth: TvLayout.focusRingWidth,
                // Contrast-checked ring (≥ 3:1 on every surface), not the raw
                // accent — amber / lime failed on the light page (E-04).
                borderColor: tokens.focusRing,
                borderRadius:
                  typeof flatStyle?.borderRadius === "number" ? flatStyle.borderRadius : Radius.md,
                margin: ringDelta > 0 ? -ringDelta : undefined,
                zIndex: 1,
                // Soft glow lifts the focused surface off its neighbours; the
                // ring alone reads weakly from the couch, especially on light
                // theme and busy cards (Fire TV 2.11 / tvOS focus).
                boxShadow: `0px ${tvDp(4)}px ${tvDp(18)}px ${withAlpha(
                  tokens.focusRing,
                  tokens.isDark ? 0.5 : 0.35,
                )}`,
              }
            : null;
        // Pointer devices: a subtle hover tint so cards/rows read as interactive
        // under a mouse or trackpad (touch never reports hover). Web reads RNW's
        // `hovered` state; iPad / Android pointers come through onHoverIn/Out.
        const hovered = web
          ? Boolean((state as { hovered?: boolean }).hovered)
          : !tv && nativeHovered;
        const webPointer: ViewStyle | null =
          web && !disabled && interactive ? ({ cursor: "pointer" } as ViewStyle) : null;
        const hover: ViewStyle | null =
          hovered && !disabled && onPress
            ? hasPaintedBackground
              ? ({ filter: tokens.isDark ? "brightness(1.1)" : "brightness(0.97)" } as ViewStyle)
              : { backgroundColor: tokens.hover }
            : null;
        return StyleSheet.flatten([pressableStyle, webPointer, hover, disabledDim, focusRing]);
      }}
      {...rest}
      // RN Web renders a Pressable with `href` as `<a href>` (not in RN's types).
      {...(webHref ? ({ href: webHref } as object) : null)}
    >
      <Animated.View style={[styles.inner, innerStyle, animatedStyle]}>
        {/* Always mounted (stable tree): only the value flips with the role. */}
        <InsideWebButtonContext.Provider value={insideWebButton || rendersWebButton}>
          {children}
        </InsideWebButtonContext.Provider>
      </Animated.View>
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
