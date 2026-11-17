import { getLocalDateString } from "@munib-tracker/shared/utils";

import {
  applyOutcome,
  MARK_MEMORIZED_STREAK,
  newRecord,
  setManualStatus,
  shouldOfferMarkMemorized,
  snoozeToTomorrow,
} from "./revision-schedule";

// 23:30 local on 17 Nov: a UTC slice would already say 18 Nov in UTC+ zones.
const NOW = new Date(2026, 10, 17, 23, 30);
const TODAY = getLocalDateString(NOW);

describe("revision ladder (§10)", () => {
  it("a new ayah is learning and due today (local day)", () => {
    const r = newRecord(NOW);
    expect(r).toMatchObject({ status: "learning", intervalDays: 0, nextReviewAt: TODAY });
  });

  it("success advances 0 → 1 → 3 → 7 → 14 → 30 and stays at 30", () => {
    let r = newRecord(NOW);
    const seen: number[] = [];
    for (let i = 0; i < 7; i++) {
      r = applyOutcome(r, "success", NOW);
      seen.push(r.intervalDays);
    }
    expect(seen).toEqual([1, 3, 7, 14, 30, 30, 30]);
    expect(r.nextReviewAt).toBe("2026-12-17");
  });

  it("a lapse resets to needs revision, due today, and counts it", () => {
    let r = applyOutcome(applyOutcome(newRecord(NOW), "success", NOW), "success", NOW);
    r = applyOutcome(r, "lapse", NOW);
    expect(r).toMatchObject({
      status: "needs_revision",
      intervalDays: 0,
      successStreak: 0,
      lapses: 1,
      nextReviewAt: TODAY,
    });
  });

  it("an all-uncertain (neutral) take neither advances nor lapses", () => {
    const before = applyOutcome(newRecord(NOW), "success", NOW);
    const after = applyOutcome(before, "neutral", NOW);
    expect(after.intervalDays).toBe(before.intervalDays);
    expect(after.lapses).toBe(before.lapses);
    expect(after.successStreak).toBe(before.successStreak);
  });

  it("offers Mark memorized only after two advances at 30 days", () => {
    let r = newRecord(NOW);
    for (let i = 0; i < MARK_MEMORIZED_STREAK - 1; i++) {
      r = applyOutcome(r, "success", NOW);
      expect(shouldOfferMarkMemorized(r)).toBe(false);
    }
    r = applyOutcome(r, "success", NOW);
    expect(shouldOfferMarkMemorized(r)).toBe(true);
  });

  it("one good take never offers Mark memorized and never writes hifz", () => {
    const r = applyOutcome(undefined, "success", NOW);
    expect(shouldOfferMarkMemorized(r)).toBe(false);
    // The ladder module has no hifz dependency at all.
    expect(Object.keys(r)).not.toContain("hifz");
  });

  it("Not now pushes to tomorrow without a lapse", () => {
    const r = snoozeToTomorrow(applyOutcome(undefined, "lapse", NOW), NOW);
    expect(r.nextReviewAt).toBe("2026-11-18");
    expect(r.lapses).toBe(1);
  });

  it("manual needs-revision is due today", () => {
    const r = setManualStatus(applyOutcome(undefined, "success", NOW), "needs_revision", NOW);
    expect(r).toMatchObject({ status: "needs_revision", nextReviewAt: TODAY, intervalDays: 0 });
  });
});
