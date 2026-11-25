import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";

import { getQuranReadingLog, quranReadingLogStore } from "./quran-reading-log-store";

const TODAY = getLocalDateString();

beforeEach(async () => {
  await AsyncStorage.clear();
  quranReadingLogStore.setState({ log: {}, isReady: false });
});

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
});
