import fs from "node:fs";
import path from "node:path";

import i18n from "@/i18n";
import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { DEFAULT_LOCATION } from "@/lib/location";
import {
  buildSalahPhaseSchedule,
  createSalahTrackingSession,
  progressForPhase,
  resolveSalahPhase,
  SALAH_PHASE_MARK_WINDOW_MS,
  shortCriticalTextForPhase,
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

  it("re-queues the latest overdue phase flip for remote catch-up", () => {
    const base = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(base);
    const currentAt = Date.parse("2026-07-06T12:00:00.000Z");
    snapshot.nextPrayer.currentPrayerId = "dhuhr";
    snapshot.nextPrayer.currentPrayerName = "Dhuhr";
    snapshot.nextPrayer.currentPrayerAtMs = currentAt;
    snapshot.nextPrayer.targetTimeMs = currentAt + 3 * 60 * 60_000;

    const afterClosed = new Date(currentAt + 30 * 60_000 + 2 * 60_000);
    const boundaries = buildSalahPhaseSchedule({
      snapshot,
      sessionId: "catch-up",
      stopLabel: "Stop",
      now: afterClosed,
    });

    expect(boundaries.map((b) => Date.parse(b.executeAt))).toEqual(
      expect.arrayContaining([currentAt + 30 * 60_000]),
    );
    const catchUp = boundaries.find((b) => Date.parse(b.executeAt) === currentAt + 30 * 60_000);
    expect(catchUp?.phase).toBe("upcoming");
  });
});

describe("Android status-chip text", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("counts down while upcoming, then names the phase action", () => {
    expect(shortCriticalTextForPhase("upcoming", "Maghrib", 45)).toBe("45m");
    expect(shortCriticalTextForPhase("upcoming", "Maghrib", 150)).toBe("2h");
    expect(shortCriticalTextForPhase("upcoming", "Maghrib", 0)).toBe("Maghri");
    expect(shortCriticalTextForPhase("markSalah", "Asr", 0)).toBe("Mark");
    expect(shortCriticalTextForPhase("afterSalah", "Asr", 0)).toBe("Adhkar");
    expect(shortCriticalTextForPhase("ended", "Asr", 0)).toBe("Done");
  });

  it("localizes the phase action instead of hardcoded English", async () => {
    i18n.addResourceBundle("ar", "translation", require("@/i18n/ar.json"), true, true);
    await i18n.changeLanguage("ar");
    expect(shortCriticalTextForPhase("markSalah", "Asr", 0)).toBe("سجّل");
    expect(shortCriticalTextForPhase("afterSalah", "Asr", 0)).toBe("أذكار");
    expect(shortCriticalTextForPhase("ended", "Asr", 0)).toBe("تم");
  });

  it("keeps every catalog's chip text within the 6 characters Android shows", () => {
    const dir = path.join(__dirname, "../../i18n");
    for (const file of fs.readdirSync(dir).filter((name) => /^[a-z]{2}\.json$/.test(name))) {
      const catalog = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const chip = catalog.notif.trackSalah.chip as Record<string, string>;
      for (const key of ["mark", "adhkar", "done"]) {
        expect({ file, key, fits: chip[key].length > 0 && chip[key].length <= 6 }).toEqual({
          file,
          key,
          fits: true,
        });
      }
    }
  });

  it("grows the progress through the phases", () => {
    expect(progressForPhase("upcoming").progressPercent).toBe(20);
    expect(progressForPhase("markSalah").progressPercent).toBe(65);
    expect(progressForPhase("afterSalah").progressPercent).toBe(85);
    expect(progressForPhase("ended").progressPercent).toBe(100);
  });
});
