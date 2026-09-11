import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  buildLiveActivityState,
  LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
  LIVE_ACTIVITY_MARK_WINDOW_MS,
  type LiveActivityState,
} from "@/lib/live-activity/state";
import {
  buildSalahPhaseSchedule,
  SALAH_ACTIVITY_HORIZON_MS,
  snapshotForNextPrayerArrival,
} from "@/lib/salah-phase";

export { snapshotForNextPrayerArrival } from "@/lib/salah-phase";

export type LiveActivityPushUpdate = {
  phase: string;
  executeAt: string;
  staleAt?: string;
  contentState: LiveActivityState;
};

/**
 * Fire ActivityKit pushes this far before the true phase boundary. Native
 * `Text(timerInterval:)` stays at 00:00 until content-state is replaced, and
 * QStash/APNs routinely land a few seconds late if we wait until adhan.
 */
export const LIVE_ACTIVITY_PUSH_LEAD_MS = 20_000;

function withPushLead(executeAtIso: string, nowMs: number): string {
  const executeMs = Date.parse(executeAtIso);
  if (!Number.isFinite(executeMs) || executeMs <= nowMs) return executeAtIso;
  return new Date(Math.max(nowMs + 1_000, executeMs - LIVE_ACTIVITY_PUSH_LEAD_MS)).toISOString();
}

/**
 * Precomputes ActivityKit content-state updates at each phase boundary so the
 * API can push them while the app is suspended or killed.
 */
export function buildLiveActivityPushSchedule(
  snapshot: WidgetSnapshot,
  now: Date = new Date(),
): LiveActivityPushUpdate[] {
  const boundaries = buildSalahPhaseSchedule({
    snapshot,
    sessionId: "activitykit",
    stopLabel: "Stop",
    now,
    horizonMs: SALAH_ACTIVITY_HORIZON_MS,
  });
  const nowMs = now.getTime();

  return boundaries.map((boundary) => {
    const executeAt = new Date(boundary.executeAt);
    // Match buildSalahPhaseSchedule's source: after the next adhan arrives,
    // content must use the shifted snapshot (including upcoming-after-adhkar).
    // Using the original snapshot for every "upcoming" left post-adhkar
    // countdowns on the prayer that just ended.
    const source =
      Date.parse(boundary.executeAt) >= snapshot.nextPrayer.targetTimeMs
        ? snapshotForNextPrayerArrival(snapshot)
        : snapshot;
    return {
      phase: boundary.phase,
      executeAt: withPushLead(boundary.executeAt, nowMs),
      staleAt: boundary.staleAt,
      contentState: buildLiveActivityState(source, executeAt),
    };
  });
}

export { LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS, LIVE_ACTIVITY_MARK_WINDOW_MS };
