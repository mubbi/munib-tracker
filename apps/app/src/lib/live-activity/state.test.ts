import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { buildLiveActivityState } from "@/lib/live-activity/state";
import { DEFAULT_LOCATION } from "@/lib/location";

const t = (_key: string, fallback: string, options?: Record<string, unknown>) => {
  if (options) {
    return fallback.replace(/\{\{(\w+)\}\}/g, (_, name) => String(options[name] ?? ""));
  }
  return fallback;
};

function makeSnapshot(overrides?: { locationDenied?: boolean }) {
  return buildWidgetSnapshot({
    location: overrides?.locationDenied ? null : DEFAULT_LOCATION,
    locationDenied: overrides?.locationDenied ?? false,
    locale: "en",
    calendar: "hijri",
    timeFormat: "24",
    theme: { isDark: false, primaryColor: "#059669" },
    salahCompleted: 3,
    salahTotal: 5,
    prayerStatus: { fajr: "completed", dhuhr: "completed", asr: "completed" },
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
    expect(state.minutesUntil).toBe(Math.round(snapshot.nextPrayer.minutesUntil));
    expect(state.progressLabel).toBe("3/5");
    expect(state.progressPercent).toBe(60);
    expect(state.primary).toBe(snapshot.theme.primary);
    expect(state.locationDenied).toBe(false);
  });

  it("derives an absolute countdown target from the whole-minute snapshot value", () => {
    const snapshot = makeSnapshot();
    const now = new Date("2026-07-06T09:00:00.000Z");
    const state = buildLiveActivityState(snapshot, now);

    expect(state.targetTimeMs).toBe(now.getTime() + state.minutesUntil * 60_000);
    expect(state.targetTimeMs).toBeGreaterThanOrEqual(now.getTime());
  });

  it("carries the location-denied deep link when location is unavailable", () => {
    const snapshot = makeSnapshot({ locationDenied: true });
    const state = buildLiveActivityState(snapshot);

    expect(state.locationDenied).toBe(true);
    expect(state.deepLink).toContain("location");
  });
});
