import { type BlurTint, BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useThemeTokens } from "@/hooks/use-theme-tokens";

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
}: GlassSurfaceProps) {
  const { scheme } = useThemeTokens();

  if (hasLiquidGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={interactive}
        colorScheme={scheme}
        style={style}
      >
        {children}
      </GlassView>
    );
  }

  const resolvedTint: BlurTint =
    tint ?? (scheme === "dark" ? "systemChromeMaterialDark" : "systemChromeMaterialLight");

  return (
    <BlurView
      tint={resolvedTint}
      intensity={intensity}
      // Real blur on Android 12+ (falls back to a translucent material below that);
      // iOS/web ignore this. Without it, Android renders no blur at all.
      blurMethod="dimezisBlurViewSdk31Plus"
      style={style}
    >
      {children}
    </BlurView>
  );
}
