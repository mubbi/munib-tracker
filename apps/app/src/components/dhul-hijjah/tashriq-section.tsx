import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TAKBIR_ICON } from "@/components/dhul-hijjah/takbir-tracker-section";
import { TakbirWording } from "@/components/dhul-hijjah/takbir-wording";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import type { DhulHijjahSeason } from "@/hooks/use-dhul-hijjah-season";
import { tashriqKey, tashriqProgress } from "@/lib/dhul-hijjah";
import { useDhulHijjahActions, useDhulHijjahYear } from "@/stores/dhul-hijjah-store";

/**
 * Takbir al-Tashriq counter on the dashboard (NF-3.3): the wording card, the
 * labelled school view (all views when no school), and every slot X/N. Slots
 * on future days are shown but can't be ticked yet.
 */
export function TashriqSection({ season }: { season: DhulHijjahSeason }) {
  const { t } = useTranslation();
  const state = useDhulHijjahYear(season.year);
  const { toggleTashriq } = useDhulHijjahActions();
  const progress = tashriqProgress(state, season.slots);
  const byDate = new Map<string, typeof season.slots>();
  for (const slot of season.slots) byDate.set(slot.date, [...(byDate.get(slot.date) ?? []), slot]);
  const statusKey = season.salahRules
    ? `dhulHijjah.tashriq.status.${season.salahRules.takbirTashriq.status}`
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
      <View style={styles.body}>
        <TakbirWording rules={season.salahRules} />
        <MadhhabNote id="tashriq.takbir" />
        {[...byDate.entries()].map(([date, slots]) => (
          <View key={date} style={styles.day}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("dhulHijjah.tashriq.dayLabel", { day: slots[0]?.hijriDay ?? 0 })}
            </ThemedText>
            <View style={styles.chips}>
              {slots.map((slot) => {
                const said = state?.tashriq[tashriqKey(slot.date, slot.prayer)] === true;
                const future = slot.date > season.today;
                const label = t(`prayers.${slot.prayer}`);
                return (
                  <Chip
                    key={slot.prayer}
                    role="checkbox"
                    label={said ? `✓ ${label}` : label}
                    accessibilityLabel={t("dhulHijjah.tashriq.after", { prayer: label })}
                    selected={said}
                    disabled={future}
                    onPress={() => void toggleTashriq(season.year, slot.date, slot.prayer)}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.three, marginTop: Spacing.three },
  day: { gap: Spacing.one },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
    borderWidth: BorderWidth.thin,
  },
  chipTv: { minHeight: TvLayout.chipMinHeight, justifyContent: "center" },
});
