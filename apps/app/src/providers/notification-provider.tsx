import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { Platform } from "react-native";

import {
  configureNotifications,
  rescheduleAll,
  SNOOZE_ACTION_IDENTIFIER,
  snoozeNotification,
} from "@/notifications/scheduler";
import { useStore } from "@/stores/create-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Owns the local-notification lifecycle: configures channels once, reschedules
 * whenever preferences change, and routes taps to the notification centre.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ready = usePreferencesReady();
  // Only the notification-relevant slice — so unrelated writes (e.g. audio
  // speed, favorites) don't cancel and reschedule every reminder.
  const notificationPrefs = useStore(preferencesStore, (s) => s.prefs.notificationPrefs);
  const bedtime = useStore(preferencesStore, (s) => s.prefs.bedtime);

  useEffect(() => {
    void configureNotifications();
  }, []);

  // notificationPrefs/bedtime are intentional trigger deps — they re-run the
  // reschedule when the relevant slice changes, without being read in the body.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger dependencies
  useEffect(() => {
    if (ready) void rescheduleAll(preferencesStore.getState().prefs);
  }, [ready, notificationPrefs, bedtime]);

  useEffect(() => {
    if (!isNative) return;
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (response.actionIdentifier === SNOOZE_ACTION_IDENTIFIER) {
        void snoozeNotification(response);
        return;
      }
      router.push("/notifications");
    });
    return () => subscription.remove();
  }, [router]);

  return <>{children}</>;
}
