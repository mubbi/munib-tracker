import { OBLIGATORY_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { NotificationPreferences, PrayerId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow, ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { adhanTrack } from "@/lib/adhan-audio";
import { isWeb } from "@/lib/notifications/platform";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { rescheduleAll } from "@/notifications/scheduler";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useToast } from "@/providers/toast-provider";
import { locationStore } from "@/stores/location-store";
import {
  preferencesStore,
  usePreferences,
  usePreferencesActions,
} from "@/stores/preferences-store";

type ToggleKey = keyof Omit<NotificationPreferences, "masterEnabled">;

const GROUPS: { titleKey: string; items: ToggleKey[] }[] = [
  { titleKey: "groupWorship", items: ["prayer", "sunnahPrayer", "qaza", "afterAzan"] },
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
  const { setNotificationPrefs, setPrayerAlert } = usePreferencesActions();
  const audio = useAudioPlayerContext();
  const toast = useToast();
  const { requestPermission, canEnableLocalReminders } = useNotificationPermissions();
  const master = prefs.notificationPrefs.masterEnabled;
  const obligatoryEnabled = master && prefs.notificationPrefs.prayer;
  const sunnahEnabled = master && prefs.notificationPrefs.sunnahPrayer;

  const enableMaster = async () => {
    if (isWeb) {
      await setNotificationPrefs({ masterEnabled: true });
      await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
      return;
    }

    if (!canEnableLocalReminders) {
      toast.info(t("notif.expoGoTitle"), t("notif.expoGoMessage"));
      return;
    }

    const result = await requestPermission();
    if (!result.granted) {
      if (result.reason === "permission_denied") {
        toast.warning(t("notif.permissionDenied"), t("notif.openSettingsHint"));
      } else if (result.reason === "unsupported") {
        toast.info(t("notif.unsupportedTitle"), t("notifCenter.webNote"));
      } else {
        toast.info(t("notif.permissionDismissed"));
      }
      return;
    }

    await setNotificationPrefs({ masterEnabled: true });
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
  };

  const onPrayerAlertChange = async (prayerId: PrayerId, value: boolean) => {
    await setPrayerAlert(prayerId, value);
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
  };

  return (
    <ScreenLayout
      eyebrow={t("notif.eyebrow")}
      title={t("settings.notifications")}
      subtitle={t("notif.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/settings/notifications" />
      <Stagger>
        <NotificationPermissionBanner />

        <Card padding="three">
          <ToggleRow
            icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
            title={t("notif.master")}
            subtitle={t("notif.masterSub")}
            value={master}
            onValueChange={async (value) => {
              if (value) {
                await enableMaster();
                return;
              }
              await setNotificationPrefs({ masterEnabled: false });
            }}
          />
        </Card>

        <Card padding="three">
          <SettingsRow
            icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
            title={t("notif.adhanTitle")}
            subtitle={t("notif.adhanSub")}
            onPress={() => audio.play([adhanTrack()], 0, { sourceHref: "/settings/notifications" })}
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

        <Card padding="three">
          <SectionHeader
            title={t("notif.prayerAlertsObligatory")}
            icon={{ ios: "moon.stars.fill", android: "mosque", web: "mosque" }}
          />
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId) => (
              <ToggleRow
                key={prayerId}
                title={t(`prayers.${prayerId}`)}
                subtitle={t(`notif.prayerAlertItems.${prayerId}.subtitle`)}
                value={isPrayerAlertEnabled(prefs, prayerId)}
                disabled={!obligatoryEnabled}
                onValueChange={(value) => void onPrayerAlertChange(prayerId, value)}
              />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("notif.prayerAlertsSunnah")}
            icon={{ ios: "moon.stars", android: "nights_stay", web: "nights_stay" }}
          />
          <View style={styles.rows}>
            {[WITR_PRAYER, ...SUNNAH_ALERTABLE_PRAYERS].map((prayerId) => (
              <ToggleRow
                key={prayerId}
                title={t(`prayers.${prayerId}`)}
                subtitle={t(`notif.prayerAlertItems.${prayerId}.subtitle`)}
                value={isPrayerAlertEnabled(prefs, prayerId)}
                disabled={!sunnahEnabled}
                onValueChange={(value) => void onPrayerAlertChange(prayerId, value)}
              />
            ))}
          </View>
        </Card>

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
