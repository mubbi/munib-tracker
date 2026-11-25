import {
  attributionCreditsGeoapify,
  GEOAPIFY_PROVIDER,
  GEOAPIFY_URL,
  OSM_COPYRIGHT_URL,
} from "@munib-tracker/shared/masjid";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { openExternalLink } from "@/lib/open-external-link";

type OsmAttributionProps = {
  /** The response's `attribution` lines; a Geoapify line adds its required credit. */
  attribution?: readonly string[];
};

/**
 * ODbL attribution, shown on every masjid list and detail screen (plan D5):
 * "© OpenStreetMap contributors", linking to openstreetmap.org/copyright —
 * plus "Powered by Geoapify" when the API says Geoapify served the data (its
 * free plan requires the credit).
 */
export function OsmAttribution({ attribution }: OsmAttributionProps = {}) {
  const { t } = useTranslation();
  const poweredBy = attributionCreditsGeoapify(attribution);
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={t("masjids.attributionA11y")}
        onPress={() => void openExternalLink(OSM_COPYRIGHT_URL)}
        style={styles.link}
        testID="osm-attribution"
      >
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("masjids.attribution")}
        </ThemedText>
      </Pressable>
      {poweredBy ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => void openExternalLink(GEOAPIFY_URL)}
          style={styles.link}
          testID="geoapify-attribution"
        >
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("masjids.poweredBy", { provider: GEOAPIFY_PROVIDER })}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", columnGap: Spacing.three },
  link: { paddingVertical: Spacing.two, alignSelf: "flex-start" },
});
