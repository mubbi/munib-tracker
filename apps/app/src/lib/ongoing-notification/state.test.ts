import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { DEFAULT_LOCATION } from "@/lib/location";
import { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";
import { buildSalahPhaseBoundary } from "@/test-support/fixtures/salah-phase";
import { buildWidgetSnapshot as buildFixtureSnapshot } from "@/test-support/fixtures/widgets";

const t = (_key: string, fallback: string, options?: Record<string, unknown>) => {
  if (options) {
    return fallback.replace(/\{\{(\w+)\}\}/g, (_, name) => String(options[name] ?? ""));
  }
  return fallback;
};

function makeSnapshot(overrides?: { locationDenied?: boolean; timeFormat?: "12" | "24" }) {
  return buildWidgetSnapshot({
    location: overrides?.locationDenied ? null : DEFAULT_LOCATION,
    locationDenied: overrides?.locationDenied ?? false,
    locale: "en",
    translationLocale: "en",
    calendar: "hijri",
    timeFormat: overrides?.timeFormat ?? "24",
    theme: { isDark: false, primaryColor: "#059669", followsSystem: true },
    salahCompleted: 3,
    salahTotal: 5,
    prayerStatus: { fajr: "completed", dhuhr: "completed", asr: "completed" },
    streakDays: 0,
    qazaRemaining: 0,
    qazaCompletedToday: 0,
    qazaTargetToday: 0,
    khatmPlan: null,
    khatmAyahsRead: 0,
    tasbeehToday: null,
    fridayChecklistDone: {},
    now: new Date("2026-07-06T09:00:00.000Z"),
    t,
  });
}

describe("buildOngoingNotificationState", () => {
  it("mirrors the widget snapshot's next-prayer fields", () => {
    const snapshot = makeSnapshot();
    const now = new Date("2026-07-06T09:00:00.000Z");
    const state = buildOngoingNotificationState(snapshot, now);

    expect(state.prayerId).toBe(snapshot.nextPrayer.prayerId);
    expect(state.prayerName).toBe(snapshot.nextPrayer.prayerName);
    expect(state.prayerTimeLabel).toBe(snapshot.nextPrayer.prayerTimeLabel);
    expect(state.countdownLabel).toBe(snapshot.nextPrayer.countdownLabel);
    expect(state.remainingLabel).toBe("Remaining");
    expect(state.prepareLabel).toBeTruthy();
    expect(state.prepareDeepLink).toContain("before_prayer");
    expect(state.followingName).toBe(snapshot.nextPrayer.followingName);
    expect(state.followingTime).toBe(snapshot.nextPrayer.followingTime);
    expect(state.deepLink).toBe(snapshot.nextPrayer.deepLink);
  });

  it("uses the snapshot's exact next-prayer instant for the chronometer target", () => {
    const snapshot = makeSnapshot();
    const state = buildOngoingNotificationState(snapshot);

    expect(state.targetTimeMs).toBe(snapshot.nextPrayer.targetTimeMs);
    expect(state.targetTimeMs).toBeGreaterThan(0);
  });

  it("falls back to minutesUntil when the snapshot has no exact target instant", () => {
    const snapshot = makeSnapshot();
    snapshot.nextPrayer.targetTimeMs = 0;
    snapshot.nextPrayer.minutesUntil = 15;
    const now = new Date("2026-07-06T09:00:00.000Z");

    const state = buildOngoingNotificationState(snapshot, now);

    expect(state.targetTimeMs).toBe(now.getTime() + 15 * 60_000);
  });

  it("includes a localized channel name", () => {
    const snapshot = makeSnapshot();
    const state = buildOngoingNotificationState(snapshot);

    expect(state.channelName).toBeTruthy();
    expect(typeof state.channelName).toBe("string");
  });

  it("carries the location-denied deep link when location is unavailable", () => {
    const snapshot = makeSnapshot({ locationDenied: true });
    const state = buildOngoingNotificationState(snapshot);

    expect(state.deepLink).toContain("location");
  });
});

describe("buildOngoingNotificationState phases", () => {
  const NOW = new Date("2026-07-03T12:00:00.000Z");
  const MIN = 60_000;

  /** Snapshot with the next Salah `minutesUntil` away and the current one `minutesAgo` (or none). */
  function snapshotAt(minutesUntil: number, minutesAgo: number | null) {
    return buildFixtureSnapshot({
      nextPrayer: {
        prayerId: "asr",
        prayerName: "Asr",
        title: "Next Salah",
        minutesUntil,
        targetTimeMs: NOW.getTime() + minutesUntil * MIN,
        currentPrayerId: "dhuhr",
        currentPrayerName: "Dhuhr",
        currentPrayerAtMs: minutesAgo == null ? 0 : NOW.getTime() - minutesAgo * MIN,
      },
    });
  }

  it.each([
    [45, "45m"],
    [150, "2h"],
  ])("shows %i minutes until the next Salah as %s", (minutes, text) => {
    const state = buildOngoingNotificationState({ snapshot: snapshotAt(minutes, null), now: NOW });
    expect(state).toMatchObject({
      phase: "upcoming",
      prayerId: "asr",
      shortCriticalText: text,
      progressPercent: 20,
    });
  });

  it("asks to mark the current Salah just after it begins", () => {
    const state = buildOngoingNotificationState({ snapshot: snapshotAt(180, 5), now: NOW });
    expect(state).toMatchObject({
      phase: "markSalah",
      prayerId: "dhuhr",
      shortCriticalText: "Mark",
      progressPercent: 65,
    });
  });

  it("moves to after-Salah adhkar once the mark window passes", () => {
    const state = buildOngoingNotificationState({ snapshot: snapshotAt(180, 20), now: NOW });
    expect(state).toMatchObject({
      phase: "afterSalah",
      shortCriticalText: "Adhkar",
      progressPercent: 85,
    });
  });

  it("uses the first boundary and maps the schedule", () => {
    const boundary = buildSalahPhaseBoundary({ progressPercent: 42, shortCriticalText: "soon" });
    const state = buildOngoingNotificationState({
      snapshot: snapshotAt(45, null),
      sessionId: "s1",
      boundaries: [boundary],
      requestPromoted: true,
      now: NOW,
    });
    expect(state).toMatchObject({
      sessionId: "s1",
      progressPercent: 42,
      shortCriticalText: "soon",
      progressSegments: boundary.progressSegments,
      requestPromoted: true,
    });
    expect(state.schedule[0]).toMatchObject({
      executeAtMs: Date.parse(boundary.executeAt),
      phase: "upcoming",
    });
  });
});
