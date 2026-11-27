import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  AppLocale,
  CalendarMode,
  QazaDailyProgress,
  QazaPrayer,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { CalendarMonthPicker } from "@/components/calendar-month-picker";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  MonthGrid,
  type MonthGridCell,
  MonthGridHeader,
  MonthGridLegend,
} from "@/components/hijri/month-grid";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentState } from "@/components/ui/content-state";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Breakpoints, Radius, Spacing } from "@/constants/theme";
import { QazaRepository } from "@/db";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useFormatCount } from "@/hooks/use-format-count";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  buildHijriMonthGrid,
  buildMonthGrid,
  localizedMonthLabel,
  localizedWeekdayInitials,
} from "@/lib/calendar";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { triggerHaptic } from "@/lib/haptics";
import { gregorianToHijri, hijriMonthLabel } from "@/lib/hijri";
import { tTv } from "@/lib/i18n/t-tv";
import { toAppLocale } from "@/lib/locale-bcp47";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useLocation } from "@/stores/location-store";
import { useTrackerActions } from "@/stores/tracker-store";

type HistoryEntry = { date: string; total: number; progress: QazaDailyProgress };

function sumCompleted(progress: QazaDailyProgress): number {
  return Object.values(progress.completed).reduce((sum, n) => sum + (n ?? 0), 0);
}

function parseGregorianMonth(date: string): { year: number; month: number } {
  const parsed = new Date(`${date}T00:00:00`);
  return { year: parsed.getFullYear(), month: parsed.getMonth() };
}

function parseHijriMonth(date: string, timeZone?: string): { year: number; month: number } {
  const hijri = gregorianToHijri(new Date(`${date}T00:00:00`), timeZone);
  return { year: hijri.year, month: hijri.month };
}

export default function QazaHistoryScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { refresh, removeQazaProgress } = useTrackerActions();
  const formatCount = useFormatCount();
  const chevronBackward = useChevronBackward();
  const chevronForward = useChevronForward();
  const defaultCalendar = useDefaultCalendar();
  const location = useLocation();
  const now = new Date();
  const today = getLocalDateString();
  const todayHijri = gregorianToHijri(now, location.timeZone);
  const [mode, setMode] = useState<CalendarMode>(defaultCalendar);
  const [byDate, setByDate] = useState<Map<string, HistoryEntry>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [removal, setRemoval] = useState<{ entry: HistoryEntry; prayerId: QazaPrayer } | null>(
    null,
  );
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [hYear, setHYear] = useState(todayHijri.year);
  const [hMonth, setHMonth] = useState(todayHijri.month);
  const [pickerOpen, setPickerOpen] = useState(false);
  const tv = isTV();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const { width } = useWindowDimensions();
  /** Desktop / wide web: the selected day's breakdown sits beside the calendar. */
  const twoPane = !tv && width >= Breakpoints.wide;
  const initialMonthSet = useRef(false);

  const load = useCallback(() => {
    let active = true;
    setFailed(false);
    QazaRepository.getAllDailyProgress()
      .then((all) => {
        if (!active) return;
        const next = new Map<string, HistoryEntry>();
        let latestDate: string | null = null;
        for (const progress of Object.values(all)) {
          const total = sumCompleted(progress);
          if (total <= 0) continue;
          next.set(progress.date, { date: progress.date, total, progress });
          if (!latestDate || progress.date.localeCompare(latestDate) > 0) {
            latestDate = progress.date;
          }
        }
        setByDate(next);
        if (latestDate && !initialMonthSet.current) {
          const gregorian = parseGregorianMonth(latestDate);
          const hijri = parseHijriMonth(latestDate, location.timeZone);
          setYear(gregorian.year);
          setMonth(gregorian.month);
          setHYear(hijri.year);
          setHMonth(hijri.month);
          initialMonthSet.current = true;
        }
        setLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [location.timeZone]);

  useFocusEffect(load);

  const locale: AppLocale = toAppLocale(i18n.language ?? "en");
  const formatDate = useCallback(
    (iso: string, calendar: CalendarMode = mode) =>
      formatCalendarDateFromIso(iso, calendar, locale),
    [locale, mode],
  );

  const weeks = useMemo(
    () =>
      mode === "hijri"
        ? buildHijriMonthGrid(hYear, hMonth, today)
        : buildMonthGrid(year, month, today),
    [mode, hYear, hMonth, year, month, today],
  );
  const label =
    mode === "hijri"
      ? hijriMonthLabel(hYear, hMonth, locale)
      : localizedMonthLabel(year, month, i18n.language ?? "en");
  const weekdays = localizedWeekdayInitials(i18n.language ?? "en");
  const hasEntries = byDate.size > 0;

  const shift = (delta: number) => {
    if (mode === "hijri") {
      const zeroBased = hMonth - 1 + delta;
      setHYear(hYear + Math.floor(zeroBased / 12));
      setHMonth((((zeroBased % 12) + 12) % 12) + 1);
      return;
    }
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const modeControl = (
    <SegmentedControl<CalendarMode>
      options={[
        { id: "gregorian", label: t("calendar.gregorian") },
        { id: "hijri", label: t("calendar.hijri") },
      ]}
      value={mode}
      onChange={setMode}
    />
  );

  const viewingCurrentMonth =
    mode === "hijri"
      ? hYear === todayHijri.year && hMonth === todayHijri.month
      : year === now.getFullYear() && month === now.getMonth();

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setHYear(todayHijri.year);
    setHMonth(todayHijri.month);
  };

  const cellFor = (day: (typeof weeks)[number][number]): MonthGridCell => {
    const entry = byDate.get(day.date);
    const hasData = !!entry && day.inMonth;
    return {
      fill: hasData ? 2 : 0,
      badge: hasData ? formatCount(entry.total) : undefined,
      disabled: !hasData,
      selected: twoPane && selected?.date === day.date,
      accessibilityLabel: hasData
        ? t("qazaHistory.dayA11y", { date: formatDate(day.date), count: entry.total })
        : formatDate(day.date),
    };
  };

  const monthCard = (
    <Card>
      <MonthGridHeader
        label={label}
        prevIcon={chevronBackward}
        nextIcon={chevronForward}
        prevLabel={t("calendar.prevMonth")}
        nextLabel={t("calendar.nextMonth")}
        pickLabel={t("calendar.pickMonthYear")}
        onPrev={() => shift(-1)}
        onNext={() => shift(1)}
        onPick={() => setPickerOpen(true)}
        todayLabel={viewingCurrentMonth ? undefined : t("calDay.today")}
        onToday={goToday}
      />
      <MonthGrid
        weeks={weeks}
        weekdays={weekdays}
        cell={cellFor}
        wide={twoPane}
        onPressDay={(day) => {
          const entry = byDate.get(day.date);
          if (entry) setSelected(entry);
        }}
      />
      <MonthGridLegend items={[{ key: "madeUp", label: t("stats.madeUp"), fills: [2] }]} />
    </Card>
  );

  const removeEntry = async () => {
    if (!removal) return;
    const { entry, prayerId } = removal;
    const count = entry.progress.completed[prayerId] ?? 0;
    if (count <= 0) return;
    await removeQazaProgress(prayerId, entry.date, count);
    triggerHaptic("warning");
    setSelected(null);
    load();
    await refresh();
  };

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("qaza.eyebrow")}
      title={t("qazaHistory.title")}
      subtitle={t("qazaHistory.subtitle")}
      onBack={() => goBackOrReplace(router, "/qaza")}
    >
      <Seo path="/qaza/history" />
      <ContentState
        status={!loaded ? "loading" : failed ? "error" : hasEntries ? "ready" : "empty"}
        skeleton="card"
        loadingLabel={t("uiFeedback.loading")}
        errorMessage={t("uiFeedback.loadFailed")}
        onRetry={load}
        empty={{
          icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
          title: t("qazaHistory.emptyTitle"),
          description: t("qazaHistory.emptyDesc"),
          actionLabel: t("qazaHistory.emptyAction"),
          onAction: () => goBackOrReplace(router, "/qaza"),
        }}
      >
        <Stagger>
          {twoPane ? (
            <View style={styles.split}>
              <View style={styles.primary}>
                {modeControl}
                {monthCard}
              </View>
              <View style={styles.aside}>
                <Card style={styles.detailCard}>
                  {selected ? (
                    <DayDetail
                      entry={selected}
                      formatDate={formatDate}
                      onRemove={(prayerId) => setRemoval({ entry: selected, prayerId })}
                    />
                  ) : (
                    <ThemedText
                      type="caption"
                      themeColor="mutedForeground"
                      style={styles.legendHint}
                    >
                      {tTv(t, "qazaHistory.legendHint", "qazaHistory.legendHintTv")}
                    </ThemedText>
                  )}
                </Card>
              </View>
            </View>
          ) : null}
          {twoPane ? null : modeControl}
          {twoPane ? null : monthCard}
          <CalendarMonthPicker
            visible={pickerOpen}
            onClose={() => setPickerOpen(false)}
            mode={mode}
            year={mode === "hijri" ? hYear : year}
            month={mode === "hijri" ? hMonth : month}
            locale={locale}
            language={i18n.language ?? "en"}
            anchorYear={mode === "hijri" ? todayHijri.year : now.getFullYear()}
            onSelect={(nextYear, nextMonth) => {
              if (mode === "hijri") {
                setHYear(nextYear);
                setHMonth(nextMonth);
                return;
              }
              setYear(nextYear);
              setMonth(nextMonth);
            }}
          />

          {twoPane ? null : (
            <Card variant="muted">
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendHint}>
                {tTv(t, "qazaHistory.legendHint", "qazaHistory.legendHintTv")}
              </ThemedText>
            </Card>
          )}
        </Stagger>
      </ContentState>

      <ConfirmDialog
        visible={removal != null}
        title={t("qazaHistory.confirmRemoveTitle")}
        message={
          removal
            ? t("qazaHistory.confirmRemoveMsg", {
                prayer: t(`prayers.${removal.prayerId}`),
                value: formatCount(removal.entry.progress.completed[removal.prayerId] ?? 0),
                date: formatDate(removal.entry.date),
              })
            : undefined
        }
        confirmLabel={t("qazaHistory.confirmRemoveAction")}
        destructive
        onConfirm={removeEntry}
        onClose={() => setRemoval(null)}
      />

      <Sheet
        visible={!twoPane && selected != null}
        variant="bottom"
        title={selected ? formatDate(selected.date) : t("qazaHistory.title")}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <DayDetail
              entry={selected}
              formatDate={formatDate}
              onRemove={(prayerId) => setRemoval({ entry: selected, prayerId })}
            />
            {tv ? (
              // TV: give focus a visible home in the sheet (otherwise it lands on the
              // invisible backdrop); remote Back also closes.
              <Button
                label={t("common.close")}
                variant="secondary"
                fullWidth
                preferredFocus
                onPress={() => setSelected(null)}
              />
            ) : null}
          </>
        ) : null}
      </Sheet>
    </ScreenLayout>
  );
}

/** Per-prayer breakdown of one day's make-ups (bottom sheet on phones, aside on desktop). */
function DayDetail({
  entry,
  formatDate,
  onRemove,
}: {
  entry: HistoryEntry;
  formatDate: (iso: string) => string;
  onRemove: (prayerId: QazaPrayer) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <>
      <ThemedText type="subtitle" accessibilityRole="header">
        {formatDate(entry.date)}
      </ThemedText>
      <Pill
        label={t("qazaHistory.count", { count: entry.total })}
        color={colors.accent}
        background={tokens.accentSoft}
      />
      <View style={styles.prayers}>
        {QAZA_PRAYERS.map((prayerId) => {
          const count = entry.progress.completed[prayerId] ?? 0;
          if (count <= 0) return null;
          return (
            <View
              key={prayerId}
              style={[styles.prayerRow, { backgroundColor: colors.muted }]}
              accessibilityRole="text"
              accessibilityLabel={`${t(`prayers.${prayerId}`)}, ${t("qazaHistory.count", {
                count,
              })}`}
            >
              <IconWell
                icon={PRAYER_ICONS[prayerId]}
                well={36}
                size={16}
                tint={colors.accent}
                background={tokens.accentSoft}
              />
              <ThemedText type="small" style={styles.prayerName}>
                {t(`prayers.${prayerId}`)}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: tokens.accentOnSoft }}>
                {count}
              </ThemedText>
              <IconButton
                name={{ ios: "trash", android: "delete", web: "delete" }}
                accessibilityLabel={t("qazaHistory.removeEntry", {
                  prayer: t(`prayers.${prayerId}`),
                })}
                onPress={() => onRemove(prayerId)}
                tintColor={colors.mutedForeground}
              />
            </View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  split: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  primary: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
  aside: {
    width: 360,
    maxWidth: "38%",
  },
  detailCard: {
    gap: Spacing.two,
  },
  legendHint: {
    textAlign: "center",
  },
  prayers: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  prayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  prayerName: {
    flex: 1,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/qaza/history");
