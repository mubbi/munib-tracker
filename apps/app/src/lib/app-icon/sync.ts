import { AppState, Platform } from "react-native";

import { type AppIconPreference, resolveAppIcon } from "./icons";
import { appIconSupported, getAppIcon, isAppIconModuleAvailable, setAppIcon } from "./native";

export type AppIconSyncResult = "changed" | "unchanged" | "unsupported" | "deferred" | "failed";

let queue: Promise<unknown> = Promise.resolve();

/**
 * Brings the launcher icon in line with the preference (and, in seasonal mode,
 * today's Hijri date). Cheap to call on every foreground: the native side is only
 * asked to change when the wanted icon differs from the current one, so iOS shows
 * its "icon changed" alert once per season boundary, never on a plain resume.
 *
 * Calls run one after another, so a settings change racing a foreground event
 * re-reads the icon the first run just set instead of requesting it twice.
 */
export interface SyncAppIconOptions {
  now?: Date;
  /** IANA zone of the stored location (same "today" as the home hero). */
  timeZone?: string;
  /** Defaults to the live `AppState.currentState` (injectable for tests). */
  appState?: string | null;
}

export function syncAppIcon(
  preference: AppIconPreference,
  opts: SyncAppIconOptions = {},
): Promise<AppIconSyncResult> {
  const next = queue.then(() => run(preference, opts));
  queue = next.catch(() => undefined);
  return next;
}

async function run(
  preference: AppIconPreference,
  { now, timeZone, appState = AppState.currentState }: SyncAppIconOptions,
): Promise<AppIconSyncResult> {
  if (!isAppIconModuleAvailable()) return "unsupported";
  // iOS rejects alternate-icon changes unless the app is active.
  if (Platform.OS === "ios" && appState !== "active") return "deferred";
  try {
    if (!(await appIconSupported())) return "unsupported";
    const wanted = resolveAppIcon(preference, now ?? new Date(), timeZone);
    const current = await getAppIcon();
    if (current === wanted) return "unchanged";
    return (await setAppIcon(wanted)) ? "changed" : "unchanged";
  } catch {
    // e.g. the app went inactive between the check and the call — the next
    // foreground retries; never surface this to the user.
    return "failed";
  }
}
