import type { MasjidBadge } from "@munib-tracker/shared/masjid";
import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { Spacing } from "@/constants/theme";

const BADGE_ICONS: Record<MasjidBadge, SymbolViewProps["name"]> = {
  wheelchair: { ios: "figure.roll", android: "accessible", web: "accessible" },
  toilets: { ios: "drop.fill", android: "wc", web: "wc" },
  toilets_wheelchair: { ios: "figure.roll", android: "accessible", web: "accessible" },
};

/** Facility badges — renders nothing when OSM has no badge data. */
export function MasjidBadges({ badges }: { badges?: MasjidBadge[] }) {
  const { t } = useTranslation();
  if (!badges || badges.length === 0) return null;
  return (
    <View style={styles.row} testID="masjid-badges">
      {badges.map((badge) => (
        <Pill key={badge} compact icon={BADGE_ICONS[badge]} label={t(`masjids.badge.${badge}`)} />
      ))}
    </View>
  );
}

/** "Jumu'ah (from OpenStreetMap)" line — renders nothing without parsed times. */
export function MasjidJumuahLine({
  times,
  format,
}: {
  times?: string[];
  format: (hhmm: string) => string;
}) {
  const { t } = useTranslation();
  if (!times || times.length === 0) return null;
  return (
    <ThemedText type="small" testID="masjid-jumuah">
      {t("masjids.jumuahFromOsm", { times: times.map(format).join(" · ") })}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
});
