import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  getPermissionStatus,
  listScheduled,
  requestPermission,
  rescheduleAll,
} from "@/notifications/scheduler";
import { usePreferences } from "@/stores/preferences-store";

type Scheduled = Awaited<ReturnType<typeof listScheduled>>;

export default function NotificationCenterScreen() {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const prefs = usePreferences();
  const [scheduled, setScheduled] = useState<Scheduled>([]);
  const [permission, setPermission] = useState<"granted" | "denied" | "undetermined">(
    "undetermined",
  );

  const reload = useCallback(async () => {
    setPermission(await getPermissionStatus());
    setScheduled(await listScheduled());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const enable = async () => {
    const granted = await requestPermission();
    if (granted) await rescheduleAll(prefs);
    await reload();
  };

  const isWeb = Platform.OS === "web";
  const sorted = [...scheduled].sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));

  return (
    <ScreenLayout
      eyebrow="Reminders"
      title="Notifications"
      subtitle="Your scheduled reminders"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        {isWeb ? (
          <Card variant="muted" padding="three">
            <ThemedText type="small" themeColor="mutedForeground">
              Scheduled reminders run on iOS and Android. On the web, use the app on your phone to
              receive prayer, zikr, and qaza reminders.
            </ThemedText>
          </Card>
        ) : permission !== "granted" ? (
          <Card padding="three" style={styles.permission}>
            <View style={[styles.icon, { backgroundColor: tokens.status.warning.soft }]}>
              <SymbolView
                name={{
                  ios: "bell.badge.fill",
                  android: "notifications_active",
                  web: "notifications_active",
                }}
                size={22}
                tintColor={tokens.status.warning.color}
              />
            </View>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.permissionText}>
              Turn on notifications to receive reminders for prayer, zikr, and qaza.
            </ThemedText>
            <Button label="Enable notifications" onPress={() => void enable()} />
          </Card>
        ) : null}

        <Card padding="three">
          <SectionHeader
            title="Scheduled"
            icon={{ ios: "clock.fill", android: "schedule", web: "schedule" }}
            actionLabel="Settings"
            onActionPress={() => router.push("/settings/notifications")}
          />
          {sorted.length === 0 ? (
            <EmptyState
              icon={{ ios: "bell.slash", android: "notifications_off", web: "notifications_off" }}
              title="No reminders scheduled"
              description="Enable categories in notification settings to see them here."
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
    gap: Spacing.three,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionText: {
    textAlign: "center",
  },
  list: {
    gap: Spacing.two,
    marginTop: Spacing.three,
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
