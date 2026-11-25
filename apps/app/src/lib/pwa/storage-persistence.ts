/**
 * Web: the tracker's data lives in browser storage (AsyncStorage → localStorage),
 * which browsers may evict under storage pressure — and WebKit clears
 * script-writable storage of sites not used for 7 days unless they run as a
 * Home Screen web app. `navigator.storage.persist()` asks the browser to keep it.
 *
 * Only requested inside the installed app: Chromium grants it silently for
 * installed apps, WebKit grants it to Home Screen web apps, and Firefox would
 * show a permission prompt for a plain tab — which we never trigger.
 */
import { isWebPushStandalonePwa } from "./display-mode";

type StorageManagerLike = {
  persist?: () => Promise<boolean>;
  persisted?: () => Promise<boolean>;
};

/** Resolves to whether storage is persistent afterwards (false when unsupported / not installed). */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || !isWebPushStandalonePwa()) return false;
    const storage = (navigator as Navigator & { storage?: StorageManagerLike }).storage;
    if (typeof storage?.persist !== "function") return false;
    if ((await storage.persisted?.()) === true) return true;
    return await storage.persist();
  } catch {
    return false;
  }
}
