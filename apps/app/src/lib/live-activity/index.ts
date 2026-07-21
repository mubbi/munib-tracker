import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  endLiveActivity,
  isLiveActivityRunning,
  isLiveActivitySupported,
  startLiveActivity,
  updateLiveActivity,
} from "@/lib/live-activity/native";
import { registerLiveActivitySchedule } from "@/lib/live-activity/register";
import { buildLiveActivityState } from "@/lib/live-activity/state";

export {
  isLiveActivityRunning,
  isLiveActivitySupported,
  subscribeLiveActivityLifecycle,
  subscribeLiveActivityPushTokens,
} from "@/lib/live-activity/native";
export {
  handleLiveActivityPushToken,
  notifyLiveActivityLifecycle,
  registerLiveActivitySchedule,
  rememberLiveActivitySnapshot,
} from "@/lib/live-activity/register";
export { buildLiveActivityPushSchedule } from "@/lib/live-activity/schedule";
export type { LiveActivityState } from "@/lib/live-activity/state";
export { buildLiveActivityState } from "@/lib/live-activity/state";

export interface SyncLiveActivityInput {
  snapshot: WidgetSnapshot;
  /** The user's `liveActivityEnabled` preference. */
  enabled: boolean;
  now?: Date;
}

/**
 * Reconciles the iOS prayer Live Activity (NF-1.19) against the latest widget
 * snapshot and the user's preference: starts it when enabled and absent,
 * refreshes it when already running, and ends it when disabled. No-ops on any
 * platform without ActivityKit support (Android, web, Expo Go, iOS < 16.1).
 *
 * After a local start/update, also (re)registers the ActivityKit push token
 * schedule so phase transitions continue while the app is suspended.
 */
export async function syncLiveActivity({
  snapshot,
  enabled,
  now,
}: SyncLiveActivityInput): Promise<void> {
  if (!isLiveActivitySupported()) return;

  if (!enabled) {
    if (isLiveActivityRunning()) await endLiveActivity();
    await registerLiveActivitySchedule(snapshot, false);
    return;
  }

  const state = buildLiveActivityState(snapshot, now);
  if (isLiveActivityRunning()) {
    await updateLiveActivity(state);
  } else {
    await startLiveActivity(state);
  }
  await registerLiveActivitySchedule(snapshot, true);
}

/** Explicitly ends the prayer Live Activity (e.g. when the user toggles it off). */
export async function stopLiveActivity(): Promise<void> {
  if (!isLiveActivitySupported()) return;
  if (isLiveActivityRunning()) await endLiveActivity();
}
