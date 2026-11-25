import { getLocalDateString } from "@munib-tracker/shared/utils";

import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import { identityAlignment } from "./align-words";
import {
  ayahHeardEnough,
  creditableAyahs,
  creditablePronunciationAyahs,
  creditableSessionAyahs,
  globalAyah,
  loggedAyahsOn,
  pagesCompleted,
  planKhatmCredit,
  planReadingCredit,
} from "./reading-credit";
import { type AyahPracticeState, createAyahState, createSessionState } from "./reduce-session";
import type { MismatchReason, PracticeHistory, PracticeSummary, WordState } from "./types";

function ayahRow(
  ayah: number,
  states: WordState[],
  opts: { takes?: number; reasons?: (MismatchReason | null)[] } = {},
): AyahPracticeState {
  const takes = opts.takes ?? 1;
  return {
    ...createAyahState(
      ayah,
      states.map((_, i) => `w${i}`),
      identityAlignment(states.length),
    ),
    states,
    reasons: opts.reasons ?? states.map(() => null),
    takes,
    reached: takes > 0,
  };
}

const ENDED = "2026-07-03T10:05:00.000Z";
const DAY = getLocalDateString(new Date(ENDED));

function history(items: PracticeSummary[] = []): PracticeHistory {
  return { schemaVersion: 1, items };
}

describe("ayahHeardEnough (two thirds rule)", () => {
  it("needs at least two thirds of the study words", () => {
    expect(ayahHeardEnough(2, 3)).toBe(true);
    expect(ayahHeardEnough(1, 3)).toBe(false);
    expect(ayahHeardEnough(1, 2)).toBe(false);
    expect(ayahHeardEnough(2, 2)).toBe(true);
    expect(ayahHeardEnough(1, 1)).toBe(true);
    expect(ayahHeardEnough(7, 10)).toBe(true);
    expect(ayahHeardEnough(6, 10)).toBe(false);
    expect(ayahHeardEnough(0, 0)).toBe(false);
  });
});

describe("creditableSessionAyahs", () => {
  it("counts matched, corrected and recited mismatches; not 'not sure', missing or unreached", () => {
    const state = createSessionState([
      ayahRow(1, ["matched", "corrected", "uncertain"]), // 2/3 → counts
      ayahRow(2, ["matched", "uncertain", "uncertain"]), // 1/3 → no
      ayahRow(3, ["confirmedMismatch", "confirmedMismatch", "matched"], {
        reasons: ["wrong", "vowel", null],
      }), // recited, only wrong → counts
      ayahRow(4, ["confirmedMismatch", "confirmedMismatch", "matched"], {
        reasons: ["missing", "skipped-ayah", null],
      }), // words skipped → no
      ayahRow(5, ["matched", "matched", "upcoming"]), // 2/3 → counts
      ayahRow(6, ["matched", "matched"], { takes: 0 }), // never started → no
    ]);
    expect(creditableSessionAyahs(state, [6, 5, 4, 3, 2, 1], true)).toEqual([1, 3, 5]);
  });

  it("only counts visited ayahs and never a listen-only session", () => {
    const state = createSessionState([ayahRow(1, ["matched"]), ayahRow(2, ["matched"])]);
    expect(creditableSessionAyahs(state, [2], true)).toEqual([2]);
    expect(creditableSessionAyahs(state, [1, 2], false)).toEqual([]);
  });
});

describe("creditablePronunciationAyahs", () => {
  it("counts clear + listen-again words, not 'not sure'", () => {
    const words = (ayah: number, states: Array<"clear" | "listen-again" | "not-sure">) =>
      states.map((state, word) => ({ surah: 1, ayah, word, state }));
    const summary = buildPracticeSummary({
      mode: "follow",
      pronunciation: {
        words: [
          ...words(1, ["clear", "listen-again", "not-sure"]),
          ...words(2, ["clear", "not-sure", "not-sure"]),
          ...words(3, ["listen-again", "listen-again"]),
        ],
      },
    });
    expect(creditablePronunciationAyahs(summary)).toEqual([1, 3]);
    expect(creditableAyahs(summary)).toEqual([1, 3]);
  });
});

describe("creditableAyahs", () => {
  it("prefers stored heardAyahs and keeps them inside the passage", () => {
    const summary = buildPracticeSummary({
      ayahStart: 2,
      ayahEnd: 5,
      heardAyahs: [5, 2, 2, 9, 1, 3.5],
    });
    expect(creditableAyahs(summary)).toEqual([2, 5]);
  });

  it("is empty for an older row with neither field", () => {
    expect(creditableAyahs(buildPracticeSummary())).toEqual([]);
  });
});

describe("planReadingCredit", () => {
  const summary = (overrides: Partial<PracticeSummary> = {}) =>
    buildPracticeSummary({
      id: "s-new",
      endedAt: ENDED,
      durationMs: 95_500,
      heardAyahs: [1, 2, 3, 4, 5],
      ...overrides,
    });

  it("credits heard ayahs and active seconds on the day the session ended", () => {
    expect(planReadingCredit({ summary: summary(), history: history(), enabled: true })).toEqual({
      sessionId: "s-new",
      date: DAY,
      surah: 1,
      ayahs: [1, 2, 3, 4, 5],
      khatmAyahs: [1, 2, 3, 4, 5],
      seconds: 95,
    });
  });

  it("returns null when the setting is off", () => {
    expect(planReadingCredit({ summary: summary(), history: history(), enabled: false })).toBe(
      null,
    );
  });

  it("is idempotent per session id: a saved session is never credited again", () => {
    const saved = summary({ loggedAyahs: [1, 2, 3, 4, 5] });
    expect(
      planReadingCredit({ summary: summary(), history: history([saved]), enabled: true }),
    ).toBeNull();
  });

  it("skips ayahs an earlier session already logged the same day", () => {
    const earlier = buildPracticeSummary({
      id: "s-old",
      endedAt: "2026-07-03T09:00:00.000Z",
      loggedAyahs: [1, 2, 3],
    });
    const otherDay = buildPracticeSummary({
      id: "s-yesterday",
      endedAt: "2026-07-01T09:00:00.000Z",
      loggedAyahs: [4],
    });
    const plan = planReadingCredit({
      summary: summary(),
      history: history([earlier, otherDay]),
      enabled: true,
    });
    expect(plan?.ayahs).toEqual([4, 5]);
    // Khatm is offered every heard ayah; its cycle record decides (D72).
    expect(plan?.khatmAyahs).toEqual([1, 2, 3, 4, 5]);
  });

  it("still offers khatm the ayahs when today's log already has them all", () => {
    const earlier = buildPracticeSummary({
      id: "s-old",
      endedAt: "2026-07-03T09:00:00.000Z",
      loggedAyahs: [1, 2, 3, 4, 5],
    });
    const plan = planReadingCredit({
      summary: summary({ durationMs: 5_000 }),
      history: history([earlier]),
      enabled: true,
    });
    expect(plan).toMatchObject({ ayahs: [], khatmAyahs: [1, 2, 3, 4, 5], seconds: 5 });
  });

  it("returns null with no new ayah and under the minimum active time", () => {
    expect(
      planReadingCredit({
        summary: summary({ heardAyahs: [], durationMs: 5_000 }),
        history: history(),
        enabled: true,
      }),
    ).toBeNull();
  });

  it("still logs practice time when no ayah was heard (listen-only)", () => {
    const plan = planReadingCredit({
      summary: summary({ heardAyahs: [], durationMs: 120_000 }),
      history: history(),
      enabled: true,
    });
    expect(plan).toMatchObject({ ayahs: [], seconds: 120 });
  });

  it("returns null for a bad timestamp", () => {
    expect(
      planReadingCredit({
        summary: summary({ endedAt: "nope" }),
        history: history(),
        enabled: true,
      }),
    ).toBeNull();
  });
});

describe("loggedAyahsOn", () => {
  it("unions logged ayahs of the day as global ayah numbers", () => {
    const a = buildPracticeSummary({ id: "a", endedAt: ENDED, loggedAyahs: [1, 7] });
    const b = buildPracticeSummary({ id: "b", surah: 2, endedAt: ENDED, loggedAyahs: [1] });
    expect([...loggedAyahsOn(history([a, b]), DAY)].sort((x, y) => x - y)).toEqual([1, 7, 8]);
    expect([...loggedAyahsOn(history([a, b]), DAY, "b")]).toEqual([1, 7]);
  });
});

describe("khatm conversion", () => {
  it("maps surah:ayah to the 1…6236 mushaf position", () => {
    expect(globalAyah(1, 1)).toBe(1);
    expect(globalAyah(2, 1)).toBe(8);
    expect(globalAyah(114, 6)).toBe(6236);
    expect(globalAyah(999, 1)).toBeNull();
  });

  const g = (surah: number, ayah: number) => globalAyah(surah, ayah) as number;
  const range = (surah: number, from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => g(surah, from + i));

  it("ayah unit counts only ayahs not yet credited to the cycle (D72)", () => {
    expect(
      planKhatmCredit({ surah: 1, ayahs: [1, 2, 3], credited: new Set(), unit: "ayah" }),
    ).toEqual({ fresh: [1, 2, 3], units: 3 });
    expect(
      planKhatmCredit({ surah: 1, ayahs: [1, 2, 3, 4], credited: new Set([1, 2]), unit: "ayah" }),
    ).toEqual({ fresh: [3, 4], units: 2 });
    expect(
      planKhatmCredit({ surah: 1, ayahs: [1, 2], credited: new Set([1, 2]), unit: "ayah" }),
    ).toEqual({ fresh: [], units: 0 });
  });

  it("page unit counts a page once, when all its ayahs are credited (page 1: 1:1–7)", () => {
    expect(
      planKhatmCredit({
        surah: 1,
        ayahs: [1, 2, 3, 4, 5, 6, 7],
        credited: new Set(),
        unit: "page",
      }),
    ).toEqual({ fresh: [1, 2, 3, 4, 5, 6, 7], units: 1 });
    // Half a page: the ayahs are recorded, no page yet.
    expect(
      planKhatmCredit({ surah: 1, ayahs: [1, 2, 3], credited: new Set(), unit: "page" }),
    ).toEqual({ fresh: [1, 2, 3], units: 0 });
    // Finished later in the cycle (any day).
    expect(
      planKhatmCredit({
        surah: 1,
        ayahs: [4, 5, 6, 7],
        credited: new Set([1, 2, 3]),
        unit: "page",
      }),
    ).toEqual({ fresh: [4, 5, 6, 7], units: 1 });
    // Practising the page again adds nothing.
    expect(
      planKhatmCredit({
        surah: 1,
        ayahs: [1, 2, 3, 4, 5, 6, 7],
        credited: new Set(range(1, 1, 7)),
        unit: "page",
      }),
    ).toEqual({ fresh: [], units: 0 });
  });

  it("a page shared by several surahs needs all of them (page 604: 112–114)", () => {
    const an = [1, 2, 3, 4, 5, 6];
    const fresh = range(114, 1, 6);
    expect(pagesCompleted(fresh, new Set(fresh))).toBe(0);
    const after = new Set([...range(112, 1, 4), ...range(113, 1, 5), ...fresh]);
    expect(pagesCompleted(fresh, after)).toBe(1);
    expect(
      planKhatmCredit({
        surah: 114,
        ayahs: an,
        credited: new Set([...range(112, 1, 4), ...range(113, 1, 5)]),
        unit: "page",
      }).units,
    ).toBe(1);
  });
});
