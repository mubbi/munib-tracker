import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import type { PracticeSummary } from "@/lib/quran-companion/types";
import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import {
  getQuranReadingLog,
  practiceReadingDelta,
  quranReadingLogStore,
  recordPracticeReading,
} from "./quran-reading-log-store";

const TODAY = getLocalDateString();

beforeEach(async () => {
  await AsyncStorage.clear();
  quranReadingLogStore.setState({ log: {}, isReady: false });
});

function summary(overrides: Partial<PracticeSummary> = {}): PracticeSummary {
  return buildPracticeSummary({
    ayahStart: 1,
    ayahEnd: 7,
    notReached: 2,
    durationMs: 95_500,
    endedAt: new Date().toISOString(),
    ...overrides,
  });
}

describe("quran-reading-log-store (D40)", () => {
  it("records deltas, persists them and reloads the sanitized log", async () => {
    await quranReadingLogStore.getState().record(TODAY, { seconds: 40, ayahs: 3 });
    await quranReadingLogStore.getState().record(TODAY, { seconds: 20, pages: 1 });
    expect(quranReadingLogStore.getState().log[TODAY]).toEqual({ seconds: 60, ayahs: 3, pages: 1 });

    const stored = JSON.parse((await AsyncStorage.getItem(DB_KEYS.quranReadingLog)) ?? "{}");
    expect(stored[TODAY]).toEqual({ seconds: 60, ayahs: 3, pages: 1 });

    quranReadingLogStore.setState({ log: {}, isReady: false });
    expect((await getQuranReadingLog())[TODAY]).toEqual({ seconds: 60, ayahs: 3, pages: 1 });
  });

  it("drops a corrupted stored value instead of crashing", async () => {
    await AsyncStorage.setItem(
      DB_KEYS.quranReadingLog,
      JSON.stringify({ nope: 1, "2026-01-01": 4 }),
    );
    expect(await getQuranReadingLog()).toEqual({});
  });

  it("records a finished practice session on the day it ended", async () => {
    expect(practiceReadingDelta(summary())).toEqual({ seconds: 95, ayahs: 5, pages: 0 });
    expect(practiceReadingDelta(summary({ notReached: 7, durationMs: 5_000 }))).toBeNull();
    await recordPracticeReading(summary());
    expect(quranReadingLogStore.getState().log[TODAY]).toEqual({ seconds: 95, ayahs: 5, pages: 0 });
  });
});
