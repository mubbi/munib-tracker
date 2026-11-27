import { describe, expect, it } from "vitest";
import {
  addDaysIso,
  applyKhatmDeal,
  approximateAge,
  childAgeBand,
  circleJoinPath,
  daysBetweenIso,
  formatInviteCode,
  GRADUATION_REPROMPT_AGE,
  graduationPromptStage,
  isGraduationAge,
  isIsoDate,
  isKhatmDeadlinePassed,
  isKhatmPartStale,
  isSignalDateWritable,
  isValidChildBirthYear,
  isValidInviteCode,
  KHATM_ROUND_ROBIN_MIN_MEMBERS,
  type KhatmDealPart,
  khatmPartCount,
  khatmStaleAfterDays,
  normalizeInviteCode,
  nudgeLimitDay,
  planKhatmDeal,
  roundRobinAssignments,
  shouldShowGraduationPrompt,
} from "./index";

const NOW = new Date("2026-11-23T12:00:00Z");
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 86_400_000);

describe.concurrent("child age rules (D7)", () => {
  it("derives a coarse upper-bound age from the birth year", () => {
    expect(approximateAge(2019, NOW)).toBe(7);
  });

  it("accepts birth years that can still be under 13 and rejects the future", () => {
    expect(isValidChildBirthYear(2026, NOW)).toBe(true);
    expect(isValidChildBirthYear(2013, NOW)).toBe(true);
    expect(isValidChildBirthYear(2012, NOW)).toBe(false);
    expect(isValidChildBirthYear(2027, NOW)).toBe(false);
    expect(isValidChildBirthYear(2015.5, NOW)).toBe(false);
  });

  it("maps ages to learning / gentle / graduate bands", () => {
    expect(childAgeBand(2021, NOW)).toBe("learning");
    expect(childAgeBand(2019, NOW)).toBe("gentle");
    expect(childAgeBand(2014, NOW)).toBe("gentle");
    expect(childAgeBand(2013, NOW)).toBe("graduate");
    expect(isGraduationAge(2013, NOW)).toBe(true);
    expect(isGraduationAge(2014, NOW)).toBe(false);
  });

  it("offers graduation at 13 (or when unlocked) and re-prompts at 15", () => {
    expect(GRADUATION_REPROMPT_AGE).toBe(15);
    expect(graduationPromptStage(2015, false, NOW)).toBe("none"); // 11
    expect(graduationPromptStage(2015, true, NOW)).toBe("offer"); // parent unlocked early
    expect(graduationPromptStage(2013, false, NOW)).toBe("offer"); // 13
    expect(graduationPromptStage(2012, false, NOW)).toBe("offer"); // 14
    expect(graduationPromptStage(2011, false, NOW)).toBe("reprompt"); // 15
    expect(graduationPromptStage(2011, true, NOW)).toBe("reprompt");
    expect(graduationPromptStage(2009, false, NOW)).toBe("reprompt"); // 17
  });

  it("re-shows the prompt at 15 after the 13 offer was dismissed, never after the re-prompt", () => {
    expect(shouldShowGraduationPrompt("none", null)).toBe(false);
    expect(shouldShowGraduationPrompt("offer", null)).toBe(true);
    expect(shouldShowGraduationPrompt("offer", "offer")).toBe(false);
    expect(shouldShowGraduationPrompt("reprompt", "offer")).toBe(true);
    expect(shouldShowGraduationPrompt("reprompt", "reprompt")).toBe(false);
    // A re-prompt dismissal sticks even if the stage were to read lower later.
    expect(shouldShowGraduationPrompt("offer", "reprompt")).toBe(false);
  });
});

describe.concurrent("invite codes", () => {
  it("normalizes case, spaces and dashes", () => {
    expect(normalizeInviteCode(" abcde-fgh23 ")).toBe("ABCDEFGH23");
    expect(isValidInviteCode("abcde-fgh23")).toBe(true);
  });

  it("rejects wrong length and non-base32 characters", () => {
    expect(isValidInviteCode("ABCDEFGH2")).toBe(false);
    expect(isValidInviteCode("ABCDEFGH01")).toBe(false);
  });

  it("formats for display and builds the join path", () => {
    expect(formatInviteCode("abcdefgh23")).toBe("ABCDE-FGH23");
    expect(circleJoinPath("abcde-fgh23")).toBe("circle/join/ABCDEFGH23");
  });
});

describe.concurrent("signal dates", () => {
  it("validates real calendar dates only", () => {
    expect(isIsoDate("2026-02-28")).toBe(true);
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("26-02-01")).toBe(false);
  });

  it("does date arithmetic in whole UTC days", () => {
    expect(addDaysIso("2026-12-31", 1)).toBe("2027-01-01");
    expect(daysBetweenIso("2026-11-20", "2026-11-23")).toBe(3);
  });

  it("allows today +1 and up to 14 days of backfill", () => {
    expect(isSignalDateWritable("2026-11-24", NOW)).toBe(true);
    expect(isSignalDateWritable("2026-11-25", NOW)).toBe(false);
    expect(isSignalDateWritable("2026-11-09", NOW)).toBe(true);
    expect(isSignalDateWritable("2026-11-08", NOW)).toBe(false);
  });
});

describe.concurrent("group khatm rules", () => {
  it("uses 30 juz / 60 hizb / 114 surahs", () => {
    expect(khatmPartCount("juz")).toBe(30);
    expect(khatmPartCount("hizb")).toBe(60);
    expect(khatmPartCount("surah")).toBe(114);
  });

  it("computes the stale threshold as max(2, remaining / 3)", () => {
    expect(khatmStaleAfterDays("2026-12-23", NOW)).toBe(10);
    expect(khatmStaleAfterDays("2026-11-25", NOW)).toBe(2);
    expect(khatmStaleAfterDays(null, NOW)).toBe(7);
  });

  it("only treats idle assigned / reading parts as stale", () => {
    expect(isKhatmPartStale({ status: "assigned", updatedAt: daysAgo(3) }, null, NOW)).toBe(false);
    expect(isKhatmPartStale({ status: "reading", updatedAt: daysAgo(8) }, null, NOW)).toBe(true);
    expect(isKhatmPartStale({ status: "done", updatedAt: daysAgo(30) }, null, NOW)).toBe(false);
    expect(isKhatmPartStale({ status: "open", updatedAt: daysAgo(30) }, null, NOW)).toBe(false);
  });

  it("detects a passed deadline", () => {
    expect(isKhatmDeadlinePassed("2026-11-22", NOW)).toBe(true);
    expect(isKhatmDeadlinePassed("2026-11-23", NOW)).toBe(false);
    expect(isKhatmDeadlinePassed(null, NOW)).toBe(false);
  });

  it("deals parts round-robin and leaves them open with no members", () => {
    expect(roundRobinAssignments(4, ["a", "b", "c"]).map((p) => p.memberId)).toEqual([
      "a",
      "b",
      "c",
      "a",
    ]);
    expect(roundRobinAssignments(2, [])).toEqual([
      { partNo: 1, memberId: null },
      { partNo: 2, memberId: null },
    ]);
  });

  it("never deals every part to a lone creator", () => {
    expect(KHATM_ROUND_ROBIN_MIN_MEMBERS).toBe(2);
    expect(roundRobinAssignments(3, ["creator"]).every((p) => p.memberId === null)).toBe(true);
    expect(planKhatmDeal(openParts(30), ["creator"])).toEqual([]);
  });
});

const openParts = (count: number): KhatmDealPart[] =>
  Array.from({ length: count }, (_, index) => ({
    partNo: index + 1,
    status: "open" as const,
    assigneeMemberId: null,
  }));

const tally = (parts: readonly KhatmDealPart[], status?: KhatmDealPart["status"]) => {
  const counts = new Map<string, number>();
  for (const part of parts) {
    if (!part.assigneeMemberId || (status && part.status !== status)) continue;
    counts.set(part.assigneeMemberId, (counts.get(part.assigneeMemberId) ?? 0) + 1);
  }
  return counts;
};

describe.concurrent("planKhatmDeal (round-robin re-deal)", () => {
  it("matches roundRobinAssignments on an all-open grid", () => {
    const moves = planKhatmDeal(openParts(30), ["a", "b", "c", "d"]);
    expect(moves.map((m) => ({ partNo: m.partNo, memberId: m.to }))).toEqual(
      roundRobinAssignments(30, ["a", "b", "c", "d"]),
    );
    expect(moves.every((m) => m.from === null)).toBe(true);
  });

  it("rebalances not-started parts when someone joins and leaves started parts alone", () => {
    const dealt = applyKhatmDeal(openParts(30), planKhatmDeal(openParts(30), ["a", "b"]));
    // a is reading part 1 and finished part 3; b is reading part 2.
    const started = dealt.map((p) =>
      p.partNo === 1 || p.partNo === 2
        ? { ...p, status: "reading" as const }
        : p.partNo === 3
          ? { ...p, status: "done" as const }
          : p,
    );
    const moves = planKhatmDeal(started, ["a", "b", "c"]);
    expect(moves.every((m) => m.to === "c")).toBe(true);
    expect(moves.some((m) => [1, 2, 3].includes(m.partNo))).toBe(false);
    const after = applyKhatmDeal(started, moves);
    expect(after.filter((p, i) => p.status !== started[i]?.status).length).toBe(0);
    // 27 not-started parts → 9 each.
    expect([...tally(after, "assigned").values()]).toEqual([9, 9, 9]);
    expect(after.find((p) => p.partNo === 1)).toMatchObject({
      status: "reading",
      assigneeMemberId: "a",
    });
    // Stable: dealing again changes nothing.
    expect(planKhatmDeal(after, ["a", "b", "c"])).toEqual([]);
  });

  it("deals returned and orphaned parts and evens out uneven shares", () => {
    const parts: KhatmDealPart[] = [
      { partNo: 1, status: "assigned", assigneeMemberId: "a" },
      { partNo: 2, status: "assigned", assigneeMemberId: "a" },
      { partNo: 3, status: "assigned", assigneeMemberId: "a" },
      { partNo: 4, status: "assigned", assigneeMemberId: "a" },
      { partNo: 5, status: "assigned", assigneeMemberId: "gone" },
      { partNo: 6, status: "open", assigneeMemberId: null },
    ];
    const moves = planKhatmDeal(parts, ["a", "b"]);
    expect(moves).toEqual([
      { partNo: 4, from: "a", to: "b" },
      { partNo: 5, from: "gone", to: "b" },
      { partNo: 6, from: null, to: "b" },
    ]);
    expect([...tally(applyKhatmDeal(parts, moves)).entries()].sort()).toEqual([
      ["a", 3],
      ["b", 3],
    ]);
  });
  it("never moves a part a member claimed or a manager assigned (dealt: false) — L12", () => {
    const parts: KhatmDealPart[] = [
      { partNo: 1, status: "assigned", assigneeMemberId: "a", dealt: false },
      { partNo: 2, status: "assigned", assigneeMemberId: "a", dealt: false },
      { partNo: 3, status: "assigned", assigneeMemberId: "a", dealt: true },
      { partNo: 4, status: "assigned", assigneeMemberId: "a", dealt: true },
      { partNo: 5, status: "open", assigneeMemberId: null },
      { partNo: 6, status: "open", assigneeMemberId: null },
    ];
    const moves = planKhatmDeal(parts, ["a", "b"]);
    expect(moves.some((m) => m.partNo <= 2)).toBe(false);
    // The 4 dealable parts are split 2 / 2; the claimed ones don't count.
    expect(moves).toEqual([
      { partNo: 5, from: null, to: "b" },
      { partNo: 6, from: null, to: "b" },
    ]);
    const after = applyKhatmDeal(parts, moves);
    expect(after.filter((p) => p.dealt === true).map((p) => p.partNo)).toEqual([3, 4, 5, 6]);
    expect(planKhatmDeal(after, ["a", "b"])).toEqual([]);
  });
});

describe("nudgeLimitDay (D32)", () => {
  it("is the UTC calendar day, the same for sender and receiver", () => {
    expect(nudgeLimitDay(new Date("2026-11-23T23:59:00Z"))).toBe("2026-11-23");
    expect(nudgeLimitDay(new Date("2026-11-24T00:01:00Z"))).toBe("2026-11-24");
    expect(nudgeLimitDay(new Date("2026-11-24T04:30:00+05:00"))).toBe("2026-11-23");
  });
});
