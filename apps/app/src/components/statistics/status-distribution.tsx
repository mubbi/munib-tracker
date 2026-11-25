import { I18nManager, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type DistributionSegment = {
  key: string;
  label: string;
  /** Size of the segment (named `amount`, not `value`: Reanimated's Babel
   * plugin flags `.value` reads inside inline styles as shared values). */
  amount: number;
  color: string;
};

type StatusDistributionProps = {
  segments: DistributionSegment[];
  formatValue?: (value: number) => string;
  /** Localized summary for screen readers (the stacked bar is decorative). */
  accessibilityLabel?: string;
};

/**
 * One stacked bar showing how a period's salah split across statuses, with a
 * legend of counts and shares underneath. Segments with no value are skipped
 * in the bar but kept in the legend so the categories stay stable.
 */
export function StatusDistribution({
  segments,
  formatValue = (value) => `${value}`,
  accessibilityLabel,
}: StatusDistributionProps) {
  const { tokens } = useThemeTokens();
  const total = segments.reduce((sum, segment) => sum + segment.amount, 0);

  return (
    <View style={styles.root} accessible accessibilityLabel={accessibilityLabel}>
      <View style={[styles.bar, { backgroundColor: tokens.track }]}>
        {total > 0
          ? segments
              .filter((segment) => segment.amount > 0)
              .map((segment) => (
                <View
                  key={segment.key}
                  style={{ flexGrow: segment.amount, flexBasis: 0, backgroundColor: segment.color }}
                />
              ))
          : null}
      </View>
      <View style={styles.legend}>
        {segments.map((segment) => {
          const share = total > 0 ? Math.round((segment.amount / total) * 100) : 0;
          return (
            <View key={segment.key} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: segment.color }]} />
              <ThemedText
                type="caption"
                themeColor="mutedForeground"
                numberOfLines={1}
                style={styles.legendLabel}
              >
                {segment.label}
              </ThemedText>
              <ThemedText type="smallBold" style={styles.legendValue}>
                {formatValue(segment.amount)}
              </ThemedText>
              <ThemedText
                type="caption"
                themeColor="mutedForeground"
                style={[styles.legendShare, { textAlign: I18nManager.isRTL ? "left" : "right" }]}
              >
                {`${share}%`}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  bar: {
    flexDirection: "row",
    height: 12,
    borderRadius: Radius.pill,
    overflow: "hidden",
    gap: Spacing.half,
  },
  legend: {
    gap: Spacing.one,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
  },
  legendValue: {
    fontVariant: ["tabular-nums"],
  },
  legendShare: {
    minWidth: 36,
    fontVariant: ["tabular-nums"],
  },
});
