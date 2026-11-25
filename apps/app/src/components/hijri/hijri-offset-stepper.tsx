import type { HijriOffsetDays } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { StepperRow } from "@/components/settings/stepper-row";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useNow } from "@/hooks/use-now";
import { formatHijriDate } from "@/lib/hijri";
import { setHijriOffsetDays } from "@/lib/hijri-adjustment-actions";
import { toAppLocale } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";
import { useLocation } from "@/stores/location-store";

const MIN_OFFSET = -2;
const MAX_OFFSET = 2;

/**
 * "Hijri date adjustment": a −2…+2 whole-calendar shift with a live preview
 * line ("Today: 21 Jumada al-Ula 1448"). Uses the shared settings stepper
 * (bounded both ways); read-only on TV.
 */
export function HijriOffsetStepper() {
  const { t, i18n } = useTranslation();
  const locale = toAppLocale(i18n.language ?? "en");
  const adjustment = useHijriAdjustment();
  const location = useLocation();
  const now = useNow();
  const offset = adjustment?.offsetDays ?? 0;
  // Re-rendered whenever the adjustment changes, so this reads the adjusted date.
  const today = formatHijriDate(now, locale, location.timeZone);
  const valueLabel =
    offset === 0
      ? t("hijriAdjust.offsetNone")
      : t(offset > 0 ? "hijriAdjust.offsetLater" : "hijriAdjust.offsetEarlier", {
          count: Math.abs(offset),
        });

  const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`);

  return (
    <View style={styles.container}>
      {isTV() ? (
        <View style={styles.row}>
          <View style={styles.copy}>
            <ThemedText type="smallBold">{t("hijriAdjust.offsetTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {valueLabel}
            </ThemedText>
          </View>
          <ThemedText type="smallBold">{signed(offset)}</ThemedText>
        </View>
      ) : (
        // The settings stepper: disabled at −2 / +2, value read out with the title.
        <StepperRow
          title={t("hijriAdjust.offsetTitle")}
          subtitle={valueLabel}
          value={offset}
          min={MIN_OFFSET}
          max={MAX_OFFSET}
          step={1}
          format={signed}
          onChange={(next) => {
            if (next !== offset) void setHijriOffsetDays(next as HijriOffsetDays);
          }}
        />
      )}
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        accessibilityLiveRegion="polite"
        accessibilityLabel={t("hijriAdjust.previewToday", { date: today })}
      >
        {t("hijriAdjust.previewToday", { date: today })}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.offsetHint")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
});
