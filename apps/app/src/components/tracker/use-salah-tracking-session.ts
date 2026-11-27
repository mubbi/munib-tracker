import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { triggerHaptic } from "@/lib/haptics";
import { toAppLocale } from "@/lib/locale-bcp47";
import {
  getExpoPushToken,
  registerWebPushSubscriptionWithApi,
} from "@/lib/notifications/register-push-token";
import { isTV } from "@/lib/platform/is-tv";
import {
  createSalahTrackingSession,
  endSalahTrackingSession,
  type SalahTrackingSession,
} from "@/lib/salah-phase";
import {
  endSurfacePushRegistration,
  registerSurfacePushSchedule,
} from "@/lib/surface-push/register";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { useToast } from "@/providers/toast-provider";
import { useKhatm } from "@/stores/khatm-store";
import { useLocation, useLocationStatus } from "@/stores/location-store";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";
import { useDailySummary, useTodayPrayers } from "@/stores/tracker-store";

type Snapshot = ReturnType<typeof buildWidgetSnapshot>;

/**
 * Best-effort remote phase pushes for an active Salah tracking session (web push
 * on web, Expo push on Android). The local alarms stay authoritative, so every
 * failure here is swallowed.
 */
async function registerRemoteTrackingPushes(
  accessToken: string,
  session: SalahTrackingSession,
  snapshot: Snapshot,
  stopLabel: string,
): Promise<void> {
  try {
    if (Platform.OS === "web") {
      const subscription = await registerWebPushSubscriptionWithApi(accessToken);
      if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
        return;
      }
      await registerSurfacePushSchedule({
        accessToken,
        channel: "web_push",
        target: JSON.stringify({
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime ?? null,
          keys: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
        }),
        session,
        snapshot,
        stopLabel,
      });
    } else if (Platform.OS === "android") {
      const token = await getExpoPushToken();
      if (!token) return;
      await registerSurfacePushSchedule({
        accessToken,
        channel: "expo",
        target: token,
        session,
        snapshot,
        stopLabel,
      });
    }
  } catch {
    /* remote schedule is best-effort; local alarms still run */
  }
}

/**
 * "Track this Salah" on the tracker: starts / stops the Salah tracking session
 * (Live Activity, ongoing notification, phase alarms) from a widget snapshot of
 * today, and mirrors it to the remote push schedule when signed in.
 */
export function useSalahTrackingSession() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { colors } = useThemeTokens();
  const { scheme, colorMode } = useTheme();
  const location = useLocation();
  const locationStatus = useLocationStatus();
  const { salahTrackingSession, timeFormat, defaultCalendar, translationLocale } = usePreferences();
  const { update: updatePrefs } = usePreferencesActions();
  const summary = useDailySummary();
  const { status } = useTodayPrayers();
  const { plan: khatmPlan, ayahsRead: khatmRead } = useKhatm();
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const active = salahTrackingSession?.status === "active" && !salahTrackingSession.dismissed;

  const start = useCallback(() => {
    if (isTV()) return;
    const locationDenied = locationStatus === "denied";
    const locale = toAppLocale(i18n.language ?? "en");
    const snapshot = buildWidgetSnapshot({
      location: locationDenied ? null : location,
      locationDenied,
      locale,
      translationLocale: toAppLocale(translationLocale ?? locale),
      calendar: defaultCalendar,
      timeFormat,
      theme: {
        isDark: scheme === "dark",
        primaryColor: colors.accent,
        followsSystem: colorMode === "system",
      },
      salahCompleted: summary.salahCompleted,
      salahTotal: summary.salahTotal,
      prayerStatus: status,
      streakDays: summary.streakDays,
      qazaRemaining: summary.qazaRemaining,
      qazaCompletedToday: summary.qazaCompletedToday,
      qazaTargetToday: summary.qazaTargetToday,
      khatmPlan,
      khatmAyahsRead: khatmRead,
      tasbeehToday: null,
      fridayChecklistDone: {},
      t,
    });
    if (snapshot.locationDenied) {
      toast.error(t("notif.defaultLocationTitle"), t("notif.defaultLocationMessage"));
      return;
    }
    const sessionState = createSalahTrackingSession(snapshot);
    updatePrefs({ salahTrackingSession: sessionState });
    triggerHaptic("success");
    if (accessToken) {
      void registerRemoteTrackingPushes(
        accessToken,
        sessionState,
        snapshot,
        t("notif.trackSalah.stop"),
      );
    }
  }, [
    accessToken,
    colorMode,
    colors.accent,
    defaultCalendar,
    i18n.language,
    khatmPlan,
    khatmRead,
    location,
    locationStatus,
    scheme,
    status,
    summary,
    t,
    timeFormat,
    toast,
    translationLocale,
    updatePrefs,
  ]);

  const stop = useCallback(() => {
    if (!salahTrackingSession) return;
    updatePrefs({
      salahTrackingSession: endSalahTrackingSession(salahTrackingSession, "ended"),
    });
    triggerHaptic("light");
    if (accessToken) void endSurfacePushRegistration(accessToken, undefined, "ended");
  }, [accessToken, salahTrackingSession, updatePrefs]);

  return { active, start, stop };
}
