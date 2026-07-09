import { useEffect, useState } from "react";
import { Platform } from "react-native";

/** Best-effort online check for review feedback submission. */
export function useIsOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      setOnline(navigator.onLine);
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
