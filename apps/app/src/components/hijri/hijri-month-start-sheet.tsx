import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { formatGregorianDay } from "@/components/hijri/hijri-format";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { hijriBaseCalendar, hijriMonthLabel, hijriPredictionSource } from "@/lib/hijri";
import { hijriMonthFromIndex, hijriMonthIndex, monthStartChoices } from "@/lib/hijri-adjustment";
import { setHijriMonthStart } from "@/lib/hijri-adjustment-actions";
import { toAppLocale } from "@/lib/locale-bcp47";
import { useLocation } from "@/stores/location-store";

type HijriMonthStartSheetProps = {
  visible: boolean;
  /** Hijri month to correct (1-based month). */
  year: number;
  month: number;
  onClose: () => void;
};

/**
 * "This month started on…" (D14, §4.5.11): the predicted day 1 and up to two
 * days either side — only choices that keep every month 29 or 30 days — a
 * note on where the prediction comes from, and "Clear this month's correction".
 */
export function HijriMonthStartSheet({ visible, year, month, onClose }: HijriMonthStartSheetProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const locale = toAppLocale(i18n.language ?? "en");
  const adjustment = useHijriAdjustment();
  const location = useLocation();
  // The sheet can step back to the previous month when a choice needs it first.
  const [target, setTarget] = useState(() => hijriMonthIndex(year, month));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setTarget(hijriMonthIndex(year, month));
  }, [visible, year, month]);

  const current = hijriMonthFromIndex(target);
  const previous = hijriMonthFromIndex(target - 1);
  // biome-ignore lint/correctness/useExhaustiveDependencies: the observer (from location) changes the base starts.
  const info = useMemo(
    () => monthStartChoices(hijriBaseCalendar(), adjustment, current.year, current.month),
    [adjustment, current.year, current.month, location],
  );
  const sourceKind = hijriPredictionSource(current.year, current.month);
  const source =
    sourceKind === "sighting"
      ? t("hijriAdjust.sourceSighting", { place: location.city ?? location.label })
      : sourceKind === "ummAlQura"
        ? t("hijriAdjust.sourceUmmAlQura")
        : t("hijriAdjust.sourceTabular");
  const monthLabel = hijriMonthLabel(current.year, current.month, locale);
  const needsPrevious = info.laterNeedsPreviousMonth || info.earlierNeedsPreviousMonth;

  const choose = async (date: string | null) => {
    setSaving(true);
    try {
      await setHijriMonthStart(current.year, current.month, date);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <ThemedText type="subtitle">{t("hijriAdjust.sheetTitle", { month: monthLabel })}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.sheetIntro")}
      </ThemedText>

      <View style={styles.choices} accessibilityRole="radiogroup">
        {info.choices.map((choice) => {
          const selected = choice.isCurrent;
          const dateLabel = formatGregorianDay(choice.jdn, locale);
          const tag = choice.isPredicted ? t("hijriAdjust.predicted") : null;
          return (
            <PressableScale
              key={choice.jdn}
              haptic="selection"
              disabled={saving}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: saving }}
              accessibilityLabel={tag ? `${dateLabel}, ${tag}` : dateLabel}
              onPress={() => void choose(choice.date)}
              style={[
                styles.choice,
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.muted,
                  borderColor: selected ? colors.accent : "transparent",
                },
              ]}
            >
              <SymbolView
                name={
                  selected
                    ? {
                        ios: "largecircle.fill.circle",
                        android: "radio_button_checked",
                        web: "radio_button_checked",
                      }
                    : {
                        ios: "circle",
                        android: "radio_button_unchecked",
                        web: "radio_button_unchecked",
                      }
                }
                size={20}
                tintColor={selected ? colors.accent : colors.mutedForeground}
              />
              <ThemedText type={selected ? "smallBold" : "small"} style={styles.choiceLabel}>
                {dateLabel}
              </ThemedText>
              {tag ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {tag}
                </ThemedText>
              ) : null}
            </PressableScale>
          );
        })}
      </View>

      {needsPrevious ? (
        <View style={[styles.note, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption">
            {t(
              info.laterNeedsPreviousMonth
                ? "hijriAdjust.laterNeedsPrevious"
                : "hijriAdjust.earlierNeedsPrevious",
              { month: hijriMonthLabel(previous.year, previous.month, locale) },
            )}
          </ThemedText>
          <Button
            size="sm"
            variant="secondary"
            label={t("hijriAdjust.correctPrevious", {
              month: hijriMonthLabel(previous.year, previous.month, locale),
            })}
            onPress={() => setTarget(target - 1)}
          />
        </View>
      ) : null}

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.predictionSource", { source })}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.neutralNote")}
      </ThemedText>

      <View style={styles.actions}>
        {info.corrected ? (
          <Button
            variant="ghost"
            size="sm"
            label={t("hijriAdjust.clearMonth")}
            disabled={saving}
            onPress={() => void choose(null)}
          />
        ) : null}
        <Button size="sm" label={t("hijriAdjust.done")} onPress={onClose} />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  choices: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
  choiceLabel: {
    flex: 1,
  },
  note: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
