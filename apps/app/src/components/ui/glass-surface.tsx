import { type BlurTint, BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode } from "react";
import { type LayoutChangeEvent, Platform, type StyleProp, type ViewStyle } from "react-native";

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
  onLayout,
}: GlassSurfaceProps) {
  const { scheme } = useThemeTokens();
  const blurTarget = useBlurTarget();

  if (hasLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={interactive}
        colorScheme={scheme}
        style={style}
        onLayout={onLayout}
      >
        {children}
      </GlassView>
    );
  }

  const resolvedTint: BlurTint =
    tint ?? (scheme === "dark" ? "systemChromeMaterialDark" : "systemChromeMaterialLight");

  const androidBlurMethod =
    Platform.OS === "android" && blurTarget ? "dimezisBlurViewSdk31Plus" : undefined;

  return (
    <BlurView
      tint={resolvedTint}
      intensity={intensity}
      // Real blur on Android 12+ when a root `BlurTargetView` is configured; iOS/web
      // ignore `blurMethod` / `blurTarget`. Without a target, Android falls back to
      // a translucent tint (no blur) to avoid native warnings.
      blurMethod={androidBlurMethod}
      blurTarget={Platform.OS === "android" ? (blurTarget ?? undefined) : undefined}
      style={style}
      onLayout={onLayout}
    >
      {children}
    </BlurView>
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
