import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import { listScheduled, rescheduleAll } from "@/notifications/scheduler";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useToast } from "@/providers/toast-provider";
import { locationStore } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

type Scheduled = Awaited<ReturnType<typeof listScheduled>>;

export default function NotificationCenterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const prefs = usePreferences();
  const toast = useToast();
  const { items, unreadCount, open, markAllRead } = useInAppNotifications();
  const { requestPermission, granted } = useNotificationPermissions();
  const [scheduled, setScheduled] = useState<Scheduled>([]);

  const reload = useCallback(async () => {
    setScheduled(await listScheduled(prefs, locationStore.getState().location));
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

  const sorted = [...scheduled].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
  const inbox = items.slice(0, 20);

  return (
    <ScreenLayout
      eyebrow={t("notifCenter.eyebrow")}
      title={t("settings.notifications")}
      subtitle={t("notifCenter.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
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
          <SectionHeader
            title={t("notifCenter.inbox")}
            icon={{ ios: "tray.fill", android: "inbox", web: "inbox" }}
            actionLabel={unreadCount > 0 ? t("notifCenter.markAllRead") : undefined}
            onActionPress={unreadCount > 0 ? () => void markAllRead() : undefined}
          />
          {inbox.length === 0 ? (
            <EmptyState
              icon={{ ios: "tray", android: "inbox", web: "inbox" }}
              title={t("notifCenter.inboxEmptyTitle")}
              description={t("notifCenter.inboxEmptyDesc")}
            />
          ) : (
            <View style={styles.list}>
              {inbox.map((item) => (
                <PressableScale
                  key={item.id}
                  onPress={() => void open(item.id)}
                  style={[
                    styles.inboxRow,
                    {
                      backgroundColor: item.readAt ? colors.muted : tokens.accentSoft,
                    },
                  ]}
                >
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
                    {item.body}
                  </ThemedText>
                </PressableScale>
              ))}
            </View>
          )}
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("notifCenter.scheduled")}
            icon={{ ios: "clock.fill", android: "schedule", web: "schedule" }}
            actionLabel={t("notifCenter.settings")}
            onActionPress={() => router.push("/settings/notifications")}
          />
          {sorted.length === 0 ? (
            <EmptyState
              icon={{ ios: "bell.slash", android: "notifications_off", web: "notifications_off" }}
              title={t("notifCenter.emptyTitle")}
              description={t("notifCenter.emptyDesc")}
            />
          ) : (
            <View style={styles.list}>
              {sorted.map((item) => (
                <View key={item.id} style={[styles.row, { backgroundColor: colors.muted }]}>
                  <View style={[styles.time, { backgroundColor: tokens.accentSoft }]}>
                    <ThemedText type="smallBold" style={{ color: colors.accent }}>
                      {item.time ?? "—"}
                    </ThemedText>
                  </View>
                  <View style={styles.rowBody}>
                    <ThemedText type="small">{item.title}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                      {item.body}
                    </ThemedText>
                  </View>
                </View>
              ))}
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
    marginTop: Spacing.three,
  },
  inboxRow: {
    gap: 2,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  time: {
    minWidth: 54,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
});
