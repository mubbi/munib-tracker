import { type Href, useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { type DhulHijjahSeason, useDhulHijjahSeason } from "@/hooks/use-dhul-hijjah-season";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { dhulHijjahStart, hairNailsWindowActive } from "@/lib/dhul-hijjah";
import { useArrowForward } from "@/lib/rtl";
import { useDhulHijjahYear, useEnsureDhulHijjahLoaded } from "@/stores/dhul-hijjah-store";
import { useLocation } from "@/stores/location-store";

export const DHUL_HIJJAH_ICON = {
  ios: "star.circle.fill",
  android: "stars",
  web: "stars",
} as const;

/** Headline for the current phase (shared by the home card and the dashboard). */
export function phaseHeadline(t: TFunction, season: DhulHijjahSeason): string {
  switch (season.phase) {
    case "teaser": {
      const start = dhulHijjahStart(season.year);
      const [y, m, d] = season.today.split("-").map(Number);
      const today = new Date(y as number, (m as number) - 1, d as number);
      const days = Math.max(1, Math.round((start.getTime() - today.getTime()) / 86_400_000));
      return t("dhulHijjah.phase.teaser", { number: days });
    }
    case "ten":
      return t("dhulHijjah.phase.ten", { day: season.dayOfTen ?? 1 });
    case "arafah":
      return t("dhulHijjah.phase.arafah");
    case "eid":
      return t("dhulHijjah.phase.eid");
    case "tashriq":
      return t("dhulHijjah.phase.tashriq", { day: season.hijri.day });
    default:
      return t("dhulHijjah.title");
  }
}

/** Home module `dhul-hijjah`: teaser from 25 Dhul-Qa'dah, then the season card until 13 Dhul-Hijjah. */
export function DhulHijjahHomeCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  const location = useLocation();
  const season = useDhulHijjahSeason();
  useEnsureDhulHijjahLoaded();
  const state = useDhulHijjahYear(season.year);
  if (!season.phase) return null;
  const hairNails = hairNailsWindowActive(state, new Date(), location.timeZone);

  return (
    <Card>
      <SectionHeader
        title={t("dhulHijjah.title")}
        icon={DHUL_HIJJAH_ICON}
        badge={
          hairNails ? (
            <Pill
              label={t("dhulHijjah.hairNails.pill")}
              compact
              color={tokens.status.info.color}
              background={tokens.status.info.soft}
            />
          ) : undefined
        }
      />
      <View style={styles.body}>
        <ThemedText type="smallBold">{phaseHeadline(t, season)}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`dhulHijjah.homeHint.${season.phase}`)}
        </ThemedText>
        <Button
          label={t("dhulHijjah.open")}
          variant="secondary"
          trailingIcon={arrowForward}
          onPress={() => router.push("/dhul-hijjah" as Href)}
          fullWidth
        />
      </View>
    </Card>
  );
}

/** Whether the home card has anything to show today (gate before mounting — Stagger gaps). */
export function useShowDhulHijjahCard(): boolean {
  return useDhulHijjahSeason().phase != null;
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
});
