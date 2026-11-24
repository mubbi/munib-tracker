import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { HadithExcerptCard } from "@/components/hadith/hadith-excerpt-card";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import {
  ensureHomeMasjidLoaded,
  MASJID_EVIDENCE,
  useHomeIqamahTimetable,
  useHomeMasjid,
} from "@/lib/masjid";
import { nextIqamah } from "@/lib/masjid/next-iqamah";
import { formatPrayerTime } from "@/lib/prayer-times";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

const TAHIYYAT_HADITH = `${MASJID_EVIDENCE.tahiyyat.collection}:${MASJID_EVIDENCE.tahiyyat.number}`;
const LOOK_AHEAD_MIN = 12 * 60;

/**
 * Tahiyyat al-masjid hint for the rawatib hub (NF-3.11 hook, `/rawatib#tahiyyat`).
 * The evidence (Bukhari 444) is rendered by reference; the schools' difference
 * on the disliked times / Friday khutbah is shown via `MadhhabNote`
 * (`masjid.tahiyyat`, docs/proofs/masjid-finder.md §2.3). With home-masjid
 * iqamah times, a gentle line names the next iqamah — never a nudge or a score.
 */
export function TahiyyatHint() {
  const { t } = useTranslation();
  const now = useNow();
  const home = useHomeMasjid();
  const timetable = useHomeIqamahTimetable();
  const location = useLocation();
  const { timeFormat } = usePreferences();

  useEffect(() => {
    if (home) void ensureHomeMasjidLoaded().catch(() => undefined);
  }, [home]);

  const next = nextIqamah(timetable, now, location.timeZone, LOOK_AHEAD_MIN);

  return (
    <View style={styles.stack}>
      <Card padding="four">
        <SectionHeader
          title={t("masjidLog.tahiyyatTitle")}
          icon={{ ios: "building.columns.fill", android: "mosque", web: "mosque" }}
        />
        <View style={styles.body}>
          <ThemedText type="small">{t("masjidLog.tahiyyatBody")}</ThemedText>
          {next ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("masjidLog.tahiyyatNextIqamah", {
                prayer: t(`prayers.${next.prayer}`),
                time: formatPrayerTime(next.at, timeFormat, location.timeZone),
              })}
            </ThemedText>
          ) : null}
          <HadithExcerptCard hadithId={TAHIYYAT_HADITH} />
        </View>
      </Card>
      <MadhhabNote id="masjid.tahiyyat" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  body: { gap: Spacing.two + 2, marginTop: Spacing.three },
});
