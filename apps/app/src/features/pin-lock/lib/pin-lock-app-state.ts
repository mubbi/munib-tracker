import type { AppStateStatus } from "react-native";

/**
 * Only true background counts as leaving the app. `inactive` fires for system sheets,
 * biometrics, Control Center, and in-app modals — must not trigger PIN lock.
 */
export function shouldRecordBackgroundTransition(nextState: AppStateStatus): boolean {
  return nextState === "background";
}

/** Lock when returning to foreground after a real background stint and timeout elapsed. */
export function shouldLockOnForeground(options: {
  wasBackgrounded: boolean;
  backgroundedAt: number | null;
  lockTimeoutMs: number;
  now?: number;
}): boolean {
  const { wasBackgrounded, backgroundedAt, lockTimeoutMs, now = Date.now() } = options;
  if (!wasBackgrounded || backgroundedAt == null) return false;
  const elapsed = now - backgroundedAt;
  return lockTimeoutMs === 0 || elapsed >= lockTimeoutMs;
}
