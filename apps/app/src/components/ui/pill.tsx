import { accentOnSurface } from "@munib-tracker/theme/color";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo } from "react";
import {
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type PillTone = "accent" | "success" | "warning" | "danger" | "info" | "neutral";

export type PillProps = {
  label: string;
  /** Semantic preset: soft tint fill + AA `onSoft` label. Explicit `color` / `background` win. */
  tone?: PillTone;
  color?: string;
  background?: string;
  icon?: SymbolViewProps["name"];
  style?: StyleProp<ViewStyle>;
  /** Tighter padding for dense list rows. */
  compact?: boolean;
};

export function Pill({ label, tone, color, background, icon, style, compact }: PillProps) {
  const { colors, tokens } = useThemeTokens();
  const { fontScale } = useWindowDimensions();
  // Large text: wrap to two lines rather than truncate (F-58).
  const lines = fontScale >= 1.3 ? 2 : 1;
  const preset = tone ? toneColors(tone, colors, tokens) : undefined;
  // A soft-tint pill is translucent over a neutral surface; `muted` is the
  // extreme neutral in both schemes (darkest in light, lightest in dark), so
  // clearing 5:1 against it keeps caption text AA on any tint. Solid / custom
  // backgrounds (hero, gradients) are trusted to the caller.
  const fg = useMemo(() => {
    if (color == null && preset) return preset.fg;
    const raw = color ?? colors.accent;
    return isSoftTint(background) ? accentOnSurface(raw, colors.muted, 5) : raw;
  }, [background, color, colors.accent, colors.muted, preset]);
  const bg = background ?? preset?.bg ?? tokens.accentSoft;

  return (
    <View style={[styles.pill, compact && styles.pillCompact, { backgroundColor: bg }, style]}>
      {icon ? <SymbolView name={icon} size={12} tintColor={fg} /> : null}
      <ThemedText type="caption" numberOfLines={lines} style={[styles.label, { color: fg }]}>
        {label}
      </ThemedText>
    </View>
  );
}

function toneColors(
  tone: PillTone,
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
): { fg: string; bg: string } {
  if (tone === "accent") return { fg: tokens.accentOnSoft, bg: tokens.accentSoft };
  if (tone === "neutral") return { fg: colors.mutedForeground, bg: colors.muted };
  return { fg: tokens.status[tone].onSoft, bg: tokens.status[tone].soft };
}

/** True for the default tint or an 8-digit hex fill at ≤40% alpha (e.g. `withAlpha(c, 0.18)`). */
function isSoftTint(background: string | undefined): boolean {
  if (background == null) return true;
  const match = /^#[0-9a-f]{6}([0-9a-f]{2})$/i.exec(background);
  return match != null && Number.parseInt(match[1] ?? "ff", 16) <= 0x66;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  label: { flexShrink: 1 },
  pillCompact: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.oneHalf,
    alignSelf: "center",
  },
});
