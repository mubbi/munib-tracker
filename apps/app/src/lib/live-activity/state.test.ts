import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import { buildLiveActivityPushSchedule } from "@/lib/live-activity/schedule";
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

  describe("Lock Screen status row and in-place Mark Salah", () => {
    function markPhaseSnapshot() {
      const snapshot = makeSnapshot();
      const currentAt = new Date("2026-07-06T09:00:00.000Z").getTime();
      snapshot.nextPrayer.currentPrayerId = "asr";
      snapshot.nextPrayer.currentPrayerName = "Asr";
      snapshot.nextPrayer.currentPrayerAtMs = currentAt;
      const asr = snapshot.schedule.rows.find((row) => row.id === "asr");
      if (asr) asr.status = "pending";
      snapshot.progress.completed = 2;
      return { snapshot, now: new Date(currentAt + 5 * 60_000) };
    }

    it("lists today's obligatory Salah with their marked state", () => {
      const snapshot = makeSnapshot();
      const state = buildLiveActivityState(snapshot, new Date("2026-07-06T09:00:00.000Z"));

      expect(state.daySalah).toEqual(
        snapshot.schedule.rows.map((row) => ({ id: row.id, done: row.status === "completed" })),
      );
      expect(state.staleLabel).toBe(snapshot.strings.staleData);
      expect(state.confirmationLabel).toBe(snapshot.strings.done);
    });

    it("precomputes the after-Mark state during the mark window", () => {
      const { snapshot, now } = markPhaseSnapshot();
      const state = buildLiveActivityState(snapshot, now);

      expect(state.phase).toBe("markSalah");
      expect(state.markedActionLabel).toBe(snapshot.strings.afterSalahAdhkar);
      expect(state.markedActionDeepLink).toContain("zikr/after_prayer?prayer=asr");
      expect(state.markedProgressLabel).toBe("3/5");
      expect(state.markedProgressPercent).toBe(60);
    });

    it("offers no in-place Mark outside the mark window", () => {
      const state = buildLiveActivityState(makeSnapshot(), new Date("2026-07-06T09:00:00.000Z"));

      expect(state.phase).toBe("upcoming");
      expect(state.markedActionLabel).toBe("");
      expect(state.markedActionDeepLink).toBe("");
      expect(state.markedProgressLabel).toBe("");
    });

    it("never pushes past the 5 of 5 total", () => {
      const { snapshot, now } = markPhaseSnapshot();
      snapshot.progress.completed = 5;

      expect(buildLiveActivityState(snapshot, now).markedProgressLabel).toBe("5/5");
    });

    it("keeps every pushed content state under the API's ActivityKit byte cap", () => {
      // MAX_CONTENT_STATE_BYTES (packages/live-activity-delivery) is 3,500. Double
      // every string to approximate 2-byte UTF-8 scripts (Arabic, Urdu, Cyrillic).
      const { snapshot, now } = markPhaseSnapshot();
      const states = [
        buildLiveActivityState(snapshot, now),
        ...buildLiveActivityPushSchedule(snapshot, now).map((u) => u.contentState),
      ];
      for (const state of states) {
        const wide = JSON.stringify(state, (_k, v) => (typeof v === "string" ? v + v : v));
        expect(Buffer.byteLength(wide)).toBeLessThan(3_500);
      }
    });
  });
});
