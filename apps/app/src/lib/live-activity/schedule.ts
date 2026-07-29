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
      executeAt: boundary.executeAt,
      staleAt: boundary.staleAt,
      contentState: buildLiveActivityState(source, executeAt),
    };
  });
}

export { LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS, LIVE_ACTIVITY_MARK_WINDOW_MS };
