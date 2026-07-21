import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { DEFAULT_LOCATION } from "@/lib/location";
import {
  buildSalahPhaseSchedule,
  createSalahTrackingSession,
  resolveSalahPhase,
  SALAH_PHASE_MARK_WINDOW_MS,
  shouldPromoteSession,
} from "@/lib/salah-phase";

const t = (_key: string, fallback: string, options?: Record<string, unknown>) => {
  if (options) {
    return fallback.replace(/\{\{(\w+)\}\}/g, (_, name) => String(options[name] ?? ""));
  }
  return fallback;
};

function makeSnapshot(now: Date) {
  return buildWidgetSnapshot({
    location: DEFAULT_LOCATION,
    locationDenied: false,
    locale: "en",
    translationLocale: "en",
    calendar: "hijri",
    timeFormat: "24",
    theme: { isDark: false, primaryColor: "#059669", followsSystem: true },
    salahCompleted: 1,
    salahTotal: 5,
    prayerStatus: { fajr: "completed" },
    streakDays: 0,
    qazaRemaining: 0,
    qazaCompletedToday: 0,
    qazaTargetToday: 0,
    khatmPlan: null,
    khatmAyahsRead: 0,
    tasbeehToday: null,
    fridayChecklistDone: {},
    now,
    t,
  });
}

describe("salah-phase", () => {
  it("resolves upcoming before the next Salah", () => {
    const now = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(now);
    expect(resolveSalahPhase(snapshot, now)).toBe("upcoming");
  });

  it("builds future phase boundaries with dedupe keys", () => {
    const now = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(now);
    const session = createSalahTrackingSession(snapshot, now);
    const boundaries = buildSalahPhaseSchedule({
      snapshot,
      sessionId: session.sessionId,
      stopLabel: "Stop",
      now,
    });
    expect(boundaries.length).toBeGreaterThan(0);
    expect(boundaries.every((b) => b.dedupeKey.includes(session.sessionId))).toBe(true);
    expect(boundaries.every((b) => b.webPath.startsWith("/"))).toBe(true);
    const nextAt = snapshot.nextPrayer.targetTimeMs;
    expect(boundaries.map((b) => Date.parse(b.executeAt))).toEqual(
      expect.arrayContaining([nextAt, nextAt + SALAH_PHASE_MARK_WINDOW_MS]),
    );
  });

  it("promotes only active, non-dismissed imminent sessions", () => {
    const now = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(now);
    const session = createSalahTrackingSession(snapshot, now);
    // Far-future promoteAt → not yet
    const deferred = { ...session, promoteAt: new Date(now.getTime() + 60 * 60_000).toISOString() };
    expect(shouldPromoteSession(deferred, snapshot, now)).toBe(false);

    const imminent = {
      ...session,
      promoteAt: now.toISOString(),
    };
    // Force snapshot to look imminent by setting target within 30 min
    snapshot.nextPrayer.targetTimeMs = now.getTime() + 10 * 60_000;
    expect(shouldPromoteSession(imminent, snapshot, now)).toBe(true);
  });
});
