import { StyleSheet, View } from "react-native";
import type { ThemedTextProps } from "@/components/themed-text";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type Stat = { value: number | string; label: string; color?: string };

type StatPairProps = {
  primary: Stat;
  secondary: Stat;
  /** Show a vertical hairline divider between the two stats. */
  divider?: boolean;
  /** Number size — "display" for hero cards, "header" for compact grids. */
  size?: Extract<ThemedTextProps["type"], "display" | "header">;
};

/** Two side-by-side stats (e.g. remaining / completed), shared across qaza, roza, and statistics. */
export function StatPair({ primary, secondary, divider = false, size = "display" }: StatPairProps) {
  const { tokens } = useThemeTokens();
  return (
    <View style={styles.row}>
      <StatColumn stat={primary} size={size} />
      {divider ? <View style={[styles.divider, { backgroundColor: tokens.hairline }]} /> : null}
      <StatColumn stat={secondary} size={size} />
    </View>
  );
}

function StatColumn({ stat, size }: { stat: Stat; size: "display" | "header" }) {
  return (
    <View style={styles.stat}>
      <ThemedText type={size} style={stat.color ? { color: stat.color } : undefined}>
        {stat.value}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {stat.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
    gap: Spacing.one,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});
