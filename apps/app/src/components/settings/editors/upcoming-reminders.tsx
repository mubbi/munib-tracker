import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  type NotificationListItem,
  NotificationListRow,
} from "@/components/notifications/notification-list-row";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { hasExactAlarmPermission, supportsPreciseAdhan } from "@/lib/notifications/exact-alarm";
import { extractReminderKey } from "@/lib/notifications/notification-visuals";
import { readSetting, setSetting } from "@/lib/settings/shortcuts";
import { formatDisplayDateTime } from "@/lib/time";
import { listScheduled } from "@/notifications/scheduler";
import { locationStore, useLocation } from "@/stores/location-store";
import { preferencesStore, usePreferences } from "@/stores/preferences-store";

type Scheduled = Awaited<ReturnType<typeof listScheduled>>;

const PREVIEW_COUNT = 6;
const PRECISE_ADHAN = "notifications.salah.preciseAdhan";

/**
 * "Upcoming reminders": the next scheduled alerts. Also drops a stale Precise
 * Adhan "on" when the exact-alarm permission was revoked in system settings.
 */
export function UpcomingRemindersPreview() {
  const { t } = useTranslation();
  const prefs = usePreferences();
  const location = useLocation();
  const [scheduled, setScheduled] = useState<Scheduled>([]);

  const reload = useCallback(async () => {
    try {
      setScheduled(
        await listScheduled(preferencesStore.getState().prefs, locationStore.getState().location),
      );
    } catch {
      setScheduled([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
      if (supportsPreciseAdhan() && readSetting<boolean>(PRECISE_ADHAN)) {
        void hasExactAlarmPermission().then(async (granted) => {
          // Same write path as the toggle (device pref + reschedule side effect).
          if (!granted) await setSetting(PRECISE_ADHAN, false);
        });
      }
    }, [reload]),
  );

  // Any reminder-affecting write changes `updatedAt` → refresh the preview.
  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh on prefs/location change.
  useEffect(() => {
    const timer = setTimeout(() => void reload(), 400);
    return () => clearTimeout(timer);
  }, [prefs.updatedAt, location, reload]);

  const items = useMemo<NotificationListItem[]>(
    () =>
      scheduled.slice(0, PREVIEW_COUNT).map((item) => ({
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

  if (!prefs.notificationPrefs.masterEnabled || items.length === 0) {
    return (
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("notif.upcomingHint")}
      </ThemedText>
    );
  }

  return (
    <View style={styles.list}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("notif.upcomingHint")}
      </ThemedText>
      {items.map((item) => (
        <NotificationListRow
          key={item.id}
          item={item}
          formattedWhen={formatDisplayDateTime(
            new Date(item.at),
            prefs.timeFormat,
            prefs.locale,
            location.timeZone,
            prefs.defaultCalendar,
          )}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
});
