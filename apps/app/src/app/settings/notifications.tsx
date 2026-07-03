import type { NotificationPreferences } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

type ToggleKey = keyof Omit<NotificationPreferences, "masterEnabled">;

const GROUPS: { title: string; items: { key: ToggleKey; title: string; subtitle: string }[] }[] = [
  {
    title: "Worship",
    items: [
      { key: "prayer", title: "Prayer reminders", subtitle: "Nudges around each prayer time" },
      { key: "qaza", title: "Qaza reminders", subtitle: "Stay on pace with make-up prayers" },
      { key: "afterAzan", title: "After azan", subtitle: "Post-adhan supplication" },
    ],
  },
  {
    title: "Zikr",
    items: [
      { key: "morningZikr", title: "Morning adhkar", subtitle: "Start the day in remembrance" },
      { key: "eveningZikr", title: "Evening adhkar", subtitle: "Wind down with dhikr" },
      { key: "beforeSleep", title: "Before sleep", subtitle: "Uses your bedtime" },
      { key: "beforePrayer", title: "Before prayer", subtitle: "Prepare your heart" },
      { key: "afterPrayer", title: "After prayer", subtitle: "Tasbih reminders" },
    ],
  },
  {
    title: "Milestones",
    items: [
      { key: "achievements", title: "Achievements", subtitle: "Celebrate streaks and badges" },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const prefs = usePreferences();
  const { setNotificationPrefs } = usePreferencesActions();
  const master = prefs.notificationPrefs.masterEnabled;

  return (
    <ScreenLayout
      eyebrow="Settings"
      title="Notifications"
      subtitle="Choose what you'd like to be reminded about"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <ToggleRow
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
            title="All notifications"
            subtitle="Master switch for every reminder"
            value={master}
            onValueChange={(value) => setNotificationPrefs({ masterEnabled: value })}
          />
        </Card>

        {GROUPS.map((group) => (
          <Card key={group.title} padding="three">
            <SectionHeader
              title={group.title}
              icon={{
                ios: "bell.badge.fill",
                android: "notifications_active",
                web: "notifications_active",
              }}
            />
            <View style={styles.rows}>
              {group.items.map((item) => (
                <ToggleRow
                  key={item.key}
                  title={item.title}
                  subtitle={item.subtitle}
                  value={prefs.notificationPrefs[item.key]}
                  disabled={!master}
                  onValueChange={(value) => setNotificationPrefs({ [item.key]: value })}
                />
              ))}
            </View>
          </Card>
        ))}

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          Delivery of these reminders is scheduled once notifications are enabled on your device.
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
