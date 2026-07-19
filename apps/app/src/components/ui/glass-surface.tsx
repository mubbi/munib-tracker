import { type BlurTint, BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode, RefObject } from "react";
import {
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

import { withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useBlurTarget } from "@/providers/blur-target-provider";

/**
 * True on iOS 26+, where the real Liquid Glass material is available. Elsewhere
 * (older iOS, Android, web) we fall back to a native blur via `expo-blur`, which
 * itself renders a CSS `backdrop-filter` on web.
 */
export const hasLiquidGlass = isLiquidGlassAvailable();

type GlassSurfaceProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * Blur strength for the `BlurView` fallback (iOS < 26, Android, web), 1–100.
   * Ignored on iOS 26 Liquid Glass, which is self-tuning.
   */
  intensity?: number;
  /** Pressable Liquid Glass on iOS 26 (adds the interactive highlight). */
  interactive?: boolean;
  /** Override the fallback blur tint; defaults to a scheme-appropriate chrome material. */
  tint?: BlurTint;
  /** Override the scheme wash opacity blended into the glass (0–1). Omit for default chrome. */
  washOpacity?: number;
  /**
   * Android-only: capture the root {@link BlurTargetView} for a real backdrop blur.
   * Use for overlay chrome outside the provider target (mini-player, toasts, modals).
   */
  backdropCapture?: boolean;
  /**
   * Android-only: capture a screen-local {@link BlurTargetView} (e.g. scroll
   * content beneath a floating header). The BlurView must be a sibling of that
   * target, never a descendant — blurring an ancestor that contains the BlurView
   * overflows the RenderThread view tree.
   */
  blurTargetRef?: RefObject<View | null>;
  /** Fired with the rendered size — used to inset content beneath floating chrome. */
  onLayout?: (event: LayoutChangeEvent) => void;
};

/**
 * A frosted "glass" chrome surface that adapts to the platform: real Liquid
 * Glass on iOS 26, a native `systemChromeMaterial` blur on older iOS / Android,
 * and a `backdrop-filter` blur on web. Use it for floating chrome that sits over
 * scrollable content — tab bars, headers, the audio mini-player, sheets — not
 * for opaque content cards.
 *
 * For rounded glass, pass `borderRadius` **and** `overflow: "hidden"` in `style`
 * (BlurView won't clip its blur to the corners otherwise).
 */
export function GlassSurface({
  children,
  style,
  intensity = 40,
  interactive,
  tint,
  backdropCapture = false,
  blurTargetRef,
  washOpacity,
  onLayout,
}: GlassSurfaceProps) {
  const { colors, scheme } = useThemeTokens();
  const blurTarget = useBlurTarget();

  // Soft scheme wash — strong enough that chrome stays scheme-correct even if
  // native BlurView / Liquid Glass lags one frame behind a light↔dark toggle.
  // Do NOT remount on scheme change: keyed remounts recreate blur/glass trees
  // (header, tab bar, mini-player, sheets) and freeze the UI for a beat.
  const defaultWashOpacity = scheme === "dark" ? 0.72 : 0.78;
  const resolvedWashOpacity = washOpacity ?? defaultWashOpacity;
  const wash =
    resolvedWashOpacity > 0 ? withAlpha(colors.background, resolvedWashOpacity) : undefined;

  if (hasLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={interactive}
        colorScheme={scheme}
        style={[style, wash != null ? { backgroundColor: wash } : null]}
        onLayout={onLayout}
      >
        {children}
      </GlassView>
    );
  }

  const resolvedTint: BlurTint =
    tint ?? (scheme === "dark" ? "systemChromeMaterialDark" : "systemChromeMaterialLight");

  const resolvedBlurTarget = blurTargetRef ?? (backdropCapture ? blurTarget : undefined);
  const androidBlurMethod =
    Platform.OS === "android" && resolvedBlurTarget ? "dimezisBlurViewSdk31Plus" : undefined;

  return (
    <BlurView
      tint={resolvedTint}
      intensity={intensity}
      blurMethod={androidBlurMethod}
      blurTarget={Platform.OS === "android" ? (resolvedBlurTarget ?? undefined) : undefined}
      style={[style, wash != null ? { backgroundColor: wash } : null]}
      onLayout={onLayout}
    >
      {children}
    </BlurView>
  );
}

type OverlayGlassFillProps = {
  /** Translucent card wash for text legibility over the blur (0–1). */
  cardWashAlpha: number;
  /** Blur strength for native `BlurView` and web `backdrop-filter`. */
  intensity?: number;
};

/**
 * Frosted fill for floating overlays (toasts, etc.) that sit above scrollable
 * content as siblings. Unlike {@link GlassSurface}, this always uses an explicit
 * backdrop blur — `BlurView` on native (even on iOS 26, where `GlassView` does
 * not blur RN siblings) and CSS `backdrop-filter` on web — plus Android
 * `BlurTargetView` capture when available.
 */
export function OverlayGlassFill({ cardWashAlpha, intensity = 72 }: OverlayGlassFillProps) {
  const { colors, scheme } = useThemeTokens();
  const blurTarget = useBlurTarget();

  const cardWash = (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: withAlpha(colors.card, cardWashAlpha), pointerEvents: "none" },
      ]}
    />
  );

  if (Platform.OS === "web") {
    return (
      <>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: withAlpha(scheme === "dark" ? "#000000" : "#ffffff", 0.08),
              backdropFilter: "blur(20px) saturate(160%)",
              pointerEvents: "none",
            } as ViewStyle,
          ]}
        />
        {cardWash}
      </>
    );
  }

  const androidCapture = Platform.OS === "android" && blurTarget != null;
  const tint: BlurTint = scheme === "dark" ? "systemThinMaterialDark" : "systemThinMaterialLight";

  return (
    <>
      <BlurView
        tint={tint}
        intensity={intensity}
        blurMethod={androidCapture ? "dimezisBlurViewSdk31Plus" : undefined}
        blurTarget={androidCapture ? blurTarget : undefined}
        style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
      />
      {cardWash}
    </>
  );
}

type GlassControlProps = {
  /** Corner radius of the glass well. */
  radius: number;
  /** Optional glass tint (e.g. an accent for a primary control). */
  tintColor?: string;
  /** Override Liquid Glass appearance — use `"dark"` on colourful hero art. */
  colorScheme?: "light" | "dark";
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Wraps an interactive control in an interactive Liquid Glass well on iOS 26+
 * (per the building-native-ui glass guide). Off iOS 26 it renders children
 * untouched, so older iOS / Android / web keep their existing solid/tinted
 * controls and we never nest `BlurView`s (a perf pitfall the guide warns about).
 */
export function GlassControl({
  radius,
  tintColor,
  colorScheme,
  style,
  children,
}: GlassControlProps) {
  if (!hasLiquidGlass) return <>{children}</>;
  return (
    <GlassView
      isInteractive
      glassEffectStyle="regular"
      tintColor={tintColor}
      colorScheme={colorScheme}
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
    >
      {children}
    </GlassView>
  );
}
