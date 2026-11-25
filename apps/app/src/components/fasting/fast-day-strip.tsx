import type {
  AppLocale,
  CalendarMode,
  VoluntaryFastingMap,
  VoluntaryFastingPrefs,
} from "@munib-tracker/shared/types";
import { isLiveFastEntry, matchesEnabledKinds } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import {
  RULING_ICON,
  RULING_TONE,
  STATUS_ICON,
  STATUS_TONE,
} from "@/components/fasting/fasting-ui";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatCompactGridDateFromIso } from "@/lib/calendar-format";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import type { FastingDay } from "@/lib/voluntary-fasting";

type FastDayStripProps = {
  days: FastingDay[];
  entries: VoluntaryFastingMap;
  prefs: VoluntaryFastingPrefs;
  locale: AppLocale;
  calendar: CalendarMode;
  today: string;
  onPressDay: (date: string) => void;
};

/** Upcoming days coloured by ruling; a star marks days the user follows (NF-3.2 hub). */
export function FastDayStrip({
  days,
  entries,
  prefs,
  locale,
  calendar,
  today,
  onPressDay,
}: FastDayStripProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const weekday = new Intl.DateTimeFormat(localeToBcp47(locale), { weekday: "short" });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityLabel={t("voluntaryFasting.strip.a11y")}
    >
      {days.map(({ date, classification }) => {
        const tone = RULING_TONE[classification.ruling];
        const border = tone === "muted" ? colors.cardBorder : tokens.status[tone].color;
        const fill = tone === "muted" ? colors.card : tokens.status[tone].soft;
        const entry = entries[date];
        const live = isLiveFastEntry(entry) ? entry : undefined;
        const followed = matchesEnabledKinds(classification, prefs);
        const dateLabel = formatCompactGridDateFromIso(date, calendar, locale);
        const weekdayLabel = weekday.format(new Date(`${date}T12:00:00`));
        const label = [
          date === today ? t("voluntaryFasting.today") : weekdayLabel,
          dateLabel,
          t(`voluntaryFasting.ruling.${classification.ruling}`),
          live ? t(`voluntaryFasting.status.${live.status}`) : null,
        ]
          .filter(Boolean)
          .join(", ");
        return (
          <PressableScale
            key={date}
            haptic="selection"
            scaleTo={0.95}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => onPressDay(date)}
            style={[
              styles.chip,
              {
                backgroundColor: fill,
                borderColor: border,
                borderWidth: date === today ? 2 : 1,
              },
            ]}
          >
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {date === today ? t("voluntaryFasting.today") : weekdayLabel}
            </ThemedText>
            <ThemedText type="smallBold" numberOfLines={1}>
              {dateLabel}
            </ThemedText>
            <View style={styles.marks}>
              {tone === "muted" ? null : (
                <SymbolView
                  name={RULING_ICON[classification.ruling]}
                  size={12}
                  tintColor={tokens.status[tone].color}
                />
              )}
              {followed ? (
                <SymbolView
                  name={{ ios: "star.fill", android: "star", web: "star" }}
                  size={12}
                  tintColor={tokens.status.success.color}
                />
              ) : null}
              {live ? (
                <SymbolView
                  name={STATUS_ICON[live.status]}
                  size={12}
                  tintColor={tokens.status[STATUS_TONE[live.status]].color}
                />
              ) : null}
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.two, paddingVertical: Spacing.one },
  chip: {
    minWidth: 64,
    minHeight: 64,
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  marks: { flexDirection: "row", gap: Spacing.half, minHeight: 12 },
});
