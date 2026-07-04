import { useRouter } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { AppState, Platform } from "react-native";
import {
  configureNotifications,
  rescheduleAll,
  SNOOZE_ACTION_IDENTIFIER,
  snoozeNotification,
} from "@/notifications/scheduler";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useStore } from "@/stores/create-store";
import { locationStore } from "@/stores/location-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Owns the local-notification lifecycle: configures channels once, reschedules
 * whenever preferences or location change, and routes taps to the notification centre.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ready = usePreferencesReady();
  const { deliver } = useInAppNotifications();
  const notificationPrefs = useStore(preferencesStore, (s) => s.prefs.notificationPrefs);
  const prayerAlerts = useStore(preferencesStore, (s) => s.prefs.prayerAlerts);
  const bedtime = useStore(preferencesStore, (s) => s.prefs.bedtime);
  const location = useStore(locationStore, (s) => s.location);
  const locationReady = useStore(locationStore, (s) => s.isReady);

  useEffect(() => {
    void configureNotifications();
  }, []);

  useEffect(() => {
    if (!ready || !locationReady) return;
    const prefs = preferencesStore.getState().prefs;
    void rescheduleAll({ ...prefs, notificationPrefs, prayerAlerts, bedtime }, location);
  }, [ready, locationReady, notificationPrefs, prayerAlerts, bedtime, location]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (status) => {
      if (status !== "active" || !ready || !locationReady) return;
      const prefs = preferencesStore.getState().prefs;
      void rescheduleAll({ ...prefs, notificationPrefs, prayerAlerts, bedtime }, location);
    });
    return () => sub.remove();
  }, [ready, locationReady, notificationPrefs, prayerAlerts, bedtime, location]);

  useEffect(() => {
    if (!isNative) return;
    let receivedSub: { remove: () => void } | undefined;
    let responseSub: { remove: () => void } | undefined;

    void import("expo-notifications").then((Notifications) => {
      receivedSub = Notifications.addNotificationReceivedListener((notification) => {
        const title = notification.request.content.title ?? "Reminder";
        const body = notification.request.content.body ?? "";
        void deliver({
          kind: "reminder",
          title,
          body,
          route: "/notifications",
          id: `os-${notification.request.identifier}`,
        });
      });

      responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
        if (response.actionIdentifier === SNOOZE_ACTION_IDENTIFIER) {
          void snoozeNotification(response);
          return;
        }
        router.push("/notifications");
      });
    });

    return () => {
      receivedSub?.remove();
      responseSub?.remove();
    };
  }, [router, deliver]);

  return <>{children}</>;
}
