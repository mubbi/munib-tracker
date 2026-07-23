import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import type { LiveActivityState } from "@/lib/live-activity/state";
import { isTV } from "@/lib/platform/is-tv";

export type LiveActivityPushTokenEvent = {
  activityId: string;
  pushToken: string;
  environment: "sandbox" | "production";
};

export type LiveActivityLifecycleEvent = {
  activityId: string;
  state: "active" | "stale" | "ended" | "dismissed" | "unknown";
};

/**
 * Optional native interface backed by the local Expo module in
 * `modules/munib-live-activity` (iOS ActivityKit). It is `null` on Android, web,
 * and Expo Go — every caller must tolerate that and no-op. See
 * `docs/NATIVE_SURFACES.md`.
 */
interface LiveActivityNativeModule {
  /** iOS 16.1+ AND the user has Live Activities enabled for the app. */
  isSupported(): boolean;
  /** Whether a prayer Live Activity is currently running. */
  isRunning(): boolean;
  /** Starts (or replaces) the prayer Live Activity; resolves to its id or null. */
  start(state: LiveActivityState): Promise<string | null>;
  /** Pushes a new content state to the running activity. */
  update(state: LiveActivityState): Promise<void>;
  /** Ends the running prayer Live Activity, if any. */
  end(): Promise<void>;
  addListener?(
    event: "onPushToken",
    listener: (event: LiveActivityPushTokenEvent) => void,
  ): { remove: () => void };
  addListener?(
    event: "onActivityState",
    listener: (event: LiveActivityLifecycleEvent) => void,
  ): { remove: () => void };
}

const nativeModule =
  Platform.OS === "ios"
    ? requireOptionalNativeModule<LiveActivityNativeModule>("MunibLiveActivity")
    : null;

/** True when the device can actually present a prayer Live Activity. */
export function isLiveActivitySupported(): boolean {
  if (isTV()) return false;
  try {
    return nativeModule?.isSupported() ?? false;
  } catch {
    return false;
  }
}

/** True when a prayer Live Activity is currently on screen. */
export function isLiveActivityRunning(): boolean {
  try {
    return nativeModule?.isRunning() ?? false;
  } catch {
    return false;
  }
}

export async function startLiveActivity(state: LiveActivityState): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.start(state);
  } catch {
    /* Activity could not start (permissions, OS limit) — silently ignore. */
  }
}

export async function updateLiveActivity(state: LiveActivityState): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.update(state);
  } catch {
    /* Ignore transient update failures; the next sync will retry. */
  }
}

export async function endLiveActivity(): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.end();
  } catch {
    /* Ignore — activity may already be gone. */
  }
}

export function subscribeLiveActivityPushTokens(
  listener: (event: LiveActivityPushTokenEvent) => void,
): () => void {
  if (!nativeModule?.addListener) return () => {};
  try {
    const subscription = nativeModule.addListener("onPushToken", listener);
    return () => subscription.remove();
  } catch {
    return () => {};
  }
}

export function subscribeLiveActivityLifecycle(
  listener: (event: LiveActivityLifecycleEvent) => void,
): () => void {
  if (!nativeModule?.addListener) return () => {};
  try {
    const subscription = nativeModule.addListener("onActivityState", listener);
    return () => subscription.remove();
  } catch {
    return () => {};
  }
}
