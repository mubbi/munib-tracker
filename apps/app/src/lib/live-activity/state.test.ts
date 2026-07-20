import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { buildLiveActivityState } from "@/lib/live-activity/state";
import { DEFAULT_LOCATION } from "@/lib/location";

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

describe("buildLiveActivityState", () => {
  it("mirrors the widget snapshot's next-prayer and progress fields", () => {
    const snapshot = makeSnapshot();
    const now = new Date("2026-07-06T09:00:00.000Z");
    const state = buildLiveActivityState(snapshot, now);

    expect(state.prayerName).toBe(snapshot.nextPrayer.prayerName);
    expect(state.prayerTime).toBe(snapshot.nextPrayer.prayerTime);
    expect(state.prayerTimeLabel).toBe(snapshot.nextPrayer.prayerTimeLabel);
    expect(state.remainingLabel).toBe("Remaining");
    expect(state.minutesUntil).toBe(Math.round(snapshot.nextPrayer.minutesUntil));
    expect(state.progressLabel).toBe("3/5");
    expect(state.progressPercent).toBe(60);
    expect(state.primary).toBe(snapshot.theme.primary);
    expect(state.locationDenied).toBe(false);
  });

  it("uses the snapshot's exact next-prayer instant for the countdown target", () => {
    const snapshot = makeSnapshot();
    const state = buildLiveActivityState(snapshot);

    expect(state.targetTimeMs).toBe(snapshot.nextPrayer.targetTimeMs);
    expect(state.targetTimeMs).toBeGreaterThan(0);
  });

  it("formats prayer time labels with the user's 12-hour preference", () => {
    const snapshot = makeSnapshot({ timeFormat: "12" });
    const state = buildLiveActivityState(snapshot);

    expect(state.prayerTime).toMatch(/AM|PM/i);
    expect(state.prayerTimeLabel).toMatch(/^at /);
    expect(state.prayerTimeLabel).toContain(state.prayerTime);
  });

  it("carries the location-denied deep link when location is unavailable", () => {
    const snapshot = makeSnapshot({ locationDenied: true });
    const state = buildLiveActivityState(snapshot);

    expect(state.locationDenied).toBe(true);
    expect(state.deepLink).toContain("location");
  });
});
