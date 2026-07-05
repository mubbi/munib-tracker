import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  type NotificationListItem,
  NotificationListRow,
} from "@/components/notifications/notification-list-row";
import { NotificationToolbar } from "@/components/notifications/notification-toolbar";
import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { extractReminderKey } from "@/lib/notifications/notification-visuals";
import { isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import { formatDisplayDateTime } from "@/lib/time";
import { rescheduleAll } from "@/notifications/scheduler";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { locationStore, useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

const PAGE_SIZE = 10;

function mapInboxItems(
  inbox: ReturnType<typeof useInAppNotifications>["items"],
): NotificationListItem[] {
  return inbox.map((item) => ({
    id: `inbox:${item.id}`,
    title: item.title,
    body: item.body,
    at: item.createdAt,
    readAt: item.readAt,
    inboxId: item.id,
    kind: item.kind,
    reminderKey: extractReminderKey(`inbox:${item.id}`, item.id),
  }));
}

export default function NotificationCenterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const location = useLocation();
  const toast = useToast();
  const { items, unreadCount, open, markAllRead } = useInAppNotifications();
  const { requestPermission, granted } = useNotificationPermissions();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const enable = async () => {
    const webGesture = isWeb ? beginWebNotificationPermissionRequest() : null;
    const result = await requestPermission({ webPermissionRequest: webGesture });
    if (!result.granted) {
      if (result.reason === "permission_denied") {
        toast.warning(t("notif.permissionDenied"), t("notif.openSettingsHint"));
      }
      return;
    }
    await rescheduleAll(prefs, locationStore.getState().location);
  };

  const delivered = useMemo(() => mapInboxItems(items), [items]);
  const visible = delivered.slice(0, visibleCount);
  const formatWhen = (iso: string) =>
    formatDisplayDateTime(
      new Date(iso),
      prefs.timeFormat,
      prefs.locale,
      location.timeZone,
      prefs.defaultCalendar,
    );

  return (
    <ScreenLayout
      eyebrow={t("notifCenter.eyebrow")}
      title={t("settings.notifications")}
      subtitle={t("notifCenter.inboxSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/notifications" />
      <Stagger>
        <NotificationPermissionBanner showWhenGranted={isWeb} />

        {!isWeb && !granted ? (
          <Card padding="three" style={styles.permission}>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.permissionText}>
              {t("notifCenter.permissionText")}
            </ThemedText>
            <ThemedText
              type="smallBold"
              themeColor="accent"
              onPress={() => void enable()}
              accessibilityRole="button"
            >
              {t("notifCenter.enable")}
            </ThemedText>
          </Card>
        ) : null}

        <Card padding="three">
          <NotificationToolbar
            unreadCount={unreadCount}
            onMarkAllRead={unreadCount > 0 ? () => void markAllRead() : undefined}
            onOpenSettings={() => router.push("/settings/notifications")}
          />

          {delivered.length === 0 ? (
            <EmptyState
              icon={{ ios: "bell.slash", android: "notifications_off", web: "notifications_off" }}
              title={t("notifCenter.inboxEmptyTitle")}
              description={t("notifCenter.inboxEmptyDesc")}
            />
          ) : (
            <View style={styles.list}>
              {visible.map((item) => (
                <NotificationListRow
                  key={item.id}
                  item={item}
                  formattedWhen={formatWhen(item.at)}
                  onPress={item.inboxId ? () => void open(item.inboxId as string) : undefined}
                />
              ))}
              {visibleCount < delivered.length ? (
                <Button
                  label={t("notifCenter.loadMore")}
                  variant="secondary"
                  fullWidth
                  onPress={() => setVisibleCount((count) => count + PAGE_SIZE)}
                />
              ) : null}
            </View>
          )}
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  permission: {
    alignItems: "center",
    gap: Spacing.two,
  },
  permissionText: {
    textAlign: "center",
  },
  list: {
    gap: Spacing.two,
  },
});
