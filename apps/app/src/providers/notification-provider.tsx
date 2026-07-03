import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { type ReactNode, useEffect } from "react";
import { Platform } from "react-native";

import { configureNotifications, rescheduleAll } from "@/notifications/scheduler";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Owns the local-notification lifecycle: configures channels once, reschedules
 * whenever preferences change, and routes taps to the notification centre.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const prefs = usePreferences();
  const ready = usePreferencesReady();

  useEffect(() => {
    void configureNotifications();
  }, []);

  useEffect(() => {
    if (ready) void rescheduleAll(prefs);
  }, [ready, prefs]);

  useEffect(() => {
    if (!isNative) return;
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      router.push("/notifications");
    });
    return () => subscription.remove();
  }, [router]);

  return <>{children}</>;
}
