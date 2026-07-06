import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { hijriToGregorian } from "@/lib/hijri";
import { formatDuration, formatPrayerTime } from "@/lib/prayer-times";
import { getRamadanInfo, RAMADAN_MONTH } from "@/lib/ramadan";
import {
  type FastStatus,
  useEnsureFastingLoaded,
  useFastingActions,
  useFastingDays,
  useFastStatus,
} from "@/stores/fasting-store";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

/** Tap-cycle order for a Ramadan day's fasting status. */
const CYCLE: Record<string, FastStatus | null> = {
  none: "fasted",
  fasted: "missed",
  missed: "exempt",
  exempt: null,
};

/** Six columns × five rows keeps all 29–30 days evenly spaced on any screen width. */
const GRID_COLUMNS = 6;

function useMinuteClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatCount(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale).format(value);
}

export default function RamadanScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  const location = useLocation();
  const prefs = usePreferences();
  const now = useMinuteClock();
  useEnsureFastingLoaded();
  const days = useFastingDays();
  const { setStatus } = useFastingActions();
  const today = getLocalDateString();
  const todayStatus = useFastStatus(today);

  const info = useMemo(() => getRamadanInfo(location, now), [location, now]);
  const locale = i18n.language?.split("-")[0];
  const success = tokens.status.success;
  const danger = tokens.status.danger;
  const infoTone = tokens.status.info;

  const ramadanDays = useMemo(
    () =>
      Array.from({ length: info.fastingLogTotalDays }, (_, i) => {
        const day = i + 1;
        return {
          day,
          date: getLocalDateString(hijriToGregorian(info.fastingLogHijriYear, RAMADAN_MONTH, day)),
        };
      }),
    [info.fastingLogTotalDays, info.fastingLogHijriYear],
  );

  type RamadanDayCell = (typeof ramadanDays)[number];
  type GridCell = RamadanDayCell | { type: "pad"; key: string };

  const gridRows = useMemo(() => {
    const rows: GridCell[][] = [];
    for (let i = 0; i < ramadanDays.length; i += GRID_COLUMNS) {
      const slice = ramadanDays.slice(i, i + GRID_COLUMNS);
      const row: GridCell[] = [...slice];
      for (let pad = slice.length; pad < GRID_COLUMNS; pad += 1) {
        row.push({ type: "pad", key: `pad-${i + pad}` });
      }
      rows.push(row);
    }
    return rows;
  }, [ramadanDays]);

  const fastedCount = ramadanDays.filter((d) => days[d.date] === "fasted").length;
  const missedCount = ramadanDays.filter((d) => days[d.date] === "missed").length;
  const exemptCount = ramadanDays.filter((d) => days[d.date] === "exempt").length;
  const progress = info.fastingLogTotalDays > 0 ? fastedCount / info.fastingLogTotalDays : 0;
  const progressPct = Math.round(progress * 100);
  const hasFutureLogDays = ramadanDays.some((d) => d.date > today);
  const showBackfillNote = !info.isRamadan;
  const showFutureDaysNote = info.isRamadan && hasFutureLogDays;
  const showLastTenCard = info.isRamadan && (info.day >= 21 || isFocused("ramadan-lastTen"));
  const showLaylatCard = info.isRamadan && (info.day >= 21 || isFocused("ramadan-laylatQadr"));

  const countdown = useMemo(() => {
    const suhoorMs = info.suhoorEnds.getTime();
    const iftarMs = info.iftar.getTime();
    const nowMs = now.getTime();

    if (nowMs < suhoorMs) {
      const minutes = Math.max(0, Math.round((suhoorMs - nowMs) / 60000));
      return {
        label: t("ramadan.countdownSuhoor", { time: formatDuration(minutes) }),
        tone: "suhoor" as const,
      };
    }
    if (nowMs < iftarMs) {
      const minutes = Math.max(0, Math.round((iftarMs - nowMs) / 60000));
      return {
        label: t("ramadan.countdownIftar", { time: formatDuration(minutes) }),
        tone: "iftar" as const,
      };
    }
    return { label: t("ramadan.afterIftar"), tone: "done" as const };
  }, [info.iftar, info.suhoorEnds, now, t]);

  const statusColor = (status: FastStatus | undefined) => {
    if (status === "fasted") return success;
    if (status === "missed") return danger;
    if (status === "exempt") return infoTone;
    return null;
  };

  const statusLabel = (status: FastStatus | undefined) => {
    if (status === "fasted") return t("ramadan.statusFasted");
    if (status === "missed") return t("ramadan.statusMissed");
    if (status === "exempt") return t("ramadan.statusExempt");
    return t("ramadan.statusNone");
  };

  return (
    <ScreenLayout
      eyebrow={t("ramadan.eyebrow")}
      title={t("ramadan.title")}
      subtitle={
        info.isRamadan
          ? t("ramadan.dayOf", { day: info.day, total: info.totalDays })
          : t("ramadan.subtitle")
      }
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/ramadan" />
      <Stagger>
        {info.isRamadan ? (
          <Card
            padding="three"
            style={[
              styles.todayCard,
              { backgroundColor: tokens.accentSoft, borderColor: colors.accent, borderWidth: 1 },
            ]}
          >
            <View style={styles.todayRow}>
              <IconWell
                icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
                tint={colors.accent}
                background={withAlpha(colors.accent, 0.12)}
                well={44}
                size={20}
              />
              <View style={styles.todayCopy}>
                <ThemedText type="smallBold">{t("ramadan.todayTitle")}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("ramadan.dayOf", { day: info.day, total: info.totalDays })}
                </ThemedText>
              </View>
              <IconButton
                name={
                  todayStatus === "fasted"
                    ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
                    : {
                        ios: "circle",
                        android: "radio_button_unchecked",
                        web: "radio_button_unchecked",
                      }
                }
                size={28}
                tintColor={todayStatus === "fasted" ? success.color : colors.mutedForeground}
                accessibilityLabel={t("ramadan.fastedToday")}
                accessibilityState={{ selected: todayStatus === "fasted" }}
                haptic="selection"
                onPress={() => setStatus(today, todayStatus === "fasted" ? null : "fasted")}
              />
            </View>
          </Card>
        ) : null}

        <FocusHighlight ref={register("ramadan-times")} active={isFocused("ramadan-times")}>
          <Card padding="three">
            <SectionHeader
              title={t("ramadan.timesTitle")}
              icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
            />
            <View
              style={[
                styles.countdownBanner,
                {
                  backgroundColor:
                    countdown.tone === "iftar"
                      ? tokens.status.warning.soft
                      : countdown.tone === "suhoor"
                        ? tokens.accentSoft
                        : success.soft,
                },
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{
                  color:
                    countdown.tone === "iftar"
                      ? tokens.status.warning.color
                      : countdown.tone === "suhoor"
                        ? colors.accent
                        : success.color,
                }}
              >
                {countdown.label}
              </ThemedText>
            </View>
            <View style={styles.times}>
              <View
                style={[
                  styles.timeBox,
                  {
                    backgroundColor: tokens.accentSoft,
                    borderColor: withAlpha(colors.accent, 0.2),
                  },
                ]}
              >
                <IconWell
                  icon={{ ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" }}
                  tint={colors.accent}
                  background={withAlpha(colors.accent, 0.14)}
                  well={36}
                  size={16}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("ramadan.suhoor")}
                </ThemedText>
                <ThemedText type="header" style={{ color: colors.accent }}>
                  {formatPrayerTime(info.suhoorEnds, prefs.timeFormat, location.timeZone)}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.timeBox,
                  {
                    backgroundColor: tokens.status.warning.soft,
                    borderColor: tokens.status.warning.border,
                  },
                ]}
              >
                <IconWell
                  icon={{ ios: "sunset.fill", android: "wb_sunny", web: "wb_sunny" }}
                  tint={tokens.status.warning.color}
                  background={withAlpha(tokens.status.warning.color, 0.14)}
                  well={36}
                  size={16}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("ramadan.iftar")}
                </ThemedText>
                <ThemedText type="header" style={{ color: tokens.status.warning.color }}>
                  {formatPrayerTime(info.iftar, prefs.timeFormat, location.timeZone)}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {t("ramadan.timesHint")}
            </ThemedText>
          </Card>
        </FocusHighlight>

        {showLastTenCard ? (
          <FocusHighlight ref={register("ramadan-lastTen")} active={isFocused("ramadan-lastTen")}>
            <Card padding="three">
              <SectionHeader
                title={t("ramadan.lastTenTitle")}
                icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.seasonBody}>
                {t("ramadan.lastTenBody")}
              </ThemedText>
            </Card>
          </FocusHighlight>
        ) : null}

        {showLaylatCard ? (
          <FocusHighlight
            ref={register("ramadan-laylatQadr")}
            active={isFocused("ramadan-laylatQadr")}
          >
            <Card padding="three">
              <SectionHeader
                title={t("ramadan.laylatQadrTitle")}
                icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.seasonBody}>
                {t("ramadan.laylatQadrBody")}
              </ThemedText>
            </Card>
          </FocusHighlight>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title={t("ramadan.fastingTitle")}
            icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
          />

          {showBackfillNote ? (
            <View
              style={[
                styles.logNote,
                { backgroundColor: tokens.accentSoft, borderColor: withAlpha(colors.accent, 0.2) },
              ]}
            >
              <ThemedText type="caption" style={{ color: colors.accent }}>
                {t("ramadan.fastingLogBackfillNote", { year: info.fastingLogHijriYear })}
              </ThemedText>
            </View>
          ) : null}

          {showFutureDaysNote ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.logNoteInline}>
              {t("ramadan.gridFutureDaysNote")}
            </ThemedText>
          ) : null}

          <View style={styles.statsRow}>
            <View
              style={[
                styles.statBox,
                { backgroundColor: success.soft, borderColor: success.border },
              ]}
            >
              <ThemedText type="header" style={[styles.statValue, { color: success.text }]}>
                {formatCount(fastedCount, locale)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("ramadan.statusFasted")}
              </ThemedText>
            </View>
            <View
              style={[styles.statBox, { backgroundColor: danger.soft, borderColor: danger.border }]}
            >
              <ThemedText type="header" style={[styles.statValue, { color: danger.text }]}>
                {formatCount(missedCount, locale)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("ramadan.statusMissed")}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: infoTone.soft, borderColor: infoTone.border },
              ]}
            >
              <ThemedText type="header" style={[styles.statValue, { color: infoTone.text }]}>
                {formatCount(exemptCount, locale)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("ramadan.statusExempt")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.progressBlock}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("ramadan.fastedCount", { count: fastedCount, total: info.fastingLogTotalDays })}
              {progressPct > 0 ? ` · ${progressPct}%` : ""}
            </ThemedText>
            <ProgressBar value={progress} height={6} color={success.color} />
          </View>

          <View style={styles.grid}>
            {gridRows.map((row) => (
              <View key={row.find((cell) => "day" in cell)?.day} style={styles.gridRow}>
                {row.map((cell) => {
                  if (!("day" in cell)) {
                    return <View key={cell.key} style={styles.gridCell} />;
                  }

                  const { day, date } = cell;
                  const status = days[date];
                  const palette = statusColor(status);
                  const isToday = date === today;
                  const isFuture = date > today;

                  return (
                    <View key={day} style={styles.gridCell}>
                      <PressableScale
                        haptic="selection"
                        disabled={isFuture}
                        accessibilityRole="button"
                        accessibilityLabel={t("ramadan.dayCellStatus", {
                          day,
                          status: statusLabel(status),
                        })}
                        accessibilityHint={isFuture ? undefined : t("ramadan.dayCellHint")}
                        accessibilityState={{ disabled: isFuture }}
                        onPress={() => setStatus(date, CYCLE[status ?? "none"])}
                        style={styles.dayPressable}
                      >
                        <View
                          style={[
                            styles.dayCircle,
                            {
                              backgroundColor: palette ? palette.soft : colors.muted,
                              borderColor: isToday
                                ? colors.accent
                                : (palette?.border ?? "transparent"),
                              borderWidth: isToday ? 2 : palette ? 1 : 0,
                              opacity: isFuture ? 0.35 : 1,
                            },
                          ]}
                        >
                          <ThemedText
                            type="smallBold"
                            style={{ color: palette ? palette.color : colors.mutedForeground }}
                          >
                            {day}
                          </ThemedText>
                        </View>
                      </PressableScale>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.legend}>
            <LegendSwatch color={success.color} label={t("ramadan.statusFasted")} />
            <LegendSwatch color={danger.color} label={t("ramadan.statusMissed")} />
            <LegendSwatch color={infoTone.color} label={t("ramadan.statusExempt")} />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendHint}>
            {t("ramadan.gridHint")}
          </ThemedText>
        </Card>

        <View style={styles.disclaimerRow}>
          <SymbolView
            name={{ ios: "info.circle", android: "info", web: "info" }}
            size={14}
            tintColor={colors.mutedForeground}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
            {t("ramadan.disclaimer")}
          </ThemedText>
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: color }]} />
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  todayCard: { gap: Spacing.two },
  todayRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  todayCopy: { flex: 1, gap: 2 },
  countdownBanner: {
    marginTop: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
  },
  times: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  timeBox: {
    flex: 1,
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "flex-start",
  },
  hint: { marginTop: Spacing.three },
  seasonBody: { marginTop: Spacing.two, lineHeight: 20 },
  logNote: {
    marginTop: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  logNoteInline: { marginTop: Spacing.three },
  statsRow: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  statValue: { lineHeight: 28 },
  progressBlock: { gap: Spacing.two, marginTop: Spacing.three, marginBottom: Spacing.three },
  grid: { gap: Spacing.one },
  gridRow: { flexDirection: "row" },
  gridCell: { flex: 1, alignItems: "center" },
  dayPressable: { alignItems: "center" },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
    justifyContent: "center",
    marginTop: Spacing.three,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.one + 2 },
  legendSwatch: { width: 12, height: 12, borderRadius: 6 },
  legendHint: { marginTop: Spacing.two, textAlign: "center" },
  disclaimerRow: { flexDirection: "row", gap: Spacing.two, alignItems: "flex-start" },
  disclaimer: { flex: 1 },
});
