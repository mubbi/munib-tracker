import type { UserPreferences } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";

import i18n from "@/i18n";
import { type BuiltReminder, buildReminders } from "@/lib/notifications/build-reminders";
import {
  dedupeArafahEveNudges,
  pushDhulHijjahReminders,
} from "@/lib/notifications/dhul-hijjah-reminders";
import { reminderBudgetTier } from "@/lib/notifications/reminder-budget";
import {
  beforeSleepBodyWithHabits,
  pushSunnahHabitsReminders,
} from "@/lib/notifications/sunnah-habits-reminders";
import { wallClockInTimeZoneToDate } from "@/lib/time";
import { pushVoluntaryFastingReminders } from "@/lib/voluntary-fasting/reminders";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { buildReminder } from "@/test-support/fixtures/notifications";
import {
  buildNotificationPreferences,
  buildUserPreferences,
} from "@/test-support/fixtures/preferences";
import { DHUL_HIJJAH_1448 as DH, noonOf } from "@/test-support/fixtures/seasonal";

/** Local timezone so the Hijri day and the reminder day agree in every CI zone. */
const LOCATION = buildStoredLocation({ timeZone: undefined });

function prefsWith(
  notif: Partial<UserPreferences["notificationPrefs"]>,
  extra: Partial<UserPreferences> = {},
): UserPreferences {
  return buildUserPreferences({
    notificationPrefs: buildNotificationPreferences(notif),
    madhhab: "hanafi",
    ...extra,
  });
}

function dhReminders(prefs: UserPreferences, date: string, intends = false): BuiltReminder[] {
  const out: BuiltReminder[] = [];
  const morning = new Date(noonOf(date).getTime() - 6 * 3600_000);
  pushDhulHijjahReminders(out, prefs, LOCATION, morning, 2, {
    dhulHijjah: { intendsUdhiyahByYear: { "1448": intends } },
  });
  return out;
}

describe("Dhul-Hijjah reminders (§11 tier 3)", () => {
  it("sends the eve-of-the-ten card with the udhiyah prompt until intention is set", () => {
    const prefs = prefsWith({});
    const eve = dhReminders(prefs, DH.eve).find((r) => r.id.startsWith("dhulHijjah:eve:"));
    expect(eve?.body).toBe(i18n.t("dhulHijjah.reminder.eveBodyUdhiyah"));
    expect(reminderBudgetTier(eve?.priority ?? 0)).toBe(3);
    const withIntent = dhReminders(prefs, DH.eve, true).find((r) =>
      r.id.startsWith("dhulHijjah:eve:"),
    );
    expect(withIntent?.body).toBe(i18n.t("dhulHijjah.reminder.eveBody"));
  });

  it("schedules a daily morning card and the Arafah eve", () => {
    const ids = dhReminders(prefsWith({}), addDays(DH.arafah, -1)).map((r) => r.id);
    expect(ids).toContain(`dhulHijjah:day:${addDays(DH.arafah, -1)}`);
    expect(ids).toContain(`dhulHijjah:arafahEve:${addDays(DH.arafah, -1)}`);
    expect(ids).toContain(`dhulHijjah:day:${DH.arafah}`);
  });

  it("doesn't push the Arafah fast to this year's pilgrim (scoped to the Hijri year)", () => {
    const pilgrim = (year: number) =>
      prefsWith(
        {},
        {
          voluntaryFasting: {
            enabledKinds: [],
            intentReminderTime: "21:00",
            suhoorAlarm: false,
            isPilgrimThisYear: true,
            pilgrimHijriYear: year,
          },
        },
      );
    const eveDay = addDays(DH.arafah, -1);
    const find = (prefs: UserPreferences, id: string) =>
      dhReminders(prefs, eveDay).find((r) => r.id === id);
    expect(find(pilgrim(1448), `dhulHijjah:arafahEve:${eveDay}`)?.body).toBe(
      i18n.t("dhulHijjah.reminder.arafahEveBodyPilgrim"),
    );
    expect(find(pilgrim(1448), `dhulHijjah:day:${DH.arafah}`)?.body).toBe(
      i18n.t("dhulHijjah.reminder.morningBodyArafahPilgrim"),
    );
    // Last year's Hajj no longer applies: the fast nudge is back.
    expect(find(pilgrim(1447), `dhulHijjah:arafahEve:${eveDay}`)?.body).toBe(
      i18n.t("dhulHijjah.reminder.arafahEveBody"),
    );
  });

  it("only adds takbir reminders when opted in, after each fard in the school's window", () => {
    expect(dhReminders(prefsWith({}), DH.arafah).some((r) => r.id.startsWith("takbir"))).toBe(
      false,
    );
    const on = dhReminders(prefsWith({ takbirTashriq: true }), DH.arafah).filter((r) =>
      r.id.startsWith("takbirTashriq:"),
    );
    // Hanafi: every fard of 12/10 is in the window.
    expect(on.filter((r) => r.id.includes(DH.eid))).toHaveLength(5);
    const maliki = dhReminders(
      prefsWith({ takbirTashriq: true }, { madhhab: "maliki" }),
      DH.arafah,
    );
    const malikiEid = maliki.filter((r) => r.id.startsWith(`takbirTashriq:${DH.eid}`));
    expect(malikiEid.map((r) => r.id.split(":").at(-1))).toEqual([
      "dhuhr",
      "asr",
      "maghrib",
      "isha",
    ]);
    expect(maliki.some((r) => r.id.startsWith(`takbirTashriq:${DH.arafah}`))).toBe(false);
  });

  it("pauses everything during an excused period and respects the toggle", () => {
    expect(
      dhReminders(prefsWith({ takbirTashriq: true }, { activeExcusedReason: "hayd" }), DH.arafah),
    ).toEqual([]);
    expect(dhReminders(prefsWith({ dhulHijjah: false }), DH.arafah)).toEqual([]);
  });

  it("is silent outside the season", () => {
    expect(dhReminders(prefsWith({ takbirTashriq: true }), "2026-11-23")).toEqual([]);
  });

  describe("manual city west of the device timezone (M1: the Hijri day is zoned once)", () => {
    // Pago Pago (UTC−11) is west of practically every device/CI zone, so a
    // second re-zoning of the location's day would land on the previous day.
    const WEST = buildStoredLocation({
      timeZone: "Pacific/Pago_Pago",
      latitude: -14.27,
      longitude: -170.7,
      source: "manual",
    });
    const morningIn = (date: string) => {
      const [y, m, d] = date.split("-").map(Number) as [number, number, number];
      return wallClockInTimeZoneToDate(y, m, d, 6, 0, WEST.timeZone);
    };
    const run = (date: string) => {
      const out: BuiltReminder[] = [];
      pushDhulHijjahReminders(out, prefsWith({}), WEST, morningIn(date), 2, {
        dhulHijjah: { intendsUdhiyahByYear: {} },
      });
      return out;
    };

    it("greets Eid on Eid — never 'Day of Arafah, fast'", () => {
      const card = run(DH.eid).find((r) => r.id === `dhulHijjah:day:${DH.eid}`);
      expect(card?.title).toBe(i18n.t("dhulHijjah.reminder.morningTitle.eid"));
      expect(card?.body).toBe(i18n.t("dhulHijjah.reminder.morningBody.eid"));
    });

    it("sends the Arafah eve on the evening of 8 Dhul-Hijjah, not a day late", () => {
      const eveDay = addDays(DH.arafah, -1);
      const ids = run(eveDay).map((r) => r.id);
      expect(ids).toContain(`dhulHijjah:arafahEve:${eveDay}`);
      expect(ids).not.toContain(`dhulHijjah:arafahEve:${DH.arafah}`);
    });
  });
});

describe("Arafah eve de-duplication (L6)", () => {
  it("drops the voluntary-fasting intent for 9 Dhul-Hijjah when the Arafah eve card is armed", () => {
    const eveDay = addDays(DH.arafah, -1);
    const reminders = [
      `fastIntent:${DH.arafah}`,
      `dhulHijjah:arafahEve:${eveDay}`,
      `fastIntent:${addDays(DH.arafah, 30)}`,
    ].map((id) => buildReminder({ id }));
    dedupeArafahEveNudges(reminders);
    expect(reminders.map((r) => r.id)).toEqual([
      `dhulHijjah:arafahEve:${eveDay}`,
      `fastIntent:${addDays(DH.arafah, 30)}`,
    ]);
  });

  it("buildReminders sends one Arafah nudge on 8 Dhul-Hijjah with both features on", () => {
    const eveDay = addDays(DH.arafah, -1);
    const prefs = prefsWith(
      { dhulHijjah: true },
      {
        voluntaryFasting: {
          enabledKinds: ["arafah"],
          intentReminderTime: "21:00",
          suhoorAlarm: false,
        },
      },
    );
    const now = new Date(noonOf(eveDay).getTime() - 6 * 3600_000);
    // Without the de-duplication the fasting feature alone would arm the intent.
    const fastingOnly: BuiltReminder[] = [];
    pushVoluntaryFastingReminders(fastingOnly, prefs, LOCATION, now, 2, {
      voluntaryFastingEntries: {},
    });
    expect(fastingOnly.map((r) => r.id)).toContain(`fastIntent:${DH.arafah}`);

    const ids = buildReminders(prefs, LOCATION, now, {
      dhulHijjah: { intendsUdhiyahByYear: {} },
      voluntaryFastingEntries: {},
    }).map((r) => r.id);
    expect(ids).toContain(`dhulHijjah:arafahEve:${eveDay}`);
    expect(ids).not.toContain(`fastIntent:${DH.arafah}`);
  });
});

describe("Sunnah habits reminders (§11 tier 5)", () => {
  const now = noonOf("2026-11-23");

  it("adds one daily evening nudge only when enabled and habits are selected", () => {
    const out: BuiltReminder[] = [];
    pushSunnahHabitsReminders(out, prefsWith({ habits: true }), LOCATION, now, {
      sunnahHabits: { selectedCount: 3, bedtimeHabitCount: 0 },
    });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: "sunnahHabits", repeat: "daily", route: "/habits" });
    expect(reminderBudgetTier(out[0]?.priority ?? 0)).toBe(5);

    const off: BuiltReminder[] = [];
    pushSunnahHabitsReminders(off, prefsWith({}), LOCATION, now, {
      sunnahHabits: { selectedCount: 3, bedtimeHabitCount: 0 },
    });
    pushSunnahHabitsReminders(off, prefsWith({ habits: true }), LOCATION, now, {
      sunnahHabits: { selectedCount: 0, bedtimeHabitCount: 0 },
    });
    expect(off).toEqual([]);
  });

  it("keeps running during excused periods (habits aren't worship-gated)", () => {
    const out: BuiltReminder[] = [];
    pushSunnahHabitsReminders(
      out,
      prefsWith({ habits: true }, { activeExcusedReason: "hayd" }),
      LOCATION,
      now,
      { sunnahHabits: { selectedCount: 1, bedtimeHabitCount: 0 } },
    );
    expect(out).toHaveLength(1);
  });

  it("folds bedtime habits into the before-sleep text without an extra slot", () => {
    expect(beforeSleepBodyWithHabits({})).toBe(i18n.t("notif.reminders.beforeSleepBody"));
    const options = { sunnahHabits: { selectedCount: 2, bedtimeHabitCount: 1 } };
    expect(beforeSleepBodyWithHabits(options)).toBe(
      i18n.t("sunnahHabits.reminder.beforeSleepBody"),
    );
    const prefs = prefsWith({ masterEnabled: true, beforeSleep: true });
    const all = buildReminders(prefs, LOCATION, now, options);
    const sleep = all.filter((r) => r.id === "beforeSleep");
    expect(sleep).toHaveLength(1);
    expect(sleep[0]?.body).toBe(i18n.t("sunnahHabits.reminder.beforeSleepBody"));
  });
});
