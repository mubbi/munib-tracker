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
  return {
    phase,
    executeAt: executeAt.toISOString(),
    staleAt: new Date(Math.min(executeAtMs + SALAH_PHASE_MARK_WINDOW_MS, horizon)).toISOString(),
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
 */
export function buildSalahPhaseSchedule(input: BuildSalahPhaseScheduleInput): SalahPhaseBoundary[] {
  const { snapshot, sessionId, stopLabel } = input;
  if (snapshot.locationDenied) return [];

  const now = input.now ?? new Date();
  const horizon = now.getTime() + (input.horizonMs ?? SALAH_ACTIVITY_HORIZON_MS);
  const currentAt = snapshot.nextPrayer.currentPrayerAtMs;
  const nextAt = snapshot.nextPrayer.targetTimeMs;
  const updates: SalahPhaseBoundary[] = [];

  const push = (executeAtMs: number, source: WidgetSnapshot) => {
    if (executeAtMs <= now.getTime() + 1_000) return;
    const boundary = boundaryFromSnapshot(source, executeAtMs, horizon, sessionId, stopLabel);
    if (boundary) updates.push(boundary);
  };

  if (currentAt > 0) {
    push(currentAt + SALAH_PHASE_MARK_WINDOW_MS, snapshot);
    push(currentAt + SALAH_PHASE_AFTER_WINDOW_MS, snapshot);
  }

  if (nextAt > now.getTime()) {
    const arrived = snapshotForNextPrayerArrival(snapshot);
    push(nextAt, arrived);
    push(nextAt + SALAH_PHASE_MARK_WINDOW_MS, arrived);
    push(nextAt + SALAH_PHASE_AFTER_WINDOW_MS, arrived);
  }

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
