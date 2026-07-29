/**
 * Platform-neutral Salah phase contract shared by iOS Live Activity, Android
 * Live Updates, Expo data pushes, and Web Push schedules.
 */

export type SalahPhase = "upcoming" | "markSalah" | "afterSalah" | "ended";

export const SALAH_PHASE_MARK_WINDOW_MS = 15 * 60_000;
export const SALAH_PHASE_AFTER_WINDOW_MS = 30 * 60_000;

/** Soft placeholder until the app rebuilds the snapshot after the next Salah. */
export const SALAH_FOLLOWING_FALLBACK_MS = 2 * 60 * 60_000;

/** ActivityKit practical lifetime (~8h). */
export const SALAH_ACTIVITY_HORIZON_MS = 7 * 60 * 60_000 + 45 * 60_000;

/** Web Push rolling schedule horizon (matches reminder SCHEDULE_DAYS_AHEAD). */
export const SALAH_WEB_PUSH_HORIZON_MS = 2 * 24 * 60 * 60_000;

export type SalahPhaseBoundary = {
  phase: SalahPhase;
  /** ISO execute time for this phase flip. */
  executeAt: string;
  /** Optional soft expiry for consumers that support stale content. */
  staleAt?: string;
  prayerId: string;
  prayerName: string;
  prayerTime: string;
  prayerTimeLabel: string;
  title: string;
  body: string;
  actionLabel: string;
  /** App deep link (`munib-tracker://…`) or same-origin path (`/tracker`). */
  actionDeepLink: string;
  /** Same-origin web path for PWA / service-worker routing. */
  webPath: string;
  targetTimeMs: number;
  dedupeKey: string;
  /** Progress bar value 0–100 for Android ProgressStyle. */
  progressPercent: number;
  /** Segment lengths for upcoming / mark / after journey (relative units). */
  progressSegments: [number, number, number];
  /** Absolute progress points (milestones) along the bar. */
  progressPoints: number[];
  shortCriticalText: string;
  stopLabel: string;
};

export type SalahTrackingSession = {
  /** Stable id for this tracked Salah journey (client-generated UUID). */
  sessionId: string;
  /** Prayer being tracked (upcoming or current). */
  prayerId: string;
  prayerName: string;
  /** When tracking was started (ISO). */
  startedAt: string;
  /** When the promoted Live Update should begin (ISO); may equal startedAt when imminent. */
  promoteAt: string;
  /** Session end (ISO) — after-Salah window close or explicit stop. */
  endsAt: string;
  /** User dismissed / unpinned; do not repost until a new Track tap. */
  dismissed: boolean;
  /** Explicit stop or natural completion. */
  status: "active" | "ended" | "dismissed";
};
