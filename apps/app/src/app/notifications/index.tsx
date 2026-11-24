import { useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
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
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { localizeCircleInboxItem } from "@/lib/circles/inbox";
import { goBackOrReplace } from "@/lib/navigation";
import { extractReminderKey } from "@/lib/notifications/notification-visuals";
import { isLocalNotificationSupported, isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { enableNotifications } from "@/lib/settings/actions";
import { formatDisplayDateTime } from "@/lib/time";
import { useAuth } from "@/providers/auth-provider";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

const PAGE_SIZE = 10;
/** Wide web / tablets: keep inbox rows at a readable measure (≈ 80–90 chars). */
const INBOX_MAX_WIDTH = 880;

function mapInboxItems(
  inbox: ReturnType<typeof useInAppNotifications>["items"],
  t: TFunction,
): NotificationListItem[] {
  return inbox.map((raw) => {
    // NF-3.16–3.18: circle events are localized by `routeData.event`.
    const item = localizeCircleInboxItem(raw, t);
    return {
      id: `inbox:${item.id}`,
      title: item.title,
      body: item.body,
      at: item.createdAt,
      readAt: item.readAt,
      inboxId: item.id,
      kind: item.kind,
      reminderKey: extractReminderKey(`inbox:${item.id}`, item.id),
    };
  });
}

export default function NotificationCenterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const location = useLocation();
  const toast = useToast();
  const { session, isAuthenticated } = useAuth();
  const { items, unreadCount, open, markAllRead, clearAll } = useInAppNotifications();
  const { refresh: refreshPermission, granted } = useNotificationPermissions();
  const { isWide, isTv } = useLargeScreenLayout();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [confirmClear, setConfirmClear] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const handleMarkAllRead = async () => {
    if (markingAllRead) return;
    setMarkingAllRead(true);
    try {
      await markAllRead();
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleClearAll = async () => {
    await clearAll();
    setVisibleCount(PAGE_SIZE);
    toast.success(t("notifCenter.cleared"));
  };

  const enable = async () => {
    if (isTV() || !isLocalNotificationSupported()) {
      toast.info(t("common.tvUnavailableTitle"), t("notif.tvUnavailableBody"));
      return;
    }
    const webGesture = isWeb ? beginWebNotificationPermissionRequest() : null;
    // Shared path: permission → master switch → reschedule → push token.
    const result = await enableNotifications({
      webPermissionRequest: webGesture,
      accessToken: isAuthenticated ? session?.accessToken : undefined,
    });
    await refreshPermission();
    if (!result.granted && result.reason === "permission_denied") {
      toast.warning(t("notif.permissionDenied"), t("notif.openSettingsHint"));
    }
  };

  const delivered = useMemo(() => mapInboxItems(items, t), [items, t]);
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
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={isWide && !isTv ? INBOX_MAX_WIDTH : undefined}
    >
      <Seo path="/notifications" />
      <Stagger>
        {!isTV() ? <NotificationPermissionBanner showWhenGranted={isWeb} /> : null}

        {!isTV() && !isWeb && !granted ? (
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
            markingAllRead={markingAllRead}
            onMarkAllRead={
              unreadCount > 0 || markingAllRead ? () => void handleMarkAllRead() : undefined
            }
            onClearAll={delivered.length > 0 ? () => setConfirmClear(true) : undefined}
            // TV: no local reminders — the settings screen would only be an empty state.
            onOpenSettings={isTV() ? undefined : () => router.push("/settings/notifications")}
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

      <ConfirmDialog
        visible={confirmClear}
        title={t("notifCenter.confirmClearAllTitle")}
        message={t("notifCenter.confirmClearAllMessage")}
        confirmLabel={t("notifCenter.clearAll")}
        destructive
        onConfirm={() => void handleClearAll()}
        onClose={() => setConfirmClear(false)}
      />
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/notifications");
