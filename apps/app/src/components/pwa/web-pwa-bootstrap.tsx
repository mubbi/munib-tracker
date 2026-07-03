import { useEffect } from "react";
import { Platform } from "react-native";

import { registerWebPwaServiceWorker } from "@/lib/pwa/register-service-worker";

/** Registers the PWA service worker once on web startup. */
export function WebPwaBootstrap() {
  useEffect(() => {
    if (Platform.OS === "web") {
      registerWebPwaServiceWorker();
    }
  }, []);

  return null;
}
