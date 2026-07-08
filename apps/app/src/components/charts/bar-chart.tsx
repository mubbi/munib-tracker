import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

export type BarDatum = {
  label: string;
  /** 0..1 fill height. */
  value: number;
  caption?: string;
};

type BarChartProps = {
  data: BarDatum[];
  color?: string;
  /** Plot height in px (labels sit below and do not count toward this). */
  height?: number;
  /** Shown when every bar is empty. */
  emptyLabel?: string;
};

const MIN_FILL_PCT = 8;

/** A dependency-free vertical bar chart built from Views — renders on iOS/Android/Web. */
export function BarChart({ data, color, height = 112, emptyLabel }: BarChartProps) {
  const { colors, tokens } = useThemeTokens();
  const barColor = color ?? colors.accent;
  const dense = data.length > 14;
  const gap = dense ? 2 : Spacing.one;
  const barWidth = dense ? "100%" : "72%";
  const allEmpty = data.length > 0 && data.every((d) => d.value <= 0);

  const axisTicks = data
    .map((datum, index) => ({ label: datum.label.trim(), index }))
    .filter((entry) => entry.label.length > 0);

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.plotShell,
          {
            height,
            backgroundColor: tokens.isDark ? tokens.surfaceRaised : colors.muted,
            borderColor: tokens.hairline,
          },
        ]}
      >
        {allEmpty && emptyLabel ? (
          <View style={styles.emptyOverlay} pointerEvents="none">
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.emptyText}>
              {emptyLabel}
            </ThemedText>
          </View>
        ) : null}

        <View style={[styles.plot, { gap }]}>
          {data.map((datum, index) => {
            const clamped = Math.max(0, Math.min(1, datum.value));
            const hasValue = clamped > 0;
            const fillPct = hasValue ? Math.max(clamped * 100, MIN_FILL_PCT) : 0;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
              <View key={`${datum.label}-${index}`} style={styles.barColumn}>
                <View
                  accessibilityRole="image"
                  accessibilityLabel={`${datum.label || `Bar ${index + 1}`}: ${Math.round(clamped * 100)}%`}
                  style={[
                    styles.track,
                    {
                      width: barWidth,
                      backgroundColor: tokens.track,
                    },
                  ]}
                >
                  {hasValue ? (
                    <View
                      style={[
                        styles.fill,
                        {
                          height: `${fillPct}%`,
                          backgroundColor: barColor,
                        },
                      ]}
                    />
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {dense ? (
        <View style={styles.axisRow}>
          {axisTicks.map((entry) => (
            <ThemedText
              key={`${entry.label}-${entry.index}`}
              type="caption"
              themeColor="mutedForeground"
              numberOfLines={1}
              style={styles.axisLabel}
            >
              {entry.label}
            </ThemedText>
          ))}
        </View>
      ) : (
        <View style={[styles.labels, { gap }]}>
          {data.map((datum, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
            <View key={`${datum.label}-label-${index}`} style={styles.labelColumn}>
              <ThemedText
                type="caption"
                themeColor="mutedForeground"
                numberOfLines={1}
                style={styles.label}
              >
                {datum.label}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.one + 2,
  },
  plotShell: {
    position: "relative",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    overflow: "hidden",
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
    zIndex: 1,
  },
  emptyText: {
    textAlign: "center",
  },
  plot: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  track: {
    flex: 1,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    minHeight: 6,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  labels: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.two,
  },
  labelColumn: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    textAlign: "center",
    fontSize: 11,
  },
  axisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
    minHeight: 16,
  },
  axisLabel: {
    flexShrink: 1,
    fontSize: 11,
    fontVariant: ["tabular-nums"],
  },
});
