import { APP_NAME } from "@munib-tracker/shared/constants";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { AppUpdateSection } from "@/components/app-update/app-update-section";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow, ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { usePinLock } from "@/features/pin-lock";
import { useFormatTime } from "@/hooks/use-time-format";
import { tTv } from "@/lib/i18n/t-tv";
import { APP_LOCALES } from "@/lib/locale-display";
import { isTV } from "@/lib/platform/is-tv";
import { useAuth } from "@/providers/auth-provider";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();
  const { formatStored } = useFormatTime();
  const tv = isTV();
  const isNative = (Platform.OS === "ios" || Platform.OS === "android") && !tv;
  const { isAuthenticated, user } = useAuth();
  const { isPinEnabled } = usePinLock();
  // A null/offline session isn't "guest" per the API, but the user still has no
  // linked account — treat them as a guest until they're a real authenticated user.
  const isGuest = !isAuthenticated;

  return (
    <ScreenLayout
      eyebrow={t("settings.eyebrow")}
      title={t("settings.title")}
      subtitle={tTv(t, "settings.subtitle", "settings.tvSubtitle")}
    >
      <Seo path="/settings" />
      <View style={styles.stack}>
        <AppUpdateSection />

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
            {isNative ? (
              <ToggleRow
                icon={{
                  ios: "iphone.radiowaves.left.and.right",
                  android: "vibration",
                  web: "vibration",
                }}
                title={t("settings.haptics")}
                subtitle={t("settings.hapticsSub")}
                value={prefs.hapticsEnabled}
                onValueChange={(enabled) => void update({ hapticsEnabled: enabled })}
              />
            ) : null}
            <ToggleRow
              icon={{ ios: "arrow.down.circle.fill", android: "download", web: "download" }}
              title={t("settings.cacheAudioLocally")}
              subtitle={t("settings.cacheAudioLocallySub")}
              value={prefs.cacheAudioLocally !== false}
              onValueChange={(enabled) => void update({ cacheAudioLocally: enabled })}
            />
            <ToggleRow
              icon={{ ios: "text.book.closed.fill", android: "menu_book", web: "menu_book" }}
              title={t("settings.cacheQuranEditionsLocally")}
              subtitle={t("settings.cacheQuranEditionsLocallySub")}
              value={prefs.cacheQuranEditionsLocally !== false}
              onValueChange={(enabled) => void update({ cacheQuranEditionsLocally: enabled })}
            />
            <ToggleRow
              icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
              title={t("settings.cacheHadithLocally")}
              subtitle={t("settings.cacheHadithLocallySub")}
              value={prefs.cacheHadithLocally !== false}
              onValueChange={(enabled) => void update({ cacheHadithLocally: enabled })}
            />
            <SettingsRow
              icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
              title={t("settings.notifications")}
              subtitle={t("settings.notificationsSub")}
              value={prefs.notificationPrefs.masterEnabled ? t("common.on") : t("common.off")}
              onPress={() => router.push("/settings/notifications")}
            />
            <SettingsRow
              icon={{ ios: "clock.fill", android: "schedule", web: "schedule" }}
              title={t("settings.timeFormat")}
              subtitle={t("settings.timeFormatSub")}
              value={
                prefs.timeFormat === "12" ? t("timeFormat.option12") : t("timeFormat.option24")
              }
              onPress={() => router.push("/settings/time-format")}
            />
            <SettingsRow
              icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
              title={t("prayerTuning.title")}
              subtitle={t("prayerTuning.settingsSub")}
              onPress={() => router.push("/settings/prayer-tuning")}
            />
            <SettingsRow
              icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
              title={t("settings.defaultCalendar")}
              subtitle={t("settings.defaultCalendarSub")}
              value={
                prefs.defaultCalendar === "hijri"
                  ? t("defaultCalendar.optionHijri")
                  : t("defaultCalendar.optionGregorian")
              }
              onPress={() => router.push("/settings/default-calendar")}
            />
            <SettingsRow
              icon={{ ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" }}
              title={t("settings.bedtime")}
              subtitle={t("settings.bedtimeSub")}
              value={formatStored(prefs.bedtime, { hour: 22, minute: 30 })}
              onPress={() => router.push("/settings/bedtime")}
            />
            <SettingsRow
              icon={{ ios: "textformat.size", android: "format_size", web: "format_size" }}
              title={t("settings.fonts")}
              subtitle={t("settings.fontsSub")}
              onPress={() => router.push("/settings/fonts")}
            />
            <SettingsRow
              icon={{ ios: "square.grid.2x2.fill", android: "dashboard", web: "dashboard" }}
              title={t("settings.homeCustomize")}
              subtitle={t("settings.homeCustomizeSub")}
              onPress={() => router.push("/settings/home")}
            />
            <SettingsRow
              icon={{
                ios: "cloud.sun.fill",
                android: "partly_cloudy_day",
                web: "partly_cloudy_day",
              }}
              title={t("settings.weather")}
              subtitle={t("settings.weatherSub")}
              value={
                prefs.weatherPrefs.effectsEnabled
                  ? prefs.weatherPrefs.unit === "celsius"
                    ? t("weather.unitCelsius")
                    : t("weather.unitFahrenheit")
                  : t("common.off")
              }
              onPress={() => router.push("/settings/weather")}
            />
            <SettingsRow
              icon={{ ios: "globe", android: "language", web: "language" }}
              title={t("settings.language")}
              subtitle={t("settings.languageSub")}
              value={APP_LOCALES.find((l) => l.code === prefs.locale)?.name ?? prefs.locale}
              onPress={() => router.push("/settings/language")}
            />
            {isNative ? (
              <SettingsRow
                icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
                title={t("settings.appLock")}
                subtitle={t("settings.appLockSub")}
                value={isPinEnabled ? t("common.on") : t("common.off")}
                onPress={() => router.push("/settings/app-lock" as Href)}
              />
            ) : null}
            {isNative ? (
              <SettingsRow
                icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
                title={t(
                  Platform.OS === "android"
                    ? "externalCommands.titleAndroid"
                    : "externalCommands.titleIos",
                )}
                subtitle={t(
                  Platform.OS === "android"
                    ? "externalCommands.settingsSubtitleAndroid"
                    : "externalCommands.settingsSubtitleIos",
                )}
                onPress={() => router.push("/settings/voice-shortcuts" as Href)}
              />
            ) : null}
          </View>
        </Card>

        <Card padding="three">
          <View style={styles.group}>
            <SettingsRow
              icon={{ ios: "flag.fill", android: "flag", web: "flag" }}
              title={t("contentReport.myReportsTitle")}
              subtitle={t("contentReport.myReportsNavSub")}
              onPress={() => router.push("/settings/my-reports")}
            />
            {!tv ? (
              <SettingsRow
                icon={{
                  ios: "square.and.arrow.down",
                  android: "file_upload",
                  web: "file_upload",
                }}
                title={t("settings.import")}
                subtitle={t("settings.importSub")}
                onPress={() => router.push("/settings/import")}
              />
            ) : null}
            {!tv ? (
              <SettingsRow
                icon={{
                  ios: "externaldrive.fill.badge.timemachine",
                  android: "backup",
                  web: "backup",
                }}
                title={t("settings.backup")}
                subtitle={t("settings.backupSub")}
                onPress={() => router.push("/settings/backup")}
              />
            ) : null}
            <SettingsRow
              icon={{ ios: "internaldrive.fill", android: "storage", web: "storage" }}
              title={t("settings.offlineData")}
              subtitle={t("settings.offlineDataSub")}
              onPress={() => router.push("/settings/offline-data")}
            />
            <SettingsRow
              icon={{ ios: "sparkles.tv.fill", android: "tour", web: "tour" }}
              title={t("tour.navRow")}
              subtitle={t("tour.navRowSub")}
              onPress={() => router.push("/tour" as Href)}
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
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.two,
  },
  footer: {
    textAlign: "center",
    marginTop: Spacing.two,
  },
});
