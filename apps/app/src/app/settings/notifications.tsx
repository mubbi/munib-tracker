import { OBLIGATORY_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { NotificationPreferences, PrayerId } from "@munib-tracker/shared/types";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { AdhanStylePicker } from "@/components/adhan/adhan-style-picker";
import { LiveActivityDiscoveryBanner } from "@/components/notifications/live-activity-discovery-banner";
import {
  type NotificationListItem,
  NotificationListRow,
} from "@/components/notifications/notification-list-row";
import { NotificationPermissionBanner } from "@/components/notifications/permission-banner";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow, ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useNotificationPermissions } from "@/hooks/use-notification-permissions";
import { ADHAN_STYLES, adhanTrack, DEFAULT_ADHAN_STYLE } from "@/lib/adhan-audio";
import { isLiveActivitySupported } from "@/lib/live-activity";
import { goBackOrReplace } from "@/lib/navigation";
import { extractReminderKey } from "@/lib/notifications/notification-visuals";
import { isWeb } from "@/lib/notifications/platform";
import { isTV } from "@/lib/platform/is-tv";
import { isPrayerAlertEnabled, SUNNAH_ALERTABLE_PRAYERS } from "@/lib/prayer-alerts";
import { formatDisplayDateTime } from "@/lib/time";
import { listScheduled, rescheduleAll } from "@/notifications/scheduler";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { useToast } from "@/providers/toast-provider";
import { locationStore, useLocation } from "@/stores/location-store";
import {
  preferencesStore,
  usePreferences,
  usePreferencesActions,
} from "@/stores/preferences-store";

type Scheduled = Awaited<ReturnType<typeof listScheduled>>;

const UPCOMING_PREVIEW_COUNT = 6;

type ToggleKey = keyof Omit<NotificationPreferences, "masterEnabled" | "reviewReactivationEnabled">;

const GROUPS: { titleKey: string; items: ToggleKey[] }[] = [
  { titleKey: "groupWorship", items: ["prayer", "sunnahPrayer", "qaza", "afterAzan"] },
  {
    titleKey: "groupZikr",
    items: ["morningZikr", "eveningZikr", "beforeSleep", "beforePrayer", "afterPrayer"],
  },
  { titleKey: "groupContent", items: ["dailyContent", "friday", "whiteDays"] },
  { titleKey: "groupMilestones", items: ["achievements"] },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const location = useLocation();
  const { setNotificationPrefs, setPrayerAlert, update } = usePreferencesActions();
  const audio = useAudioPlayerContext();
  const toast = useToast();
  const { requestPermission, canEnableLocalReminders } = useNotificationPermissions();
  const master = prefs.notificationPrefs.masterEnabled;
  const obligatoryEnabled = master && prefs.notificationPrefs.prayer;
  const sunnahEnabled = master && prefs.notificationPrefs.sunnahPrayer;
  const [scheduled, setScheduled] = useState<Scheduled>([]);
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const tv = isTV();
  const liveActivitySupported = useMemo(
    () => !tv && isIOS && isLiveActivitySupported(),
    [isIOS, tv],
  );

  const reloadScheduled = useCallback(async () => {
    if (tv) {
      setScheduled([]);
      return;
    }
    try {
      setScheduled(
        await listScheduled(preferencesStore.getState().prefs, locationStore.getState().location),
      );
    } catch {
      setScheduled([]);
    }
  }, [tv]);

  useFocusEffect(
    useCallback(() => {
      void reloadScheduled();
    }, [reloadScheduled]),
  );

  const upcoming = useMemo<NotificationListItem[]>(
    () =>
      scheduled.slice(0, UPCOMING_PREVIEW_COUNT).map((item) => ({
        id: `scheduled:${item.id}`,
        title: item.title,
        body: item.body,
        at: item.fireAt,
        readAt: null,
        reminderKey: extractReminderKey(`scheduled:${item.id}`),
        route: item.route,
      })),
    [scheduled],
  );

  const formatWhen = (iso: string) =>
    formatDisplayDateTime(
      new Date(iso),
      prefs.timeFormat,
      prefs.locale,
      location.timeZone,
      prefs.defaultCalendar,
    );

  const enableMaster = async () => {
    if (isWeb) {
      await setNotificationPrefs({ masterEnabled: true });
      await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
      await reloadScheduled();
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
    await reloadScheduled();
  };

  const onNotificationToggle = async (patch: Partial<NotificationPreferences>) => {
    await setNotificationPrefs(patch);
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
    await reloadScheduled();
  };

  const onSelectAdhanStyle = async (adhanStyleId: string) => {
    await update({ adhanStyleId });
    // Preview the newly-picked style so the choice is audible immediately.
    audio.play([adhanTrack(adhanStyleId)], 0, { sourceHref: "/settings/notifications" });
  };

  const onDisableMaster = async () => {
    await setNotificationPrefs({ masterEnabled: false });
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
    await reloadScheduled();
  };

  const onPrayerAlertChange = async (prayerId: PrayerId, value: boolean) => {
    await setPrayerAlert(prayerId, value);
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
    await reloadScheduled();
  };

  return (
    <ScreenLayout
      eyebrow={t("notif.eyebrow")}
      title={t("settings.notifications")}
      subtitle={t("notif.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/notifications" />
      {tv ? (
        <EmptyState
          icon={{ ios: "tv", android: "tv", web: "tv" }}
          title={t("common.tvUnavailableTitle")}
          description={t("notif.tvUnavailableBody")}
        />
      ) : (
        <Stagger>
          <NotificationPermissionBanner />

          {location.source === "default" ? (
            <Card padding="three" style={styles.defaultLocationCard}>
              <ThemedText type="smallBold">{t("notif.defaultLocationTitle")}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground">
                {t("notif.defaultLocationMessage")}
              </ThemedText>
              <Button
                label={t("location.setLocation")}
                variant="secondary"
                onPress={() => router.push("/location")}
              />
            </Card>
          ) : null}

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
                await onDisableMaster();
              }}
            />
          </Card>

          {master && upcoming.length > 0 ? (
            <Card padding="three">
              <SectionHeader
                title={t("notif.upcomingTitle")}
                icon={{ ios: "clock.fill", android: "schedule", web: "schedule" }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.upcomingHint}>
                {t("notif.upcomingHint")}
              </ThemedText>
              <View style={styles.upcomingList}>
                {upcoming.map((item) => (
                  <NotificationListRow
                    key={item.id}
                    item={item}
                    formattedWhen={formatWhen(item.at)}
                  />
                ))}
              </View>
            </Card>
          ) : null}

          <Card padding="three">
            <SettingsRow
              icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
              title={t("notif.adhanTitle")}
              subtitle={t("notif.adhanSub")}
              onPress={() =>
                audio.play([adhanTrack(prefs.adhanStyleId)], 0, {
                  sourceHref: "/settings/notifications",
                })
              }
            />
            {ADHAN_STYLES.length > 1 ? (
              <View style={styles.adhanPicker}>
                <AdhanStylePicker
                  value={prefs.adhanStyleId ?? DEFAULT_ADHAN_STYLE}
                  onChange={(id) => void onSelectAdhanStyle(id)}
                />
              </View>
            ) : null}
            <View style={styles.adhanToggle}>
              <ToggleRow
                icon={{ ios: "megaphone.fill", android: "campaign", web: "campaign" }}
                title={t("notif.playAdhan")}
                subtitle={t("notif.playAdhanHint")}
                value={prefs.notificationPrefs.playAdhanOnPrayer}
                disabled={!obligatoryEnabled}
                onValueChange={(value) => void onNotificationToggle({ playAdhanOnPrayer: value })}
              />
            </View>
            <View style={styles.adhanToggle}>
              <SettingsRow
                icon={{ ios: "clock.badge", android: "more_time", web: "more_time" }}
                title={t("reminderOffsets.title")}
                subtitle={t("reminderOffsets.rowSub")}
                onPress={() => router.push("/settings/reminder-offsets")}
              />
            </View>
          </Card>

          {!tv && (isIOS || isAndroid) ? <LiveActivityDiscoveryBanner /> : null}

          {!tv && (isIOS || isAndroid) ? (
            <Card padding="three">
              <ToggleRow
                icon={{
                  ios: "platter.filled.top.iphone",
                  android: "widgets",
                  web: "widgets",
                }}
                title={t("notif.liveActivity")}
                subtitle={
                  isAndroid
                    ? t("notif.liveActivityHintAndroid")
                    : liveActivitySupported
                      ? t("notif.liveActivityHint")
                      : t("notif.liveActivityUnavailable")
                }
                value={prefs.liveActivityEnabled === true}
                disabled={isIOS && !liveActivitySupported}
                onValueChange={(value) => void update({ liveActivityEnabled: value })}
              />
            </Card>
          ) : null}

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
                    onValueChange={(value) => void onNotificationToggle({ [key]: value })}
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

          <Card padding="three">
            <SectionHeader
              title={t("settings.reviewReactivationEnabled")}
              icon={{ ios: "star.bubble.fill", android: "rate_review", web: "rate_review" }}
            />
            <ToggleRow
              title={t("settings.reviewReactivationEnabled")}
              subtitle={t("settings.reviewReactivationEnabledDesc")}
              value={prefs.notificationPrefs.reviewReactivationEnabled !== false}
              disabled={!master}
              onValueChange={(value) =>
                void setNotificationPrefs({ reviewReactivationEnabled: value })
              }
            />
          </Card>

          <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
            {t("notif.footer")}
          </ThemedText>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  defaultLocationCard: {
    gap: Spacing.three,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  upcomingHint: {
    marginTop: Spacing.two,
  },
  upcomingList: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  adhanToggle: {
    marginTop: Spacing.two,
  },
  adhanPicker: {
    marginTop: Spacing.three,
  },
  footer: {
    textAlign: "center",
  },
});
