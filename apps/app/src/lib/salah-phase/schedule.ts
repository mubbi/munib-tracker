import { buildAppUrl } from "@/lib/app-links";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import {
  SALAH_ACTIVITY_HORIZON_MS,
  SALAH_FOLLOWING_FALLBACK_MS,
  SALAH_PHASE_AFTER_WINDOW_MS,
  SALAH_PHASE_MARK_WINDOW_MS,
  type SalahPhase,
  type SalahPhaseBoundary,
} from "@/lib/salah-phase/types";

export type {
  SalahPhase,
  SalahPhaseBoundary,
  SalahTrackingSession,
} from "@/lib/salah-phase/types";
export {
  SALAH_ACTIVITY_HORIZON_MS,
  SALAH_FOLLOWING_FALLBACK_MS,
  SALAH_PHASE_AFTER_WINDOW_MS,
  SALAH_PHASE_MARK_WINDOW_MS,
  SALAH_WEB_PUSH_HORIZON_MS,
} from "@/lib/salah-phase/types";

/** Resolve which phase the snapshot is in at `now`. */
export function resolveSalahPhase(snapshot: WidgetSnapshot, now: Date = new Date()): SalahPhase {
  const { nextPrayer } = snapshot;
  const elapsedSinceCurrent = now.getTime() - nextPrayer.currentPrayerAtMs;
  const currentPrayerIsRecent =
    nextPrayer.currentPrayerAtMs > 0 &&
    elapsedSinceCurrent >= 0 &&
    elapsedSinceCurrent < SALAH_PHASE_AFTER_WINDOW_MS;
  if (!currentPrayerIsRecent) return "upcoming";
  const currentPrayerCompleted =
    snapshot.schedule.rows.find((row) => row.id === nextPrayer.currentPrayerId)?.status ===
    "completed";
  if (currentPrayerCompleted || elapsedSinceCurrent >= SALAH_PHASE_MARK_WINDOW_MS) {
    return "afterSalah";
  }
  return "markSalah";
}

export function actionForPhase(
  phase: SalahPhase,
  snapshot: WidgetSnapshot,
): { actionLabel: string; actionDeepLink: string; webPath: string } {
  if (phase === "markSalah") {
    return {
      actionLabel: snapshot.strings.markSalah,
      actionDeepLink: buildAppUrl("/mark-current"),
      webPath: "/tracker",
    };
  }
  if (phase === "afterSalah") {
    return {
      actionLabel: snapshot.strings.afterSalahAdhkar,
      actionDeepLink: buildAppUrl(
        `/zikr/after_prayer?prayer=${snapshot.nextPrayer.currentPrayerId}`,
      ),
      webPath: `/zikr/after_prayer?prayer=${snapshot.nextPrayer.currentPrayerId}`,
    };
  }
  if (phase === "ended") {
    return {
      actionLabel: snapshot.strings.markSalah,
      actionDeepLink: buildAppUrl("/tracker"),
      webPath: "/tracker",
    };
  }
  return {
    actionLabel: snapshot.strings.prepareSalah,
    actionDeepLink: buildAppUrl("/zikr/before_prayer"),
    webPath: "/zikr/before_prayer",
  };
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
      targetTimeMs: arrivalMs + SALAH_FOLLOWING_FALLBACK_MS,
      minutesUntil: Math.round(SALAH_FOLLOWING_FALLBACK_MS / 60_000),
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

function progressForPhase(phase: SalahPhase): {
  progressPercent: number;
  progressSegments: [number, number, number];
  progressPoints: number[];
} {
  // Relative segment lengths: countdown → mark window → after-Salah window.
  const segments: [number, number, number] = [60, 15, 30];
  const points = [60, 75];
  if (phase === "upcoming")
    return { progressPercent: 20, progressSegments: segments, progressPoints: points };
  if (phase === "markSalah")
    return { progressPercent: 65, progressSegments: segments, progressPoints: points };
  if (phase === "afterSalah")
    return { progressPercent: 85, progressSegments: segments, progressPoints: points };
  return { progressPercent: 100, progressSegments: segments, progressPoints: points };
}

function shortCritical(phase: SalahPhase, prayerName: string, minutesUntil: number): string {
  if (phase === "upcoming") {
    if (minutesUntil <= 0) return prayerName.slice(0, 6);
    if (minutesUntil < 60) return `${minutesUntil}m`;
    return `${Math.floor(minutesUntil / 60)}h`;
  }
  if (phase === "markSalah") return "Mark";
  if (phase === "afterSalah") return "Adhkar";
  return "Done";
}

function boundaryFromSnapshot(
  snapshot: WidgetSnapshot,
  executeAtMs: number,
  horizon: number,
  sessionId: string,
  stopLabel: string,
  nowMs: number = Date.now(),
): SalahPhaseBoundary | null {
  if (!Number.isFinite(executeAtMs) || executeAtMs > horizon) return null;
  const executeAt = new Date(executeAtMs);
  const phase = resolveSalahPhase(snapshot, executeAt);
  const showingCurrent = phase !== "upcoming";
  const prayerId = showingCurrent
    ? snapshot.nextPrayer.currentPrayerId
    : snapshot.nextPrayer.prayerId;
  const prayerName = showingCurrent
    ? snapshot.nextPrayer.currentPrayerName
    : snapshot.nextPrayer.prayerName;
  const prayerTime = showingCurrent
    ? snapshot.nextPrayer.currentPrayerTime
    : snapshot.nextPrayer.prayerTime;
  const prayerTimeLabel = showingCurrent
    ? snapshot.nextPrayer.currentPrayerTimeLabel
    : snapshot.nextPrayer.prayerTimeLabel;
  const action = actionForPhase(phase, snapshot);
  const progress = progressForPhase(phase);
  const minutesUntil = Math.max(
    0,
    Math.round((snapshot.nextPrayer.targetTimeMs - executeAtMs) / 60_000),
  );
  // Overdue catch-ups must not advertise a staleAt already in the past.
  const staleFrom = Math.max(executeAtMs, nowMs);
  return {
    phase,
    executeAt: executeAt.toISOString(),
    staleAt: new Date(Math.min(staleFrom + SALAH_PHASE_MARK_WINDOW_MS, horizon)).toISOString(),
    prayerId,
    prayerName,
    prayerTime,
    prayerTimeLabel,
    title: showingCurrent ? action.actionLabel : snapshot.nextPrayer.title,
    body: prayerTimeLabel,
    actionLabel: action.actionLabel,
    actionDeepLink: action.actionDeepLink,
    webPath: action.webPath,
    targetTimeMs: snapshot.nextPrayer.targetTimeMs,
    dedupeKey: `${sessionId}:${phase}:${executeAt.toISOString()}`,
    progressPercent: progress.progressPercent,
    progressSegments: progress.progressSegments,
    progressPoints: progress.progressPoints,
    shortCriticalText: shortCritical(phase, prayerName, minutesUntil),
    stopLabel,
  };
}

export type BuildSalahPhaseScheduleInput = {
  snapshot: WidgetSnapshot;
  sessionId: string;
  stopLabel: string;
  now?: Date;
  /** Horizon in ms from now (ActivityKit ~8h, Web Push 48h). */
  horizonMs?: number;
};

/**
 * Precomputes phase boundaries for remote delivery (APNs / Expo Push / Web Push)
 * and Android AlarmManager schedules.
 *
 * Future flips are scheduled at their real boundary times. The latest flip that
 * is already due is also kept (same `executeAt`) so a reschedule that cancels
 * QStash mid-flight can still re-queue an overdue afterSalah→upcoming (etc.)
 * update instead of leaving ActivityKit stuck until the app opens.
 */
export function buildSalahPhaseSchedule(input: BuildSalahPhaseScheduleInput): SalahPhaseBoundary[] {
  const { snapshot, sessionId, stopLabel } = input;
  if (snapshot.locationDenied) return [];

  const now = input.now ?? new Date();
  const nowMs = now.getTime();
  const horizon = nowMs + (input.horizonMs ?? SALAH_ACTIVITY_HORIZON_MS);
  const currentAt = snapshot.nextPrayer.currentPrayerAtMs;
  const nextAt = snapshot.nextPrayer.targetTimeMs;
  const updates: SalahPhaseBoundary[] = [];

  const push = (executeAtMs: number, source: WidgetSnapshot, allowOverdue = false) => {
    if (!Number.isFinite(executeAtMs) || executeAtMs > horizon) return;
    if (!allowOverdue && executeAtMs <= nowMs + 1_000) return;
    // Ignore flips older than the after-Salah window — too late to matter.
    if (allowOverdue && executeAtMs <= nowMs - SALAH_PHASE_AFTER_WINDOW_MS) return;
    if (allowOverdue && executeAtMs > nowMs + 1_000) return;
    const boundary = boundaryFromSnapshot(
      source,
      executeAtMs,
      horizon,
      sessionId,
      stopLabel,
      nowMs,
    );
    if (boundary) updates.push(boundary);
  };

  if (currentAt > 0) {
    push(currentAt + SALAH_PHASE_MARK_WINDOW_MS, snapshot);
    push(currentAt + SALAH_PHASE_AFTER_WINDOW_MS, snapshot);
  }

  if (nextAt > nowMs) {
    const arrived = snapshotForNextPrayerArrival(snapshot);
    push(nextAt, arrived);
    push(nextAt + SALAH_PHASE_MARK_WINDOW_MS, arrived);
    push(nextAt + SALAH_PHASE_AFTER_WINDOW_MS, arrived);
  }

  // Re-queue the most recent due flip so cancel/recreate churn (or a missed
  // QStash delivery) cannot leave the lock-screen surface on afterSalah.
  const overdue: { at: number; source: WidgetSnapshot }[] = [];
  if (currentAt > 0) {
    overdue.push(
      { at: currentAt + SALAH_PHASE_MARK_WINDOW_MS, source: snapshot },
      { at: currentAt + SALAH_PHASE_AFTER_WINDOW_MS, source: snapshot },
    );
  }
  if (nextAt > 0 && nextAt <= nowMs + SALAH_PHASE_AFTER_WINDOW_MS) {
    const arrived = snapshotForNextPrayerArrival(snapshot);
    overdue.push(
      { at: nextAt, source: arrived },
      { at: nextAt + SALAH_PHASE_MARK_WINDOW_MS, source: arrived },
      { at: nextAt + SALAH_PHASE_AFTER_WINDOW_MS, source: arrived },
    );
  }
  const latestDue = overdue
    .filter((item) => item.at <= nowMs)
    .sort((a, b) => a.at - b.at)
    .at(-1);
  if (latestDue) push(latestDue.at, latestDue.source, true);

  const byExecuteAt = new Map<string, SalahPhaseBoundary>();
  for (const update of updates) {
    byExecuteAt.set(update.executeAt, update);
  }
  return [...byExecuteAt.values()].sort((a, b) => a.executeAt.localeCompare(b.executeAt));
}

/** When a Live Update should promote: only when Salah is imminent (≤ 30 min) or already in a phase window. */
export function isSalahImminent(snapshot: WidgetSnapshot, now: Date = new Date()): boolean {
  const phase = resolveSalahPhase(snapshot, now);
  if (phase !== "upcoming") return true;
  const msUntil = snapshot.nextPrayer.targetTimeMs - now.getTime();
  return msUntil > 0 && msUntil <= 30 * 60_000;
}
