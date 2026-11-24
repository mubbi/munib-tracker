import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { formatGregorianDay } from "@/components/hijri/hijri-format";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { Radius, Spacing } from "@/constants/theme";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { hijriBaseCalendar, hijriMonthLabel } from "@/lib/hijri";
import { createAdjustedCalendar, isoDateToJDN } from "@/lib/hijri-adjustment";
import { setHijriMonthStart } from "@/lib/hijri-adjustment-actions";
import { toAppLocale } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";
import { useLocation } from "@/stores/location-store";

/**
 * The per-month corrections the user made, each removable, plus the months
 * whose length moved because of them (a correction can lengthen the previous
 * month or ripple a few months forward until it converges).
 */
export function HijriCorrectionsList() {
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  const locale = toAppLocale(i18n.language ?? "en");
  const adjustment = useHijriAdjustment();
  const location = useLocation();
  const tv = isTV();

  // biome-ignore lint/correctness/useExhaustiveDependencies: the observer (from location) changes the base starts.
  const { corrections, affected } = useMemo(() => {
    const calendar = createAdjustedCalendar(hijriBaseCalendar(), adjustment);
    return { corrections: calendar.corrections(), affected: calendar.affectedMonths() };
  }, [adjustment, location]);

  if (corrections.length === 0) {
    return (
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.noCorrections")}
      </ThemedText>
    );
  }

  const rippled = affected.filter((m) => !m.corrected && m.length !== m.predictedLength);

  return (
    <View style={styles.container}>
      {corrections.map((correction) => {
        const label = hijriMonthLabel(correction.year, correction.month, locale);
        const jdn = isoDateToJDN(correction.date);
        const date = jdn === null ? correction.date : formatGregorianDay(jdn, locale);
        return (
          <View key={correction.key} style={[styles.row, { backgroundColor: colors.muted }]}>
            <View style={styles.copy}>
              <ThemedText type="smallBold">{label}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(correction.applied ? "hijriAdjust.startedOn" : "hijriAdjust.notApplied", {
                  date,
                })}
              </ThemedText>
            </View>
            {tv ? null : (
              <IconButton
                name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
                size={22}
                tintColor={colors.mutedForeground}
                accessibilityLabel={t("hijriAdjust.removeCorrection", { month: label })}
                onPress={() => void setHijriMonthStart(correction.year, correction.month, null)}
              />
            )}
          </View>
        );
      })}
      {rippled.length > 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("hijriAdjust.affectedMonths", {
            months: rippled
              .map((m) =>
                t("hijriAdjust.affectedMonth", {
                  month: hijriMonthLabel(m.year, m.month, locale),
                  days: m.length,
                }),
              )
              .join(", "),
          })}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
