import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";
import { aggregateByDate, type DayActivity, getLocalDateString } from "@munib-tracker/shared/utils";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { CalendarMonthPicker } from "@/components/calendar-month-picker";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { PrayerRepository } from "@/db";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  buildHijriMonthGrid,
  buildMonthGrid,
  localizedMonthLabel,
  localizedWeekdayInitials,
} from "@/lib/calendar";
import { formatCalendarDate } from "@/lib/calendar-format";
import { gregorianToHijri, hijriMonthLabel } from "@/lib/hijri";

export default function CalendarScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const defaultCalendar = useDefaultCalendar();
  const now = new Date();
  const todayHijri = gregorianToHijri(now);
  const [mode, setMode] = useState<CalendarMode>(defaultCalendar);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [hYear, setHYear] = useState(todayHijri.year);
  const [hMonth, setHMonth] = useState(todayHijri.month);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activity, setActivity] = useState<Map<string, DayActivity>>(new Map());

  const base = i18n.language?.split("-")[0];
  const locale: AppLocale = base === "ar" || base === "ur" ? base : "en";

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
  const weeks =
    mode === "hijri" ? buildHijriMonthGrid(hYear, hMonth, today) : buildMonthGrid(year, month);
  const label =
    mode === "hijri"
      ? hijriMonthLabel(hYear, hMonth, locale)
      : localizedMonthLabel(year, month, i18n.language ?? "en");
  const weekdays = localizedWeekdayInitials(i18n.language ?? "en");

  // Localized, screen-reader-friendly label for a day cell: the full date in the
  // active calendar plus its worship status (prayed / partial / missed / today).
  const describeDay = (date: string, isToday: boolean) => {
    const parsed = new Date(`${date}T00:00:00`);
    const dateText = formatCalendarDate(parsed, mode, locale);
    const info = activity.get(date);
    let statusText: string | null;
    if (date > today) statusText = t("calDay.futureSubtitle");
    else if ((info?.level ?? 0) >= 1) statusText = t("calendar.prayed");
    else if ((info?.level ?? 0) > 0) statusText = t("calendar.partial");
    else if ((info?.missed ?? 0) > 0) statusText = t("calendar.missed");
    else statusText = null; // past/current day with no logged worship yet
    const todayPrefix = isToday ? `${t("calDay.today")}, ` : "";
    return statusText ? `${todayPrefix}${dateText}, ${statusText}` : `${todayPrefix}${dateText}`;
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

  return (
    <ScreenLayout
      eyebrow={t("calendar.eyebrow")}
      title={t("calendar.title")}
      subtitle={t("calendar.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/calendar" />
      <Stagger>
        <SegmentedControl<CalendarMode>
          options={[
            { id: "gregorian", label: t("calendar.gregorian") },
            { id: "hijri", label: t("calendar.hijri") },
          ]}
          value={mode}
          onChange={setMode}
        />

        <Card padding="three">
          <View style={styles.header}>
            <NavButton
              icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
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
            <NavButton
              icon={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
              label={t("calendar.nextMonth")}
              onPress={() => shift(1)}
            />
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
                const info = activity.get(day.date);
                const level = info?.level ?? 0;
                const hasMiss = (info?.missed ?? 0) > 0;
                const fill =
                  level > 0
                    ? withAlpha(tokens.status.success.color, 0.2 + level * 0.55)
                    : "transparent";
                const disabled = !day.inMonth || day.isFuture;

                return (
                  <Pressable
                    key={day.date}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityLabel={describeDay(day.date, day.isToday)}
                    accessibilityState={{ disabled }}
                    onPress={() =>
                      router.push({
                        pathname: "/calendar/[date]",
                        params: { date: day.date, calendar: mode },
                      })
                    }
                    style={styles.cell}
                  >
                    <View
                      style={[
                        styles.dayCircle,
                        { backgroundColor: fill },
                        day.isToday && { borderColor: colors.accent, borderWidth: 2 },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: day.inMonth ? colors.foreground : colors.mutedForeground,
                          opacity: disabled && !day.isToday ? 0.4 : 1,
                        }}
                      >
                        {day.day}
                      </ThemedText>
                    </View>
                    {hasMiss ? (
                      <View style={[styles.dot, { backgroundColor: tokens.status.danger.color }]} />
                    ) : (
                      <View style={styles.dot} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </Card>

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

        <Card variant="muted" padding="three">
          <View style={styles.legend}>
            <LegendSwatch
              color={withAlpha(tokens.status.success.color, 0.75)}
              label={t("calendar.prayed")}
            />
            <LegendSwatch
              color={withAlpha(tokens.status.success.color, 0.3)}
              label={t("calendar.partial")}
            />
            <LegendDot color={tokens.status.danger.color} label={t("calendar.missed")} />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.legendHint}>
            {t("calendar.legendHint", {
              date: formatCalendarDate(new Date(`${today}T00:00:00`), mode, locale),
            })}
          </ThemedText>
        </Card>
      </Stagger>
    </ScreenLayout>
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
      style={[styles.navButton, { backgroundColor: tokens.accentSoft }]}
    >
      <SymbolView name={icon} size={18} tintColor={colors.accent} />
    </PressableScale>
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

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
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
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  legend: {
    flexDirection: "row",
    gap: Spacing.four,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendHint: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
});
