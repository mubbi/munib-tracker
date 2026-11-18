import type { PracticeSummary } from "@/lib/quran-companion/types";

import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import { summaryOutcome } from "./practice-session-summary";

/** A listener session with nothing counted yet. */
function summary(over: Partial<PracticeSummary> = {}): PracticeSummary {
  return buildPracticeSummary({
    ayahEnd: 1,
    engine: "tilawa-zipformer",
    engineVersion: "1",
    matched: 0,
    ...over,
  });
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
