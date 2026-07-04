import type { NotificationResponse } from "expo-notifications";
import { type Href, useRouter } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { AppState, Platform } from "react-native";
import { isWeb } from "@/lib/notifications/platform";
import { setWebReminderFireHandler } from "@/lib/notifications/web-reminder-scheduler";
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
    if (!isWeb) return;
    setWebReminderFireHandler((reminder) => {
      void deliver({
        kind: "reminder",
        title: reminder.title,
        body: reminder.body,
        route: reminder.route,
        id: `web-${reminder.id}`,
      });
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification(reminder.title, { body: reminder.body, tag: reminder.id });
        } catch {
          // Ignore — permission can change between check and show.
        }
      }
    });
    return () => setWebReminderFireHandler(null);
  }, [deliver]);

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
    // Guard against handling the same tap twice — on some platforms a cold-start
    // response is also replayed to the live listener.
    const handledResponses = new Set<string>();

    void import("expo-notifications").then((Notifications) => {
      const handleResponse = (response: NotificationResponse) => {
        if (response.actionIdentifier === SNOOZE_ACTION_IDENTIFIER) {
          void snoozeNotification(response);
          return;
        }
        const id = response.notification.request.identifier;
        if (handledResponses.has(id)) return;
        handledResponses.add(id);
        const data = response.notification.request.content.data as { route?: string } | undefined;
        router.push((data?.route ?? "/notifications") as Href);
      };

      receivedSub = Notifications.addNotificationReceivedListener((notification) => {
        const { content } = notification.request;
        const title = content.title ?? "Reminder";
        const body = content.body ?? "";
        const route = (content.data as { route?: string } | undefined)?.route;
        void deliver({
          kind: "reminder",
          title,
          body,
          route: route ?? "/notifications",
          id: `os-${notification.request.identifier}`,
        });
      });

      responseSub = Notifications.addNotificationResponseReceivedListener(handleResponse);

      // Cold start: the app was launched by tapping a notification. The live
      // listener doesn't replay that launch tap, so handle it explicitly once.
      void Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response) handleResponse(response);
      });
    });

    return () => {
      receivedSub?.remove();
      responseSub?.remove();
    };
  }, [router, deliver]);

  return <>{children}</>;
}
