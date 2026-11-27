import { useEffect } from "react";
import { Platform } from "react-native";

import { registerWebPwaServiceWorker } from "@/lib/pwa/register-service-worker";
import { requestPersistentStorage } from "@/lib/pwa/storage-persistence";
import { listenForInstallPrompt } from "./install-prompt-store";

/**
 * Web startup: registers the PWA service worker, starts capturing the Chromium
 * `beforeinstallprompt` event (it fires once, before the home screen's install
 * banner mounts), and — inside the installed app — asks the browser to keep the
 * app's storage (offline tracker data) from being evicted.
 */
export function WebPwaBootstrap() {
  useEffect(() => {
    if (Platform.OS !== "web") return;
    registerWebPwaServiceWorker();
    void requestPersistentStorage();
    return listenForInstallPrompt();
  }, []);

  return null;
}
