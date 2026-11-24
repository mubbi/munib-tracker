import { ApiError } from "@munib-tracker/api-client";

import { makeCircleMember, makeGoalDoneSignal, makeNudge } from "@/test-support/circles";

import {
  buildPartnerRows,
  duasToday,
  fard5GoalMet,
  goalLooksMet,
  nudgeOutcomeFromError,
  nudgeOutcomeKey,
  partnerRoomLeft,
  sanitizePartnerGoal,
  sanitizePartnerGoalMap,
  sharedDoneOn,
  visibleNudges,
} from "./partner";

const TODAY = "2026-11-24";
const me = makeCircleMember({ memberId: "me", isMe: true, joinedAt: "2026-11-05T00:00:00Z" });
const ali = makeCircleMember({
  memberId: "ali",
  displayName: "Ali",
  joinedAt: "2026-11-01T00:00:00Z",
});

function apiError(status: number) {
  return new ApiError("x", status, null);
}

describe("partner goal (private, device only)", () => {
  it("sanitizes goals and clamps pages", () => {
    expect(sanitizePartnerGoal({ kind: "fard5", extra: 1 })).toEqual({ kind: "fard5" });
    expect(sanitizePartnerGoal({ kind: "quranPages", pages: 9999 })).toEqual({
      kind: "quranPages",
      pages: 604,
    });
    expect(sanitizePartnerGoal({ kind: "quranPages", pages: 0 })).toEqual({
      kind: "quranPages",
      pages: 1,
    });
    expect(sanitizePartnerGoal({ kind: "custom", label: "  Read tafsir  " })).toEqual({
      kind: "custom",
      label: "Read tafsir",
    });
    expect(sanitizePartnerGoal({ kind: "custom", label: "   " })).toBeNull();
    expect(sanitizePartnerGoal({ kind: "missed" })).toBeNull();
    expect(sanitizePartnerGoalMap({ a: { kind: "wird" }, b: { kind: "nope" } })).toEqual({
      a: { kind: "wird" },
    });
  });

  it("hints (never auto-shares) when all five fard are logged", () => {
    const all = {
      fajr: "completed",
      dhuhr: "delayed",
      asr: "qaza",
      maghrib: "completed",
      isha: "completed",
    } as const;
    expect(fard5GoalMet(all)).toBe(true);
    expect(fard5GoalMet({ ...all, isha: "pending" })).toBe(false);
    expect(goalLooksMet({ kind: "fard5" }, all)).toBe(true);
    expect(goalLooksMet({ kind: "wird" }, all)).toBe(false);
    expect(goalLooksMet(null, all)).toBe(false);
  });
});

describe("partner dots", () => {
  it("shows done / no signal only, me first, 7 days ending today", () => {
    const rows = buildPartnerRows(
      [ali, me],
      [makeGoalDoneSignal("ali", TODAY), makeGoalDoneSignal("me", "2026-11-20")],
      TODAY,
    );
    expect(rows.map((r) => r.memberId)).toEqual(["me", "ali"]);
    expect(rows[0]?.days).toHaveLength(7);
    expect(rows[0]?.days.at(-1)).toEqual({ date: TODAY, state: "none" });
    expect(rows[0]?.days.find((d) => d.date === "2026-11-20")?.state).toBe("done");
    expect(rows[1]?.days.at(-1)?.state).toBe("done");
    expect(new Set(rows.flatMap((r) => r.days.map((d) => d.state)))).toEqual(
      new Set(["done", "none"]),
    );
  });

  it("hides a paused partner's signals and skips children", () => {
    const paused = { ...ali, paused: true };
    const child = makeCircleMember({ memberId: "kid", memberKind: "child" });
    const rows = buildPartnerRows([me, paused, child], [makeGoalDoneSignal("ali", TODAY)], TODAY);
    expect(rows.map((r) => r.memberId)).toEqual(["me", "ali"]);
    expect(rows[1]?.days.every((d) => d.state === "none")).toBe(true);
  });

  it("knows whether I shared today and how much room is left", () => {
    expect(sharedDoneOn([makeGoalDoneSignal("me", TODAY)], "me", TODAY)).toBe(true);
    expect(sharedDoneOn([makeGoalDoneSignal("ali", TODAY)], "me", TODAY)).toBe(false);
    expect(partnerRoomLeft(2)).toBe(3);
    expect(partnerRoomLeft(5)).toBe(0);
  });
});

describe("received nudges", () => {
  const isha = new Date(2026, 10, 24, 18, 30);
  const reminder = makeNudge({
    id: "r",
    kind: "reminder",
    createdAt: new Date(2026, 10, 24, 9).toISOString(),
  });
  const dua = makeNudge({
    id: "d",
    kind: "dua",
    createdAt: new Date(2026, 10, 24, 8).toISOString(),
  });
  const oldDua = makeNudge({
    id: "d0",
    kind: "dua",
    createdAt: new Date(2026, 10, 20, 8).toISOString(),
  });

  it("shows duas at once but a reminder only after local Isha", () => {
    const before = visibleNudges([reminder, dua], {
      now: new Date(2026, 10, 24, 17),
      isha,
      excused: false,
    });
    expect(before.duas.map((n) => n.id)).toEqual(["d"]);
    expect(before.reminder).toBeNull();
    const after = visibleNudges([reminder, dua], {
      now: new Date(2026, 10, 24, 19),
      isha,
      excused: false,
    });
    expect(after.reminder?.id).toBe("r");
  });

  it("never shows reminders during an excused period, and drops stale ones", () => {
    const now = new Date(2026, 10, 24, 22);
    expect(visibleNudges([reminder], { now, isha, excused: true }).reminder).toBeNull();
    const yesterday = makeNudge({
      kind: "reminder",
      createdAt: new Date(2026, 10, 23, 9).toISOString(),
    });
    expect(visibleNudges([yesterday], { now, isha, excused: false }).reminder).toBeNull();
  });

  it("falls back to 21:00 when Isha can't be computed", () => {
    expect(
      visibleNudges([reminder], { now: new Date(2026, 10, 24, 20), isha: null, excused: false })
        .reminder,
    ).toBeNull();
    expect(
      visibleNudges([reminder], { now: new Date(2026, 10, 24, 21, 5), isha: null, excused: false })
        .reminder,
    ).not.toBeNull();
  });

  it("counts today's duas without revealing anyone", () => {
    const { duas } = visibleNudges([dua, oldDua], {
      now: new Date(2026, 10, 24, 12),
      isha,
      excused: false,
    });
    expect(duasToday(duas, new Date(2026, 10, 24, 12))).toBe(1);
    expect(JSON.stringify(duas)).not.toMatch(/from|sender/);
  });
});

describe("sending nudges (D32: one per kind per pair per day)", () => {
  it("maps 429 to a per-kind gentle message", () => {
    expect(nudgeOutcomeFromError(apiError(429))).toBe("alreadySent");
    expect(nudgeOutcomeKey("dua", "alreadySent")).toBe("partnerCircle.nudge.alreadyDua");
    expect(nudgeOutcomeKey("reminder", "alreadySent")).toBe("partnerCircle.nudge.alreadyReminder");
    expect(nudgeOutcomeFromError(new Error("network"))).toBe("offline");
    expect(nudgeOutcomeFromError(apiError(500))).toBe("error");
  });
});
