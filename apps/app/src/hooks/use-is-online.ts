import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

function isReachable(state: {
  isConnected?: boolean | null;
  isInternetReachable?: boolean | null;
}): boolean {
  if (state.isConnected === false) return false;
  // null means "unknown" on some platforms — treat as online so we still try sync.
  if (state.isInternetReachable === false) return false;
  return true;
}

/**
 * Online detection for sync / version polls / review submission.
 * Web uses `navigator.onLine`; native uses expo-network.
 */
export function useIsOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      setOnline(window.navigator.onLine);
      const onOnline = () => setOnline(true);
      const onOffline = () => setOnline(false);
      window.addEventListener("online", onOnline);
      window.addEventListener("offline", onOffline);
      return () => {
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      };
    }

    let subscription: { remove: () => void } | undefined;
    void (async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        setOnline(isReachable(state));
      } catch {
        setOnline(true);
      }
      subscription = Network.addNetworkStateListener((state) => {
        setOnline(isReachable(state));
      });
    })();

    return () => subscription?.remove();
  }, []);

  return online;
}
