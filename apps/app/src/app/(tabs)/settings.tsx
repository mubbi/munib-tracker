import { APP_NAME } from "@munib-tracker/shared/constants";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { usePreferences } from "@/stores/preferences-store";

const LOCALE_LABELS: Record<string, string> = { en: "English", ar: "العربية", ur: "اردو" };

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { isGuest, user } = useAuth();

  return (
    <ScreenLayout
      eyebrow={t("settings.eyebrow")}
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.group}>
            <SettingsRow
              icon={{
                ios: "person.crop.circle.fill",
                android: "account_circle",
                web: "account_circle",
              }}
              title={t("settings.account")}
              subtitle={
                isGuest ? t("settings.accountGuest") : (user?.email ?? t("common.signedIn"))
              }
              onPress={() => router.push("/profile")}
            />
          </View>
        </Card>

        <Card padding="three">
          <View style={styles.group}>
            <SettingsRow
              icon={{ ios: "paintpalette.fill", android: "palette", web: "palette" }}
              title={t("settings.appearance")}
              subtitle={t("settings.appearanceSub")}
              onPress={() => router.push("/settings/appearance")}
            />
            <SettingsRow
              icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
              title={t("settings.notifications")}
              subtitle={t("settings.notificationsSub")}
              value={prefs.notificationPrefs.masterEnabled ? t("common.on") : t("common.off")}
              onPress={() => router.push("/settings/notifications")}
            />
            <SettingsRow
              icon={{ ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" }}
              title={t("settings.bedtime")}
              subtitle={t("settings.bedtimeSub")}
              value={prefs.bedtime}
              onPress={() => router.push("/settings/bedtime")}
            />
            <SettingsRow
              icon={{ ios: "textformat.size", android: "format_size", web: "format_size" }}
              title={t("settings.fonts")}
              subtitle={t("settings.fontsSub")}
              onPress={() => router.push("/settings/fonts")}
            />
            <SettingsRow
              icon={{ ios: "globe", android: "language", web: "language" }}
              title={t("settings.language")}
              subtitle={t("settings.languageSub")}
              value={LOCALE_LABELS[prefs.locale]}
              onPress={() => router.push("/settings/language")}
            />
          </View>
        </Card>

        <Card padding="three">
          <View style={styles.group}>
            <SettingsRow
              icon={{ ios: "trophy.fill", android: "emoji_events", web: "emoji_events" }}
              title={t("settings.achievements")}
              subtitle={t("settings.achievementsSub")}
              onPress={() => router.push("/achievements")}
            />
            <SettingsRow
              icon={{ ios: "safari.fill", android: "explore", web: "explore" }}
              title={t("settings.qibla")}
              subtitle={t("settings.qiblaSub")}
              onPress={() => router.push("/qibla")}
            />
            <SettingsRow
              icon={{ ios: "info.circle.fill", android: "info", web: "info" }}
              title={t("settings.about")}
              subtitle={t("settings.aboutSub")}
              onPress={() => router.push("/settings/about")}
            />
            <SettingsRow
              icon={{ ios: "text.badge.checkmark", android: "verified", web: "verified" }}
              title={t("credits.settingsLabel")}
              subtitle={t("credits.settingsSub")}
              onPress={() => router.push("/credits")}
            />
          </View>
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("settings.footer", { app: APP_NAME })}
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
