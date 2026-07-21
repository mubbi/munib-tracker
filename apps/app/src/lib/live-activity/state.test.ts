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
    expect(state.prepareLabel).toBe("Prepare");
    expect(state.qiblaLabel).toBe("Qibla");
    expect(state.locale).toBe("en");
    expect(state.isRtl).toBe(false);
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

  it("uses app-selected locale labels and direction for native controls", () => {
    const snapshot = makeSnapshot();
    snapshot.locale = "ur";
    snapshot.isRtl = true;
    snapshot.strings.prepareSalah = "تیاری";
    snapshot.strings.qibla = "قبلہ";

    const state = buildLiveActivityState(snapshot);

    expect(state.prepareLabel).toBe("تیاری");
    expect(state.qiblaLabel).toBe("قبلہ");
    expect(state.locale).toBe("ur");
    expect(state.isRtl).toBe(true);
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

  it("keeps the current Salah visible with a mark action for its first 15 minutes", () => {
    const snapshot = makeSnapshot();
    const currentAt = new Date("2026-07-06T09:00:00.000Z").getTime();
    snapshot.nextPrayer.currentPrayerId = "asr";
    snapshot.nextPrayer.currentPrayerName = "Asr";
    snapshot.nextPrayer.currentPrayerTime = "14:00";
    snapshot.nextPrayer.currentPrayerTimeLabel = "at 14:00";
    snapshot.nextPrayer.currentPrayerAtMs = currentAt;
    const currentRow = snapshot.schedule.rows.find((row) => row.id === "asr");
    expect(currentRow).toBeDefined();
    if (currentRow) currentRow.status = "pending";

    const state = buildLiveActivityState(snapshot, new Date(currentAt + 5 * 60_000));

    expect(state.phase).toBe("markSalah");
    expect(state.prayerId).toBe("asr");
    expect(state.actionLabel).toBe("Mark Salah");
    expect(state.actionDeepLink).toContain("mark-current");
  });

  it("switches to after-Salah adhkar when marked or after 15 minutes", () => {
    const snapshot = makeSnapshot();
    const currentAt = new Date("2026-07-06T09:00:00.000Z").getTime();
    snapshot.nextPrayer.currentPrayerId = "asr";
    snapshot.nextPrayer.currentPrayerName = "Asr";
    snapshot.nextPrayer.currentPrayerTime = "14:00";
    snapshot.nextPrayer.currentPrayerTimeLabel = "at 14:00";
    snapshot.nextPrayer.currentPrayerAtMs = currentAt;
    const currentRow = snapshot.schedule.rows.find((row) => row.id === "asr");
    expect(currentRow).toBeDefined();
    if (currentRow) currentRow.status = "completed";

    const marked = buildLiveActivityState(snapshot, new Date(currentAt + 5 * 60_000));
    if (currentRow) currentRow.status = "pending";
    const elapsed = buildLiveActivityState(snapshot, new Date(currentAt + 20 * 60_000));

    expect(marked.phase).toBe("afterSalah");
    expect(elapsed.phase).toBe("afterSalah");
    expect(marked.actionDeepLink).toContain("zikr/after_prayer");
  });

  it("resumes the upcoming Salah countdown after 30 minutes", () => {
    const snapshot = makeSnapshot();
    const currentAt = new Date("2026-07-06T09:00:00.000Z").getTime();
    snapshot.nextPrayer.currentPrayerId = "asr";
    snapshot.nextPrayer.currentPrayerName = "Asr";
    snapshot.nextPrayer.currentPrayerTime = "14:00";
    snapshot.nextPrayer.currentPrayerTimeLabel = "at 14:00";
    snapshot.nextPrayer.currentPrayerAtMs = currentAt;

    const state = buildLiveActivityState(snapshot, new Date(currentAt + 30 * 60_000));

    expect(state.phase).toBe("upcoming");
    expect(state.prayerId).toBe(snapshot.nextPrayer.prayerId);
    expect(state.actionLabel).toBe("Prepare");
  });
});
