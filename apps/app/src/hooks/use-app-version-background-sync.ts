import {
  APP_VERSION_BACKGROUND_POLL_MS,
  type AppVersionMeta,
  fetchAppVersionMeta,
} from "@munib-tracker/api-client";
import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus, Platform } from "react-native";
import { useIsOnline } from "@/hooks/use-is-online";
import { needsExplicitVersionPolling } from "@/lib/app/app-version-background-check";
import { useAuth } from "@/providers/auth-provider";

const VERSION_FOCUS_MIN_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Version check via public GET /version/meta:
 * - Always on launch and when the app returns to foreground.
 * - Every 30 minutes when logged out or offline.
 */
export function useAppVersionBackgroundSync(
  onMeta: (meta: AppVersionMeta) => void,
  enabled = true,
): void {
  const { isAuthenticated } = useAuth();
  const isOnline = useIsOnline();
  const pollOnInterval = needsExplicitVersionPolling({
    isLoggedIn: isAuthenticated,
    isOnline,
  });

  const onMetaRef = useRef(onMeta);
  onMetaRef.current = onMeta;
  const inFlightRef = useRef(false);
  const lastRunAtRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const run = (force = false) => {
      if (inFlightRef.current) return;
      if (!force && Date.now() - lastRunAtRef.current < VERSION_FOCUS_MIN_INTERVAL_MS) return;
      inFlightRef.current = true;
      lastRunAtRef.current = Date.now();
      // Public endpoint: auth state/token rotation must not restart this effect.
      void fetchAppVersionMeta()
        .then((meta) => {
          if (meta) onMetaRef.current(meta);
        })
        .finally(() => {
          inFlightRef.current = false;
        });
    };

    run(true);

    const intervalId = pollOnInterval
      ? setInterval(run, APP_VERSION_BACKGROUND_POLL_MS)
      : undefined;

    if (Platform.OS === "web" && typeof document !== "undefined") {
      const onVisibility = () => {
        if (document.visibilityState === "visible") run();
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        if (intervalId !== undefined) clearInterval(intervalId);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    const onAppState = (next: AppStateStatus) => {
      if (next === "active") run();
    };
    const appStateSub = AppState.addEventListener("change", onAppState);

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      appStateSub.remove();
    };
  }, [pollOnInterval, enabled]);
}
