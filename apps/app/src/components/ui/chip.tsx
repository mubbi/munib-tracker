import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Opacity, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

/**
 * Accessibility semantics of a chip — pick by what the chip *does*:
 * - `switch`: an on/off preference (show transliteration) — WAI-ARIA switch.
 * - `checkbox`: one of several independent picks (weekend days).
 * - `radio`: one-of-N filter (All / Meccan / Medinan).
 * - `button`: a filter tab announced as "selected" (the historic default).
 */
export type ChipRole = "switch" | "checkbox" | "radio" | "button";

/** `soft`: tinted fill + accent outline (toggles). `solid`: accent fill (filters / tabs). */
export type ChipVariant = "soft" | "solid";

export type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: SymbolViewProps["name"];
  /** Trailing count badge (search / occasion filters). */
  count?: number;
  role?: ChipRole;
  variant?: ChipVariant;
  disabled?: boolean;
  /** Defaults to `label` (and `label, count` when a count is shown). */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Visual height of a phone chip is ~34pt; extend the touch area to the 44pt
 * minimum without changing layout (Apple HIG "Accessibility → Buttons and
 * controls", Material 3 48dp target). TV uses `chipMinHeight` instead.
 */
const PHONE_HIT_SLOP = { top: 6, bottom: 6, left: 2, right: 2 } as const;

/**
 * The one pill-shaped selectable chip. Replaces the per-screen `ToggleChip` /
 * `FilterChip` copies (Qur'an + hadith toolbars, scripture filters, search,
 * dua occasions, Qur'an revelation filter).
 *
 * TV: selection is drawn as a soft fill + hairline accent so the solid focus
 * ring stays the only "focused" look (D-pad users must tell the two apart).
 */
export function Chip({
  label,
  selected,
  onPress,
  icon,
  count,
  role = "button",
  variant = "soft",
  disabled,
  accessibilityLabel,
  style,
}: ChipProps) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { fontScale } = useWindowDimensions();
  // Large text: let the label wrap to two lines instead of truncating (F-58).
  const labelLines = fontScale >= 1.3 ? 2 : 1;
  const solid = variant === "solid" && !tv;

  const fg = selected
    ? solid
      ? colors.accentForeground
      : tokens.accentOnSoft
    : colors.mutedForeground;
  const backgroundColor = selected ? (solid ? colors.accent : tokens.accentSoft) : colors.muted;
  const borderColor = selected
    ? tv
      ? withAlpha(colors.accent, 0.35)
      : colors.accent
    : "transparent";

  const checkable = role === "switch" || role === "checkbox" || role === "radio";
  const a11yLabel =
    accessibilityLabel ?? (count == null ? label : `${label}, ${count.toLocaleString()}`);

  return (
    <PressableScale
      haptic="selection"
      scaleTo={0.95}
      disabled={disabled}
      accessibilityRole={role}
      accessibilityLabel={a11yLabel}
      accessibilityState={
        checkable ? { checked: selected, disabled: !!disabled } : { selected, disabled: !!disabled }
      }
      hitSlop={tv ? undefined : PHONE_HIT_SLOP}
      onPress={onPress}
      style={[
        styles.chip,
        tv && styles.chipTv,
        { backgroundColor, borderColor, opacity: disabled ? Opacity.disabled : 1 },
        style,
      ]}
    >
      {icon ? <SymbolView name={icon} size={tv ? 20 : 16} tintColor={fg} /> : null}
      <ThemedText
        type="smallBold"
        numberOfLines={labelLines}
        style={[styles.label, { color: fg }, tv && { fontSize: TvLayout.bodyFontSize }]}
      >
        {label}
      </ThemedText>
      {count != null ? (
        <View
          style={[
            styles.count,
            { backgroundColor: selected && solid ? tokens.scrim : tokens.hairline },
          ]}
        >
          <ThemedText type="caption" style={{ color: fg }}>
            {count.toLocaleString()}
          </ThemedText>
        </View>
      ) : null}
    </PressableScale>
  );
}

/**
 * On/off chip for a visibility preference (transliteration / translation …).
 * Prop-compatible with the toolbar `ToggleChip` it replaces.
 */
export function ToggleChip({
  icon,
  label,
  enabled,
  accessibilityLabel,
  onPress,
  disabled,
}: {
  icon?: SymbolViewProps["name"];
  label: string;
  enabled: boolean;
  accessibilityLabel?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Chip
      role="switch"
      icon={icon}
      label={label}
      selected={enabled}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
    maxWidth: 200,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    borderColor: "transparent",
  },
  chipTv: {
    maxWidth: tvDp(280),
    minHeight: TvLayout.chipMinHeight,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  label: { flexShrink: 1 },
  count: {
    minWidth: 22,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: Radius.pill,
    alignItems: "center",
  },
});
