/**
 * Local tracking-change signal (zikr counts …) for cloud sync.
 *
 * Tracking writes land in AsyncStorage with a fresh `updatedAt`, which `runSync`
 * already includes in its delta push — but `runSync` otherwise only runs on
 * sign-in, foreground (rate-limited) or "Sync now". The auth provider listens
 * here to push soon after the user records something (debounced, so a burst of
 * tasbeeh taps becomes one sync) and to flush before the app is backgrounded,
 * so another device sees the counts without waiting for a later foreground.
 *
 * Kept dependency-free so stores can emit without importing auth / network code.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let version = 0;
let syncedVersion = 0;

/** Record that tracking data changed locally (call after the write is persisted). */
export function markTrackingChanged(): void {
  version += 1;
  for (const listener of listeners) listener();
}

/** Monotonic change counter — capture before a sync, compare after. */
export function trackingChangeVersion(): number {
  return version;
}

/** True while some local tracking change has not been covered by a successful sync. */
export function hasUnsyncedTrackingChanges(): boolean {
  return version !== syncedVersion;
}

/** Mark every change up to `upTo` as pushed (a sync that began after them succeeded). */
export function markTrackingSynced(upTo: number): void {
  if (upTo > syncedVersion) syncedVersion = upTo;
}

export function onTrackingChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Jest-only: reset module state between tests. */
export function __resetTrackingChangesForTests(): void {
  listeners.clear();
  version = 0;
  syncedVersion = 0;
}
