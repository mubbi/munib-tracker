import { type MasjidSummary, masjidDisplayName } from "@munib-tracker/shared/masjid";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MasjidBadges, MasjidJumuahLine } from "@/components/masjid/masjid-badges";
import { useMasjidFormat } from "@/components/masjid/use-masjid-format";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";

export type MasjidRowItem = MasjidSummary & { distanceMeters: number };

type MasjidRowProps = {
  masjid: MasjidRowItem;
  isHome: boolean;
  readOnly: boolean;
  /** Each handler gets this row's masjid, so the list can pass one stable callback. */
  onOpen: (masjid: MasjidRowItem) => void;
  onDirections: (masjid: MasjidRowItem) => void;
  onSetHome: (masjid: MasjidRowItem) => void;
};

/**
 * One list row: name + distance always; Jumu'ah and badges only when OSM has
 * them. Actions are hidden in read-only mode (TV). The open target and the
 * action buttons are siblings — RN Web renders every pressable as a <button>,
 * and a button nested in a button is invalid HTML with broken clicks.
 * Memoised: "Show more" grows the list without re-rendering the rows above.
 */
export const MasjidRow = memo(function MasjidRow({
  masjid,
  isHome,
  readOnly,
  onOpen,
  onDirections,
  onSetHome,
}: MasjidRowProps) {
  const { t, i18n } = useTranslation();
  const format = useMasjidFormat();
  const name = masjidDisplayName(masjid, i18n.language) ?? t("masjids.unnamed");
  const distance = format.distance(masjid.distanceMeters);

  return (
    <Card style={styles.stack}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={t("masjids.rowA11y", { name, distance })}
        scaleTo={0.985}
        haptic="light"
        onPress={() => onOpen(masjid)}
        style={styles.stack}
      >
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
      </PressableScale>
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
            onPress={() => onDirections(masjid)}
          />
          {isHome ? null : (
            <Button
              size="sm"
              variant="ghost"
              label={t("masjids.setHome")}
              onPress={() => onSetHome(masjid)}
            />
          )}
        </View>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  header: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  flex: { flex: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
