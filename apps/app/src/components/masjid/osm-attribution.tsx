import { OSM_COPYRIGHT_URL } from "@munib-tracker/shared/masjid";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

/**
 * ODbL attribution, shown on every masjid list and detail screen (plan D5):
 * "© OpenStreetMap contributors", linking to openstreetmap.org/copyright.
 */
export function OsmAttribution() {
  const { t } = useTranslation();
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={t("masjids.attributionA11y")}
      onPress={() => void Linking.openURL(OSM_COPYRIGHT_URL)}
      style={styles.root}
      testID="osm-attribution"
    >
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("masjids.attribution")}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { paddingVertical: Spacing.two, alignSelf: "flex-start" },
});
