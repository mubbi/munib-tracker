import type { NotificationResponse } from "expo-notifications";
import { type Href, useRouter } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Platform } from "react-native";
import { maybeOpenReviewFunnelFromNotificationData } from "@/features/reviews/lib/reviewNotificationTap";
import {
  handleLiveActivityPushToken,
  notifyLiveActivityLifecycle,
  subscribeLiveActivityLifecycle,
  subscribeLiveActivityPushTokens,
} from "@/lib/live-activity";
import { hasOutstandingQazaDebt, isQazaReminderId } from "@/lib/notifications/build-reminders";
import { isLocalNotificationSupported, isWeb } from "@/lib/notifications/platform";
import {
  registerExpoPushTokenWithApi,
  registerWebPushSubscriptionWithApi,
} from "@/lib/notifications/register-push-token";
import { tryPlayWebAdhanForReminder } from "@/lib/notifications/web-adhan-playback";
import { setWebReminderFireHandler } from "@/lib/notifications/web-reminder-scheduler";
import { isTV } from "@/lib/platform/is-tv";
import {
  configureNotifications,
  MARK_ACTION_IDENTIFIER,
  markFromNotification,
  rescheduleAll,
  SNOOZE_ACTION_IDENTIFIER,
  snoozeNotification,
} from "@/notifications/scheduler";
import { useAuth } from "@/providers/auth-provider";
import { useInAppNotifications } from "@/providers/in-app-notifications-provider";
import { useStore } from "@/stores/create-store";
import { locationStore } from "@/stores/location-store";
import { preferencesStore, usePreferencesReady } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

function readHasQazaDebt(): boolean {
  const { qazaCounters, roza } = trackerStore.getState();
  return hasOutstandingQazaDebt(qazaCounters, roza);
}

/** Drop stale Qaza nudges if debt was cleared after the OS/web timer was armed. */
function shouldDeliverReminder(reminderId: string): boolean {
  if (!isQazaReminderId(reminderId)) return true;
  return readHasQazaDebt();
}

/**
 * Owns the local-notification lifecycle: configures channels once, reschedules
 * whenever preferences or location change, and routes taps to the notification centre.
 * No-op on TV (no local OS reminders / Live Activity / push registration).
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ready = usePreferencesReady();
  const { i18n } = useTranslation();
  const activeLocale = i18n.resolvedLanguage ?? i18n.language;
  const { session, isAuthenticated } = useAuth();
  const { deliver } = useInAppNotifications();
  const notificationPrefs = useStore(preferencesStore, (s) => s.prefs.notificationPrefs);
  const prayerAlerts = useStore(preferencesStore, (s) => s.prefs.prayerAlerts);
  const prayerReminderOffsets = useStore(preferencesStore, (s) => s.prefs.prayerReminderOffsets);
  const bedtime = useStore(preferencesStore, (s) => s.prefs.bedtime);
  const location = useStore(locationStore, (s) => s.location);
  const locationReady = useStore(locationStore, (s) => s.isReady);
  const _trackerReady = useStore(trackerStore, (s) => s.isReady);
  const _qazaDebtKey = useStore(trackerStore, (s) => {
    const salahRemaining = s.qazaCounters.reduce((sum, c) => sum + c.remaining, 0);
    return `${salahRemaining}:${s.roza.remaining}`;
  });
  const tv = isTV();
  const notificationsOk = !tv && isLocalNotificationSupported();

  useEffect(() => {
    if (!activeLocale || !notificationsOk) return;
    void configureNotifications();
  }, [activeLocale, notificationsOk]);

  useEffect(() => {
    if (tv || !session?.accessToken) return;
    void registerExpoPushTokenWithApi(session.accessToken);
    void registerWebPushSubscriptionWithApi(session.accessToken);
  }, [session?.accessToken, tv]);

  useEffect(() => {
    if (tv || Platform.OS !== "ios") return;
    const unsubscribeToken = subscribeLiveActivityPushTokens((event) => {
      handleLiveActivityPushToken(event);
    });
    const unsubscribeLifecycle = subscribeLiveActivityLifecycle((event) => {
      if (event.state === "ended" || event.state === "dismissed") {
        void notifyLiveActivityLifecycle(event.activityId, event.state);
      }
    });
    return () => {
      unsubscribeToken();
      unsubscribeLifecycle();
    };
  }, [tv]);

  useEffect(() => {
    if (!isWeb || tv) return;
    setWebReminderFireHandler((reminder) => {
      if (!shouldDeliverReminder(reminder.id)) return;
      tryPlayWebAdhanForReminder(reminder);
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
          const browserNotif = new Notification(reminder.title, {
            body: reminder.body,
            tag: reminder.id,
          });
          browserNotif.onclick = () => {
            window.focus();
            router.push((reminder.route ?? "/notifications") as Href);
            browserNotif.close();
          };
        } catch {
          // Ignore — permission can change between check and show.
        }
      }
    });
    return () => setWebReminderFireHandler(null);
  }, [deliver, router, tv]);

  useEffect(() => {
    if (!notificationsOk || !activeLocale || !ready || !locationReady) return;
    const prefs = preferencesStore.getState().prefs;
    void rescheduleAll(
      { ...prefs, notificationPrefs, prayerAlerts, prayerReminderOffsets, bedtime },
      location,
    );
  }, [
    notificationsOk,
    ready,
    locationReady,
    notificationPrefs,
    prayerAlerts,
    prayerReminderOffsets,
    bedtime,
    activeLocale,
    location,
  ]);

  useEffect(() => {
    if (!notificationsOk || !activeLocale) return;
    const sub = AppState.addEventListener("change", (status) => {
      if (status !== "active" || !ready || !locationReady) return;
      const prefs = preferencesStore.getState().prefs;
      void rescheduleAll(
        { ...prefs, notificationPrefs, prayerAlerts, prayerReminderOffsets, bedtime },
        location,
      );
      if (isAuthenticated && session?.accessToken) {
        void registerExpoPushTokenWithApi(session.accessToken);
      }
    });
    return () => sub.remove();
  }, [
    notificationsOk,
    ready,
    locationReady,
    notificationPrefs,
    prayerAlerts,
    prayerReminderOffsets,
    bedtime,
    activeLocale,
    location,
    isAuthenticated,
    session?.accessToken,
  ]);

  useEffect(() => {
    if (!isNative || tv) return;
    let receivedSub: { remove: () => void } | undefined;
    let responseSub: { remove: () => void } | undefined;
    // Guard against handling the same tap twice — on some platforms a cold-start
    // response is also replayed to the live listener.
    const handledResponses = new Set<string>();

    void import("expo-notifications").then((Notifications) => {
      const handleResponse = (response: NotificationResponse) => {
        if (response.actionIdentifier === MARK_ACTION_IDENTIFIER) {
          void markFromNotification(response);
          return;
        }
        if (response.actionIdentifier === SNOOZE_ACTION_IDENTIFIER) {
          void snoozeNotification(response);
          return;
        }
        const id = response.notification.request.identifier;
        if (handledResponses.has(id)) return;
        handledResponses.add(id);
        const data = response.notification.request.content.data as
          | { route?: string; type?: string; triggerId?: string }
          | undefined;
        if (maybeOpenReviewFunnelFromNotificationData(data ?? undefined)) return;
        router.push((data?.route ?? "/notifications") as Href);
      };

      receivedSub = Notifications.addNotificationReceivedListener((notification) => {
        const { content } = notification.request;
        if (!shouldDeliverReminder(notification.request.identifier)) return;
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
  }, [router, deliver, tv]);

  return <>{children}</>;
}
