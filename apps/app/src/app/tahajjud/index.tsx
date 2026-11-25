import type { AppLocale, PrayerLog } from "@munib-tracker/shared/types";
import {
  addDays,
  computePrayerStreak,
  getLocalDateString,
  longestPrayerStreak,
  prayerCompletionDates,
} from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { NightTimeline } from "@/components/night-timeline";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { BorderWidth, Breakpoints, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useNow } from "@/hooks/use-now";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useTimeFormat } from "@/hooks/use-time-format";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { localizedWeekdayInitials } from "@/lib/calendar";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { triggerHaptic } from "@/lib/haptics";
import { gregorianToHijri } from "@/lib/hijri";
import { tTv } from "@/lib/i18n/t-tv";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import { locationCalcExtras } from "@/lib/location";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  computeNightDividers,
  detectNightPrayerBounds,
  formatDuration,
  formatPrayerTime,
} from "@/lib/prayer-times";
import { chevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { trackerStore, usePrayerStatus, useTrackerActions } from "@/stores/tracker-store";

/** Full weeks shown in the history calendar (the last row ends on today's week). */
const CALENDAR_WEEKS = 4;

type NightCell =
  | { kind: "night"; date: string; done: boolean; isToday: boolean; day: string }
  | { kind: "future"; key: string };

const MOON_ICON: SymbolViewProps["name"] = {
  ios: "moon.stars.fill",
  android: "nights_stay",
  web: "nights_stay",
};

export default function TahajjudScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { setPrayerStatus } = useTrackerActions();
  const todayStatus = usePrayerStatus("tahajjud");
  const today = getLocalDateString();
  const defaultCalendar = useDefaultCalendar();
  const locale = usePreferences().locale as AppLocale;
  const timeFormat = useTimeFormat();
  const location = useLocation();
  const now = useNow();
  const tv = isTV();
  const { width } = useWindowDimensions();
  /** Desktop / wide web: history calendar + virtue as main column, tonight + stats aside. */
  const twoPane = !tv && width >= Breakpoints.wide;

  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">("loading");
  const undoToast = useUndoToast();

  const reload = useCallback(async () => {
    try {
      setLogs(await PrayerRepository.getAll());
      setLoadStatus("ready");
    } catch {
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const completed = useMemo(() => prayerCompletionDates(logs, "tahajjud"), [logs]);
  const currentStreak = useMemo(() => computePrayerStreak(logs, "tahajjud", today), [logs, today]);
  const longest = useMemo(() => longestPrayerStreak(logs, "tahajjud"), [logs]);
  const totalNights = completed.size;
  const prayedToday = todayStatus === "completed";

  // ── Tonight: Maghrib → Fajr for the night that contains (or follows) now ──
  const night = useMemo(() => {
    const bounds = detectNightPrayerBounds(
      { latitude: location.latitude, longitude: location.longitude },
      now,
      location.method,
      location.madhab,
      locationCalcExtras(location),
      location.timeZone,
    );
    if (bounds.fajrAt.getTime() <= bounds.maghribAt.getTime()) return undefined;
    return { ...computeNightDividers(bounds.maghribAt, bounds.fajrAt), ...bounds };
  }, [location, now]);

  const inLastThird =
    night != null &&
    now.getTime() >= night.lastThird.getTime() &&
    now.getTime() < night.fajrAt.getTime();

  const countdown = useMemo(() => {
    if (!night) return undefined;
    const nowMs = now.getTime();
    if (nowMs < night.lastThird.getTime()) {
      const minutes = Math.round((night.lastThird.getTime() - nowMs) / 60_000);
      return t("lastThirdNight.willStartIn", { time: formatDuration(minutes, t) });
    }
    if (nowMs < night.fajrAt.getTime()) {
      const minutes = Math.round((night.fajrAt.getTime() - nowMs) / 60_000);
      return t("lastThirdNight.timeRemaining", { time: formatDuration(minutes, t) });
    }
    return undefined;
  }, [night, now, t]);

  const formatTime = (date: Date) => formatPrayerTime(date, timeFormat, location.timeZone);

  // ── History: Sunday-first weeks, oldest → newest, ending on today's week ──
  const weekdays = useMemo(() => localizedWeekdayInitials(locale), [locale]);
  const numberFormat = useMemo(() => {
    try {
      return new Intl.NumberFormat(localeToBcp47(locale));
    } catch {
      return undefined;
    }
  }, [locale]);

  const { weeks, firstDate, pastNights, donePast } = useMemo(() => {
    const todayWeekday = new Date(`${today}T00:00:00`).getDay();
    const start = addDays(today, -(todayWeekday + 7 * (CALENDAR_WEEKS - 1)));
    const rows: NightCell[][] = [];
    let past = 0;
    let done = 0;
    for (let w = 0; w < CALENDAR_WEEKS; w += 1) {
      const row: NightCell[] = [];
      for (let d = 0; d < 7; d += 1) {
        const date = addDays(start, w * 7 + d);
        if (date > today) {
          row.push({ kind: "future", key: date });
          continue;
        }
        const dayOfMonth =
          defaultCalendar === "hijri"
            ? gregorianToHijri(new Date(`${date}T00:00:00`)).day
            : Number(date.slice(8, 10));
        const isDone = completed.has(date);
        past += 1;
        if (isDone) done += 1;
        row.push({
          kind: "night",
          date,
          done: isDone,
          isToday: date === today,
          day: numberFormat ? numberFormat.format(dayOfMonth) : String(dayOfMonth),
        });
      }
      rows.push(row);
    }
    return { weeks: rows, firstDate: start, pastNights: past, donePast: done };
  }, [completed, defaultCalendar, numberFormat, today]);

  /** Logs or clears tonight; both directions say so in a toast with Undo (never silent). */
  const toggleTonight = async () => {
    const next = prayedToday ? "pending" : "completed";
    // Restore exactly what was there (a prior skipped/other status is not flattened to pending).
    const before = todayStatus ?? "pending";
    triggerHaptic(next === "completed" ? "success" : "selection");
    await undoToast.run({
      do: async () => {
        await setPrayerStatus("tahajjud", next);
        await reload();
      },
      undo: async () => {
        await setPrayerStatus("tahajjud", before);
        await reload();
      },
      messageKey: next === "completed" ? "tahajjud.toastLogged" : "tahajjud.toastCleared",
      type: next === "completed" ? "success" : "info",
    });
  };

  const toggleNight = async (date: string, done: boolean) => {
    if (date === today) {
      await toggleTonight();
      return;
    }
    await trackerStore
      .getState()
      .setPrayerStatusOnDate(date, "tahajjud", done ? "pending" : "completed");
    await reload();
  };

  const formatCount = (value: number) =>
    numberFormat ? numberFormat.format(value) : String(value);
  const info = tokens.status.info;
  const success = tokens.status.success;

  const tonightCard = (
    <Card
      padding="four"
      style={{
        backgroundColor: info.soft,
        borderColor: withAlpha(info.color, tokens.isDark ? 0.45 : 0.28),
        borderWidth: BorderWidth.hairline,
      }}
    >
      <View style={styles.tonightHeader}>
        <IconWell icon={MOON_ICON} tint={info.color} background={withAlpha(info.color, 0.16)} />
        <View style={styles.flexCopy}>
          <ThemedText type="smallBold" style={{ color: info.text }}>
            {t("tahajjud.tonightTitle")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("lastThirdNight.lastThirdLabel")}
          </ThemedText>
        </View>
        {inLastThird ? (
          <View style={[styles.liveBadge, { backgroundColor: success.soft }]}>
            <View style={[styles.liveDot, { backgroundColor: success.color }]} />
            <ThemedText type="caption" style={{ color: success.text }}>
              {t("tahajjud.inWindow")}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {night ? (
        <>
          <View style={styles.tonightTime}>
            <ThemedText type="display" style={{ color: info.text }}>
              {formatTime(night.lastThird)}
            </ThemedText>
            {countdown ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {countdown}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.timeline}>
            <NightTimeline
              compact
              maghribAt={night.maghribAt}
              midNight={night.midNight}
              lastThird={night.lastThird}
              fajrAt={night.fajrAt}
              now={now}
              format={formatTime}
            />
          </View>
        </>
      ) : (
        <ThemedText type="small" themeColor="mutedForeground" style={styles.tonightTime}>
          {t("lastThirdNight.invalidTimes")}
        </ThemedText>
      )}

      <Button
        label={prayedToday ? t("tahajjud.markedTonight") : t("tahajjud.markTonight")}
        variant={prayedToday ? "secondary" : "primary"}
        icon={
          prayedToday
            ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
            : { ios: "moon.fill", android: "bedtime", web: "bedtime" }
        }
        fullWidth
        preferredFocus
        onPress={() => void toggleTonight()}
        style={styles.markButton}
      />

      <PressableScale
        onPress={() => router.push("/last-third-night")}
        accessibilityRole="button"
        accessibilityLabel={t("tahajjud.calculatorCta")}
        accessibilityHint={t("tahajjud.calculatorHint")}
        style={[styles.calculatorLink, tv && styles.calculatorLinkTv]}
      >
        <SymbolView
          name={{ ios: "clock", android: "schedule", web: "schedule" }}
          size={14}
          tintColor={info.text}
        />
        <ThemedText type="caption" style={[styles.flexCopy, { color: info.text }]}>
          {t("tahajjud.calculatorCta")}
        </ThemedText>
        <SymbolView name={chevronForward()} size={12} tintColor={info.text} />
      </PressableScale>
    </Card>
  );

  const stats = [
    { key: "streak", value: currentStreak, label: t("tahajjud.streakCaption"), color: info.text },
    { key: "best", value: longest, label: t("tahajjud.bestLabel"), color: success.text },
    { key: "total", value: totalNights, label: t("tahajjud.totalLabel"), color: colors.foreground },
  ];

  const statsCard = (
    <ContentState
      status={loadStatus}
      skeleton="card"
      loadingLabel={t("uiFeedback.loading")}
      errorMessage={t("uiFeedback.loadFailed")}
      onRetry={() => void reload()}
    >
      <Card>
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={stat.key} style={styles.statsCellWrap}>
              {index > 0 ? (
                <View style={[styles.statsDivider, { backgroundColor: tokens.hairline }]} />
              ) : null}
              <View style={styles.statsCell}>
                <ThemedText type="header" style={{ color: stat.color }}>
                  {formatCount(stat.value)}
                </ThemedText>
                <ThemedText
                  type="caption"
                  themeColor="mutedForeground"
                  numberOfLines={2}
                  style={styles.centerText}
                >
                  {stat.label}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
        {currentStreak === 0 && !prayedToday ? (
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            style={[styles.centerText, styles.statsNudge]}
          >
            {t("tahajjud.startTonight")}
          </ThemedText>
        ) : null}
      </Card>
    </ContentState>
  );

  const calendarCard = (
    <ContentState
      status={loadStatus}
      skeleton="card"
      loadingLabel={t("uiFeedback.loading")}
      errorMessage={t("uiFeedback.loadFailed")}
      onRetry={() => void reload()}
    >
      <Card>
        <View style={styles.calendarHeader}>
          <View style={styles.flexCopy}>
            <ThemedText type="smallBold">
              {t("tahajjud.lastNights", { count: pastNights })}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {`${formatCalendarDateFromIso(firstDate, defaultCalendar, locale)} – ${formatCalendarDateFromIso(today, defaultCalendar, locale)}`}
            </ThemedText>
          </View>
          <View style={[styles.ratioPill, { backgroundColor: success.soft }]}>
            <ThemedText type="smallBold" style={{ color: success.text }}>
              {`${formatCount(donePast)}/${formatCount(pastNights)}`}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.calendar, twoPane && styles.calendarWide]}>
          <View style={styles.weekRow}>
            {weekdays.map((weekday) => (
              <View key={weekday.key} style={styles.weekdayCell}>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {weekday.label}
                </ThemedText>
              </View>
            ))}
          </View>
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex.toString()}`} style={styles.weekRow}>
              {week.map((cell) => {
                if (cell.kind === "future") {
                  return <View key={cell.key} style={styles.dayCell} />;
                }
                const dateLabel = formatCalendarDateFromIso(cell.date, defaultCalendar, locale);
                return (
                  <View key={cell.date} style={styles.dayCell}>
                    <PressableScale
                      haptic="light"
                      scaleTo={0.9}
                      hitSlop={4}
                      accessibilityRole="checkbox"
                      accessibilityLabel={dateLabel}
                      accessibilityState={{ checked: cell.done }}
                      onPress={() => void toggleNight(cell.date, cell.done)}
                      rippleBorderless
                      style={[
                        styles.dayDot,
                        tv && styles.dayDotTv,
                        {
                          backgroundColor: cell.done ? success.color : colors.muted,
                          borderColor: cell.isToday ? colors.accent : "transparent",
                        },
                      ]}
                    >
                      <ThemedText
                        type="smallBold"
                        style={{ color: cell.done ? colors.accentText : colors.mutedForeground }}
                      >
                        {cell.day}
                      </ThemedText>
                      {cell.done ? (
                        <SymbolView
                          name={{ ios: "checkmark", android: "check", web: "check" }}
                          size={9}
                          tintColor={colors.accentText}
                        />
                      ) : null}
                    </PressableScale>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={[styles.calendarFooter, { borderTopColor: tokens.hairline }]}>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: success.color }]}>
                <SymbolView
                  name={{ ios: "checkmark", android: "check", web: "check" }}
                  size={8}
                  tintColor={colors.accentText}
                />
              </View>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("tahajjud.legendPrayed")}
              </ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  styles.legendToday,
                  { borderColor: colors.accent, backgroundColor: colors.muted },
                ]}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("common.today")}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.calendarHint}>
            {tTv(t, "tahajjud.calendarHint", "tahajjud.calendarHintTv")}
          </ThemedText>
        </View>
      </Card>
    </ContentState>
  );

  const virtueCard = (
    <Card style={[styles.virtue, { borderStartColor: info.color }]}>
      <View style={styles.hadithHeader}>
        <SymbolView
          name={{ ios: "quote.opening", android: "format_quote", web: "format_quote" }}
          size={16}
          tintColor={info.color}
        />
        <ThemedText type="smallBold">{t("tahajjud.virtueTitle")}</ThemedText>
      </View>
      <ScriptureMeaning english={t("tahajjud.virtueBody")}>
        {(text) => (
          <ThemedText type="default" themeColor="foreground" style={styles.hadithBody}>
            {text}
          </ThemedText>
        )}
      </ScriptureMeaning>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tahajjud.virtueRef")}
      </ThemedText>
    </Card>
  );

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1200 : undefined}
      eyebrow={t("tahajjud.eyebrow")}
      title={t("tahajjud.title")}
      subtitle={t("tahajjud.subtitle")}
      onBack={() => goBackOrReplace(router, "/tracker")}
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} />
      <Seo path="/tahajjud" />

      {twoPane ? (
        <View style={styles.split}>
          <View style={styles.primary}>
            <Stagger>
              {calendarCard}
              {virtueCard}
            </Stagger>
          </View>
          <View style={styles.aside}>
            <Stagger>
              {tonightCard}
              {statsCard}
            </Stagger>
          </View>
        </View>
      ) : (
        <Stagger>
          {tonightCard}
          {statsCard}
          {calendarCard}
          {virtueCard}
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  split: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  primary: { flex: 1, minWidth: 0 },
  aside: { width: 380, maxWidth: "40%" },
  flexCopy: { flex: 1, minWidth: 0 },
  centerText: { textAlign: "center" },

  tonightHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  liveDot: { width: 6, height: 6, borderRadius: Radius.pill },
  tonightTime: { marginTop: Spacing.three, gap: Spacing.half },
  timeline: { marginTop: Spacing.three },
  markButton: { marginTop: Spacing.four },
  calculatorLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
  calculatorLinkTv: { minHeight: TvLayout.minFocusTarget },

  statsRow: { flexDirection: "row", alignItems: "stretch" },
  statsCellWrap: { flex: 1, flexDirection: "row" },
  statsDivider: { width: StyleSheet.hairlineWidth, marginVertical: Spacing.one },
  statsCell: { flex: 1, alignItems: "center", gap: Spacing.half, paddingHorizontal: Spacing.one },
  statsNudge: { marginTop: Spacing.three },

  calendarHeader: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  ratioPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
  calendar: { marginTop: Spacing.three, gap: Spacing.two },
  /** Desktop: keep cells square-ish instead of stretching across a 800px column. */
  calendarWide: { maxWidth: 520, alignSelf: "center", width: "100%" },
  weekRow: { flexDirection: "row" },
  weekdayCell: { flex: 1, alignItems: "center" },
  dayCell: { flex: 1, alignItems: "center", justifyContent: "center", minWidth: 0 },
  dayDot: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    gap: 1,
    borderWidth: BorderWidth.thick,
    alignItems: "center",
    justifyContent: "center",
  },
  dayDotTv: { width: TvLayout.minFocusTarget, height: TvLayout.minFocusTarget },
  calendarFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: BorderWidth.hairline,
  },
  legend: { flexDirection: "row", gap: Spacing.three },
  calendarHint: { flexGrow: 1, flexBasis: 180, minWidth: 0 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  legendToday: { borderWidth: BorderWidth.thick },

  virtue: { borderStartWidth: 3 },
  hadithHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  hadithBody: { marginTop: Spacing.two, marginBottom: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/tahajjud");
