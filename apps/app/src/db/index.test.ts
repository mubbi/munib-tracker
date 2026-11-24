import AsyncStorage from "@react-native-async-storage/async-storage";
import { initDatabase, resetDatabase } from "./index";
import { DB_KEYS } from "./keys";
import * as migrations from "./migrations";
import { readJSON, writeJSON } from "./store";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe("initDatabase", () => {
  it("retries after a failed migration instead of caching the failure", async () => {
    const run = jest
      .spyOn(migrations, "runMigrations")
      .mockRejectedValueOnce(new Error("migrate failed"))
      .mockResolvedValue(undefined);

    await expect(initDatabase()).rejects.toThrow("migrate failed");
    await expect(initDatabase()).resolves.toBeUndefined();
    await expect(initDatabase()).resolves.toBeUndefined();

    expect(run).toHaveBeenCalledTimes(2);
  });
});

describe("resetDatabase", () => {
  it("wipes persisted user data", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    await resetDatabase();
    expect(await readJSON(DB_KEYS.fasting, null)).toBeNull();
  });

  it("also removes quarantined __corrupt copies and shards of user data", async () => {
    // A corrupt value is moved aside by readJSON, not deleted — reset must not leave it behind.
    await AsyncStorage.setItem(DB_KEYS.prayerLogs, "{not-json");
    expect(await readJSON(DB_KEYS.prayerLogs, null)).toBeNull();
    expect(await AsyncStorage.getItem(`${DB_KEYS.prayerLogs}__corrupt`)).toBe("{not-json");
    await AsyncStorage.setItem(`${DB_KEYS.quranRootIndex}/meta`, "{}");
    await AsyncStorage.setItem(`${DB_KEYS.vaultDebts}__corrupt`, "ciphertext");
    await AsyncStorage.setItem(DB_KEYS.version, "9");

    await resetDatabase();

    expect(await AsyncStorage.getItem(`${DB_KEYS.prayerLogs}__corrupt`)).toBeNull();
    expect(await AsyncStorage.getItem(`${DB_KEYS.quranRootIndex}/meta`)).toBeNull();
    expect(await AsyncStorage.getItem(`${DB_KEYS.vaultDebts}__corrupt`)).toBeNull();
    expect(await AsyncStorage.getItem(DB_KEYS.version)).toBe("9");
  });
});
