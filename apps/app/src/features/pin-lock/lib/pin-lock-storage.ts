import { Platform } from "react-native";

import { isExpoGo } from "@/lib/notifications/platform";
import { deleteSecureItem, setSecureItem } from "@/lib/storage/safe-secure-store";

export const PIN_STORE_KEY = "munib_tracker_pin_hash";
export const PIN_ENABLED_KEY = "munib_tracker_pin_enabled";
export const PIN_LOCKOUT_UNTIL_KEY = "munib_tracker_pin_lockout_until";
export const PIN_FAILED_ATTEMPTS_KEY = "munib_tracker_pin_failed_attempts";
export const LOCK_TIMEOUT_STORAGE_KEY = "munib_tracker_pin_lock_timeout_ms";

/** Remove PIN hash, lockout, and timeout from secure storage (sign-out / factory reset). */
export async function clearPinLockStorage(): Promise<void> {
  if (Platform.OS === "web" || isExpoGo()) return;
  try {
    await Promise.all([
      deleteSecureItem(PIN_STORE_KEY),
      deleteSecureItem(PIN_ENABLED_KEY),
      deleteSecureItem(PIN_LOCKOUT_UNTIL_KEY),
      deleteSecureItem(PIN_FAILED_ATTEMPTS_KEY),
    ]);
  } catch {
    // ignore
  }
  await setSecureItem(LOCK_TIMEOUT_STORAGE_KEY, "0").catch(() => {});
}
