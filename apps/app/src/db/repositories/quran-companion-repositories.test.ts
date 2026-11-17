import AsyncStorage from "@react-native-async-storage/async-storage";

import { encodeMap } from "@/lib/quran-companion/memorization-codec";
import { ayahCount } from "@/lib/quran-companion/passage";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import type { MemorizationRecord, PracticeSummary } from "@/lib/quran-companion/types";
import { DB_KEYS } from "../keys";
import { QuranCompanionPrefsRepository } from "./quran-companion-prefs-repository";
import { QuranMemorizationRepository } from "./quran-memorization-repository";
import { QuranPracticeRepository } from "./quran-practice-repository";

/** Spec §12: repository round-trips, the 30-item cap, and newer-schema blobs left alone. */

function summary(i: number): PracticeSummary {
  const ended = new Date(Date.UTC(2026, 10, 1, 0, i)).toISOString();
  return {
    id: `s${i}`,
    mode: "check",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    startedAt: ended,
    endedAt: ended,
    durationMs: 60_000,
    engine: "tilawa-zipformer",
    engineVersion: "0.4.0",
    matched: 25,
    uncertain: 1,
    confirmedMismatch: 0,
    corrected: 0,
    notReached: 3,
    weakAyahs: [],
  };
}

const record: MemorizationRecord = {
  status: "practising",
  successStreak: 3,
  intervalDays: 7,
  nextReviewAt: "2026-11-24",
  lastAttemptAt: "2026-11-17T09:00:00.000Z",
  lastSuccessAt: "2026-11-17T09:00:00.000Z",
  lapses: 1,
  updatedAt: "2026-11-17T09:00:00.000Z",
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("QuranPracticeRepository", () => {
  it("round-trips summaries and keeps only the newest 30", async () => {
    for (let i = 0; i < 35; i++) await QuranPracticeRepository.add(summary(i));
    const history = await QuranPracticeRepository.get();
    expect(history.items).toHaveLength(30);
    expect(history.items[0].id).toBe("s34");
    expect(history.items.at(-1)?.id).toBe("s5");
  });

  it("clear keeps a clearedAt marker and drops the items", async () => {
    await QuranPracticeRepository.add(summary(1));
    const cleared = await QuranPracticeRepository.clear(new Date("2026-11-17T10:00:00.000Z"));
    expect(cleared.items).toEqual([]);
    expect(cleared.clearedAt).toBe("2026-11-17T10:00:00.000Z");
    expect((await QuranPracticeRepository.get()).items).toEqual([]);
  });

  it("reads a newer-schema blob as empty and never overwrites it", async () => {
    const newer = JSON.stringify({ schemaVersion: 2, items: [{ id: "future" }] });
    await AsyncStorage.setItem(DB_KEYS.quranPracticeSessions, newer);
    expect((await QuranPracticeRepository.get()).items).toEqual([]);
    await QuranPracticeRepository.add(summary(1));
    await QuranPracticeRepository.clear();
    expect(await AsyncStorage.getItem(DB_KEYS.quranPracticeSessions)).toBe(newer);
  });
});

describe("QuranCompanionPrefsRepository", () => {
  it("starts from the §9.5 defaults", async () => {
    const prefs = await QuranCompanionPrefsRepository.get();
    expect(prefs).toEqual(DEFAULT_COMPANION_PREFS);
    expect(prefs.wifiOnlyDownload).toBe(true);
    expect(prefs.dailyRevisionLimit).toBe(10);
    expect(prefs.engineChoice).toBe("tilawa-zipformer");
  });

  it("round-trips the Wi-Fi flag, engine choice and daily limit", async () => {
    await QuranCompanionPrefsRepository.update({
      wifiOnlyDownload: false,
      engineChoice: "tilawa-fastconformer",
      dailyRevisionLimit: 20,
    });
    const prefs = await QuranCompanionPrefsRepository.get();
    expect(prefs.wifiOnlyDownload).toBe(false);
    expect(prefs.engineChoice).toBe("tilawa-fastconformer");
    expect(prefs.dailyRevisionLimit).toBe(20);
  });

  it("leaves a newer-schema blob untouched", async () => {
    const newer = JSON.stringify({ schemaVersion: 2, defaultMode: "future" });
    await AsyncStorage.setItem(DB_KEYS.quranCompanionPrefs, newer);
    expect(await QuranCompanionPrefsRepository.get()).toEqual(DEFAULT_COMPANION_PREFS);
    await QuranCompanionPrefsRepository.update({ keepAwake: false });
    expect(await AsyncStorage.getItem(DB_KEYS.quranCompanionPrefs)).toBe(newer);
  });
});

describe("QuranMemorizationRepository", () => {
  it("round-trips records through the compact codec", async () => {
    await QuranMemorizationRepository.upsert({ "1:1": record, "2:255": record });
    const all = await QuranMemorizationRepository.getAll();
    expect(Object.keys(all).sort()).toEqual(["1:1", "2:255"]);
    expect(all["2:255"]?.intervalDays).toBe(7);
    expect(all["2:255"]?.nextReviewAt).toBe("2026-11-24");
  });

  it("a full hafiz map (6,236 ayahs) serializes under 600 KB (§10 payload size)", () => {
    const records: Record<string, MemorizationRecord> = {};
    for (let s = 1; s <= 114; s++) {
      for (let a = 1; a <= ayahCount(s); a++) records[`${s}:${a}`] = record;
    }
    expect(Object.keys(records)).toHaveLength(6236);
    const bytes = new TextEncoder().encode(JSON.stringify(encodeMap(records))).length;
    expect(bytes).toBeLessThan(600 * 1024);
  });
});
