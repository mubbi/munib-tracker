import { useEffect, useState } from "react";
import { Platform } from "react-native";

/** Best-effort online detection for version polling (no NetInfo dependency). */
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
    return undefined;
  }, []);

  return online;
}
