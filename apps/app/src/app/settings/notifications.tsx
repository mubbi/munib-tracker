import type { NotificationPreferences } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { requestPermission } from "@/notifications/scheduler";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

type ToggleKey = keyof Omit<NotificationPreferences, "masterEnabled">;

const GROUPS: { titleKey: string; items: ToggleKey[] }[] = [
  { titleKey: "groupWorship", items: ["prayer", "qaza", "afterAzan"] },
  {
    titleKey: "groupZikr",
    items: ["morningZikr", "eveningZikr", "beforeSleep", "beforePrayer", "afterPrayer"],
  },
  { titleKey: "groupMilestones", items: ["achievements"] },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { setNotificationPrefs } = usePreferencesActions();
  const master = prefs.notificationPrefs.masterEnabled;

  return (
    <ScreenLayout
      eyebrow={t("notif.eyebrow")}
      title={t("settings.notifications")}
      subtitle={t("notif.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <ToggleRow
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
            title={t("notif.master")}
            subtitle={t("notif.masterSub")}
            value={master}
            onValueChange={async (value) => {
              if (value) await requestPermission();
              await setNotificationPrefs({ masterEnabled: value });
            }}
          />
        </Card>

        {GROUPS.map((group) => (
          <Card key={group.titleKey} padding="three">
            <SectionHeader
              title={t(`notif.${group.titleKey}`)}
              icon={{
                ios: "bell.badge.fill",
                android: "notifications_active",
                web: "notifications_active",
              }}
            />
            <View style={styles.rows}>
              {group.items.map((key) => (
                <ToggleRow
                  key={key}
                  title={t(`notif.items.${key}.title`)}
                  subtitle={t(`notif.items.${key}.subtitle`)}
                  value={prefs.notificationPrefs[key]}
                  disabled={!master}
                  onValueChange={(value) => setNotificationPrefs({ [key]: value })}
                />
              ))}
            </View>
          </Card>
        ))}

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("notif.footer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  footer: {
    textAlign: "center",
  },
});
