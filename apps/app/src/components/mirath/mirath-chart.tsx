import type { MirathResult } from "@munib-tracker/shared/mirath";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CategoryHues, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chartCoordinateStyle, segmentedTrackDirection } from "@/lib/chart-rtl";
import {
  type MirathChartSegment,
  mirathChartA11yLabel,
  mirathChartSegments,
  mirathSegmentLabel,
} from "@/lib/mirath/chart";

const HUES = [
  CategoryHues.sage,
  CategoryHues.dawn,
  CategoryHues.sky,
  CategoryHues.rose,
  CategoryHues.violet,
] as const;

/**
 * Stacked share bar + legend for one school's result (NF-3.10 "pie/bars chart").
 * The bar sits on the fixed LTR chart plane (`chart-rtl.ts`) and runs from the
 * reading edge, so the first heir is on the right in RTL. Each legend entry
 * carries the fraction and percentage; the bar is one accessible element.
 */
export function MirathShareChart({ result }: { result: MirathResult }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const segments = useMemo(() => mirathChartSegments(result), [result]);
  if (!segments.length) return null;

  const colorOf = (s: MirathChartSegment) =>
    s.kind === "unallocated"
      ? tokens.track
      : s.hue === 0
        ? colors.accent
        : (HUES[(s.hue - 1) % HUES.length] as string);

  return (
    <View style={styles.wrap}>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={mirathChartA11yLabel(t, segments)}
        style={[
          chartCoordinateStyle,
          styles.bar,
          { flexDirection: segmentedTrackDirection(), backgroundColor: tokens.track },
        ]}
      >
        {segments.map((s) => (
          <View
            key={s.kind === "heir" ? s.heir : "unallocated"}
            style={[styles.segment, { flexGrow: s.percent, backgroundColor: colorOf(s) }]}
          />
        ))}
      </View>
      {/* The bar's label already reads every share; hide the duplicate legend from screen readers. */}
      <View
        style={styles.legend}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {segments.map((s) => (
          <View key={s.kind === "heir" ? s.heir : "unallocated"} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: colorOf(s) }]} />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendText}>
              {mirathSegmentLabel(t, s)}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: Spacing.three, gap: Spacing.two },
  bar: {
    height: 18,
    borderRadius: Radius.sm,
    overflow: "hidden",
    gap: 2,
  },
  segment: { flexBasis: 0, minWidth: 3 },
  legend: { flexDirection: "row", flexWrap: "wrap", columnGap: Spacing.three, rowGap: Spacing.one },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.one, maxWidth: "100%" },
  swatch: { width: 10, height: 10, borderRadius: 5 },
  legendText: { flexShrink: 1 },
});
