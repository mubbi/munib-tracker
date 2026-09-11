import { buildWidgetSnapshot } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import {
  buildLiveActivityPushSchedule,
  LIVE_ACTIVITY_PUSH_LEAD_MS,
} from "@/lib/live-activity/schedule";
import {
  LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
  LIVE_ACTIVITY_MARK_WINDOW_MS,
} from "@/lib/live-activity/state";
import { DEFAULT_LOCATION } from "@/lib/location";

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

describe("buildLiveActivityPushSchedule", () => {
  it("schedules mark/after/upcoming boundaries for the current and next windows", () => {
    const now = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(now);
    const updates = buildLiveActivityPushSchedule(snapshot, now);

    expect(updates.length).toBeGreaterThan(0);
    expect(updates.every((u) => u.contentState.actionDeepLink.startsWith("munib-tracker://"))).toBe(
      true,
    );

    const executeTimes = updates.map((u) => Date.parse(u.executeAt));
    const currentAt = snapshot.nextPrayer.currentPrayerAtMs;
    const nextAt = snapshot.nextPrayer.targetTimeMs;
    if (currentAt > 0) {
      const nowMs = now.getTime();
      const expectedCurrent = [
        currentAt + LIVE_ACTIVITY_MARK_WINDOW_MS,
        currentAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
      ]
        .filter((at) => at > nowMs + 1_000)
        .map((at) => Math.max(nowMs + 1_000, at - LIVE_ACTIVITY_PUSH_LEAD_MS));
      if (expectedCurrent.length > 0) {
        expect(executeTimes).toEqual(expect.arrayContaining(expectedCurrent));
      }
    }
    expect(executeTimes).toEqual(
      expect.arrayContaining([
        nextAt - LIVE_ACTIVITY_PUSH_LEAD_MS,
        nextAt + LIVE_ACTIVITY_MARK_WINDOW_MS - LIVE_ACTIVITY_PUSH_LEAD_MS,
        nextAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS - LIVE_ACTIVITY_PUSH_LEAD_MS,
      ]),
    );
  });

  it("keeps markSalah content when the adhan push is fired before 00:00", () => {
    const now = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(now);
    const nextAt = snapshot.nextPrayer.targetTimeMs;
    const updates = buildLiveActivityPushSchedule(snapshot, now);
    const arrival = updates.find(
      (u) => Date.parse(u.executeAt) === nextAt - LIVE_ACTIVITY_PUSH_LEAD_MS,
    );

    expect(arrival?.phase).toBe("markSalah");
    expect(arrival?.contentState.phase).toBe("markSalah");
    expect(arrival?.contentState.prayerId).toBe(snapshot.nextPrayer.prayerId);
  });

  it("re-queues an overdue afterSalah→upcoming flip so the lock screen can catch up", () => {
    const snapshot = makeSnapshot(new Date("2026-07-06T09:00:00.000Z"));
    const currentAt = Date.parse("2026-07-06T12:00:00.000Z");
    snapshot.nextPrayer.currentPrayerId = "dhuhr";
    snapshot.nextPrayer.currentPrayerName = "Dhuhr";
    snapshot.nextPrayer.currentPrayerAtMs = currentAt;
    snapshot.nextPrayer.prayerId = "asr";
    snapshot.nextPrayer.prayerName = "Asr";
    snapshot.nextPrayer.targetTimeMs = currentAt + 3 * 60 * 60_000;

    // 5 minutes after the after-Salah window closed — the original QStash job
    // may already have been cancelled by a reschedule.
    const now = new Date(currentAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS + 5 * 60_000);
    const updates = buildLiveActivityPushSchedule(snapshot, now);
    const catchUp = updates.find(
      (u) => Date.parse(u.executeAt) === currentAt + LIVE_ACTIVITY_AFTER_SALAH_WINDOW_MS,
    );

    expect(catchUp).toBeDefined();
    expect(catchUp?.phase).toBe("upcoming");
    expect(catchUp?.contentState.phase).toBe("upcoming");
    expect(catchUp?.contentState.prayerId).toBe("asr");
  });

  it("returns no updates when location is denied", () => {
    const now = new Date("2026-07-06T09:00:00.000Z");
    const snapshot = makeSnapshot(now);
    snapshot.locationDenied = true;
    expect(buildLiveActivityPushSchedule(snapshot, now)).toEqual([]);
  });
});
