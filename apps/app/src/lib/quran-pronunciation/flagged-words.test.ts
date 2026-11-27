import { EMPTY_HISTORY } from "@/lib/quran-companion/merge";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import { ladderOutcomes } from "@/lib/quran-companion/summary";
import type { PracticeHistory } from "@/lib/quran-companion/types";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranPracticeStore } from "@/stores/quran-practice-store";

import {
  clearWordWindows,
  flaggedWordsFromHistory,
  getFlaggedWords,
  getWordWindows,
  rememberWordWindows,
} from "./flagged-words";
import { buildPronunciationSummary, countStates, isPronunciationSummary } from "./summary";

const summary = (
  id: string,
  endedAt: string,
  words: Parameters<typeof buildPronunciationSummary>[0]["results"],
) =>
  buildPronunciationSummary({
    id,
    passage: { surah: 1, ayahStart: 2, ayahEnd: 3 },
    results: words,
    startedAt: "2026-11-24T10:00:00.000Z",
    endedAt,
    engineVersion: "v",
    wordCounts: { 2: 4, 3: 2 },
  });

const older = summary("a", "2026-11-24T10:01:00.000Z", {
  2: [
    { index: 0, state: "clear" },
    { index: 1, state: "listen-again" },
    { index: 2, state: "not-sure" },
    { index: 3, state: "listen-again" },
  ],
});
const newer = summary("b", "2026-11-24T11:00:00.000Z", {
  3: [
    { index: 0, state: "listen-again" },
    { index: 1, state: "clear" },
  ],
  2: [{ index: 1, state: "listen-again" }],
});
const history: PracticeHistory = { schemaVersion: 1, items: [older, newer] };

describe("buildPronunciationSummary", () => {
  it("stores word states only, under the existing follow mode", () => {
    expect(older.mode).toBe("follow");
    expect(older.pronunciation?.words).toHaveLength(4);
    expect(Object.keys(older.pronunciation?.words[0] ?? {}).sort()).toEqual([
      "ayah",
      "state",
      "surah",
      "word",
    ]);
    expect(older).toMatchObject({ matched: 1, uncertain: 3, confirmedMismatch: 0, notReached: 2 });
    expect(older.weakAyahs).toEqual([]);
    expect(isPronunciationSummary(older)).toBe(true);
  });

  it("never moves the memorisation ladder", () => {
    expect(ladderOutcomes({ engineRan: true, mode: older.mode, ayahs: {} } as never)).toEqual([]);
  });

  it("counts states", () => {
    expect(
      countStates([
        { index: 0, state: "clear" },
        { index: 1, state: "not-sure" },
      ]),
    ).toEqual({
      clear: 1,
      "listen-again": 0,
      "not-sure": 1,
    });
  });
});

describe("flagged words for NF-3.15", () => {
  it("lists Listen-again words newest first, de-duplicated", () => {
    expect(flaggedWordsFromHistory(history)).toEqual([
      { surah: 1, ayah: 2, word: 1, at: newer.endedAt },
      { surah: 1, ayah: 3, word: 0, at: newer.endedAt },
      { surah: 1, ayah: 2, word: 3, at: older.endedAt },
    ]);
    expect(flaggedWordsFromHistory(history, { limit: 1 })).toHaveLength(1);
    expect(flaggedWordsFromHistory(history, { since: newer.endedAt })).toHaveLength(2);
    expect(flaggedWordsFromHistory(EMPTY_HISTORY)).toEqual([]);
  });

  it("respects the opt-out setting", () => {
    quranPracticeStore.setState({ history, isReady: true });
    quranCompanionPrefsStore.setState({
      prefs: { ...DEFAULT_COMPANION_PREFS, feedCoachingFromAssessment: true },
      isReady: true,
    });
    expect(getFlaggedWords()).toHaveLength(3);
    quranCompanionPrefsStore.setState({
      prefs: { ...DEFAULT_COMPANION_PREFS, feedCoachingFromAssessment: false },
    });
    expect(getFlaggedWords()).toEqual([]);
  });

  it("keeps per-word windows in memory only, until the screen closes", () => {
    rememberWordWindows(1, 2, [
      { index: 0, state: "clear", startMs: 0, endMs: 400 },
      { index: 1, state: "not-sure" },
    ]);
    expect(getWordWindows(1, 2)).toEqual([{ word: 0, startMs: 0, endMs: 400 }]);
    clearWordWindows();
    expect(getWordWindows(1, 2)).toBeNull();
  });
});
