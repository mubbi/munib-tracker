import { coachingState } from "@/test-support/tajweed-coaching";

import {
  coachingDueByDay,
  duePlanItems,
  mergeTajweedCoaching,
  RECENT_LIMIT,
  recentTryAgainRate,
  recordDrillVerdict,
  recordListened,
  sanitizeTajweedCoaching,
} from "./progress";

// Local noon so the local calendar day is the same in every time zone used by CI.
const DAY1 = new Date(2026, 10, 24, 12, 0, 0);
const DAY2 = new Date(2026, 10, 25, 12, 0, 0);

describe("recordDrillVerdict (revision-ladder spacing)", () => {
  it("moves a head one rung out on matched and counts it", () => {
    const s1 = recordDrillVerdict(coachingState(), "qalqalah", "matched", DAY1);
    expect(s1.heads.qalqalah).toMatchObject({
      attempts: 1,
      matched: 1,
      intervalDays: 1,
      nextDueAt: "2026-11-25",
      recent: ["m"],
    });
    const s2 = recordDrillVerdict(s1, "qalqalah", "matched", DAY2);
    expect(s2.heads.qalqalah).toMatchObject({ intervalDays: 3, nextDueAt: "2026-11-28" });
  });

  it("brings a head one rung in on try-again", () => {
    const s = coachingState({
      heads: { ghunna: { attempts: 3, matched: 3, tryAgain: 0, notSure: 0, intervalDays: 7 } },
    });
    const next = recordDrillVerdict(s, "ghunna", "try-again", DAY1);
    expect(next.heads.ghunna).toMatchObject({
      tryAgain: 1,
      intervalDays: 3,
      nextDueAt: "2026-11-27",
      recent: ["t"],
    });
    const first = recordDrillVerdict(coachingState(), "ghunna", "try-again", DAY1);
    expect(first.heads.ghunna).toMatchObject({ intervalDays: 0, nextDueAt: "2026-11-24" });
  });

  it("changes nothing but the counts on not-sure", () => {
    const next = recordDrillVerdict(coachingState(), "gemination", "not-sure", DAY1);
    expect(next.heads.gemination).toMatchObject({ attempts: 1, notSure: 1 });
    expect(next.heads.gemination?.nextDueAt).toBeUndefined();
    expect(next.heads.gemination?.recent).toBeUndefined();
  });

  it("keeps only the last judged outcomes for the try-again rate", () => {
    let s = coachingState();
    for (let i = 0; i < RECENT_LIMIT + 4; i++)
      s = recordDrillVerdict(s, "qalqalah", "matched", DAY1);
    s = recordDrillVerdict(s, "qalqalah", "try-again", DAY1);
    expect(s.heads.qalqalah?.recent).toHaveLength(RECENT_LIMIT);
    expect(recentTryAgainRate(s.heads.qalqalah)).toBeCloseTo(1 / RECENT_LIMIT);
    expect(recentTryAgainRate(undefined)).toBe(0);
  });
});

describe("listen cards and due days", () => {
  it("records a self-reported listen and spaces it out", () => {
    const s = recordListened(coachingState(), "madd", DAY1);
    expect(s.listened?.madd).toMatchObject({ count: 1, intervalDays: 1, nextDueAt: "2026-11-25" });
  });

  it("marks a day due when any plan item is new or past its date", () => {
    const plan = {
      createdAt: "2026-11-24T00:00:00.000Z",
      items: [
        { head: "qalqalah" as const, words: [] },
        { head: "listen:madd" as const, words: [] },
      ],
    };
    let s = coachingState({ plan });
    expect(duePlanItems(s, "2026-11-24")).toHaveLength(2);
    s = recordDrillVerdict(s, "qalqalah", "matched", DAY1);
    s = recordListened(s, "madd", DAY1);
    expect(coachingDueByDay(s, DAY1, 2)).toEqual({ "2026-11-24": false, "2026-11-25": true });
    expect(coachingDueByDay(coachingState(), DAY1, 1)).toEqual({ "2026-11-24": false });
  });
});

describe("sanitize + merge (blob sync)", () => {
  it("drops invalid heads, plan items and word refs", () => {
    const out = sanitizeTajweedCoaching({
      heads: { qalqalah: { attempts: -2, matched: "x", recent: ["m", "z"] }, bogus: {} },
      plan: {
        createdAt: "2026-11-24T00:00:00.000Z",
        items: [
          { head: "listen:nope", words: [] },
          {
            head: "ghunna",
            words: [
              { surah: 200, ayah: 1, wordIndex: 0 },
              { surah: 1, ayah: 1, wordIndex: 2 },
            ],
          },
        ],
        wordCards: [{ surah: 1, ayah: 1, wordIndex: 0, categories: ["qalqalah", "nope"] }],
      },
    });
    expect(out.heads).toEqual({
      qalqalah: { attempts: 0, matched: 0, tryAgain: 0, notSure: 0, recent: ["m"] },
    });
    expect(out.plan?.items).toEqual([
      { head: "ghunna", words: [{ surah: 1, ayah: 1, wordIndex: 2 }] },
    ]);
    expect(out.plan?.wordCards).toEqual([
      { surah: 1, ayah: 1, wordIndex: 0, categories: ["qalqalah"] },
    ]);
    expect(sanitizeTajweedCoaching("garbage")).toEqual({ schemaVersion: 1, heads: {} });
  });

  it("keeps the later record per head and the newer plan", () => {
    const local = recordDrillVerdict(coachingState(), "qalqalah", "matched", DAY2);
    const remote = coachingState({
      heads: {
        qalqalah: { attempts: 9, matched: 9, tryAgain: 0, notSure: 0, lastAt: DAY1.toISOString() },
        ghunna: { attempts: 1, matched: 0, tryAgain: 1, notSure: 0, lastAt: DAY1.toISOString() },
      },
      plan: { createdAt: "2026-11-25T00:00:00.000Z", items: [{ head: "ghunna", words: [] }] },
    });
    const merged = mergeTajweedCoaching(local, remote);
    expect(merged.heads.qalqalah?.attempts).toBe(1);
    expect(merged.heads.ghunna?.tryAgain).toBe(1);
    expect(merged.plan?.items[0].head).toBe("ghunna");
    expect(mergeTajweedCoaching(remote, local)).toEqual(merged);
  });
});
