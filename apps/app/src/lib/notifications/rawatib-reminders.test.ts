import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import {
  pushRawatibNudgeReminders,
  RAWATIB_NUDGE_ROUTE,
  rawatibNudgeActive,
} from "@/lib/notifications/rawatib-reminders";
import { budgetPriority } from "@/lib/notifications/reminder-budget";
import {
  buildNotificationPreferences,
  buildUserPreferences,
} from "@/test-support/fixtures/preferences";

const NOW = new Date("2026-03-10T12:45:00Z");
const NUDGE = {
  parent: "dhuhr" as const,
  rawatib: "dhuhr_after" as const,
  fireAt: new Date("2026-03-10T12:50:00Z"),
};

function prefs(overrides: Parameters<typeof buildNotificationPreferences>[0] = {}, extra = {}) {
  return buildUserPreferences({
    madhhab: "hanafi",
    notificationPrefs: buildNotificationPreferences({ rawatibNudge: true, ...overrides }),
    ...extra,
  });
}

function run(p: ReturnType<typeof prefs>, nudges = [NUDGE]): BuiltReminder[] {
  const out: BuiltReminder[] = [];
  pushRawatibNudgeReminders(out, p, NOW, { rawatibNudges: nudges });
  return out;
}

describe("rawatib after-fard nudge (NF-3.1, §11 tier 5)", () => {
  it("is off by default", () => {
    const p = buildUserPreferences({ madhhab: "hanafi" });
    expect(rawatibNudgeActive(p)).toBe(false);
    expect(run(prefs({ rawatibNudge: false }))).toEqual([]);
  });

  it("schedules one generic, low-priority reminder when opted in", () => {
    const [reminder] = run(prefs());
    expect(reminder).toMatchObject({
      id: "rawatib:dhuhr_after",
      repeat: "date",
      route: RAWATIB_NUDGE_ROUTE,
      fireAt: NUDGE.fireAt,
    });
    expect(reminder?.priority).toBeGreaterThanOrEqual(budgetPriority(5, 0));
    expect(reminder?.body).toContain("Dhuhr");
  });

  it("is paused during any excused period and when sunnah reminders are off", () => {
    for (const reason of ["hayd", "sick", "travel"] as const) {
      expect(run(prefs({}, { activeExcusedReason: reason }))).toEqual([]);
    }
    expect(run(prefs({ sunnahPrayer: false }))).toEqual([]);
    expect(run(prefs({ masterEnabled: false }))).toEqual([]);
  });

  it("skips users with rawatib off and nudges already in the past", () => {
    expect(run(prefs({}, { rawatib: { enabled: false, extras: [] } }))).toEqual([]);
    expect(run(prefs(), [{ ...NUDGE, fireAt: new Date("2026-03-10T12:00:00Z") }])).toEqual([]);
  });
});
