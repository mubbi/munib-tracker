import { Platform } from "react-native";

import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  nativeCancelOngoingNotification,
  nativeUpdateOngoingNotification,
} from "@/lib/external-commands/native-bridge";
import { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";

export type { OngoingNotificationState } from "@/lib/ongoing-notification/state";
export { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";

export interface SyncOngoingNotificationInput {
  snapshot: WidgetSnapshot;
  /** The user's `liveActivityEnabled` preference (shared with iOS). */
  enabled: boolean;
  now?: Date;
}

/**
 * Reconciles the Android sticky "next Salah" notification (Phase 4, Android
 * counterpart to the iOS Live Activity) against the latest widget snapshot
 * and the user's preference: posts/refreshes it when enabled, cancels it
 * when disabled. No-ops on every platform but Android.
 */
export async function syncOngoingNotification({
  snapshot,
  enabled,
  now,
}: SyncOngoingNotificationInput): Promise<void> {
  if (Platform.OS !== "android") return;

  if (!enabled) {
    await nativeCancelOngoingNotification();
    return;
  }

  const state = buildOngoingNotificationState(snapshot, now);
  await nativeUpdateOngoingNotification(JSON.stringify(state));
}

/** Explicitly cancels the ongoing notification (e.g. when the user toggles it off). */
export async function stopOngoingNotification(): Promise<void> {
  if (Platform.OS !== "android") return;
  await nativeCancelOngoingNotification();
}
