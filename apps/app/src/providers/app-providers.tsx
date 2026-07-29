import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type ReactNode, useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { runWhenIdle } from "@/lib/run-when-idle";
import { continueStore } from "@/stores/continue-store";
import { locationStore } from "@/stores/location-store";
import { quranStore } from "@/stores/quran-store";
import { trackerStore } from "@/stores/tracker-store";
import { weatherStore } from "@/stores/weather-store";

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

    let lastCoords: { latitude: number; longitude: number } | null = null;
    const unsubscribeLocation = locationStore.subscribe(() => {
      const { latitude, longitude } = locationStore.getState().location;
      const unchanged =
        lastCoords && lastCoords.latitude === latitude && lastCoords.longitude === longitude;
      if (unchanged) return;
      lastCoords = { latitude, longitude };
      void weatherStore.getState().sync();
    });

    const onChange = (status: AppStateStatus) => {
      if (!mounted || status !== "active") return;
      void locationStore.getState().refresh();
      void weatherStore.getState().sync();
      const tracker = trackerStore.getState();
      if (tracker.date !== getLocalDateString()) {
        void tracker.load();
      } else {
        void tracker.refresh();
      }
    };

    const subscription = AppState.addEventListener("change", onChange);
    return () => {
      mounted = false;
      idle.cancel();
      unsubscribeLocation();
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
}
