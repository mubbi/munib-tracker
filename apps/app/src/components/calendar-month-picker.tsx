import type { AppLocale } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  CALENDAR_YEAR_LOOKAHEAD,
  CALENDAR_YEAR_LOOKBACK,
  localizedMonthNames,
} from "@/lib/calendar";
import { hijriMonthName } from "@/lib/hijri";

type CalendarMode = "gregorian" | "hijri";

type CalendarMonthPickerProps = {
  visible: boolean;
  onClose: () => void;
  mode: CalendarMode;
  year: number;
  /** Gregorian: 0–11. Hijri: 1–12. */
  month: number;
  onSelect: (year: number, month: number) => void;
  locale: AppLocale;
  language: string;
  anchorYear: number;
};

type PickerView = "months" | "years";

export function CalendarMonthPicker({
  visible,
  onClose,
  mode,
  year,
  month,
  onSelect,
  locale,
  language,
  anchorYear,
}: CalendarMonthPickerProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [view, setView] = useState<PickerView>("months");
  const [pickerYear, setPickerYear] = useState(year);

  const { min: minYear, max: maxYear } = useMemo(
    () => ({
      min: anchorYear - CALENDAR_YEAR_LOOKBACK,
      max: anchorYear + CALENDAR_YEAR_LOOKAHEAD,
    }),
    [anchorYear],
  );

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index),
    [minYear, maxYear],
  );

  const monthLabels =
    mode === "hijri"
      ? Array.from({ length: 12 }, (_, index) => hijriMonthName(index + 1, locale))
      : localizedMonthNames(language);

  useEffect(() => {
    if (visible) {
      setView("months");
      setPickerYear(year);
    }
  }, [visible, year]);

  const shiftYear = (delta: number) => {
    setPickerYear((current) => Math.min(maxYear, Math.max(minYear, current + delta)));
  };

  const monthValue = (index: number) => (mode === "hijri" ? index + 1 : index);
  const isSelectedMonth = (index: number) => pickerYear === year && monthValue(index) === month;

  const handleMonthPress = (index: number) => {
    onSelect(pickerYear, monthValue(index));
    onClose();
  };

  const handleYearPress = (nextYear: number) => {
    setPickerYear(nextYear);
    setView("months");
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      {view === "months" ? (
        <>
          <ThemedText type="subtitle">{t("calendar.pickMonthYear")}</ThemedText>
          <View style={styles.yearNav}>
            <NavIconButton
              icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
              label={t("calendar.prevYear")}
              disabled={pickerYear <= minYear}
              onPress={() => shiftYear(-1)}
            />
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("calendar.selectYear")}
              onPress={() => setView("years")}
              style={[styles.yearButton, { backgroundColor: tokens.accentSoft }]}
            >
              <ThemedText type="subtitle">{pickerYear}</ThemedText>
              <SymbolView
                name={{
                  ios: "chevron.down",
                  android: "keyboard_arrow_down",
                  web: "keyboard_arrow_down",
                }}
                size={14}
                tintColor={colors.accent}
              />
            </PressableScale>
            <NavIconButton
              icon={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
              label={t("calendar.nextYear")}
              disabled={pickerYear >= maxYear}
              onPress={() => shiftYear(1)}
            />
          </View>

          <View style={styles.monthGrid}>
            {monthLabels.map((label, index) => {
              const selected = isSelectedMonth(index);
              const monthKey = monthValue(index);
              return (
                <PressableScale
                  key={monthKey}
                  haptic="selection"
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={label}
                  onPress={() => handleMonthPress(index)}
                  style={[
                    styles.monthCell,
                    {
                      backgroundColor: selected ? withAlpha(colors.accent, 0.18) : colors.muted,
                      borderColor: selected ? colors.accent : "transparent",
                      borderWidth: selected ? 1.5 : 0,
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    numberOfLines={2}
                    style={{
                      color: selected ? colors.accent : colors.foreground,
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <View style={styles.yearHeader}>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("common.back")}
              onPress={() => setView("months")}
              style={[styles.backButton, { backgroundColor: tokens.accentSoft }]}
            >
              <SymbolView
                name={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
                size={16}
                tintColor={colors.accent}
              />
            </PressableScale>
            <ThemedText type="subtitle" style={styles.yearTitle}>
              {t("calendar.selectYear")}
            </ThemedText>
            <View style={styles.backButtonSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.yearGrid}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {years.map((itemYear) => {
              const selected = itemYear === pickerYear;
              return (
                <PressableScale
                  key={itemYear}
                  haptic="selection"
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${itemYear}`}
                  onPress={() => handleYearPress(itemYear)}
                  style={[
                    styles.yearCell,
                    {
                      backgroundColor: selected ? withAlpha(colors.accent, 0.18) : colors.muted,
                      borderColor: selected ? colors.accent : "transparent",
                      borderWidth: selected ? 1.5 : 0,
                    },
                  ]}
                >
                  <ThemedText
                    type="smallBold"
                    style={{ color: selected ? colors.accent : colors.foreground }}
                  >
                    {itemYear}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </ScrollView>
        </>
      )}
    </Sheet>
  );
}

function NavIconButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: Parameters<typeof SymbolView>[0]["name"];
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={[styles.navIcon, { backgroundColor: tokens.accentSoft, opacity: disabled ? 0.35 : 1 }]}
    >
      <SymbolView name={icon} size={18} tintColor={colors.accent} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  yearNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.one,
  },
  yearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    minHeight: 44,
  },
  navIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  monthCell: {
    width: "30%",
    flexGrow: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  yearTitle: {
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonSpacer: {
    width: 36,
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    maxHeight: 320,
  },
  yearCell: {
    width: "22%",
    flexGrow: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
