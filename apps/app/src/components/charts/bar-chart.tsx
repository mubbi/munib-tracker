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
  height?: number;
};

/** A dependency-free vertical bar chart built from Views — renders on iOS/Android/Web. */
export function BarChart({ data, color, height = 140 }: BarChartProps) {
  const { colors, tokens } = useThemeTokens();
  const barColor = color ?? colors.accent;

  return (
    <View>
      <View style={[styles.plot, { height }]}>
        {data.map((datum, index) => {
          const clamped = Math.max(0, Math.min(1, datum.value));
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
            <View key={`${datum.label}-${index}`} style={styles.column}>
              <View style={[styles.track, { backgroundColor: tokens.track }]}>
                <View
                  accessibilityRole="image"
                  accessibilityLabel={`${datum.label}: ${Math.round(clamped * 100)}%`}
                  style={[
                    styles.fill,
                    { height: `${Math.max(clamped * 100, 2)}%`, backgroundColor: barColor },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((datum, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: chart labels are not unique (repeated weekday/month initials)
          <View key={`${datum.label}-label-${index}`} style={styles.column}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  plot: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.one,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  track: {
    width: "70%",
    height: "100%",
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  labels: {
    flexDirection: "row",
    marginTop: Spacing.one + 2,
  },
  label: {
    textAlign: "center",
  },
});
