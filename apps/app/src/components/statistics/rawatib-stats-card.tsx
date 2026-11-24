import { RAWATIB_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerLog } from "@munib-tracker/shared/types";
import {
  addDays,
  completedRawatibRakahs,
  rawatibConsistency,
  summarizeRawatib,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { HadithExcerptCard } from "@/components/hadith/hadith-excerpt-card";
import { LinkRow, MetricGrid, ReadableView } from "@/components/statistics/metrics";
import { SalahRateList } from "@/components/statistics/salah-rate-list";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Radius, Spacing } from "@/constants/theme";
import { useRawatibConfig } from "@/hooks/use-rawatib";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { RAWATIB_EVIDENCE, RAWATIB_ROUTE } from "@/lib/rawatib";
import { type PrayerDayIndex, rawatibBreakdown } from "@/lib/statistics";

const GRID_DAYS = 30;

type RawatibStatsCardProps = {
  logs: PrayerLog[];
  index: PrayerDayIndex;
  /** Inclusive period window (week / month / year). */
  from: string;
  to: string;
  today: string;
  formatCount: (value: number) => string;
};

/**
 * Rawatib section of /statistics (NF-3.1): days with the whole preset prayed,
 * today's rakahs toward 12 / 10, a 30-day consistency grid and per-row rates.
 * Fard rates elsewhere on the screen never include rawatib. No "house" counts —
 * just the hadith card (Muslim 728, rendered by reference from the corpus).
 */
export function RawatibStatsCard({
  logs,
  index,
  from,
  to,
  today,
  formatCount,
}: RawatibStatsCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const config = useRawatibConfig();

  const periodCells = useMemo(
    () => rawatibConsistency(logs, from, to, today),
    [logs, from, to, today],
  );
  const gridCells = useMemo(
    () => rawatibConsistency(logs, addDays(today, -(GRID_DAYS - 1)), today, today),
    [logs, today],
  );
  const summary = useMemo(() => summarizeRawatib(periodCells), [periodCells]);
  const rows = useMemo(
    () => rawatibBreakdown(index, periodCells, config.ids),
    [index, periodCells, config.ids],
  );
  const todayRakahs = useMemo(
    () =>
      completedRawatibRakahs(
        logs.filter((log) => log.date === today),
        config.preset,
      ),
    [logs, today, config.preset],
  );
  const hasAny = periodCells.some((cell) => !cell.beforeStart) || todayRakahs > 0;

  if (!config.enabled && !hasAny) return null;

  return (
    <Card padding="four" style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle">{t("rawatib.stats.title")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("rawatib.stats.subtitle", { count: config.preset })}
        </ThemedText>
      </View>
      <ReadableView style={[styles.shell, { backgroundColor: colors.muted }]}>
        <MetricGrid
          columns={3}
          metrics={[
            {
              value: `${formatCount(todayRakahs)}/${formatCount(config.preset)}`,
              label: t("rawatib.stats.todayRakahs"),
              color: tokens.status.success.text,
            },
            {
              value: formatCount(summary.completeDays),
              label: t("rawatib.stats.completeDays"),
              color: tokens.status.info.text,
            },
            {
              value: formatCount(summary.countedDays),
              label: t("rawatib.stats.trackedDays"),
              color: colors.accentText,
            },
          ]}
        />
      </ReadableView>

      <ReadableView
        accessibilityLabel={t("rawatib.stats.gridA11y", {
          complete: gridCells.filter((cell) => cell.complete).length,
          days: GRID_DAYS,
        })}
      >
        <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.blockTitle}>
          {t("rawatib.stats.gridTitle")}
        </ThemedText>
        <View style={styles.grid} testID="rawatib-grid">
          {gridCells.map((cell) => {
            const ratio = cell.total > 0 ? cell.done / cell.total : 0;
            const background = cell.excused
              ? tokens.status.info.soft
              : cell.beforeStart || cell.done === 0
                ? tokens.track
                : cell.complete
                  ? tokens.status.success.color
                  : tokens.status.success.soft;
            return (
              <View
                key={cell.date}
                style={[
                  styles.cell,
                  {
                    backgroundColor: background,
                    opacity: cell.beforeStart
                      ? 0.4
                      : ratio > 0 && !cell.complete
                        ? 0.6 + ratio * 0.4
                        : 1,
                    borderColor: cell.isToday ? colors.accent : "transparent",
                  },
                ]}
              />
            );
          })}
        </View>
      </ReadableView>

      {rows.some((row) => row.days > 0) ? (
        <View>
          <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.blockTitle}>
            {t("rawatib.stats.perRow")}
          </ThemedText>
          <SalahRateList rows={rows} formatCount={formatCount} />
        </View>
      ) : null}

      <View>
        <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.blockTitle}>
          {t("rawatib.stats.evidenceTitle")}
        </ThemedText>
        <HadithExcerptCard hadithId={RAWATIB_EVIDENCE.twelve} />
      </View>

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("rawatib.stats.note", { count: RAWATIB_PRAYERS.length })}
      </ThemedText>
      <LinkRow label={t("rawatib.stats.openHub")} onPress={() => router.push(RAWATIB_ROUTE)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    gap: 2,
  },
  shell: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.two,
  },
  blockTitle: {
    marginBottom: Spacing.two,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  cell: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
