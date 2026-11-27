import { ApiError } from "@munib-tracker/api-client";

import { JUZ_STARTS } from "@/lib/quran-meta";
import { makeCircleMember, makeKhatmDetail, makeKhatmPart } from "@/test-support/circles";

import {
  applyOptimisticDeal,
  applyOptimisticPartAction,
  assignmentModeHintKey,
  classifyKhatmError,
  currentKhatm,
  deadlineState,
  HIZB_STARTS,
  isKhatmManager,
  khatmDealState,
  khatmProgress,
  memberInitials,
  myParts,
  needsDeadlineDecision,
  partActions,
  partStartAyah,
  roundRobinMemberIds,
} from "./khatm";

const ME = "me";
const active = {
  status: "active" as const,
  assignmentMode: "self_pick" as const,
  deadlinePassed: false,
};

describe("partActions mirrors the server rules", () => {
  it("lets members claim open parts in self-pick, managers also assign", () => {
    const open = makeKhatmPart(1);
    expect(partActions(open, { myMemberId: ME, isManager: false, khatm: active })).toEqual([
      "claim",
    ]);
    expect(partActions(open, { myMemberId: ME, isManager: true, khatm: active })).toEqual([
      "claim",
      "assign",
    ]);
  });

  it("in creator-assigns mode only managers act until the deadline passes", () => {
    const open = makeKhatmPart(1);
    const mode = { ...active, assignmentMode: "creator_assigns" as const };
    expect(partActions(open, { myMemberId: ME, isManager: false, khatm: mode })).toEqual([]);
    expect(
      partActions(open, {
        myMemberId: ME,
        isManager: false,
        khatm: { ...mode, deadlinePassed: true },
      }),
    ).toEqual(["claim"]);
  });

  it("offers read / reading / done / give back on my parts", () => {
    const mine = makeKhatmPart(2, { assigneeMemberId: ME, status: "assigned" });
    expect(partActions(mine, { myMemberId: ME, isManager: false, khatm: active })).toEqual([
      "read",
      "reading",
      "complete",
      "release",
    ]);
    const reading = { ...mine, status: "reading" as const };
    expect(partActions(reading, { myMemberId: ME, isManager: false, khatm: active })).toEqual([
      "read",
      "complete",
      "release",
    ]);
  });

  it("only lets managers reassign someone else's part once it is stale (ask first)", () => {
    const theirs = makeKhatmPart(3, { assigneeMemberId: "ali", status: "reading" });
    expect(partActions(theirs, { myMemberId: ME, isManager: true, khatm: active })).toEqual([]);
    expect(
      partActions({ ...theirs, stale: true }, { myMemberId: ME, isManager: true, khatm: active }),
    ).toEqual(["reassignStale", "release"]);
    expect(
      partActions({ ...theirs, stale: true }, { myMemberId: ME, isManager: false, khatm: active }),
    ).toEqual([]);
  });

  it("is empty for done parts, completed khatms and TV", () => {
    expect(
      partActions(makeKhatmPart(4, { status: "done" }), {
        myMemberId: ME,
        isManager: true,
        khatm: active,
      }),
    ).toEqual([]);
    expect(
      partActions(makeKhatmPart(4), {
        myMemberId: ME,
        isManager: true,
        khatm: { ...active, status: "completed" },
      }),
    ).toEqual([]);
    expect(
      partActions(makeKhatmPart(4), {
        myMemberId: ME,
        isManager: true,
        khatm: active,
        readOnly: true,
      }),
    ).toEqual([]);
  });
});

describe("optimistic updates", () => {
  it("claims, completes and finishes the khatm on the last part", () => {
    const detail = makeKhatmDetail({
      partCount: 2,
      parts: [makeKhatmPart(1, { status: "done" }), makeKhatmPart(2)],
    });
    const claimed = applyOptimisticPartAction(detail, 2, "claim", ME);
    expect(claimed.parts[1]).toMatchObject({
      assigneeMemberId: ME,
      status: "assigned",
      stale: false,
    });
    expect(claimed.status).toBe("active");
    const done = applyOptimisticPartAction(claimed, 2, "complete", ME);
    expect(done.doneCount).toBe(2);
    expect(done.status).toBe("completed");
    expect(detail.parts[1]?.status).toBe("open"); // input untouched for rollback
  });

  it("assigns and returns parts to the pool", () => {
    const detail = makeKhatmDetail();
    const assigned = applyOptimisticPartAction(detail, 5, { assign: "ali" }, ME);
    expect(assigned.parts[4]).toMatchObject({ assigneeMemberId: "ali", status: "assigned" });
    const back = applyOptimisticPartAction(assigned, 5, { assign: null }, ME);
    expect(back.parts[4]).toMatchObject({ assigneeMemberId: null, status: "open" });
  });
});

describe("errors, progress, deadlines", () => {
  it("classifies 409 races and 410 gone invites", () => {
    expect(classifyKhatmError(new ApiError("x", 409))).toBe("conflict");
    expect(classifyKhatmError(new ApiError("x", 410))).toBe("gone");
    expect(classifyKhatmError(new ApiError("x", 403))).toBe("forbidden");
    expect(classifyKhatmError(new TypeError("fetch failed"))).toBe("offline");
  });

  it("summarizes the grid without any per-member tally", () => {
    const detail = makeKhatmDetail({
      partCount: 4,
      parts: [
        makeKhatmPart(1, { status: "done" }),
        makeKhatmPart(2, { status: "reading", assigneeMemberId: ME }),
        makeKhatmPart(3, { status: "assigned", assigneeMemberId: "ali" }),
        makeKhatmPart(4),
      ],
    });
    expect(khatmProgress(detail)).toEqual({
      done: 1,
      reading: 1,
      claimed: 1,
      open: 1,
      total: 4,
      fraction: 0.25,
    });
    expect(myParts(detail, ME).map((p) => p.partNo)).toEqual([2]);
  });

  it("counts down in local days and flags the deadline decision", () => {
    expect(deadlineState(null, "2026-11-24")).toEqual({ kind: "none" });
    expect(deadlineState("2026-11-27", "2026-11-24")).toEqual({ kind: "upcoming", daysLeft: 3 });
    expect(deadlineState("2026-11-24", "2026-11-24")).toEqual({ kind: "today" });
    expect(deadlineState("2026-11-20", "2026-11-24")).toEqual({ kind: "passed", daysAgo: 4 });
    const late = makeKhatmDetail({ deadline: "2026-11-20", deadlinePassed: true, doneCount: 3 });
    expect(needsDeadlineDecision(late)).toBe(true);
    expect(needsDeadlineDecision({ ...late, status: "completed" })).toBe(false);
  });

  it("picks the active khatm, managers and initials", () => {
    expect(
      currentKhatm([
        { id: "a", status: "completed", createdAt: "2" },
        { id: "b", status: "active", createdAt: "1" },
      ])?.id,
    ).toBe("b");
    expect(currentKhatm([])).toBeNull();
    expect(isKhatmManager("owner")).toBe(true);
    expect(isKhatmManager("admin")).toBe(true);
    expect(isKhatmManager("member")).toBe(false);
    expect(memberInitials("bilal ahmed")).toBe("BA");
    expect(memberInitials("Zayd")).toBe("ZA");
    expect(memberInitials(null)).toBe("");
  });
});

describe("reader deep links", () => {
  it("opens juz, hizb and surah parts at their first ayah", () => {
    expect(partStartAyah("juz", 2, JUZ_STARTS)).toEqual({ surah: 2, ayah: 142 });
    expect(partStartAyah("juz", 30, JUZ_STARTS)).toEqual({ surah: 78, ayah: 1 });
    expect(partStartAyah("hizb", 60, JUZ_STARTS)).toEqual({ surah: 87, ayah: 1 });
    expect(partStartAyah("surah", 18, JUZ_STARTS)).toEqual({ surah: 18, ayah: 1 });
    expect(partStartAyah("juz", 31, JUZ_STARTS)).toBeNull();
    expect(partStartAyah("surah", 0, JUZ_STARTS)).toBeNull();
  });

  it("HIZB_STARTS matches the bundled ayah-meta dataset", () => {
    const starts: Array<[number, number]> = [];
    let previous = 0;
    for (let surah = 1; surah <= 114; surah += 1) {
      const meta = require(
        `../../../assets/data/quran/ayah-meta/${String(surah).padStart(3, "0")}.json`,
      ) as Record<string, { hizb: number }>;
      for (const ayah of Object.keys(meta)
        .map(Number)
        .sort((a, b) => a - b)) {
        const hizb = meta[String(ayah)]?.hizb ?? previous;
        if (hizb !== previous) {
          starts.push([surah, ayah]);
          previous = hizb;
        }
      }
    }
    expect(starts).toHaveLength(60);
    expect(HIZB_STARTS).toEqual(starts);
  });
});

describe("round-robin dealing", () => {
  const owner = makeCircleMember({ memberId: "a", role: "owner", isMe: true });
  const second = makeCircleMember({ memberId: "b", joinedAt: "2026-11-02T10:00:00.000Z" });
  const child = makeCircleMember({ memberId: "kid", memberKind: "child" });
  const robin = makeKhatmDetail({ assignmentMode: "round_robin" });

  it("deals in join order to account members only", () => {
    expect(roundRobinMemberIds([second, child, owner])).toEqual(["a", "b"]);
  });

  it("waits for a second member instead of giving the creator every part", () => {
    expect(khatmDealState(robin, [owner], { isManager: true })).toEqual({ kind: "waiting" });
    expect(applyOptimisticDeal(robin, [owner])).toBe(robin);
  });

  it("offers the deal to managers in round-robin mode only", () => {
    const state = khatmDealState(robin, [owner, second], { isManager: true });
    expect(state.kind).toBe("ready");
    expect(khatmDealState(robin, [owner, second], { isManager: false })).toEqual({ kind: "none" });
    expect(khatmDealState(robin, [owner, second], { isManager: true, readOnly: true })).toEqual({
      kind: "none",
    });
    expect(khatmDealState(makeKhatmDetail(), [owner, second], { isManager: true })).toEqual({
      kind: "none",
    });
  });

  it("deals optimistically like the server and then reports balanced", () => {
    const dealt = applyOptimisticDeal(robin, [owner, second], new Date("2026-11-24T00:00:00Z"));
    expect(dealt.parts.slice(0, 3).map((p) => p.assigneeMemberId)).toEqual(["a", "b", "a"]);
    expect(dealt.parts.every((p) => p.status === "assigned" && !p.stale)).toBe(true);
    expect(khatmDealState(dealt, [owner, second], { isManager: true })).toEqual({
      kind: "balanced",
    });
  });

  it("never re-deals a part someone claimed themselves (L12)", () => {
    const claimed = applyOptimisticPartAction(robin, 1, "claim", "b");
    expect(claimed.parts[0]).toMatchObject({ assigneeMemberId: "b", dealt: false });
    const dealt = applyOptimisticDeal(claimed, [owner, second]);
    expect(dealt.parts[0]).toMatchObject({ assigneeMemberId: "b", status: "assigned" });
    expect(dealt.parts.slice(1).every((p) => p.status === "assigned" && p.dealt)).toBe(true);
  });

  it("explains round-robin with the deal hint and keeps the other mode hints", () => {
    expect(assignmentModeHintKey("round_robin")).toBe("khatmGroups.deal.hint");
    expect(assignmentModeHintKey("self_pick")).toBe("khatmGroups.grid.hint.self_pick");
  });
});
