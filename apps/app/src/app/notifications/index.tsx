import { type Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
import { listScheduled, rescheduleAll } from "@/notifications/scheduler";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { locationStore, useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

type Scheduled = Awaited<ReturnType<typeof listScheduled>>;

const PAGE_SIZE = 10;

function mapInboxItems(inbox: ReturnType<typeof useInAppNotifications>["items"]): NotificationListItem[] {
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

function mapScheduledItems(scheduled: Scheduled): NotificationListItem[] {
  return scheduled.map((item) => ({
    id: `scheduled:${item.id}`,
    title: item.title,
    body: item.body,
    at: item.fireAt,
    readAt: null,
    reminderKey: extractReminderKey(`scheduled:${item.id}`),
    route: item.route,
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
  const [scheduled, setScheduled] = useState<Scheduled>([]);
  const [upcomingVisibleCount, setUpcomingVisibleCount] = useState(PAGE_SIZE);

  const reload = useCallback(async () => {
    setScheduled(await listScheduled(prefs, locationStore.getState().location));
    setUpcomingVisibleCount(PAGE_SIZE);
  }, [prefs]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

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
    await reload();
  };

  const delivered = useMemo(() => mapInboxItems(items), [items]);
  const upcoming = useMemo(() => mapScheduledItems(scheduled), [scheduled]);
  const formatWhen = (iso: string) =>
    formatDisplayDateTime(new Date(iso), prefs.timeFormat, prefs.locale, location.timeZone);

  const renderRows = (rows: NotificationListItem[]) =>
    rows.map((item) => (
      <NotificationListRow
        key={item.id}
        item={item}
        formattedWhen={formatWhen(item.at)}
        onPress={
          item.inboxId
            ? () => void open(item.inboxId as string)
            : item.route
              ? () => router.push(item.route as Href)
              : undefined
        }
      />
    ));

  return (
    <ScreenLayout
      eyebrow={t("notifCenter.eyebrow")}
      title={t("settings.notifications")}
      subtitle={t("notifCenter.subtitle")}
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

          {delivered.length === 0 && upcoming.length === 0 ? (
            <EmptyState
              icon={{ ios: "bell.slash", android: "notifications_off", web: "notifications_off" }}
              title={t("notifCenter.emptyTitle")}
              description={t("notifCenter.emptyDesc")}
            />
          ) : (
            <View style={styles.list}>
              {delivered.length > 0 ? (
                <>
                  <ThemedText type="smallBold">{t("notifCenter.delivered")}</ThemedText>
                  {renderRows(delivered)}
                </>
              ) : null}

              {upcoming.length > 0 ? (
                <>
                  <ThemedText type="smallBold" style={styles.sectionTitle}>
                    {t("notifCenter.scheduled")}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("notifCenter.scheduledHint")}
                  </ThemedText>
                  {renderRows(upcoming.slice(0, upcomingVisibleCount))}
                </>
              ) : null}

              {upcomingVisibleCount < upcoming.length ? (
                <Button
                  label={t("notifCenter.loadMore")}
                  variant="secondary"
                  fullWidth
                  onPress={() => setUpcomingVisibleCount((count) => count + PAGE_SIZE)}
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
  sectionTitle: {
    marginTop: Spacing.two,
  },
});
