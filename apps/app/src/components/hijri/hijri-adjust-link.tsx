import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { HijriMonthStartSheet } from "@/components/hijri/hijri-month-start-sheet";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { hijriMonthLabel } from "@/lib/hijri";
import { toAppLocale } from "@/lib/locale-bcp47";
import { isTV } from "@/lib/platform/is-tv";

type HijriAdjustLinkProps = {
  /** Hijri month the "This month started on…" sheet opens on. */
  year: number;
  month: number;
  /** Horizontal placement in the parent column. */
  align?: "start" | "center";
};

/**
 * Small "Adjust" link (Ramadan screen, calendar month header) that opens the
 * "This month started on…" sheet, so a user can correct the month at the
 * moment of an announcement. Hidden on TV (settings stay read-only there).
 */
export function HijriAdjustLink({ year, month, align = "start" }: HijriAdjustLinkProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  if (isTV()) return null;
  const locale = toAppLocale(i18n.language ?? "en");

  return (
    <>
      <PressableScale
        haptic="light"
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={t("hijriAdjust.adjustA11y", {
          month: hijriMonthLabel(year, month, locale),
        })}
        onPress={() => setOpen(true)}
        style={[styles.link, { alignSelf: align === "center" ? "center" : "flex-start" }]}
      >
        <ThemedText type="linkPrimary">{t("hijriAdjust.adjust")}</ThemedText>
      </PressableScale>
      <HijriMonthStartSheet
        visible={open}
        year={year}
        month={month}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    paddingVertical: Spacing.one,
  },
});
