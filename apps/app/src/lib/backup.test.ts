import AsyncStorage from "@react-native-async-storage/async-storage";

import { BACKUP_KEYS, DB_KEYS, RESET_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { applyBackup, exportBackup, parseBackup } from "@/lib/backup";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("backup export/import", () => {
  it("round-trips user data through export → parse → apply", async () => {
    await writeJSON(DB_KEYS.prayerLogs, { a: 1 });
    await writeJSON(DB_KEYS.customTasbeeh, { t1: { title: "x" } });
    // Keys added to the corpus after the first release must round-trip too.
    await writeJSON(DB_KEYS.hifz, { "2:255": "memorized" });
    await writeJSON(DB_KEYS.learnDuaProgress, ["dua-1"]);
    // A cache key must NOT be included in the backup.
    await writeJSON(DB_KEYS.weatherCache, { temp: 20 });

    const text = await exportBackup("2026-07-06T00:00:00.000Z");
    const parsed = JSON.parse(text);
    expect(parsed.app).toBe("munib-tracker");
    expect(parsed.data[DB_KEYS.prayerLogs]).toEqual({ a: 1 });
    expect(parsed.data[DB_KEYS.weatherCache]).toBeUndefined();

    await AsyncStorage.clear();
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    if (result.ok) await applyBackup(result.file);

    expect(await readJSON(DB_KEYS.prayerLogs, null)).toEqual({ a: 1 });
    expect(await readJSON(DB_KEYS.customTasbeeh, null)).toEqual({ t1: { title: "x" } });
    expect(await readJSON(DB_KEYS.hifz, null)).toEqual({ "2:255": "memorized" });
    expect(await readJSON(DB_KEYS.learnDuaProgress, null)).toEqual(["dua-1"]);
  });

  it("rejects malformed and foreign files", () => {
    expect(parseBackup("{not json").ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: "other", data: {} })).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: "munib-tracker", version: 99, data: {} })).ok).toBe(
      false,
    );
  });
});

describe("key coverage", () => {
  const CACHE_KEYS = [
    DB_KEYS.quranEditionCache,
    DB_KEYS.hadithBookCache,
    DB_KEYS.audioDurationCache,
    DB_KEYS.reverseGeocodeCache,
    DB_KEYS.weatherCache,
  ];

  it("resets every persisted key except the schema-version marker", () => {
    const everythingButVersion = Object.values(DB_KEYS).filter((key) => key !== DB_KEYS.version);
    expect(new Set(RESET_KEYS)).toEqual(new Set(everythingButVersion));
    expect(RESET_KEYS).not.toContain(DB_KEYS.version);
  });

  it("backs up all user data but never caches or device-local bookkeeping", () => {
    // Backup is a strict subset of what a reset would clear.
    expect(RESET_KEYS).toEqual(expect.arrayContaining(BACKUP_KEYS));
    for (const cache of CACHE_KEYS) expect(BACKUP_KEYS).not.toContain(cache);
    for (const local of [DB_KEYS.syncMetadata, DB_KEYS.tombstones, DB_KEYS.contentReportQueue]) {
      expect(BACKUP_KEYS).not.toContain(local);
    }
    // Personal stores that were historically missed must now be captured.
    for (const key of [
      DB_KEYS.customTasbeeh,
      DB_KEYS.khatm,
      DB_KEYS.hifz,
      DB_KEYS.customAdhkar,
      DB_KEYS.khushuJournal,
      DB_KEYS.hajjChecklist,
      DB_KEYS.jannahIntentions,
      DB_KEYS.jahannamIntentions,
      DB_KEYS.learnDuaProgress,
    ]) {
      expect(BACKUP_KEYS).toContain(key);
    }
  });
});
