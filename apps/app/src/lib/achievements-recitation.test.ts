import AsyncStorage from "@react-native-async-storage/async-storage";

import { resetDatabase } from "@/db";
import { BACKUP_KEYS, DB_KEYS, RESET_KEYS } from "@/db/keys";
import { QuranPracticeRepository } from "@/db/repositories/quran-practice-repository";
import { RecitationTotalsRepository } from "@/db/repositories/recitation-totals-repository";
import { quranPracticeStore } from "@/stores/quran-practice-store";
import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";
import { usePlatform } from "@/test-support/platform";

import { loadRecitationStats } from "./achievements-recitation";

/** Distinct, increasing end times so the newest-30 history keeps the latest saves. */
function session(i: number, heardAyahs: number[] = [1, 2]) {
  const ended = new Date(Date.UTC(2026, 10, 1, 8, i)).toISOString();
  return buildPracticeSummary({ id: `s${i}`, endedAt: ended, startedAt: ended, heardAyahs });
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("loadRecitationStats (D71)", () => {
  it("seeds the lifetime totals from a synced history on a fresh device, once", async () => {
    for (let i = 0; i < 3; i++) await QuranPracticeRepository.add(session(i));
    expect(await RecitationTotalsRepository.get()).toMatchObject({ sessions: 0 });

    expect(await loadRecitationStats()).toEqual({
      sessions: 3,
      ayahsRecited: 6,
      bestRevisionStreak: 0,
    });
    expect(await RecitationTotalsRepository.get()).toMatchObject({ sessions: 3, ayahsRecited: 6 });
    // A second read credits nothing again.
    expect(await loadRecitationStats()).toMatchObject({ sessions: 3, ayahsRecited: 6 });
  });

  it("keeps counting after the history cap rolls old sessions off", async () => {
    for (let i = 0; i < 35; i++) await quranPracticeStore.getState().addSummary(session(i));
    expect((await QuranPracticeRepository.get()).items).toHaveLength(30);
    expect(await loadRecitationStats()).toEqual({
      sessions: 35,
      ayahsRecited: 70,
      bestRevisionStreak: 0,
    });
  });

  it("credits a session once however often it is saved", async () => {
    const one = session(1, [1, 2, 3]);
    await quranPracticeStore.getState().addSummary(one);
    await quranPracticeStore.getState().addSummary(one);
    expect(await RecitationTotalsRepository.get()).toMatchObject({
      sessions: 1,
      ayahsRecited: 3,
      creditedIds: ["s1"],
    });
  });

  it("keeps the totals when practice history is deleted, so badges and Noor stay", async () => {
    await quranPracticeStore.getState().addSummary(session(1));
    await quranPracticeStore.getState().clearHistory();
    expect(await loadRecitationStats()).toMatchObject({ sessions: 1, ayahsRecited: 2 });
  });

  it("is backed up and wiped by Reset app data", async () => {
    expect(BACKUP_KEYS).toContain(DB_KEYS.recitationTotals);
    expect(RESET_KEYS).toContain(DB_KEYS.recitationTotals);
    await quranPracticeStore.getState().addSummary(session(1));
    await resetDatabase();
    expect(await AsyncStorage.getItem(DB_KEYS.recitationTotals)).toBeNull();
    expect(await loadRecitationStats()).toEqual({
      sessions: 0,
      ayahsRecited: 0,
      bestRevisionStreak: 0,
    });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("returns null (no practice there) and writes nothing", async () => {
      await QuranPracticeRepository.add(session(1));
      expect(await loadRecitationStats()).toBeNull();
      expect(await AsyncStorage.getItem(DB_KEYS.recitationTotals)).toBeNull();
    });
  });
});
