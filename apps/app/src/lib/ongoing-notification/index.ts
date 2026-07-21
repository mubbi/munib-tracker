import { Platform } from "react-native";

import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  nativeCancelOngoingNotification,
  nativeUpdateOngoingNotification,
} from "@/lib/external-commands/native-bridge";
import { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";
import {
  buildSalahPhaseSchedule,
  type SalahTrackingSession,
  shouldPromoteSession,
} from "@/lib/salah-phase";

export type { OngoingNotificationState } from "@/lib/ongoing-notification/state";
export { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";

export interface SyncOngoingNotificationInput {
  snapshot: WidgetSnapshot;
  /**
   * Ambient sticky countdown when `liveActivityEnabled` is true (pre-Android 16
   * / non-promoted fallback). Promoted Live Updates require an explicit session.
   */
  enabled: boolean;
  /** Explicit "Track this Salah" session for Android 16 Live Updates. */
  session?: SalahTrackingSession | null;
  now?: Date;
}

/**
 * Reconciles the Android sticky / Live Update notification against the latest
 * widget snapshot, preference, and optional explicit tracking session.
 */
export async function syncOngoingNotification({
  snapshot,
  enabled,
  session,
  now,
}: SyncOngoingNotificationInput): Promise<void> {
  if (Platform.OS !== "android") return;

  const activeSession =
    session && session.status === "active" && !session.dismissed ? session : null;
  const promote = shouldPromoteSession(activeSession, snapshot, now);
  const showAmbient = enabled === true;

  if (!promote && !showAmbient) {
    await nativeCancelOngoingNotification();
    return;
  }

  if (activeSession?.dismissed) {
    await nativeCancelOngoingNotification();
    return;
  }

  const sessionId = activeSession?.sessionId ?? "ambient";
  const boundaries = buildSalahPhaseSchedule({
    snapshot,
    sessionId,
    stopLabel: "Stop",
    now,
  });
  const state = buildOngoingNotificationState({
    snapshot,
    sessionId,
    boundaries,
    requestPromoted: promote,
    now,
  });
  await nativeUpdateOngoingNotification(JSON.stringify(state));
}

/** Explicitly cancels the ongoing notification (e.g. when the user toggles it off). */
export async function stopOngoingNotification(): Promise<void> {
  if (Platform.OS !== "android") return;
  await nativeCancelOngoingNotification();
}
