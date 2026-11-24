import { type MasjidSummary, masjidDisplayName } from "@munib-tracker/shared/masjid";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MasjidBadges, MasjidJumuahLine } from "@/components/masjid/masjid-badges";
import { useMasjidFormat } from "@/components/masjid/use-masjid-format";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Spacing } from "@/constants/theme";

export type MasjidRowItem = MasjidSummary & { distanceMeters: number };

/**
 * One list row: name + distance always; Jumu'ah and badges only when OSM has
 * them. Actions are hidden in read-only mode (TV).
 */
export function MasjidRow({
  masjid,
  isHome,
  readOnly,
  onOpen,
  onDirections,
  onSetHome,
}: {
  masjid: MasjidRowItem;
  isHome: boolean;
  readOnly: boolean;
  onOpen: () => void;
  onDirections: () => void;
  onSetHome: () => void;
}) {
  const { t, i18n } = useTranslation();
  const format = useMasjidFormat();
  const name = masjidDisplayName(masjid, i18n.language) ?? t("masjids.unnamed");
  const distance = format.distance(masjid.distanceMeters);

  return (
    <Card
      padding="three"
      onPress={onOpen}
      accessibilityLabel={t("masjids.rowA11y", { name, distance })}
    >
      <View style={styles.stack}>
        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.flex} numberOfLines={2}>
            {name}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {distance}
          </ThemedText>
        </View>
        {isHome ? (
          <Pill
            compact
            icon={{ ios: "house.fill", android: "home", web: "home" }}
            label={t("masjids.homeBadge")}
          />
        ) : null}
        <MasjidJumuahLine times={masjid.jumuah} format={format.time} />
        <MasjidBadges badges={masjid.badges} />
        {readOnly ? null : (
          <View style={styles.actions}>
            <Button
              size="sm"
              variant="secondary"
              icon={{
                ios: "arrow.triangle.turn.up.right.diamond.fill",
                android: "directions",
                web: "directions",
              }}
              label={t("masjids.directions")}
              accessibilityHint={t("masjids.directionsHint")}
              onPress={onDirections}
            />
            {isHome ? null : (
              <Button size="sm" variant="ghost" label={t("masjids.setHome")} onPress={onSetHome} />
            )}
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  header: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  flex: { flex: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
