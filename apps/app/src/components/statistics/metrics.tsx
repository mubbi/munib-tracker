import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { chevronForward } from "@/lib/rtl";

export type Metric = {
  value: string | number;
  label: string;
  color?: string;
};

type MetricGridProps = {
  metrics: Metric[];
  columns?: 2 | 3;
};

/** Equal-width metric cells in rows, with hairline dividers between columns and rows. */
export function MetricGrid({ metrics, columns = 2 }: MetricGridProps) {
  const { tokens } = useThemeTokens();
  const rows: Metric[][] = [];
  for (let i = 0; i < metrics.length; i += columns) {
    rows.push(metrics.slice(i, i + columns));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={row.map((m) => m.label).join("-")}>
          {rowIndex > 0 ? (
            <View style={[styles.rowDivider, { backgroundColor: tokens.hairline }]} />
          ) : null}
          <View style={styles.row}>
            {Array.from({ length: columns }).map((_, colIndex) => {
              const metric = row[colIndex];
              return (
                <View key={metric?.label ?? `empty-${colIndex}`} style={styles.cell}>
                  {colIndex > 0 ? (
                    <View style={[styles.colDivider, { backgroundColor: tokens.hairline }]} />
                  ) : null}
                  {metric ? (
                    <View style={styles.cellInner}>
                      <ThemedText
                        type="header"
                        style={metric.color ? { color: metric.color } : undefined}
                      >
                        {metric.value}
                      </ThemedText>
                      <ThemedText
                        type="caption"
                        themeColor="mutedForeground"
                        numberOfLines={2}
                        style={styles.metricLabel}
                      >
                        {metric.label}
                      </ThemedText>
                    </View>
                  ) : (
                    <View style={styles.cellInner} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

type StatsGroupProps = {
  title: string;
  metrics: Metric[];
  columns?: 2 | 3;
};

export function StatsGroup({ title, metrics, columns = 2 }: StatsGroupProps) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.group}>
      <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.groupTitle}>
        {title}
      </ThemedText>
      <View style={[styles.metricShell, { backgroundColor: colors.muted }]}>
        <MetricGrid metrics={metrics} columns={columns} />
      </View>
    </View>
  );
}

export function CardDivider() {
  const { tokens } = useThemeTokens();
  return <View style={[styles.cardDivider, { backgroundColor: tokens.hairline }]} />;
}

type StatLineProps = {
  label: string;
  value: string | number;
  color?: string;
  /** 0..1 — renders a thin relative bar under the row when set. */
  bar?: number;
};

export function StatLine({ label, value, color, bar }: StatLineProps) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.statLine}>
      <View style={styles.statLineMain}>
        <ThemedText type="small" style={styles.statLineLabel} numberOfLines={1}>
          {label}
        </ThemedText>
        <ThemedText type="smallBold" style={color ? { color } : { color: colors.foreground }}>
          {value}
        </ThemedText>
      </View>
      {bar != null ? <ProgressBar value={bar} height={3} color={color} /> : null}
    </View>
  );
}

type LinkRowProps = {
  label: string;
  onPress: () => void;
};

export function LinkRow({ label, onPress }: LinkRowProps) {
  const { colors } = useThemeTokens();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && styles.linkPressed]}
    >
      <ThemedText type="smallBold" style={{ color: colors.accent }}>
        {label}
      </ThemedText>
      <SymbolView name={chevronForward} size={14} tintColor={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  colDivider: {
    width: StyleSheet.hairlineWidth,
  },
  cellInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    gap: Spacing.one,
    minHeight: 72,
  },
  metricLabel: {
    textAlign: "center",
  },
  group: {
    gap: Spacing.two,
  },
  metricShell: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  groupTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.three,
  },
  statLine: {
    gap: Spacing.one + 2,
    paddingVertical: Spacing.one + 2,
  },
  statLineMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  statLineLabel: {
    flex: 1,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingTop: Spacing.one,
  },
  linkPressed: {
    opacity: 0.65,
  },
});
