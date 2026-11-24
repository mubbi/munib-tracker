import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TAKBIR_ICON } from "@/components/dhul-hijjah/takbir-tracker-section";
import { TakbirWording } from "@/components/dhul-hijjah/takbir-wording";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import type { DhulHijjahSeason } from "@/hooks/use-dhul-hijjah-season";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tashriqKey, tashriqProgress } from "@/lib/dhul-hijjah";
import { isTV } from "@/lib/platform/is-tv";
import { useDhulHijjahActions, useDhulHijjahYear } from "@/stores/dhul-hijjah-store";

/**
 * Takbir al-Tashriq counter on the dashboard (NF-3.3): the wording card, the
 * labelled school view (all views when no school), and every slot X/N. Slots
 * on future days are shown but can't be ticked yet.
 */
export function TashriqSection({ season }: { season: DhulHijjahSeason }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const state = useDhulHijjahYear(season.year);
  const { toggleTashriq } = useDhulHijjahActions();
  const progress = tashriqProgress(state, season.slots);
  const byDate = new Map<string, typeof season.slots>();
  for (const slot of season.slots) byDate.set(slot.date, [...(byDate.get(slot.date) ?? []), slot]);
  const statusKey = season.salahRules
    ? `dhulHijjah.tashriq.status.${season.salahRules.takbirTashriq.status}`
    : "dhulHijjah.tashriq.status.allViews";

  return (
    <Card padding="three">
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
                  <PressableScale
                    key={slot.prayer}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: said, disabled: future }}
                    accessibilityLabel={t("dhulHijjah.tashriq.after", { prayer: label })}
                    disabled={future}
                    onPress={() => void toggleTashriq(season.year, slot.date, slot.prayer)}
                    haptic="selection"
                    style={[
                      styles.chip,
                      isTV() ? styles.chipTv : null,
                      {
                        borderColor: said ? tokens.status.success.color : tokens.hairline,
                        backgroundColor: said ? tokens.status.success.soft : colors.card,
                        opacity: future ? 0.5 : 1,
                      },
                    ]}
                  >
                    <ThemedText
                      type="caption"
                      style={{ color: said ? tokens.status.success.text : colors.foreground }}
                    >
                      {said ? `✓ ${label}` : label}
                    </ThemedText>
                  </PressableScale>
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
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipTv: { minHeight: TvLayout.chipMinHeight, justifyContent: "center" },
});
