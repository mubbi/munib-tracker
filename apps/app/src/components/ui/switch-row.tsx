import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

export type SwitchRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

/**
 * Non-focusable on/off track for TV rows. tvOS has no `UISwitch` and a small
 * native switch is a poor D-pad target, so the whole row takes focus and
 * Select toggles it; this only draws the state. `flex-start`/`flex-end` follow
 * layout direction, so "on" sits at the trailing edge in LTR and RTL.
 */
export function TvSwitchTrack({ value }: { value: boolean }) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View
      style={[
        styles.tvTrack,
        {
          backgroundColor: value ? colors.accent : tokens.track,
          alignItems: value ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View style={[styles.tvKnob, { backgroundColor: colors.card }]} />
    </View>
  );
}

/**
 * A compact, in-context on/off row (title + optional hint + switch). The
 * feature-local twin of the settings `ToggleRow` — one implementation instead
 * of the per-feature copies (seasonal, focus lock, timetable import …).
 *
 * - Phone / web: 44pt minimum row, native switch labelled with the title
 *   (Apple HIG "Toggles", Material 3 "Switch").
 * - TV: the whole row is the focus target with WAI-ARIA `switch` semantics.
 */
export function SwitchRow({ title, subtitle, value, onValueChange, disabled }: SwitchRowProps) {
  const { colors } = useThemeTokens();

  if (isTV()) {
    return (
      <PressableScale
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityState={{ checked: value, disabled: !!disabled }}
        disabled={disabled}
        onPress={() => onValueChange(!value)}
        style={[styles.tvRow, { backgroundColor: colors.muted, opacity: disabled ? 0.5 : 1 }]}
      >
        <View style={styles.text}>
          <ThemedText type="small" style={{ fontSize: TvLayout.bodyFontSize }}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <TvSwitchTrack value={value} />
      </PressableScale>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <ThemedText type="small">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <ThemedSwitch
        value={value}
        disabled={disabled}
        onValueChange={onValueChange}
        accessibilityLabel={title}
        accessibilityHint={subtitle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    // 44pt row even when the subtitle is absent (HIG / M3 minimum target).
    minHeight: 44,
    paddingVertical: Spacing.one,
  },
  tvRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: TvLayout.minFocusTarget,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
  tvTrack: {
    width: tvDp(56),
    height: tvDp(32),
    borderRadius: tvDp(16),
    padding: tvDp(3),
    justifyContent: "center",
  },
  tvKnob: {
    width: tvDp(26),
    height: tvDp(26),
    borderRadius: tvDp(13),
  },
});
