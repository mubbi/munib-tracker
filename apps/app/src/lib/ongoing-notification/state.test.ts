import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { DEFAULT_LOCATION } from "@/lib/location";
import { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";

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
    expect(state.markLabel).toBe(snapshot.nextPrayer.markLabel);
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
