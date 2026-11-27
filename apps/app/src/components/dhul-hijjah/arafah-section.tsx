import { DHUL_HIJJAH_EVIDENCE } from "@munib-tracker/shared/content/dhul-hijjah";
import { type Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { dhulHijjahDate } from "@/lib/dhul-hijjah";
import { computeLocationPrayerTimes } from "@/lib/location";
import { formatDisplayHhMm, getZonedParts } from "@/lib/time";
import { isPilgrimForHijriYear } from "@/lib/voluntary-fasting";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

const ARAFAH_ICON = {
  ios: "hands.sparkles.fill",
  android: "volunteer_activism",
  web: "volunteer_activism",
} as const;

/**
 * Day of Arafah view (NF-3.3): the fast for those not on Hajj, a dua focus
 * window from Asr to Maghrib (live countdown on the day) and a shortcut to the
 * user's own dua list. Times are the user's real Salah times. Someone
 * performing Hajj this year is not offered the fast — the pilgrim note shows.
 */
export function ArafahSection({ year, isToday }: { year: number; isToday: boolean }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const location = useLocation();
  const { timeFormat, voluntaryFasting } = usePreferences();
  const pilgrim = isPilgrimForHijriYear(voluntaryFasting, year);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isToday) return;
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, [isToday]);

  const date = dhulHijjahDate(year, 9);
  const [y, m, d] = date.split("-").map(Number);
  const times = computeLocationPrayerTimes(
    location,
    new Date(y as number, (m as number) - 1, d as number, 12),
  );
  const fmt = (at: Date) => {
    const parts = getZonedParts(at, location.timeZone);
    return formatDisplayHhMm(parts.hour, parts.minute, timeFormat);
  };
  const inWindow = isToday && now >= times.asr && now < times.maghrib;
  const minutesLeft = Math.max(0, Math.round((times.maghrib.getTime() - now.getTime()) / 60_000));
  const realTimes = location.source !== "default";

  return (
    <Card>
      <SectionHeader
        title={t("dhulHijjah.arafah.title")}
        icon={ARAFAH_ICON}
        badge={
          inWindow ? (
            <Pill
              label={t("dhulHijjah.arafah.liveLeft", { number: minutesLeft })}
              compact
              color={tokens.status.success.color}
              background={tokens.status.success.soft}
            />
          ) : undefined
        }
      />
      <View style={styles.body}>
        {pilgrim ? (
          <>
            <ThemedText type="smallBold">{t("dhulHijjah.arafah.pilgrimTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("voluntaryFasting.reason.pilgrimArafah")}
            </ThemedText>
          </>
        ) : (
          <>
            <ThemedText type="smallBold">{t("dhulHijjah.arafah.fastTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("dhulHijjah.arafah.fastBody")}
            </ThemedText>
            <EvidenceLine refs={DHUL_HIJJAH_EVIDENCE.arafahFast} />
          </>
        )}

        <ThemedText type="smallBold" style={styles.gap}>
          {t("dhulHijjah.arafah.duaTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {realTimes
            ? t("dhulHijjah.arafah.duaWindow", { from: fmt(times.asr), to: fmt(times.maghrib) })
            : t("dhulHijjah.arafah.duaWindowNoLocation")}
        </ThemedText>
        <EvidenceLine refs={DHUL_HIJJAH_EVIDENCE.arafahDua} />
        <NavRow
          icon={{ ios: "star.fill", android: "star", web: "star" }}
          label={t("dhulHijjah.arafah.myDuas")}
          onPress={() => router.push("/dua/favorites" as Href)}
          href="/dua/favorites"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.one, marginTop: Spacing.two },
  gap: { marginTop: Spacing.two },
});
