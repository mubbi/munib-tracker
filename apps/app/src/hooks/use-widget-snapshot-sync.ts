import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { refreshRegisteredAndroidWidgets } from "@/lib/appSurfaces/widgets/androidTaskHandler";
import {
  buildWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { ensureDailyHadithPool } from "@/lib/daily-hadith";
import {
  nativePublishAndroidWidgetPreviews,
  nativePushWearSnapshot,
} from "@/lib/external-commands/native-bridge";
import { syncLiveActivity } from "@/lib/live-activity";
import {
  LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
  LIVE_ACTIVITY_MARK_WINDOW_MS,
} from "@/lib/live-activity/state";
import { toAppLocale } from "@/lib/locale-bcp47";
import { syncOngoingNotification } from "@/lib/ongoing-notification";
import { isTV } from "@/lib/platform/is-tv";
import { runWhenIdle } from "@/lib/run-when-idle";
import { useTheme } from "@/providers/theme-provider";
import {
  useEnsureCustomTasbeehLoaded,
  useTasbeehUpdatedToday,
} from "@/stores/custom-tasbeeh-store";
import {
  useEnsureFridayChecklistLoaded,
  useFridayChecklistForDate,
} from "@/stores/friday-checklist-store";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";
import { useLocation, useLocationStatus } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { useDailySummary, useTodayPrayers } from "@/stores/tracker-store";

/** Longer than a typical theme toggle paint so native I/O never contends with UI. */
const WIDGET_SYNC_DEBOUNCE_MS = 750;

/** Refresh home-screen widget snapshot when prayer data, locale, or theme changes. */
export function useWidgetSnapshotSync(enabled = true): void {
  const { t, i18n } = useTranslation();
  const { scheme, colors, colorMode } = useTheme();
  const location = useLocation();
  const locationStatus = useLocationStatus();
  const {
    timeFormat,
    defaultCalendar,
    liveActivityEnabled,
    translationLocale,
    salahTrackingSession,
  } = usePreferences();
  const summary = useDailySummary();
  const { status: prayerStatus } = useTodayPrayers();
  useEnsureKhatmLoaded();
  const { plan: khatmPlan, ayahsRead: khatmAyahsRead } = useKhatm();
  useEnsureCustomTasbeehLoaded();
  const tasbeehToday = useTasbeehUpdatedToday();
  useEnsureFridayChecklistLoaded();
  const fridayChecklistDone = useFridayChecklistForDate(getLocalDateString());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boundaryRefreshRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncRef = useRef<(() => Promise<void>) | null>(null);

  const locale = toAppLocale(i18n.language ?? "en");
  const meaningLocale = toAppLocale(translationLocale ?? locale);

  const sync = useCallback(async () => {
    if (!enabled || Platform.OS === "web" || isTV()) return;
    await ensureDailyHadithPool();
    const locationDenied = locationStatus === "denied";
    const snapshot = buildWidgetSnapshot({
      location: locationDenied ? null : location,
      locationDenied,
      locale,
      translationLocale: meaningLocale,
      calendar: defaultCalendar,
      timeFormat,
      theme: {
        isDark: scheme === "dark",
        primaryColor: colors.accent,
        followsSystem: colorMode === "system",
      },
      salahCompleted: summary.salahCompleted,
      salahTotal: summary.salahTotal,
      prayerStatus,
      streakDays: summary.streakDays,
      qazaRemaining: summary.qazaRemaining,
      qazaCompletedToday: summary.qazaCompletedToday,
      qazaTargetToday: summary.qazaTargetToday,
      khatmPlan,
      khatmAyahsRead,
      tasbeehToday: tasbeehToday
        ? { title: tasbeehToday.title, count: tasbeehToday.count, target: tasbeehToday.target }
        : null,
      fridayChecklistDone,
      t,
    });
    await writeWidgetSnapshot(snapshot);
    const snapshotJson = JSON.stringify(snapshot);
    await nativePushWearSnapshot(snapshotJson);
    await refreshRegisteredAndroidWidgets();
    await nativePublishAndroidWidgetPreviews(snapshotJson);
    await syncLiveActivity({ snapshot, enabled: liveActivityEnabled === true });
    await syncOngoingNotification({
      snapshot,
      enabled: liveActivityEnabled === true,
      session: salahTrackingSession ?? null,
    });

    if (boundaryRefreshRef.current) clearTimeout(boundaryRefreshRef.current);
    boundaryRefreshRef.current = null;
    const trackingActive =
      liveActivityEnabled === true ||
      (salahTrackingSession?.status === "active" && !salahTrackingSession.dismissed);
    if (trackingActive && !snapshot.locationDenied) {
      const currentAt = snapshot.nextPrayer.currentPrayerAtMs;
      const nowMs = Date.now();
      const boundaries = [
        snapshot.nextPrayer.targetTimeMs,
        currentAt + LIVE_ACTIVITY_MARK_WINDOW_MS,
        currentAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
      ].filter((time) => time > nowMs);
      const nextBoundary = Math.min(...boundaries);
      if (Number.isFinite(nextBoundary)) {
        boundaryRefreshRef.current = setTimeout(
          () => void syncRef.current?.(),
          Math.max(1_000, nextBoundary - nowMs + 1_000),
        );
      }
    }
  }, [
    colorMode,
    colors.accent,
    defaultCalendar,
    fridayChecklistDone,
    khatmAyahsRead,
    khatmPlan,
    liveActivityEnabled,
    salahTrackingSession,
    locale,
    location,
    locationStatus,
    meaningLocale,
    prayerStatus,
    scheme,
    summary.qazaCompletedToday,
    summary.qazaRemaining,
    summary.qazaTargetToday,
    summary.salahCompleted,
    summary.salahTotal,
    summary.streakDays,
    t,
    tasbeehToday,
    timeFormat,
    enabled,
  ]);

  useEffect(() => {
    syncRef.current = sync;
    return () => {
      if (syncRef.current === sync) syncRef.current = null;
    };
  }, [sync]);

  useEffect(() => {
    if (!enabled || Platform.OS === "web") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    let idleCancel: (() => void) | null = null;
    debounceRef.current = setTimeout(() => {
      const handle = runWhenIdle(() => {
        void sync();
      });
      idleCancel = handle.cancel;
    }, WIDGET_SYNC_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (boundaryRefreshRef.current) clearTimeout(boundaryRefreshRef.current);
      idleCancel?.();
    };
  }, [enabled, sync]);
}
