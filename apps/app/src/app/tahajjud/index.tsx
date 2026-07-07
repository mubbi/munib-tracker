import type { AppLocale, PrayerLog } from "@munib-tracker/shared/types";
import {
  addDays,
  computePrayerStreak,
  getLocalDateString,
  longestPrayerStreak,
  prayerCompletionDates,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatCalendarDateFromIso, formatCompactGridDateFromIso } from "@/lib/calendar-format";
import { goBackOrReplace } from "@/lib/navigation";
import { usePreferences } from "@/stores/preferences-store";
import { usePrayerStatus, useTrackerActions } from "@/stores/tracker-store";

const GRID_NIGHTS = 14;

export default function TahajjudScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { setPrayerStatus } = useTrackerActions();
  const todayStatus = usePrayerStatus("tahajjud");
  const today = getLocalDateString();
  const defaultCalendar = useDefaultCalendar();
  const locale = usePreferences().locale as AppLocale;

  const [logs, setLogs] = useState<PrayerLog[]>([]);

  const reload = useCallback(async () => {
    setLogs(await PrayerRepository.getAll());
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const completed = useMemo(() => prayerCompletionDates(logs, "tahajjud"), [logs]);
  const currentStreak = useMemo(() => computePrayerStreak(logs, "tahajjud", today), [logs, today]);
  const longest = useMemo(() => longestPrayerStreak(logs, "tahajjud"), [logs]);
  const totalNights = completed.size;

  // Most-recent-first strip of the last two weeks.
  const nights = useMemo(() => {
    const cells: { date: string; done: boolean; isToday: boolean }[] = [];
    for (let i = 0; i < GRID_NIGHTS; i += 1) {
      const date = addDays(today, -i);
      cells.push({ date, done: completed.has(date), isToday: i === 0 });
    }
    return cells;
  }, [completed, today]);

  const prayedToday = todayStatus === "completed";

  const toggleTonight = async () => {
    await setPrayerStatus("tahajjud", prayedToday ? "pending" : "completed");
    await reload();
  };

  const nightLabel = (date: string) => formatCompactGridDateFromIso(date, defaultCalendar, locale);

  const nightAccessibilityLabel = (date: string) =>
    formatCalendarDateFromIso(date, defaultCalendar, locale);

  return (
    <ScreenLayout
      eyebrow={t("tahajjud.eyebrow")}
      title={t("tahajjud.title")}
      subtitle={t("tahajjud.subtitle")}
      onBack={() => goBackOrReplace(router, "/tracker")}
    >
      <Seo path="/tahajjud" />

      <View style={styles.stack}>
        <Card
          padding="four"
          style={{
            backgroundColor: tokens.status.info.soft,
            borderColor: withAlpha(tokens.status.info.color, tokens.isDark ? 0.45 : 0.28),
            borderWidth: StyleSheet.hairlineWidth,
          }}
        >
          <View style={styles.heroRow}>
            <View
              style={[
                styles.heroIcon,
                { backgroundColor: withAlpha(tokens.status.info.color, 0.16) },
              ]}
            >
              <SymbolView
                name={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
                size={22}
                tintColor={tokens.status.info.color}
              />
            </View>
            <View style={styles.heroCopy}>
              <ThemedText type="display" style={{ color: tokens.status.info.text }}>
                {t("tahajjud.streakValue", { count: currentStreak })}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("tahajjud.streakCaption")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.pills}>
            <Pill
              label={t("tahajjud.bestStreak", { count: longest })}
              color={tokens.status.success.color}
              background={tokens.status.success.soft}
            />
            <Pill
              label={t("tahajjud.totalNights", { count: totalNights })}
              color={colors.accent}
              background={tokens.accentSoft}
            />
          </View>

          <Button
            label={prayedToday ? t("tahajjud.markedTonight") : t("tahajjud.markTonight")}
            variant={prayedToday ? "secondary" : "primary"}
            icon={
              prayedToday
                ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
                : { ios: "moon.fill", android: "bedtime", web: "bedtime" }
            }
            fullWidth
            onPress={() => void toggleTonight()}
            style={styles.markButton}
          />
        </Card>

        <Card padding="three">
          <ThemedText type="smallBold">
            {t("tahajjud.lastNights", { count: GRID_NIGHTS })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.gridHint}>
            {t("tahajjud.lastNightsHint")}
          </ThemedText>
          <View style={styles.grid}>
            {nights.map((cell) => (
              <View
                key={cell.date}
                style={styles.cell}
                accessibilityLabel={nightAccessibilityLabel(cell.date)}
              >
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor: cell.done ? tokens.status.success.color : colors.muted,
                      borderColor: cell.isToday ? colors.accent : "transparent",
                      borderWidth: cell.isToday ? 2 : 0,
                    },
                  ]}
                >
                  {cell.done ? (
                    <SymbolView
                      name={{ ios: "checkmark", android: "check", web: "check" }}
                      size={12}
                      tintColor={colors.accentText}
                    />
                  ) : null}
                </View>
                <ThemedText
                  type="caption"
                  themeColor="mutedForeground"
                  style={styles.cellLabel}
                  numberOfLines={1}
                >
                  {nightLabel(cell.date)}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <Card padding="three">
          <View style={styles.hadithHeader}>
            <SymbolView
              name={{ ios: "quote.opening", android: "format_quote", web: "format_quote" }}
              size={16}
              tintColor={colors.mutedForeground}
            />
            <ThemedText type="smallBold">{t("tahajjud.virtueTitle")}</ThemedText>
          </View>
          <ThemedText type="small" themeColor="foreground" style={styles.hadithBody}>
            {t("tahajjud.virtueBody")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("tahajjud.virtueRef")}
          </ThemedText>
        </Card>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  heroRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: { flex: 1, gap: 2 },
  pills: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  markButton: { marginTop: Spacing.three },
  gridHint: { marginTop: Spacing.one },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  cell: { alignItems: "center", gap: Spacing.one, minWidth: 36, flex: 1 },
  cellLabel: { fontSize: 10, textAlign: "center" },
  dot: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  hadithHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  hadithBody: { marginTop: Spacing.two, marginBottom: Spacing.one },
});
