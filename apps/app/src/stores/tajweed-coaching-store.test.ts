import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

import { tajweedCoachingStore } from "./tajweed-coaching-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  await tajweedCoachingStore.getState().load();
});

describe("tajweedCoachingStore", () => {
  it("persists drill results under DB_KEYS.tajweedCoaching (counts only)", async () => {
    await tajweedCoachingStore.getState().recordDrill("qalqalah", "matched");
    await tajweedCoachingStore.getState().recordListen("madd");
    const stored = await readJSON<Record<string, unknown>>(DB_KEYS.tajweedCoaching, {});
    expect(stored).toMatchObject({
      schemaVersion: 1,
      heads: { qalqalah: { attempts: 1, matched: 1 } },
      listened: { madd: { count: 1 } },
    });
    // No audio, transcript or score ever lands in the blob.
    expect(JSON.stringify(stored)).not.toMatch(/audio|score|gop|transcript/i);
  });

  it("sets and clears the plan, and reloads sanitized data", async () => {
    const plan = {
      createdAt: "2026-11-24T00:00:00.000Z",
      items: [{ head: "ghunna" as const, words: [] }],
    };
    await tajweedCoachingStore.getState().setPlan(plan);
    await tajweedCoachingStore.getState().load();
    expect(tajweedCoachingStore.getState().data.plan).toEqual(plan);
    await tajweedCoachingStore.getState().setPlan(null);
    expect(tajweedCoachingStore.getState().data.plan).toBeUndefined();
  });
});
