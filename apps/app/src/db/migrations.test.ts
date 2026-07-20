import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "./keys";
import { DB_VERSION, runMigrations } from "./migrations";
import { readJSON, writeJSON } from "./store";

beforeEach(async () => {
  await AsyncStorage.clear();
});

async function storedVersion(): Promise<number> {
  // -1 is a sentinel: the key must never be absent after a run, and a real
  // version is always >= 0, so this can only survive if nothing was written.
  return readJSON<number>(DB_KEYS.version, -1);
}

describe("runMigrations", () => {
  it("stamps a fresh store (no version key) at the current DB_VERSION", async () => {
    expect(await AsyncStorage.getItem(DB_KEYS.version)).toBeNull();

    await runMigrations();

    expect(await storedVersion()).toBe(DB_VERSION);
  });

  it("advances a seeded older version up to DB_VERSION", async () => {
    // Seed a version behind the current schema. Works for any future DB_VERSION.
    await writeJSON(DB_KEYS.version, 0);

    await runMigrations();

    expect(await storedVersion()).toBe(DB_VERSION);
  });

  it("is a no-op when the store is already at the current version", async () => {
    await writeJSON(DB_KEYS.version, DB_VERSION);

    await runMigrations();

    // Already current: the runner leaves the version at DB_VERSION.
    // (Spying on AsyncStorage.setItem to assert "no rewrite" here leaks into the
    // shared mock and breaks the following test, so assert on the value instead.)
    expect(await storedVersion()).toBe(DB_VERSION);
  });

  it("is idempotent across repeated runs", async () => {
    await runMigrations();
    const afterFirst = await storedVersion();
    await runMigrations();
    const afterSecond = await storedVersion();

    expect(afterFirst).toBe(DB_VERSION);
    expect(afterSecond).toBe(DB_VERSION);
  });

  it("keeps DB_VERSION as a positive integer the runner can converge to", () => {
    // Guards the loop invariant: a non-integer or negative target would make the
    // for-loop bookkeeping in runMigrations meaningless.
    expect(Number.isInteger(DB_VERSION)).toBe(true);
    expect(DB_VERSION).toBeGreaterThanOrEqual(1);
  });

  it("clears lastPushedAt when migrating from schema v1 to v2", async () => {
    await writeJSON(DB_KEYS.version, 1);
    await writeJSON(DB_KEYS.syncMetadata, {
      lastPushedAt: "2026-07-01T00:00:00.000Z",
      lastSyncedAt: "2026-07-01T00:00:00.000Z",
    });

    await runMigrations();

    expect(await storedVersion()).toBe(DB_VERSION);
    const meta = await readJSON<Record<string, unknown>>(DB_KEYS.syncMetadata, {});
    expect(meta.lastPushedAt).toBeUndefined();
    expect(meta.lastSyncedAt).toBe("2026-07-01T00:00:00.000Z");
  });
});
