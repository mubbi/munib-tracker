import type { SalahPhaseBoundary, SalahTrackingSession } from "@/lib/salah-phase/types";

/** An "upcoming Asr" phase boundary executing at 2026-07-03T15:00Z. */
export function buildSalahPhaseBoundary(
  overrides: Partial<SalahPhaseBoundary> = {},
): SalahPhaseBoundary {
  return {
    phase: "upcoming",
    executeAt: "2026-07-03T15:00:00.000Z",
    staleAt: "2026-07-03T15:30:00.000Z",
    prayerId: "asr",
    prayerName: "Asr",
    prayerTime: "15:30",
    prayerTimeLabel: "at 15:30",
    title: "Asr soon",
    body: "Prepare for Asr",
    actionLabel: "Mark Salah",
    actionDeepLink: "munib-tracker://tracker",
    webPath: "/tracker",
    targetTimeMs: Date.parse("2026-07-03T15:30:00.000Z"),
    dedupeKey: "asr:upcoming",
    progressPercent: 10,
    progressSegments: [1, 1, 1],
    progressPoints: [33, 66],
    shortCriticalText: "30m",
    stopLabel: "Stop",
    ...overrides,
  };
}

/** An active tracking session for Asr ending at 2026-07-03T16:30Z. */
export function buildSalahTrackingSession(
  overrides: Partial<SalahTrackingSession> = {},
): SalahTrackingSession {
  return {
    sessionId: "session-1",
    prayerId: "asr",
    prayerName: "Asr",
    startedAt: "2026-07-03T14:30:00.000Z",
    promoteAt: "2026-07-03T15:00:00.000Z",
    endsAt: "2026-07-03T16:30:00.000Z",
    dismissed: false,
    status: "active",
    ...overrides,
  };
}
