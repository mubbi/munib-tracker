import { identityAlignment } from "./align-words";
import {
  type AyahPracticeState,
  createAyahState,
  createSessionState,
  type SessionState,
} from "./reduce-session";
import { buildPracticeSummary, ladderOutcomes, visitedAyahs } from "./summary";
import type { WordState } from "./types";

/** An ayah row with explicit word states after `takes` takes. */
function ayahRow(ayah: number, states: WordState[], takes = 1): AyahPracticeState {
  return {
    ...createAyahState(
      ayah,
      states.map((_, i) => `w${i}`),
      identityAlignment(states.length),
    ),
    states,
    takes,
    reached: takes > 0,
  };
}

function setup(rows: AyahPracticeState[]): SessionState {
  return createSessionState(rows);
}

const PASSAGE = { surah: 1, ayahStart: 1, ayahEnd: 4 };
const STARTED = new Date("2026-07-03T10:00:00.000Z");

function summarize(
  state: SessionState,
  visited: number[],
  overrides: Partial<Parameters<typeof buildPracticeSummary>[0]> = {},
) {
  return buildPracticeSummary({
    state,
    visited: new Set(visited),
    passage: PASSAGE,
    mode: "check",
    startedAt: STARTED,
    endedAt: new Date(STARTED.getTime() + 60_000),
    engine: "tilawa-zipformer",
    engineVersion: "v1",
    confirmsMismatches: true,
    ...overrides,
  });
}

describe("visitedAyahs", () => {
  it("returns visited rows in ayah order and skips unknown ayahs", () => {
    const state = setup([ayahRow(1, ["matched"]), ayahRow(3, ["matched"])]);
    expect(visitedAyahs(state, new Set([3, 9, 1])).map((a) => a.ayah)).toEqual([1, 3]);
  });
});

describe("buildPracticeSummary", () => {
  const state = setup([
    ayahRow(1, ["matched", "matched"]),
    ayahRow(2, ["matched", "confirmedMismatch", "corrected"]),
    ayahRow(3, ["uncertain", "upcoming"]),
    ayahRow(4, ["matched"], 0),
  ]);

  it("totals word counts over practised ayahs", () => {
    expect(summarize(state, [1, 2, 3, 4])).toMatchObject({
      matched: 3,
      uncertain: 1,
      confirmedMismatch: 1,
      corrected: 1,
      notReached: 1,
      durationMs: 60_000,
      surah: 1,
      ayahStart: 1,
      ayahEnd: 4,
      engine: "tilawa-zipformer",
    });
  });

  it("reports mismatched ayahs as weak first", () => {
    expect(summarize(state, [1, 2, 3]).weakAyahs).toEqual([2]);
  });

  it("falls back to not-sure ayahs when nothing was mismatched", () => {
    expect(summarize(state, [1, 3]).weakAyahs).toEqual([3]);
  });

  it("flags mismatches as unconfirmed for builds that cannot confirm them", () => {
    expect(summarize(state, [2], { confirmsMismatches: false }).mismatchesUnconfirmed).toBe(true);
    expect(summarize(state, [2])).not.toHaveProperty("mismatchesUnconfirmed");
  });

  it("reports zero counts for listen-only sessions", () => {
    expect(summarize(state, [1, 2, 3], { engine: "none" })).toMatchObject({
      matched: 0,
      confirmedMismatch: 0,
      weakAyahs: [],
    });
  });

  it("never reports a negative duration", () => {
    expect(summarize(state, [], { endedAt: new Date(STARTED.getTime() - 1) }).durationMs).toBe(0);
  });
});

describe("ladderOutcomes", () => {
  const state = setup([
    ayahRow(1, ["matched", "matched"]),
    ayahRow(2, ["confirmedMismatch"]),
    ayahRow(3, ["matched"], 0),
  ]);
  const base = { state, visited: new Set([1, 2, 3]), surah: 5 };

  it("records an outcome for each practised ayah", () => {
    expect(ladderOutcomes({ ...base, mode: "check", engineRan: true })).toEqual([
      { surah: 5, ayah: 1, outcome: "success" },
      { surah: 5, ayah: 2, outcome: "lapse" },
    ]);
  });

  it.each([
    ["Follow mode", { mode: "follow" as const, engineRan: true }],
    ["listen-only sessions", { mode: "check" as const, engineRan: false }],
  ])("writes nothing for %s", (_label, overrides) => {
    expect(ladderOutcomes({ ...base, ...overrides })).toEqual([]);
  });
});
