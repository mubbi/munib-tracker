import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type { AppLocale, CalendarMode, QazaDailyProgress } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { CalendarMonthPicker } from "@/components/calendar-month-picker";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { QazaRepository } from "@/db";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  buildHijriMonthGrid,
  buildMonthGrid,
  localizedMonthLabel,
  localizedWeekdayInitials,
} from "@/lib/calendar";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { gregorianToHijri, hijriMonthLabel } from "@/lib/hijri";
import { tTv } from "@/lib/i18n/t-tv";
import { toAppLocale } from "@/lib/locale-bcp47";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useLocation } from "@/stores/location-store";

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
  const { colors } = useThemeTokens();
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
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [hYear, setHYear] = useState(todayHijri.year);
  const [hMonth, setHMonth] = useState(todayHijri.month);
  const [pickerOpen, setPickerOpen] = useState(false);
  const tv = isTV();
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const { width } = useWindowDimensions();
  /** Desktop / wide web: the selected day's breakdown sits beside the calendar. */
  const twoPane = !tv && width >= 1024;
  const initialMonthSet = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void QazaRepository.getAllDailyProgress().then((all) => {
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
      });
      return () => {
        active = false;
      };
    }, [location.timeZone]),
  );

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

  const monthCard = (
    <Card padding="three">
      <View style={styles.header}>
        <NavButton
          icon={chevronBackward}
          label={t("calendar.prevMonth")}
          onPress={() => shift(-1)}
        />
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("calendar.pickMonthYear")}
          onPress={() => setPickerOpen(true)}
          style={styles.monthLabelButton}
        >
          <ThemedText type="subtitle">{label}</ThemedText>
          <SymbolView
            name={{
              ios: "chevron.down",
              android: "keyboard_arrow_down",
              web: "keyboard_arrow_down",
            }}
            size={14}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>
        <NavButton icon={chevronForward} label={t("calendar.nextMonth")} onPress={() => shift(1)} />
      </View>

      <View style={styles.weekRow}>
        {weekdays.map((weekday) => (
          <View key={weekday.key} style={styles.cell}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {weekday.label}
            </ThemedText>
          </View>
        ))}
      </View>

      {weeks.map((week) => (
        <View key={week[0]?.date} style={styles.weekRow}>
          {week.map((day) => {
            const entry = byDate.get(day.date);
            const hasData = !!entry && day.inMonth;
            const disabled = !day.inMonth || !hasData;

            return (
              <PressableScale
                key={day.date}
                haptic="light"
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={
                  hasData
                    ? t("qazaHistory.dayA11y", {
                        date: formatDate(day.date),
                        count: entry.total,
                      })
                    : undefined
                }
                accessibilityState={
                  twoPane ? { disabled, selected: selected?.date === day.date } : { disabled }
                }
                onPress={() => entry && setSelected(entry)}
                style={styles.cell}
              >
                <View
                  style={[
                    styles.dayCell,
                    tv ? styles.dayCellTv : null,
                    twoPane ? styles.dayCellWide : null,
                    hasData && {
                      backgroundColor: withAlpha(colors.accent, 0.18),
                    },
                    // TV: accent ring is reserved for D-pad focus — today is neutral.
                    day.isToday && {
                      borderColor: tv ? colors.foreground : colors.accent,
                      borderWidth: 2,
                    },
                    twoPane &&
                      selected?.date === day.date && {
                        borderColor: colors.foreground,
                        borderWidth: 2,
                      },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    style={{
                      color: day.inMonth ? colors.foreground : colors.mutedForeground,
                      opacity: day.inMonth ? 1 : 0.45,
                    }}
                  >
                    {day.day}
                  </ThemedText>
                  {hasData ? (
                    <ThemedText
                      type="caption"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.7}
                      style={{ color: colors.accent, textAlign: "center" }}
                    >
                      {t("qazaHistory.count", { count: entry.total })}
                    </ThemedText>
                  ) : null}
                </View>
              </PressableScale>
            );
          })}
        </View>
      ))}
    </Card>
  );

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("qaza.eyebrow")}
      title={t("qazaHistory.title")}
      subtitle={t("qazaHistory.subtitle")}
      onBack={() => goBackOrReplace(router, "/qaza")}
    >
      <Seo path="/qaza/history" />
      {loaded && !hasEntries ? (
        <EmptyState
          icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          title={t("qazaHistory.emptyTitle")}
          description={t("qazaHistory.emptyDesc")}
        />
      ) : (
        <Stagger>
          {twoPane ? (
            <View style={styles.split}>
              <View style={styles.primary}>
                {modeControl}
                {monthCard}
              </View>
              <View style={styles.aside}>
                <Card padding="three" style={styles.detailCard}>
                  {selected ? (
                    <DayDetail entry={selected} formatDate={formatDate} />
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
            <Card variant="muted" padding="three">
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendHint}>
                {tTv(t, "qazaHistory.legendHint", "qazaHistory.legendHintTv")}
              </ThemedText>
            </Card>
          )}
        </Stagger>
      )}

      <Sheet
        visible={!twoPane && selected != null}
        variant="bottom"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <DayDetail entry={selected} formatDate={formatDate} />
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
}: {
  entry: HistoryEntry;
  formatDate: (iso: string) => string;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <>
      <ThemedText type="subtitle">{formatDate(entry.date)}</ThemedText>
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
              <ThemedText type="smallBold" style={{ color: colors.accent }}>
                {count}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </>
  );
}

function NavButton({
  icon,
  label,
  onPress,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.navButton,
        isTV() ? styles.navButtonTv : null,
        { backgroundColor: tokens.accentSoft },
      ]}
    >
      <SymbolView name={icon} size={18} tintColor={colors.accent} />
    </PressableScale>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  monthLabelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    maxWidth: "52%",
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonTv: {
    width: TvLayout.minFocusTarget,
    height: TvLayout.minFocusTarget,
  },
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  dayCell: {
    width: "100%",
    minHeight: 52,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    gap: 2,
  },
  dayCellWide: {
    minHeight: 72,
  },
  dayCellTv: {
    minHeight: TvLayout.minFocusTarget,
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
