import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import type { SalahRow } from "@/lib/statistics";

type SalahRateListProps = {
  rows: SalahRow[];
  formatCount: (value: number) => string;
};

/** Rate tone: ≥80% success, ≥50% warning, below that needs care. */
function useRateColor() {
  const { tokens, colors } = useThemeTokens();
  return (rate: number | null) => {
    if (rate == null) return colors.mutedForeground;
    if (rate >= 0.8) return tokens.status.success.color;
    if (rate >= 0.5) return tokens.status.warning.color;
    return tokens.status.danger.color;
  };
}

/** Each salah's on-time rate for the period, with a bar and its status counts. */
export function SalahRateList({ rows, formatCount }: SalahRateListProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const rateColor = useRateColor();

  return (
    <View style={[styles.list, { backgroundColor: colors.muted }]}>
      {rows.map((row, index) => {
        const color = rateColor(row.onTimeRate);
        const percent = row.onTimeRate == null ? "—" : `${Math.round(row.onTimeRate * 100)}%`;
        const name = t(`prayers.${row.prayerId}`);
        const meta = t("statistics.salahRowMeta", {
          completed: formatCount(row.completed),
          delayed: formatCount(row.delayed),
          missed: formatCount(row.missed),
        });
        return (
          <TvReadableBlock key={row.prayerId} accessibilityLabel={`${name}, ${percent}, ${meta}`}>
            {index > 0 ? (
              <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
            ) : null}
            <View style={styles.row}>
              <IconWell icon={PRAYER_ICONS[row.prayerId]} />
              <View style={styles.copy}>
                <View style={styles.titleRow}>
                  <ThemedText type="smallBold" style={styles.name} numberOfLines={1}>
                    {name}
                  </ThemedText>
                  <ThemedText type="smallBold" style={[styles.percent, { color }]}>
                    {percent}
                  </ThemedText>
                </View>
                <ProgressBar
                  value={row.onTimeRate ?? 0}
                  accessibilityLabel={name}
                  height={4}
                  color={color}
                />
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {meta}
                </ThemedText>
              </View>
            </View>
          </TvReadableBlock>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  percent: {
    fontVariant: ["tabular-nums"],
  },
});
