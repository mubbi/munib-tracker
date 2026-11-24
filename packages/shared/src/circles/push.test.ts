import { describe, expect, it } from "vitest";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../constants";
import { APP_LOCALE_CODES } from "../i18n/app-locale";
import type { NotificationPreferences } from "../types/preferences";
import { FARD_PRAYERS } from "./index";
import {
  CIRCLE_EVENT_TYPES,
  CIRCLE_PUSH_COPY,
  CIRCLE_PUSH_LOCALES,
  CIRCLE_PUSH_PREF_KEYS,
  type CirclePushPrefs,
  circleEventHref,
  circlePushCopy,
  dueFamilyDigestWeek,
  FAMILY_DIGEST_PREF_KEY,
  FAMILY_DIGEST_PUSH_COPY,
  familyDigestDedupeKey,
  familyDigestHref,
  familyDigestPushCopy,
  familyDigestWeek,
  isCirclePushEnabled,
  isFamilyDigestPushEnabled,
  resolveCirclePushLocale,
  shouldSendFamilyDigest,
  summarizeFamilyWeek,
} from "./push";

describe("circle push (D33)", () => {
  it("routes khatm events to the group and duas to the partner screen", () => {
    expect(circleEventHref({ type: "khatm_part_done", circleId: "c1", khatmId: "k1" })).toBe(
      "/khatm-groups?circleId=c1&khatmId=k1",
    );
    expect(circleEventHref({ type: "khatm_completed", circleId: "c1" })).toBe(
      "/khatm-groups?circleId=c1",
    );
    expect(circleEventHref({ type: "dua_received", circleId: "c 2" })).toBe(
      "/partner?circleId=c%202",
    );
  });

  it("gates on the master switch and the per-kind toggle (unset ⇒ on)", () => {
    expect(isCirclePushEnabled(undefined, "dua_received")).toBe(true);
    expect(isCirclePushEnabled({}, "khatm_part_done")).toBe(true);
    expect(isCirclePushEnabled({ masterEnabled: false }, "khatm_completed")).toBe(false);
    expect(
      isCirclePushEnabled({ masterEnabled: true, circleKhatmProgress: false }, "khatm_part_done"),
    ).toBe(false);
    expect(isCirclePushEnabled({ circleKhatmProgress: false }, "khatm_completed")).toBe(true);
    for (const type of CIRCLE_EVENT_TYPES) {
      expect(DEFAULT_NOTIFICATION_PREFERENCES[CIRCLE_PUSH_PREF_KEYS[type]]).toBe(true);
    }
  });

  it("localizes from a stored locale tag and falls back to English", () => {
    expect(resolveCirclePushLocale("ur-PK")).toBe("ur");
    expect(resolveCirclePushLocale("pt_BR")).toBe("en");
    expect(resolveCirclePushLocale(null)).toBe("en");
    expect(circlePushCopy("xx", "dua_received")).toEqual(CIRCLE_PUSH_COPY.en.dua_received);
  });

  it("mirrors the shared locale list and preference fields", () => {
    expect([...CIRCLE_PUSH_LOCALES]).toEqual([...APP_LOCALE_CODES]);
    // Compile-time: the structural prefs type stays assignable from the real one.
    const prefs: CirclePushPrefs =
      DEFAULT_NOTIFICATION_PREFERENCES satisfies NotificationPreferences;
    expect(prefs.circleDuaReceived).toBe(true);
  });

  it("has content-free copy for every locale and event", () => {
    for (const locale of APP_LOCALE_CODES) {
      for (const type of CIRCLE_EVENT_TYPES) {
        const copy = CIRCLE_PUSH_COPY[locale][type];
        expect(copy.title.trim()).not.toBe("");
        expect(copy.body.trim()).not.toBe("");
        // Fixed copy: no interpolation slots for names, counts or intentions.
        expect(`${copy.title}${copy.body}`).not.toMatch(/\{\{|%s|\$\{/);
      }
    }
  });
});

describe("family weekly digest (D40)", () => {
  it("is due from Friday 18:00 UTC to the end of the ISO week", () => {
    expect(dueFamilyDigestWeek(new Date("2026-11-27T17:59:59Z"))).toBeNull(); // Fri
    expect(dueFamilyDigestWeek(new Date("2026-11-23T09:00:00Z"))).toBeNull(); // Mon
    const due = dueFamilyDigestWeek(new Date("2026-11-27T18:00:00Z"));
    expect(due).toMatchObject({ weekKey: "2026-W48", from: "2026-11-20", to: "2026-11-26" });
    // Sunday late is the same week; the next Monday starts a new, not-yet-due week.
    expect(dueFamilyDigestWeek(new Date("2026-11-29T23:59:00Z"))?.weekKey).toBe("2026-W48");
    expect(dueFamilyDigestWeek(new Date("2026-11-30T00:00:00Z"))).toBeNull();
    // ISO year boundary: Friday 2027-01-01 belongs to 2026-W53.
    expect(familyDigestWeek(new Date("2027-01-01T19:00:00Z")).weekKey).toBe("2026-W53");
    expect(familyDigestWeek(new Date("2027-01-08T19:00:00Z")).weekKey).toBe("2027-W01");
  });

  it("aggregates the children's counts and excludes rest days", () => {
    const week = { from: "2026-11-20", to: "2026-11-26" };
    const all = { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
    const signals = [
      { memberId: "a", date: "2026-11-20", kind: "fard_status", value: all },
      { memberId: "a", date: "2026-11-21", kind: "fard_status", value: { ...all, isha: false } },
      { memberId: "a", date: "2026-11-22", kind: "rest_day", value: { rest: true } },
      { memberId: "b", date: "2026-11-26", kind: "fard_status", value: all },
      // Outside the window / not a counted child / not a counted kind.
      { memberId: "a", date: "2026-11-27", kind: "fard_status", value: all },
      { memberId: "parent", date: "2026-11-23", kind: "fard_status", value: all },
      { memberId: "a", date: "2026-11-23", kind: "goal_done", value: { done: true } },
    ];
    expect(summarizeFamilyWeek(signals, ["a", "b"], week)).toEqual({
      prayed: 14,
      possible: (7 - 1) * 5 + 7 * 5,
    });
    expect(summarizeFamilyWeek([], ["a"], week)).toEqual({ prayed: 0, possible: 35 });
    expect(shouldSendFamilyDigest({ prayed: 0, possible: 35 })).toBe(false);
    expect(shouldSendFamilyDigest({ prayed: 3, possible: 0 })).toBe(false);
    expect(shouldSendFamilyDigest({ prayed: 3, possible: 35 })).toBe(true);
  });

  it("gates on the master switch and its own toggle (unset ⇒ on)", () => {
    expect(isFamilyDigestPushEnabled(undefined)).toBe(true);
    expect(isFamilyDigestPushEnabled({ circleDuaReceived: false })).toBe(true);
    expect(isFamilyDigestPushEnabled({ masterEnabled: false })).toBe(false);
    expect(isFamilyDigestPushEnabled({ [FAMILY_DIGEST_PREF_KEY]: false })).toBe(false);
    expect(DEFAULT_NOTIFICATION_PREFERENCES[FAMILY_DIGEST_PREF_KEY]).toBe(true);
  });

  it("fills counts only (no names) and falls back to English", () => {
    const copy = familyDigestPushCopy("ur-PK", { prayed: 28, possible: 35 });
    expect(copy).toEqual({
      title: FAMILY_DIGEST_PUSH_COPY.en.title,
      body: "28 of 35 Salah logged this week — mashaAllah.",
    });
    for (const template of Object.values(FAMILY_DIGEST_PUSH_COPY)) {
      const slots = `${template?.title}${template?.body}`.match(/\{\{(\w+)\}\}/g) ?? [];
      expect(new Set(slots)).toEqual(new Set(["{{prayed}}", "{{possible}}"]));
    }
    expect(familyDigestHref("c 1")).toBe("/family?circleId=c%201");
    expect(familyDigestDedupeKey("c1", "2026-W48")).toBe("circle:digest:c1:2026-W48");
  });

  it("counts the same five prayers as the shared fard list", () => {
    const all = Object.fromEntries(FARD_PRAYERS.map((p) => [p, true]));
    const week = { from: "2026-11-20", to: "2026-11-20" };
    expect(
      summarizeFamilyWeek(
        [{ memberId: "a", date: "2026-11-20", kind: "fard_status", value: all }],
        ["a"],
        week,
      ),
    ).toEqual({ prayed: FARD_PRAYERS.length, possible: FARD_PRAYERS.length });
  });
});
