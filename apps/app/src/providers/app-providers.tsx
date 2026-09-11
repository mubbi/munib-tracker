import { getLocalDateString, msUntilNextLocalMidnight } from "@munib-tracker/shared/utils";
import { type ReactNode, useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { type IdleTaskHandle, runWhenIdle } from "@/lib/run-when-idle";
import { continueStore } from "@/stores/continue-store";
import { locationStore } from "@/stores/location-store";
import { quranStore } from "@/stores/quran-store";
import { trackerStore } from "@/stores/tracker-store";
import { weatherStore } from "@/stores/weather-store";

/** setTimeout clamps above ~24.8d; midnight is always sooner, but keep a ceiling. */
const MAX_TIMEOUT_MS = 2_147_483_647;

function refreshTrackerForCurrentDay(): void {
  const tracker = trackerStore.getState();
  if (tracker.date !== getLocalDateString()) {
    void tracker.load();
  } else {
    void tracker.refresh();
  }
}

/**
 * Boots the local data stores and keeps them fresh when the app returns to the
 * foreground or the calendar day rolls over. Location loads cached coords
 * immediately (hero needs them) and only refreshes GPS when permission was
 * already granted — never prompts at startup. Tracker / quran / continue /
 * weather warm after the first paint.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    let mounted = true;
    let weatherIdle: IdleTaskHandle | null = null;
    let dayRolloverTimer: ReturnType<typeof setTimeout> | null = null;
    void locationStore.getState().load();
    // Tracker backs the home goal card — load with location so first paint of
    // below-fold content has salah/zikr totals (quran/continue/weather can wait).
    void trackerStore.getState().load();

    const idle = runWhenIdle(() => {
      if (!mounted) return;
      void quranStore.getState().load();
      void continueStore.getState().load();
      void weatherStore.getState().load();
    });

    const scheduleWeatherSync = () => {
      weatherIdle?.cancel();
      weatherIdle = runWhenIdle(() => {
        if (!mounted) return;
        void weatherStore.getState().sync();
      });
    };

    const scheduleDayRollover = () => {
      if (dayRolloverTimer) clearTimeout(dayRolloverTimer);
      const delay = Math.min(msUntilNextLocalMidnight(), MAX_TIMEOUT_MS);
      dayRolloverTimer = setTimeout(() => {
        if (!mounted) return;
        // Carry excused periods / streak onto the new calendar day even when the
        // app stayed in the foreground past midnight.
        void trackerStore.getState().load();
        scheduleDayRollover();
      }, delay);
    };
    scheduleDayRollover();

    let lastCoords: { latitude: number; longitude: number } | null = null;
    const unsubscribeLocation = locationStore.subscribe(() => {
      const { latitude, longitude } = locationStore.getState().location;
      const unchanged =
        lastCoords && lastCoords.latitude === latitude && lastCoords.longitude === longitude;
      if (unchanged) return;
      lastCoords = { latitude, longitude };
      // Defer so GPS/coord updates do not land a weather re-render on the same
      // native layout pass as resume (iOS AppHang / Android ReactTextView ANR).
      scheduleWeatherSync();
    });

    const onChange = (status: AppStateStatus) => {
      if (!mounted || status !== "active") return;
      void locationStore.getState().refresh();
      scheduleWeatherSync();
      refreshTrackerForCurrentDay();
      scheduleDayRollover();
    };

    const subscription = AppState.addEventListener("change", onChange);
    return () => {
      mounted = false;
      idle.cancel();
      weatherIdle?.cancel();
      if (dayRolloverTimer) clearTimeout(dayRolloverTimer);
      unsubscribeLocation();
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
}
