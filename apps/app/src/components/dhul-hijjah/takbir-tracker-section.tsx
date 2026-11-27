import type { ObligatoryPrayer, PrayerStatus } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useMadhhab } from "@/hooks/use-madhhab";
import {
  DHUL_HIJJAH_MONTH,
  hijriForDateString,
  tashriqKey,
  tashriqProgress,
  tashriqSlots,
  tashriqSlotsAllViews,
  tashriqSlotsOn,
} from "@/lib/dhul-hijjah";
import {
  useDhulHijjahActions,
  useDhulHijjahYear,
  useEnsureDhulHijjahLoaded,
} from "@/stores/dhul-hijjah-store";

export const TAKBIR_ICON = {
  ios: "speaker.wave.2.fill",
  android: "campaign",
  web: "campaign",
} as const;

type Props = {
  date: string;
  status: Record<string, PrayerStatus>;
  /** Hidden while a hayd period is active (no fard to follow). */
  hidden?: boolean;
};

/**
 * Takbir al-Tashriq on the Tracker day view (NF-3.3): one chip per fard in the
 * school's window. A chip unlocks once that fard is marked completed, then
 * toggles "Takbir said ✓". Renders nothing outside the window.
 */
export function TakbirTashriqTrackerSection({ date, status, hidden = false }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { rules } = useMadhhab();
  useEnsureDhulHijjahLoaded();
  // `date` is already the location's day key — re-zoning it would shift the Hijri day.
  const hijri = hijriForDateString(date);
  const year = hijri.year;
  const state = useDhulHijjahYear(year);
  const { toggleTashriq } = useDhulHijjahActions();
  if (hidden || hijri.month !== DHUL_HIJJAH_MONTH || hijri.day < 9 || hijri.day > 13) return null;

  const salahRules = rules("salah");
  const slots = salahRules ? tashriqSlots(salahRules, year) : tashriqSlotsAllViews(year);
  const prayers = tashriqSlotsOn(slots, date);
  if (prayers.length === 0) return null;
  const progress = tashriqProgress(state, slots);
  const statusKey = salahRules
    ? `dhulHijjah.tashriq.status.${salahRules.takbirTashriq.status}`
    : "dhulHijjah.tashriq.status.allViews";

  return (
    <Card>
      <SectionHeader
        title={t("dhulHijjah.tashriq.title")}
        subtitle={t(statusKey)}
        icon={TAKBIR_ICON}
        badge={
          <Pill
            label={t("dhulHijjah.tashriq.progress", { done: progress.done, total: progress.total })}
            compact
          />
        }
      />
      <View style={styles.chips}>
        {prayers.map((prayer: ObligatoryPrayer) => {
          const prayed = status[prayer] === "completed";
          const said = state?.tashriq[tashriqKey(date, prayer)] === true;
          const label = said
            ? t("dhulHijjah.tashriq.saidAfter", { prayer: t(`prayers.${prayer}`) })
            : t("dhulHijjah.tashriq.after", { prayer: t(`prayers.${prayer}`) });
          return (
            <Chip
              key={prayer}
              role="checkbox"
              label={label}
              accessibilityLabel={label}
              selected={said}
              disabled={!prayed && !said}
              icon={said ? { ios: "checkmark", android: "check", web: "check" } : undefined}
              onPress={() => void toggleTashriq(year, date, prayer)}
            />
          );
        })}
      </View>
      <View style={styles.link}>
        <NavRow
          icon={TAKBIR_ICON}
          label={t("dhulHijjah.tashriq.wordingLink")}
          onPress={() => router.push("/dhul-hijjah?focus=tashriq" as Href)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.three },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.thin,
  },
  chipTv: { minHeight: TvLayout.chipMinHeight },
  link: { marginTop: Spacing.three },
});
