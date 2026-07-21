import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  buildLiveActivityState,
  LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
  LIVE_ACTIVITY_MARK_WINDOW_MS,
  type LiveActivityState,
} from "@/lib/live-activity/state";

/** Soft placeholder until the app rebuilds the snapshot after the next Salah. */
const FOLLOWING_FALLBACK_MS = 2 * 60 * 60_000;
/** Keep schedules inside ActivityKit's practical lifetime. */
const ACTIVITY_SCHEDULE_HORIZON_MS = 7 * 60 * 60_000 + 45 * 60_000;

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
  if (snapshot.locationDenied) return [];

  const updates: LiveActivityPushUpdate[] = [];
  const horizon = now.getTime() + ACTIVITY_SCHEDULE_HORIZON_MS;
  const currentAt = snapshot.nextPrayer.currentPrayerAtMs;
  const nextAt = snapshot.nextPrayer.targetTimeMs;

  const push = (executeAtMs: number, source: WidgetSnapshot) => {
    if (!Number.isFinite(executeAtMs) || executeAtMs <= now.getTime() + 1_000) return;
    if (executeAtMs > horizon) return;
    const executeAt = new Date(executeAtMs);
    const state = buildLiveActivityState(source, executeAt);
    updates.push({
      phase: state.phase,
      executeAt: executeAt.toISOString(),
      staleAt: new Date(
        Math.min(executeAtMs + LIVE_ACTIVITY_MARK_WINDOW_MS, horizon),
      ).toISOString(),
      contentState: state,
    });
  };

  if (currentAt > 0) {
    push(currentAt + LIVE_ACTIVITY_MARK_WINDOW_MS, snapshot);
    push(currentAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS, snapshot);
  }

  if (nextAt > now.getTime()) {
    const arrived = snapshotForNextPrayerArrival(snapshot);
    push(nextAt, arrived);
    push(nextAt + LIVE_ACTIVITY_MARK_WINDOW_MS, arrived);
    push(nextAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS, arrived);
  }

  // Deduplicate by executeAt (same boundary from overlapping windows).
  const byExecuteAt = new Map<string, LiveActivityPushUpdate>();
  for (const update of updates) {
    byExecuteAt.set(update.executeAt, update);
  }
  return [...byExecuteAt.values()].sort((a, b) => a.executeAt.localeCompare(b.executeAt));
}

/** Shifts "current" to today's next Salah so mark/after phases decode correctly. */
export function snapshotForNextPrayerArrival(snapshot: WidgetSnapshot): WidgetSnapshot {
  const np = snapshot.nextPrayer;
  const arrivalMs = np.targetTimeMs;
  return {
    ...snapshot,
    nextPrayer: {
      ...np,
      currentPrayerId: np.prayerId,
      currentPrayerName: np.prayerName,
      currentPrayerTime: np.prayerTime,
      currentPrayerTimeLabel: np.prayerTimeLabel,
      currentPrayerAtMs: arrivalMs,
      prayerId: np.followingName ? "following" : np.prayerId,
      prayerName: np.followingName || np.prayerName,
      prayerTime: np.followingTime || np.prayerTime,
      prayerTimeLabel: np.followingTime
        ? np.prayerTimeLabel.replace(np.prayerTime, np.followingTime)
        : np.prayerTimeLabel,
      targetTimeMs: arrivalMs + FOLLOWING_FALLBACK_MS,
      minutesUntil: Math.round(FOLLOWING_FALLBACK_MS / 60_000),
    },
    schedule: {
      ...snapshot.schedule,
      rows: snapshot.schedule.rows.map((row) => {
        if (row.id === np.prayerId) return { ...row, status: "active" as const };
        if (row.id === np.currentPrayerId) return { ...row, status: "completed" as const };
        return row;
      }),
    },
  };
}
