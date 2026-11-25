import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { LiveActivityDiscoveryBanner } from "@/components/notifications/live-activity-discovery-banner";
import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { Callout } from "@/components/ui/callout";
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
        // Same notice pattern as the permission banner above: title, body, one action.
        <Callout
          tone="warning"
          title={t("notif.defaultLocationTitle")}
          action={{
            label: t("location.setLocation"),
            onPress: () => router.push(settingHref("prayer-times.location") as Href),
          }}
        >
          {t("notif.defaultLocationMessage")}
        </Callout>
      ) : null}
      {native ? <LiveActivityDiscoveryBanner /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
});
