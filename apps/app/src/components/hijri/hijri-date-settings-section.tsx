import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { HijriBasisMovedCard } from "@/components/hijri/hijri-basis-moved-card";
import { HijriCorrectionsList } from "@/components/hijri/hijri-corrections-list";
import { HijriMonthStartSheet } from "@/components/hijri/hijri-month-start-sheet";
import { HijriOffsetStepper } from "@/components/hijri/hijri-offset-stepper";
import { ThemedText } from "@/components/themed-text";
import { NavRow } from "@/components/ui/nav-row";
import { Spacing } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import { gregorianToHijri, hijriMonthLabel } from "@/lib/hijri";
import { toAppLocale } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";
import { useLocation } from "@/stores/location-store";

/**
 * Settings › Language & region › Hijri date (D14): the moved-location card,
 * the −2…+2 offset stepper with a live preview, "This month started on…" for
 * the current month, and the removable list of corrections. Drop-in body for
 * the settings registry row (wired by NF-3.0b).
 */
export function HijriDateSettingsSection() {
  const { t, i18n } = useTranslation();
  const locale = toAppLocale(i18n.language ?? "en");
  const location = useLocation();
  const now = useNow();
  const today = gregorianToHijri(now, location.timeZone);
  const [sheetOpen, setSheetOpen] = useState(false);
  const tv = isTV();

  return (
    <View style={styles.container}>
      <HijriBasisMovedCard />
      <HijriOffsetStepper />
      {tv ? null : (
        <NavRow
          icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          label={t("hijriAdjust.monthStartedRow", {
            month: hijriMonthLabel(today.year, today.month, locale),
          })}
          onPress={() => setSheetOpen(true)}
        />
      )}
      <ThemedText type="smallBold">{t("hijriAdjust.correctionsTitle")}</ThemedText>
      <HijriCorrectionsList />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("hijriAdjust.neutralNote")}
      </ThemedText>
      <HijriMonthStartSheet
        visible={sheetOpen}
        year={today.year}
        month={today.month}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
});
