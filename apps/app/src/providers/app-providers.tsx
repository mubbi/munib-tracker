import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type ReactNode, useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { preferencesStore } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

/**
 * Boots the local data stores and keeps them fresh when the app returns to the
 * foreground or the calendar day rolls over. Wraps the app below the theme
 * provider so every screen reads live data from the same source of truth.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    let mounted = true;
    void preferencesStore.getState().load();
    void trackerStore.getState().load();

    const onChange = (status: AppStateStatus) => {
      if (!mounted || status !== "active") return;
      const tracker = trackerStore.getState();
      // A new day means a fresh set of prayers/zikr targets.
      if (tracker.date !== getLocalDateString()) {
        void tracker.load();
      } else {
        void tracker.refresh();
      }
    };

    const subscription = AppState.addEventListener("change", onChange);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
}
