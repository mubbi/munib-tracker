import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { useLearnTileStyle } from "@/components/jannah/hub-layout";
import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

const CHECKED_ICON: SymbolViewProps["name"] = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
};
const UNCHECKED_ICON: SymbolViewProps["name"] = {
  ios: "circle",
  android: "radio_button_unchecked",
  web: "radio_button_unchecked",
};

/**
 * One intention the reader can tick (Jannah / Jahannam journeys, G-45). A
 * ticked intention keeps its title in the foreground colour — done is not
 * disabled (G-42); the state is carried by the check glyph and `checked`.
 */
export function JourneyIntentionRow({
  icon,
  title,
  hint,
  checked,
  onToggle,
}: {
  icon: AppIcon;
  title: string;
  hint: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const { colors, tokens } = useThemeTokens();

  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={title}
      accessibilityHint={hint}
      onPress={onToggle}
      haptic="selection"
      style={[
        styles.intentionRow,
        isTV() ? styles.rowTv : styles.rowFill,
        { backgroundColor: colors.muted },
      ]}
    >
      <IconWell
        icon={icon}
        tint={checked ? tokens.status.success.onSoft : colors.mutedForeground}
        background={checked ? tokens.status.success.soft : colors.card}
        well={40}
        size={18}
      />
      <View style={styles.intentionCopy}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      </View>
      <SymbolView
        testID={checked ? "journey-intention-checked" : "journey-intention-unchecked"}
        name={checked ? CHECKED_ICON : UNCHECKED_ICON}
        size={22}
        tintColor={checked ? tokens.status.success.onSoft : colors.mutedForeground}
      />
    </PressableScale>
  );
}

/** One "today" metric that links to the tracker behind it (both journeys). */
export function JourneyMetricRow({
  icon,
  label,
  value,
  hint,
  progress,
  onPress,
  tiled,
}: {
  icon: AppIcon;
  label: string;
  value: string;
  hint: string;
  progress?: number | null;
  onPress: () => void;
  /** Wide grid cell: tile chrome instead of the hairline separator. */
  tiled: boolean;
}) {
  const tileStyle = useLearnTileStyle();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();

  return (
    <PressableScale
      onPress={onPress}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${value}`}
      accessibilityHint={hint}
      style={[
        styles.metricRow,
        isTV() && [styles.rowTv, styles.metricRowTv],
        { borderTopColor: tokens.hairline },
        tiled ? [tileStyle, styles.metricTile] : null,
      ]}
    >
      <IconWell icon={icon} tint={colors.accent} well={40} size={18} />
      <View style={styles.metricCopy}>
        <View style={styles.metricHead}>
          <ThemedText type="smallBold">{label}</ThemedText>
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {value}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
        {progress != null && progress > 0 ? (
          <ProgressBar value={progress} accessibilityLabel={label} height={4} />
        ) : null}
      </View>
      <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: BorderWidth.hairline,
  },
  metricTile: { borderTopWidth: 0 },
  // TV: inset so the focus ring does not sit on the icon / value text.
  metricRowTv: { paddingHorizontal: Spacing.two, borderRadius: Radius.md },
  metricCopy: { flex: 1, gap: Spacing.one },
  metricHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  intentionRow: {
    flexDirection: "row",
    gap: Spacing.three,
    alignItems: "center",
    padding: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  intentionCopy: { flex: 1, gap: Spacing.half },
  rowTv: { minHeight: TvLayout.minFocusTarget },
  // Grid cells: fill the row height (inert in the phone stack).
  rowFill: { flexGrow: 1 },
});
