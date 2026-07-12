import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";
import { addDays, type DayActivity, getLocalDateString } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildWeekContainingDate, localizedWeekdayInitials } from "@/lib/calendar";
import { formatCalendarDate } from "@/lib/calendar-format";
import { gregorianToHijri } from "@/lib/hijri";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

type CalendarWeekStripProps = {
  date: string;
  calendarMode: CalendarMode;
  locale: AppLocale;
  activity: Map<string, DayActivity>;
  onSelectDate: (date: string) => void;
};

export function CalendarWeekStrip({
  date,
  calendarMode,
  locale,
  activity,
  onSelectDate,
}: CalendarWeekStripProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronBackward = useChevronBackward();
  const chevronForward = useChevronForward();
  const today = getLocalDateString();
  const weekdays = localizedWeekdayInitials(i18n.language ?? "en");
  const week = buildWeekContainingDate(date, today);

  const describeDay = (iso: string, isToday: boolean, isSelected: boolean) => {
    const parsed = new Date(`${iso}T00:00:00`);
    const dateText = formatCalendarDate(parsed, calendarMode, locale);
    const info = activity.get(iso);
    let statusText: string | null;
    if (iso > today) statusText = t("calDay.futureSubtitle");
    else if ((info?.level ?? 0) >= 1) statusText = t("calendar.prayed");
    else if ((info?.level ?? 0) > 0) statusText = t("calendar.partial");
    else if ((info?.missed ?? 0) > 0) statusText = t("calendar.missed");
    else statusText = null;
    const todayPrefix = isToday ? `${t("calDay.today")}, ` : "";
    const selectedPrefix = isSelected ? `${t("calDay.selected")}, ` : "";
    return statusText
      ? `${selectedPrefix}${todayPrefix}${dateText}, ${statusText}`
      : `${selectedPrefix}${todayPrefix}${dateText}`;
  };

  const shiftWeek = (delta: number) => {
    onSelectDate(addDays(date, delta * 7));
  };

  return (
    <Card padding="three">
      <View style={styles.header}>
        <NavButton
          icon={chevronBackward}
          label={t("calDay.prevWeek")}
          onPress={() => shiftWeek(-1)}
        />
        <ThemedText type="smallBold" themeColor="mutedForeground" style={styles.headerLabel}>
          {t("calDay.weekOf", {
            date: formatCalendarDate(new Date(`${date}T00:00:00`), calendarMode, locale, {
              month: "short",
              day: "numeric",
            }),
          })}
        </ThemedText>
        <NavButton
          icon={chevronForward}
          label={t("calDay.nextWeek")}
          onPress={() => shiftWeek(1)}
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

      <View style={styles.weekRow}>
        {week.map((day) => {
          const info = activity.get(day.date);
          const level = info?.level ?? 0;
          const hasMiss = (info?.missed ?? 0) > 0;
          const isSelected = day.date === date;
          const fill =
            level > 0 ? withAlpha(tokens.status.success.color, 0.2 + level * 0.55) : "transparent";
          const displayDay =
            calendarMode === "hijri"
              ? gregorianToHijri(new Date(`${day.date}T00:00:00`)).day
              : day.day;

          return (
            <View key={day.date} style={styles.cell}>
              <PressableScale
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={describeDay(day.date, day.isToday, isSelected)}
                accessibilityState={{ selected: isSelected, disabled: day.isFuture }}
                disabled={day.isFuture}
                onPress={() => onSelectDate(day.date)}
                style={[
                  styles.dayCircle,
                  { backgroundColor: fill },
                  day.isToday && { borderColor: colors.accent, borderWidth: 2 },
                  isSelected && {
                    backgroundColor: isSelected
                      ? withAlpha(colors.accent, fill === "transparent" ? 0.18 : 0.35)
                      : fill,
                    borderColor: colors.accent,
                    borderWidth: 2,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: isSelected ? colors.accentText : colors.foreground,
                    opacity: day.isFuture ? 0.4 : 1,
                  }}
                >
                  {displayDay}
                </ThemedText>
              </PressableScale>
              {hasMiss ? (
                <View style={[styles.dot, { backgroundColor: tokens.status.danger.color }]} />
              ) : (
                <View style={styles.dot} />
              )}
            </View>
          );
        })}
      </View>
    </Card>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  headerLabel: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: Spacing.two,
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
});
