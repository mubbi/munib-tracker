import type { PracticeSummary } from "@/lib/quran-companion/types";

import { summaryOutcome } from "./practice-session-summary";

function summary(over: Partial<PracticeSummary> = {}): PracticeSummary {
  return {
    id: "s1",
    mode: "check",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    startedAt: "2026-11-17T10:00:00.000Z",
    endedAt: "2026-11-17T10:01:00.000Z",
    durationMs: 60_000,
    engine: "tilawa-zipformer",
    engineVersion: "1",
    matched: 0,
    uncertain: 0,
    confirmedMismatch: 0,
    corrected: 0,
    notReached: 0,
    weakAyahs: [],
    ...over,
  };
}

describe("summaryOutcome", () => {
  it("treats a session with only unreached words as nothing heard", () => {
    const o = summaryOutcome(summary({ notReached: 4 }));
    expect(o.nothingHeard).toBe(true);
    expect(o.total).toBe(4);
  });

  it("treats a session ended before any take as nothing heard", () => {
    expect(summaryOutcome(summary()).nothingHeard).toBe(true);
  });

  it("is not nothing-heard for listen-only sessions", () => {
    const o = summaryOutcome(summary({ engine: "none" }));
    expect(o.listened).toBe(true);
    expect(o.nothingHeard).toBe(false);
  });

  it("counts corrected words as heard", () => {
    const o = summaryOutcome(summary({ matched: 5, corrected: 2, notReached: 1 }));
    expect(o).toMatchObject({ heard: 7, missed: 1, total: 8, nothingHeard: false });
  });

  it("folds mismatches into not-sure when the engine cannot confirm them", () => {
    const o = summaryOutcome(
      summary({ uncertain: 1, confirmedMismatch: 2, mismatchesUnconfirmed: true }),
    );
    expect(o).toMatchObject({ notSure: 3, tryAgain: 0, nothingHeard: false });
  });

  it("keeps confirmed mismatches as try-again", () => {
    const o = summaryOutcome(summary({ matched: 3, confirmedMismatch: 2 }));
    expect(o).toMatchObject({ heard: 3, tryAgain: 2, notSure: 0 });
  });
});
