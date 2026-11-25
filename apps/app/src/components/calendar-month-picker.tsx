import type { AppLocale, CalendarMode } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  CALENDAR_YEAR_LOOKAHEAD,
  CALENDAR_YEAR_LOOKBACK,
  localizedMonthNames,
} from "@/lib/calendar";
import { hijriMonthName } from "@/lib/hijri";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

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

/** Years per row — TV uses the landscape width so the 50-year list stays short. */
const YEAR_COLUMNS = isTV() ? 6 : 4;

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
  const chevronBackward = useChevronBackward();
  const chevronForward = useChevronForward();
  const [view, setView] = useState<PickerView>("months");
  const [pickerYear, setPickerYear] = useState(year);
  const tv = isTV();
  /**
   * TV: selected = soft fill + hairline (accent ring is reserved for D-pad focus)
   * and the selected cell takes initial focus. Phone keeps the accent outline.
   */
  const selectedChrome = (selected: boolean) => ({
    backgroundColor: selected ? withAlpha(colors.accent, 0.18) : colors.muted,
    borderColor: selected ? (tv ? tokens.accentBorder : colors.accent) : "transparent",
    borderWidth: selected ? (tv ? StyleSheet.hairlineWidth : 1.5) : 0,
  });

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

  const monthRows = useMemo(() => {
    const rows: { label: string; index: number }[][] = [];
    for (let rowStart = 0; rowStart < monthLabels.length; rowStart += 3) {
      rows.push(
        monthLabels.slice(rowStart, rowStart + 3).map((label, offset) => ({
          label,
          index: rowStart + offset,
        })),
      );
    }
    return rows;
  }, [monthLabels]);

  const yearRows = useMemo(() => {
    const rows: number[][] = [];
    for (let rowStart = 0; rowStart < years.length; rowStart += YEAR_COLUMNS) {
      rows.push(years.slice(rowStart, rowStart + YEAR_COLUMNS));
    }
    return rows;
  }, [years]);

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
    <Sheet
      accessibilityLabel={t("calendar.pickMonthYear")}
      visible={visible}
      onClose={onClose}
      variant="bottom"
    >
      {view === "months" ? (
        <>
          <ThemedText type="subtitle">{t("calendar.pickMonthYear")}</ThemedText>
          <View style={styles.yearNav}>
            <NavIconButton
              icon={chevronBackward}
              label={t("calendar.prevYear")}
              disabled={pickerYear <= minYear}
              onPress={() => shiftYear(-1)}
            />
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("calendar.selectYear")}
              onPress={() => setView("years")}
              style={[
                styles.yearButton,
                tv && styles.tvTarget,
                { backgroundColor: tokens.accentSoft },
              ]}
            >
              <ThemedText type="subtitle" numberOfLines={1}>
                {pickerYear}
              </ThemedText>
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
              icon={chevronForward}
              label={t("calendar.nextYear")}
              disabled={pickerYear >= maxYear}
              onPress={() => shiftYear(1)}
            />
          </View>

          <View style={styles.monthGrid}>
            {monthRows.map((row) => (
              <View key={row[0]?.index} style={styles.monthRow}>
                {row.map(({ label, index }) => {
                  const selected = isSelectedMonth(index);
                  const monthKey = monthValue(index);
                  return (
                    <PressableScale
                      key={monthKey}
                      haptic="selection"
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={label}
                      {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
                      onPress={() => handleMonthPress(index)}
                      style={[styles.monthCell, tv && styles.tvTarget, selectedChrome(selected)]}
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
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.yearHeader}>
            <IconButton
              name={chevronBackward}
              accessibilityLabel={t("common.back")}
              onPress={() => setView("months")}
              tintColor={colors.accent}
              background={tokens.accentSoft}
            />
            <ThemedText type="subtitle" style={styles.yearTitle}>
              {t("calendar.selectYear")}
            </ThemedText>
            <View style={[styles.backButtonSpacer, tv && styles.tvSpacer]} />
          </View>

          <View style={styles.yearGrid}>
            {yearRows.map((row) => (
              <View key={row[0]} style={styles.yearRow}>
                {row.map((itemYear) => {
                  const selected = itemYear === pickerYear;
                  return (
                    <PressableScale
                      key={itemYear}
                      haptic="selection"
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`${itemYear}`}
                      {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
                      onPress={() => handleYearPress(itemYear)}
                      style={[styles.yearCell, tv && styles.tvTarget, selectedChrome(selected)]}
                    >
                      <ThemedText
                        type="smallBold"
                        numberOfLines={1}
                        style={{ color: selected ? colors.accent : colors.foreground }}
                      >
                        {itemYear}
                      </ThemedText>
                    </PressableScale>
                  );
                })}
              </View>
            ))}
          </View>
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
    <IconButton
      name={icon}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      tintColor={colors.accent}
      background={tokens.accentSoft}
    />
  );
}

const styles = StyleSheet.create({
  tvTarget: {
    minHeight: TvLayout.minFocusTarget,
  },
  tvIconTarget: {
    width: TvLayout.minFocusTarget,
    height: TvLayout.minFocusTarget,
  },
  tvSpacer: {
    width: TvLayout.minFocusTarget,
  },
  yearNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  yearButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    minHeight: 44,
    minWidth: 0,
  },
  monthGrid: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  monthRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  monthCell: {
    flex: 1,
    minHeight: 48,
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
  backButtonSpacer: {
    width: 44,
  },
  yearGrid: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  yearRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  yearCell: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
