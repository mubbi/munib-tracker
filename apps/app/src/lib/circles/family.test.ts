import {
  ALL_FIVE,
  makeCircleMember,
  makeFardSignal,
  makeRestDaySignal,
} from "@/test-support/circles";

import {
  canUseCircleType,
  circleHomeHref,
  EMPTY_FARD_STATUS,
  earnedSticker,
  fardOn,
  fardValueFromStatuses,
  indexSignals,
  isFamilyParent,
  lastNDates,
  mergeDeviceFardDays,
  prayedCount,
  rewardProgress,
  STICKERS,
  sameFardStatus,
  sharingAdultMembers,
  signalWindow,
  stickerForDate,
  upsertFardSignal,
  weeklyDigest,
} from "./family";

const TODAY = "2026-11-24";

describe("fardValueFromStatuses", () => {
  it("shares only the five fard booleans; late and made-up count as prayed", () => {
    const value = fardValueFromStatuses({
      fajr: "completed",
      dhuhr: "delayed",
      asr: "qaza",
      maghrib: "missed",
      isha: "pending",
      witr: "completed",
    });
    expect(value).toEqual({ fajr: true, dhuhr: true, asr: true, maghrib: false, isha: false });
    expect(Object.keys(value)).toEqual(["fajr", "dhuhr", "asr", "maghrib", "isha"]);
  });

  it("is all false for an empty day", () => {
    expect(fardValueFromStatuses({})).toEqual(EMPTY_FARD_STATUS);
    expect(prayedCount(EMPTY_FARD_STATUS)).toBe(0);
    expect(sameFardStatus(EMPTY_FARD_STATUS, { ...EMPTY_FARD_STATUS })).toBe(true);
  });
});

describe("indexSignals", () => {
  it("groups fard and rest-day signals by member and date", () => {
    const index = indexSignals([
      makeFardSignal("child-1", TODAY, { fajr: true }),
      makeRestDaySignal("child-1", "2026-11-23"),
      makeFardSignal("child-2", TODAY, ALL_FIVE),
    ]);
    expect(index.get("child-1")?.get(TODAY)?.fard?.fajr).toBe(true);
    expect(index.get("child-1")?.get("2026-11-23")).toEqual({ fard: null, rest: true });
    expect(earnedSticker(index.get("child-2")?.get(TODAY))).toBe(true);
  });

  it("ignores a malformed fard value", () => {
    const bad = { ...makeFardSignal("c", TODAY), value: { fajr: true } };
    expect(indexSignals([bad]).get("c")?.get(TODAY)?.fard).toBeNull();
  });
});

describe("rewardProgress", () => {
  it("counts full days, not a streak — a gap never resets progress", () => {
    const index = indexSignals([
      makeFardSignal("k", "2026-11-20", ALL_FIVE),
      makeFardSignal("k", "2026-11-21", { fajr: true }),
      makeFardSignal("k", "2026-11-23", ALL_FIVE),
    ]);
    expect(rewardProgress(index.get("k"), 7)).toEqual({
      done: 2,
      target: 7,
      ratio: 2 / 7,
      reached: false,
    });
  });

  it("caps at the target", () => {
    const index = indexSignals(
      lastNDates(TODAY, 5).map((date) => makeFardSignal("k", date, ALL_FIVE)),
    );
    expect(rewardProgress(index.get("k"), 3)).toMatchObject({ done: 3, reached: true });
  });
});

describe("weeklyDigest", () => {
  it("counts the week and leaves rest days out of the possible total", () => {
    const index = indexSignals([
      makeFardSignal("k", TODAY, ALL_FIVE),
      makeFardSignal("k", "2026-11-22", { fajr: true, isha: true }),
      makeRestDaySignal("k", "2026-11-21"),
      // Outside the 7-day window.
      makeFardSignal("k", "2026-11-10", ALL_FIVE),
    ]);
    expect(weeklyDigest(index.get("k"), TODAY)).toEqual({
      prayed: 7,
      possible: 30,
      restDays: 1,
    });
  });

  it("returns zero (not 'missed') for a week with no signals", () => {
    expect(weeklyDigest(undefined, TODAY)).toEqual({ prayed: 0, possible: 35, restDays: 0 });
  });
});

describe("dates, stickers and routing", () => {
  it("builds windows ending today", () => {
    expect(lastNDates(TODAY, 3)).toEqual(["2026-11-22", "2026-11-23", TODAY]);
    expect(signalWindow(TODAY, 7)).toEqual({ from: "2026-11-18", to: TODAY });
    expect(signalWindow(TODAY, 999).from).toBe("2026-10-21");
  });

  it("picks a stable sticker per date", () => {
    expect(stickerForDate(TODAY)).toBe(stickerForDate(TODAY));
    expect(STICKERS).toContain(stickerForDate("2026-01-01"));
  });

  it("routes each circle type and gates family/partner behind an account", () => {
    expect(circleHomeHref({ id: "a b", type: "family" })).toBe("/family?circleId=a%20b");
    expect(circleHomeHref({ id: "p", type: "partner" })).toBe("/partner?circleId=p");
    expect(circleHomeHref({ id: "k", type: "khatm_group" })).toBe("/khatm-groups?circleId=k");
    expect(canUseCircleType("family", false)).toBe(false);
    expect(canUseCircleType("khatm_group", false)).toBe(true);
    expect(isFamilyParent("parent")).toBe(true);
    expect(isFamilyParent("member")).toBe(false);
  });
});

describe("fardOn / upsertFardSignal (optimistic parent logging)", () => {
  const rest = makeRestDaySignal("kid-1", TODAY);
  const other = makeFardSignal("kid-2", TODAY, { fajr: true });

  it("reads one member's day, or null when there is no signal", () => {
    const signals = [rest, other, makeFardSignal("kid-1", TODAY, { asr: true })];
    expect(fardOn(signals, "kid-1", TODAY)).toEqual({ ...EMPTY_FARD_STATUS, asr: true });
    expect(fardOn(signals, "kid-1", "2026-11-23")).toBeNull();
  });

  it("adds a missing day and replaces an existing one, leaving other signals alone", () => {
    const now = new Date("2026-11-24T10:00:00.000Z");
    const added = upsertFardSignal([rest, other], "kid-1", TODAY, ALL_FIVE, now);
    expect(added).toHaveLength(3);
    expect(fardOn(added, "kid-1", TODAY)).toEqual(ALL_FIVE);
    expect(added).toContain(rest);
    expect(added).toContain(other);

    const replaced = upsertFardSignal(added, "kid-1", TODAY, EMPTY_FARD_STATUS, now);
    expect(replaced).toHaveLength(3);
    expect(fardOn(replaced, "kid-1", TODAY)).toEqual(EMPTY_FARD_STATUS);
  });

  it("two quick toggles build on each other", () => {
    let signals = upsertFardSignal([], "kid-1", TODAY, { ...EMPTY_FARD_STATUS, fajr: true });
    const current = fardOn(signals, "kid-1", TODAY) ?? EMPTY_FARD_STATUS;
    signals = upsertFardSignal(signals, "kid-1", TODAY, { ...current, dhuhr: true });
    expect(fardOn(signals, "kid-1", TODAY)).toEqual({
      ...EMPTY_FARD_STATUS,
      fajr: true,
      dhuhr: true,
    });
  });
});

describe("mergeDeviceFardDays", () => {
  it("device taps replace the server fard_status for that date; other signals stay", () => {
    const yesterday = "2026-11-23";
    const server = [
      makeFardSignal("kid-1", TODAY, EMPTY_FARD_STATUS),
      makeFardSignal("kid-1", yesterday, ALL_FIVE),
      makeRestDaySignal("kid-1", TODAY),
    ];
    const merged = mergeDeviceFardDays(server, { [TODAY]: { value: ALL_FIVE } }, "kid-1");
    expect(merged).toHaveLength(3);
    expect(fardOn(merged, "kid-1", TODAY)).toEqual(ALL_FIVE);
    expect(fardOn(merged, "kid-1", yesterday)).toEqual(ALL_FIVE);
    expect(indexSignals(merged).get("kid-1")?.get(TODAY)?.rest).toBe(true);
  });

  it("returns the server list unchanged when the device has no taps", () => {
    const server = [makeFardSignal("kid-1", TODAY, ALL_FIVE)];
    expect(mergeDeviceFardDays(server, {}, "kid-1")).toEqual(server);
  });
});

describe("sharingAdultMembers", () => {
  it("lists only other adult members who opted in to share", () => {
    const members = [
      makeCircleMember({ memberId: "me", isMe: true, role: "member", shareFardStatus: true }),
      makeCircleMember({ memberId: "teen", role: "member", shareFardStatus: true }),
      makeCircleMember({ memberId: "quiet", role: "member", shareFardStatus: false }),
      makeCircleMember({ memberId: "dad", role: "parent", shareFardStatus: true }),
      makeCircleMember({
        memberId: "kid",
        memberKind: "child",
        role: "member",
        shareFardStatus: true,
      }),
    ];
    expect(sharingAdultMembers(members).map((m) => m.memberId)).toEqual(["teen"]);
  });
});
