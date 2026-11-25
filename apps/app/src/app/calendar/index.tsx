import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";
import {
  addDays,
  aggregateByDate,
  type DayActivity,
  getLocalDateString,
  matchesEnabledKinds,
} from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewInstance,
} from "react-native";
import { CalendarDayPanel } from "@/components/calendar-day-panel";
import { CalendarMonthPicker } from "@/components/calendar-month-picker";
import { HijriAdjustLink } from "@/components/hijri/hijri-adjust-link";
import {
  MonthGrid,
  type MonthGridCell,
  MonthGridHeader,
  MonthGridLegend,
  type MonthGridMarker,
} from "@/components/hijri/month-grid";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Breakpoints, Spacing } from "@/constants/theme";
import { PrayerRepository } from "@/db";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  buildHijriMonthGrid,
  buildMonthGrid,
  localizedMonthLabel,
  localizedWeekdayInitials,
} from "@/lib/calendar";
import { formatCalendarDate } from "@/lib/calendar-format";
import { gregorianToHijri, hijriMonthLabel } from "@/lib/hijri";
import { tTv } from "@/lib/i18n/t-tv";
import { toAppLocale } from "@/lib/locale-bcp47";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { fastingCalendarContext, fastingDaysForRange } from "@/lib/voluntary-fasting";
import { isTypingTarget } from "@/lib/web/is-typing-target";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";

/** Stable empty list so row-edge guides stay tvOS-selectable without re-setting on render. */
const NO_DESTINATIONS: ViewInstance[] = [];

type FocusGuideHandle = { setDestinations?: (destinations: unknown[]) => void };

/** True when a key event comes from a text-entry control (never hijack typing). */

export default function CalendarScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronBackward = useChevronBackward();
  const chevronForward = useChevronForward();
  const defaultCalendar = useDefaultCalendar();
  const location = useLocation();
  const now = new Date();
  // Same Hijri engine + location timezone as the prayer hero / Ramadan card.
  const todayHijri = gregorianToHijri(now, location.timeZone);
  const [mode, setMode] = useState<CalendarMode>(defaultCalendar);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [hYear, setHYear] = useState(todayHijri.year);
  const [hMonth, setHMonth] = useState(todayHijri.month);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activity, setActivity] = useState<Map<string, DayActivity>>(new Map());
  const tv = isTV();
  const { width } = useWindowDimensions();
  /**
   * Desktop / wide web: a large month grid with the selected day's checklist in
   * a side panel (edited in place) instead of navigating to `/calendar/[date]`.
   */
  const twoPane = !tv && width >= Breakpoints.wide;
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());
  // TV row-wrap: day-cell host nodes + invisible edge guides per week row.
  const cellRefs = useRef(new Map<string, ViewInstance | null>());
  const rowStartGuides = useRef<(ViewInstance | null)[]>([]);
  const rowEndGuides = useRef<(ViewInstance | null)[]>([]);

  const locale: AppLocale = toAppLocale(i18n.language ?? "en");

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void PrayerRepository.getAll().then((logs) => {
        if (active) setActivity(aggregateByDate(logs));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const today = getLocalDateString();
  // D14: a Hijri correction moves month boundaries — rebuild the grid when it changes.
  const hijriAdjustment = useHijriAdjustment();
  // biome-ignore lint/correctness/useExhaustiveDependencies: hijriAdjustment changes hijri.ts output.
  const weeks = useMemo(
    () =>
      mode === "hijri" ? buildHijriMonthGrid(hYear, hMonth, today) : buildMonthGrid(year, month),
    [mode, hYear, hMonth, year, month, today, hijriAdjustment],
  );

  // NF-3.2: fasting ruling dots — a recommended fast the user follows, or a day
  // fasting is not allowed (Eid / Tashriq). Missed-salah dots take precedence.
  const fastingPrefs = usePreferences();
  useEnsureVoluntaryFastingLoaded();
  const fastingEntries = useVoluntaryFastingEntries();
  // biome-ignore lint/correctness/useExhaustiveDependencies: hijriAdjustment changes hijri.ts output.
  const fastRulings = useMemo(() => {
    const dates = weeks.flat().map((day) => day.date);
    const map = new Map<string, "recommended" | "prohibited">();
    if (dates.length === 0) return map;
    const ctx = fastingCalendarContext(fastingPrefs, fastingEntries);
    for (const { date, classification } of fastingDaysForRange(
      dates[0] as string,
      dates[dates.length - 1] as string,
      ctx,
    )) {
      if (classification.blocking) map.set(date, "prohibited");
      else if (matchesEnabledKinds(classification, ctx.prefs)) map.set(date, "recommended");
    }
    return map;
  }, [weeks, fastingPrefs, fastingEntries, hijriAdjustment]);

  // TV: D-pad past the end of a week wraps to the next week's first selectable
  // day (and before its start to the previous week's last one). Edge guides
  // redirect focus natively on both tvOS and Android TV.
  useEffect(() => {
    if (!tv) return;
    const selectable = weeks.map((week) =>
      week.filter((day) => day.inMonth && !day.isFuture).map((day) => day.date),
    );
    const nodeFor = (date: string | undefined) => {
      const node = date ? cellRefs.current.get(date) : null;
      return node ? [node] : [];
    };
    const findRow = (from: number, step: 1 | -1) => {
      for (let i = from; i >= 0 && i < selectable.length; i += step) {
        if (selectable[i].length > 0) return selectable[i];
      }
      return null;
    };
    selectable.forEach((_, index) => {
      const next = findRow(index + 1, 1);
      const prev = findRow(index - 1, -1);
      (rowEndGuides.current[index] as unknown as FocusGuideHandle | null)?.setDestinations?.(
        nodeFor(next?.[0]),
      );
      (rowStartGuides.current[index] as unknown as FocusGuideHandle | null)?.setDestinations?.(
        nodeFor(prev?.[prev.length - 1]),
      );
    });
  }, [tv, weeks]);
  const label =
    mode === "hijri"
      ? hijriMonthLabel(hYear, hMonth, locale)
      : localizedMonthLabel(year, month, i18n.language ?? "en");
  const weekdays = localizedWeekdayInitials(i18n.language ?? "en");

  // Localized, screen-reader-friendly label for a day cell: the full date in the
  // active calendar plus its worship status (prayed / partial / missed / today)
  // and its fasting ruling, so nothing depends on the marker glyphs.
  const describeDay = (date: string, isToday: boolean) => {
    const parsed = new Date(`${date}T00:00:00`);
    const dateText = formatCalendarDate(parsed, mode, locale, undefined, location.timeZone);
    const info = activity.get(date);
    const parts: string[] = [dateText];
    if (date > today) parts.push(t("calDay.futureSubtitle"));
    else if ((info?.level ?? 0) >= 1) parts.push(t("calendar.prayed"));
    else if ((info?.level ?? 0) > 0) parts.push(t("calendar.partial"));
    else if ((info?.missed ?? 0) > 0) parts.push(t("calendar.missed"));
    const ruling = fastRulings.get(date);
    if (ruling === "prohibited") parts.push(t("voluntaryFasting.calendar.prohibited"));
    else if (ruling === "recommended") parts.push(t("voluntaryFasting.calendar.recommended"));
    return isToday ? `${t("calDay.today")}, ${parts.join(", ")}` : parts.join(", ");
  };

  /** Fill level (3 discrete steps) + up to two glyph markers for one day. */
  const cellFor = (day: (typeof weeks)[number][number]): MonthGridCell => {
    const info = activity.get(day.date);
    const level = info?.level ?? 0;
    const markers: MonthGridMarker[] = [];
    if ((info?.missed ?? 0) > 0) markers.push("missed");
    const ruling = fastRulings.get(day.date);
    if (ruling === "prohibited") markers.push("prohibited");
    else if (ruling === "recommended") markers.push("recommended");
    const disabled = !day.inMonth || day.isFuture;
    return {
      fill: level >= 1 ? 3 : level >= 0.5 ? 2 : level > 0 ? 1 : 0,
      markers,
      disabled,
      selected: twoPane && day.date === selectedDate,
      accessibilityLabel: describeDay(day.date, day.isToday),
    };
  };

  const shift = (delta: number) => {
    if (mode === "hijri") {
      // hMonth is 1-based; normalize across year boundaries.
      const zeroBased = hMonth - 1 + delta;
      setHYear(hYear + Math.floor(zeroBased / 12));
      setHMonth((((zeroBased % 12) + 12) % 12) + 1);
      return;
    }
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  /** Select a day in the side panel and keep its month on screen (both calendars). */
  const selectDay = useCallback(
    (date: string) => {
      const clamped = date > today ? today : date;
      setSelectedDate(clamped);
      // Already in the visible month (mouse clicks) — don't re-derive the month.
      if (weeks.some((week) => week.some((day) => day.inMonth && day.date === clamped))) return;
      const parsed = new Date(`${clamped}T00:00:00`);
      setYear(parsed.getFullYear());
      setMonth(parsed.getMonth());
      const hijri = gregorianToHijri(parsed, location.timeZone);
      setHYear(hijri.year);
      setHMonth(hijri.month);
    },
    [location.timeZone, today, weeks],
  );

  // Desktop web: ←/→ move a day (mirrored in RTL), ↑/↓ a week, Home jumps to
  // today, PageUp/PageDown change month. Only while this screen is focused, never
  // while typing or with a dialog (month picker / status sheet) open.
  const shiftRef = useRef(shift);
  shiftRef.current = shift;
  const selectedRef = useRef(selectedDate);
  selectedRef.current = selectedDate;
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "web" || !twoPane || typeof window === "undefined") return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        if (isTypingTarget(event.target)) return;
        if (document.querySelector('[aria-modal="true"]')) return;
        const forward = I18nManager.isRTL ? -1 : 1;
        let delta: number | null = null;
        switch (event.key) {
          case "ArrowRight":
            delta = forward;
            break;
          case "ArrowLeft":
            delta = -forward;
            break;
          case "ArrowDown":
            delta = 7;
            break;
          case "ArrowUp":
            delta = -7;
            break;
          case "Home":
            event.preventDefault();
            selectDay(getLocalDateString());
            return;
          case "PageUp":
            event.preventDefault();
            shiftRef.current(-1);
            return;
          case "PageDown":
            event.preventDefault();
            shiftRef.current(1);
            return;
          default:
            return;
        }
        event.preventDefault();
        selectDay(addDays(selectedRef.current, delta));
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [selectDay, twoPane]),
  );

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
    if (twoPane) setSelectedDate(today);
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
      >
        {mode === "hijri" ? <HijriAdjustLink year={hYear} month={hMonth} align="center" /> : null}
      </MonthGridHeader>
      <MonthGrid
        weeks={weeks}
        weekdays={weekdays}
        cell={cellFor}
        wide={twoPane}
        cellRefs={cellRefs}
        rowStartGuides={rowStartGuides}
        rowEndGuides={rowEndGuides}
        guideDestinations={NO_DESTINATIONS}
        onPressDay={(day) =>
          twoPane
            ? selectDay(day.date)
            : router.push({
                pathname: "/calendar/[date]",
                params: { date: day.date, calendar: mode },
              })
        }
      />
    </Card>
  );

  const legendCard = (
    <Card variant="muted">
      <MonthGridLegend
        items={[
          { key: "prayed", label: t("calendar.prayed"), fills: [3] },
          { key: "partial", label: t("calendar.partial"), fills: [1, 2] },
          { key: "missed", label: t("calendar.missed"), marker: "missed" },
          {
            key: "recommended",
            label: t("voluntaryFasting.calendar.recommended"),
            marker: "recommended",
          },
          {
            key: "prohibited",
            label: t("voluntaryFasting.calendar.prohibited"),
            marker: "prohibited",
          },
        ]}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendHint}>
        {tTv(t, "calendar.legendHint", "calendar.legendHintTv", {
          date: formatCalendarDate(
            new Date(`${today}T00:00:00`),
            mode,
            locale,
            undefined,
            location.timeZone,
          ),
        })}
      </ThemedText>
    </Card>
  );

  const converterCard = (
    <Card
      onPress={() => router.push("/calendar/converter")}
      accessibilityLabel={t("calendar.converterRowTitle")}
    >
      <View style={styles.converterRow}>
        <IconWell
          icon={{ ios: "arrow.left.arrow.right", android: "sync_alt", web: "sync_alt" }}
          tint={colors.accent}
          background={tokens.accentSoft}
        />
        <View style={styles.converterCopy}>
          <ThemedText type="smallBold">{t("calendar.converterRowTitle")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("calendar.converterRowSubtitle")}
          </ThemedText>
        </View>
        <SymbolView name={chevronForward} size={16} tintColor={colors.mutedForeground} />
      </View>
    </Card>
  );

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("calendar.eyebrow")}
      title={t("calendar.title")}
      subtitle={t("calendar.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/calendar" />
      <Stagger>
        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.primary}>
              {modeControl}
              {monthCard}
              {legendCard}
              {converterCard}
            </View>
            <View style={styles.aside}>
              <CalendarDayPanel
                date={selectedDate}
                calendarMode={mode}
                locale={locale}
                onActivityChange={setActivity}
              />
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

        {twoPane ? null : legendCard}
        {twoPane ? null : converterCard}
      </Stagger>
    </ScreenLayout>
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
    width: 400,
    maxWidth: "42%",
  },
  legendHint: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  converterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  converterCopy: {
    flex: 1,
    gap: Spacing.half,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/calendar");
