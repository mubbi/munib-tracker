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

/**
 * Version check via public GET /version/meta:
 * - Always on launch and when the app returns to foreground.
 * - Every 30 minutes when logged out or offline.
 */
export function useAppVersionBackgroundSync(
  onMeta: (meta: AppVersionMeta) => void,
  enabled = true,
): void {
  const { isAuthenticated, session } = useAuth();
  const isOnline = useIsOnline();
  const pollOnInterval = needsExplicitVersionPolling({
    isLoggedIn: isAuthenticated,
    isOnline,
  });

  const onMetaRef = useRef(onMeta);
  onMetaRef.current = onMeta;
  const inFlightRef = useRef(false);
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!enabled) return;

    const run = () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      void fetchAppVersionMeta(accessToken)
        .then((meta) => {
          if (meta) onMetaRef.current(meta);
        })
        .finally(() => {
          inFlightRef.current = false;
        });
    };

    run();

    const intervalId = pollOnInterval
      ? setInterval(run, APP_VERSION_BACKGROUND_POLL_MS)
      : undefined;

    const onAppState = (next: AppStateStatus) => {
      if (next === "active") run();
    };
    const appStateSub = AppState.addEventListener("change", onAppState);

    if (Platform.OS === "web" && typeof document !== "undefined") {
      const onVisibility = () => {
        if (document.visibilityState === "visible") run();
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        if (intervalId !== undefined) clearInterval(intervalId);
        appStateSub.remove();
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      appStateSub.remove();
    };
  }, [pollOnInterval, enabled, accessToken]);
}
