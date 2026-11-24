import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { LiveActivityDiscoveryBanner } from "@/components/notifications/live-activity-discovery-banner";
import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";
import { settingHref } from "@/lib/settings/routes";
import { useLocation } from "@/stores/location-store";

/** Permission status + "set your location first" + Live Activity tip (not settings). */
export function NotificationsGroupHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const location = useLocation();
  const native = (Platform.OS === "ios" || Platform.OS === "android") && !isTV();
  return (
    <View style={styles.stack}>
      <NotificationPermissionBanner />
      {location.source === "default" ? (
        <Card padding="three" style={styles.card}>
          <ThemedText type="smallBold">{t("notif.defaultLocationTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("notif.defaultLocationMessage")}
          </ThemedText>
          <Button
            label={t("location.setLocation")}
            variant="secondary"
            onPress={() => router.push(settingHref("prayer-times.location") as Href)}
          />
        </Card>
      ) : null}
      {native ? <LiveActivityDiscoveryBanner /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  card: { gap: Spacing.three },
});
