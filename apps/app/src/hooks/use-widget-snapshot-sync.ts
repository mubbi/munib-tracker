import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { useAdhkarClock } from "@/hooks/use-adhkar-clock";
import { useAdhkarDayCounts } from "@/hooks/use-adhkar-day-counts";
import { refreshRegisteredAndroidWidgets } from "@/lib/appSurfaces/widgets/androidTaskHandler";
import { afterSalahTasbeehSteps } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { widgetRefreshBoundaries } from "@/lib/appSurfaces/widgets/resolveSnapshotAt";
import {
  buildWidgetSnapshot,
  writeWidgetSnapshot,
} from "@/lib/appSurfaces/widgets/snapshotStorage";
import { ensureDailyHadithPool } from "@/lib/daily-hadith";
import {
  nativePublishAndroidWidgetPreviews,
  nativePushWearSnapshot,
  nativeScheduleWidgetRefresh,
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
import { syncTvHomeSurfaces } from "@/lib/tv-home/sync";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
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
    hijriAdjustment,
  } = usePreferences();
  const summary = useDailySummary();
  const { status: prayerStatus } = useTodayPrayers();
  useEnsureKhatmLoaded();
  const { plan: khatmPlan, ayahsRead: khatmAyahsRead } = useKhatm();
  useEnsureCustomTasbeehLoaded();
  const tasbeehToday = useTasbeehUpdatedToday();
  useEnsureFridayChecklistLoaded();
  const fridayChecklistDone = useFridayChecklistForDate(getLocalDateString());
  // Adhkar widget: counts for the adhkar day (Fajr -> Fajr). Only `date` feeds the
  // sync deps, so the clock's minute tick never re-writes the snapshot by itself.
  const adhkarDate = useAdhkarClock().date;
  const { counts: adhkarCounts } = useAdhkarDayCounts(adhkarDate);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boundaryRefreshRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncRef = useRef<(() => Promise<void>) | null>(null);

  const locale = toAppLocale(i18n.language ?? "en");
  const meaningLocale = toAppLocale(translationLocale ?? locale);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hijriAdjustment (D14) changes hijri.ts output in the snapshot.
  const sync = useCallback(async () => {
    if (!enabled || Platform.OS === "web") return;
    await ensureDailyHadithPool();
    // The watch tasbeeh shows the after-Salah phrases from the adhkar dataset.
    await ensureZikrCorpus().catch(() => []);
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
      afterSalahSteps: afterSalahTasbeehSteps(getZikrById),
      adhkarCounts,
      t,
    });
    // TV has no widgets / watch / Live Activity — the same snapshot feeds the Android
    // TV launcher row and the Apple TV Top Shelf instead (their native sides track
    // the next-Salah windows while the app is closed).
    if (isTV()) {
      await syncTvHomeSurfaces(snapshot, t);
      return;
    }
    await writeWidgetSnapshot(snapshot);
    const snapshotJson = JSON.stringify(snapshot);
    await nativePushWearSnapshot(snapshotJson);
    await refreshRegisteredAndroidWidgets();
    // Exact-ish redraws at each Adhan / adhkar window / midnight while the app is closed.
    await nativeScheduleWidgetRefresh(widgetRefreshBoundaries(snapshot, new Date()));
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
    adhkarCounts,
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
    hijriAdjustment,
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
