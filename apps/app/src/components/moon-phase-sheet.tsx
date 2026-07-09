import type { AppLocale } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, View } from "react-native";

import { MoonPhaseIcon } from "@/components/moon-phase";
import { ThemedText } from "@/components/themed-text";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { gradientBackground } from "@/lib/gradient";
import { formatHijriDate, gregorianToHijri, hijriMonthName } from "@/lib/hijri";
import { toAppLocale } from "@/lib/locale-bcp47";
import { daysUntilNewMoon, moonAgeDays, moonPhase } from "@/lib/moon";
import { useLocation } from "@/stores/location-store";

type MoonPhaseSheetProps = {
  visible: boolean;
  /** Instant to describe (the live clock). */
  date: Date;
  onClose: () => void;
};

/**
 * Details for the current moon phase, opened by tapping the moon in the hero.
 * Pairs the astronomical shape (phase, illumination, age, next crescent) with
 * its Islamic significance — the Hijri calendar is lunar, so the moon's shape
 * literally marks the date, the month's turn, and the White Days of fasting.
 * All values are computed on-device (offline) from the same `moon`/`hijri` libs.
 */
export function MoonPhaseSheet({ visible, date, onClose }: MoonPhaseSheetProps) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const location = useLocation();

  const locale: AppLocale = toAppLocale(i18n.language ?? "en");

  const { fraction, illumination, waxing, name } = moonPhase(date);
  const hijri = gregorianToHijri(date);
  const percent = Math.round(illumination * 100);
  const age = Math.round(moonAgeDays(fraction));
  const toNewMoon = Math.max(1, Math.round(daysUntilNewMoon(fraction)));
  const nextMonthName = hijriMonthName(hijri.month === 12 ? 1 : hijri.month + 1, locale);
  const currentMonthName = hijriMonthName(hijri.month, locale);

  const note = noteFor(hijri.day, name);
  const noteBody =
    note === "newMonth" || note === "full"
      ? t(`moonSheet.note.${note}Body`, { month: currentMonthName })
      : t(`moonSheet.note.${note}Body`);

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom">
      <View style={styles.header}>
        <View
          style={[
            styles.stage,
            gradientBackground("radial-gradient(circle at 50% 42%, #1D2A48, #0D1424)"),
          ]}
        >
          <MoonPhaseIcon
            date={date}
            size={72}
            litColor="#F5EBCB"
            shadowColor="#37527E"
            southernHemisphere={location.latitude < 0}
          />
        </View>
        <ThemedText type="title" style={styles.phaseName}>
          {t(`moon.${name}`)}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t(waxing ? "moonSheet.waxing" : "moonSheet.waning")}
        </ThemedText>
      </View>

      <View style={[styles.rows, { backgroundColor: colors.muted }]}>
        <InfoRow label={t("moonSheet.illuminationLabel")} value={`${percent}%`} />
        <Divider color={colors.border} />
        <InfoRow label={t("moonSheet.hijriDate")} value={formatHijriDate(date, locale)} />
        <Divider color={colors.border} />
        <InfoRow
          label={t("moonSheet.lunarDay")}
          value={t("moonSheet.lunarDayValue", { day: hijri.day, month: currentMonthName })}
        />
        <Divider color={colors.border} />
        <InfoRow label={t("moonSheet.age")} value={t("moonSheet.ageValue", { days: age })} />
        <Divider color={colors.border} />
        <InfoRow
          label={t("moonSheet.nextNewMoon")}
          value={t("moonSheet.nextNewMoonValue", { days: toNewMoon, month: nextMonthName })}
        />
      </View>

      <View style={[styles.note, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {t(`moonSheet.note.${note}Title`)}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {noteBody}
        </ThemedText>
      </View>
    </Sheet>
  );
}

/** Picks the most relevant Islamic note for the current lunar day + phase. */
function noteFor(
  hijriDay: number,
  phaseName: string,
): "whiteDays" | "newMonth" | "full" | "general" {
  if (hijriDay >= 13 && hijriDay <= 15) return "whiteDays";
  if (hijriDay <= 2) return "newMonth";
  if (phaseName === "full") return "full";
  return "general";
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.rowValue}>
        {value}
      </ThemedText>
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: Spacing.one,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
  },
  stage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  phaseName: {
    textAlign: "center",
  },
  rows: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingVertical: Spacing.three - 2,
  },
  rowLabel: {
    flexShrink: 0,
  },
  rowValue: {
    flexShrink: 1,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  note: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    padding: Spacing.three,
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
});
