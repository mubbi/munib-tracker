/**
 * Registers the Web Push service worker on web load.
 * Early registration improves installability signals (Android) and ensures push works after iOS Add to Home Screen.
 */
export function registerWebPwaServiceWorker(): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const swUrl = "/expo-service-worker.js";
  void navigator.serviceWorker.register(swUrl, { scope: "/" }).catch(() => {
    /* offline or blocked — install still works via manifest + apple-touch-icon */
  });
}
