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
});
