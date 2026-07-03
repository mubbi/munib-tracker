import { APP_NAME } from "@munib-tracker/shared/constants";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { usePreferences } from "@/stores/preferences-store";

const LOCALE_LABELS: Record<string, string> = { en: "English", ar: "العربية", ur: "اردو" };

export default function SettingsScreen() {
  const router = useRouter();
  const prefs = usePreferences();

  return (
    <ScreenLayout eyebrow="Personalize" title="Settings" subtitle="Appearance & preferences">
      <Stagger>
        <Card padding="three">
          <View style={styles.group}>
            <SettingsRow
              icon={{ ios: "paintpalette.fill", android: "palette", web: "palette" }}
              title="Appearance"
              subtitle="Theme & accent color"
              onPress={() => router.push("/settings/appearance")}
            />
            <SettingsRow
              icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
              title="Notifications"
              subtitle="Reminders for prayer, qaza, and zikr"
              value={prefs.notificationPrefs.masterEnabled ? "On" : "Off"}
              onPress={() => router.push("/settings/notifications")}
            />
            <SettingsRow
              icon={{ ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" }}
              title="Bedtime"
              subtitle="Used for before-sleep adhkar"
              value={prefs.bedtime}
              onPress={() => router.push("/settings/bedtime")}
            />
            <SettingsRow
              icon={{ ios: "textformat.size", android: "format_size", web: "format_size" }}
              title="Fonts"
              subtitle="Arabic & translation text size"
              onPress={() => router.push("/settings/fonts")}
            />
            <SettingsRow
              icon={{ ios: "globe", android: "language", web: "language" }}
              title="Language"
              subtitle="App & translation language"
              value={LOCALE_LABELS[prefs.locale]}
              onPress={() => router.push("/settings/language")}
            />
          </View>
        </Card>

        <Card padding="three">
          <View style={styles.group}>
            <SettingsRow
              icon={{ ios: "info.circle.fill", android: "info", web: "info" }}
              title="About"
              subtitle="Version, credits, and policies"
              onPress={() => router.push("/settings/about")}
            />
          </View>
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {APP_NAME} · built with intention
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: Spacing.two,
  },
  footer: {
    textAlign: "center",
    marginTop: Spacing.two,
  },
});
