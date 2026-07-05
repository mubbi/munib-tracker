import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { applyBackup, exportBackup, parseBackup } from "@/lib/backup";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("backup export/import", () => {
  it("round-trips user data through export → parse → apply", async () => {
    await writeJSON(DB_KEYS.prayerLogs, { a: 1 });
    await writeJSON(DB_KEYS.customTasbeeh, { t1: { title: "x" } });
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
  });

  it("rejects malformed and foreign files", () => {
    expect(parseBackup("{not json").ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: "other", data: {} })).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ app: "munib-tracker", version: 99, data: {} })).ok).toBe(
      false,
    );
  });
});
