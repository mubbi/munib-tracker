import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import {
  hijriToGregorian,
  resetHijriAdjustmentCacheForTests,
  setHijriAdjustment,
} from "@/lib/hijri";
import {
  importLegacyWhiteDays,
  legacyWhiteDayFasts,
  migrateLegacyWhiteDaysChecklist,
} from "@/lib/white-days-migration";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { whiteDaysCheckKey, whiteDaysChecklistStore } from "@/stores/white-days-checklist-store";

const dateOf = (y: number, m: number, d: number) => getLocalDateString(hijriToGregorian(y, m, d));
const TICK = "2026-07-27T18:00:00.000Z";

function row(id: string, monthKey: string, completedAt = TICK) {
  return { [whiteDaysCheckKey(id, monthKey)]: { id, monthKey, completedAt } };
}

beforeEach(async () => {
  await AsyncStorage.clear();
  setHijriAdjustment(null);
  resetHijriAdjustmentCacheForTests();
  voluntaryFastingStore.setState({ entries: {}, isReady: false });
  whiteDaysChecklistStore.setState({ done: {}, isReady: false });
});

describe("legacyWhiteDayFasts (pure)", () => {
  it("maps month ticks to dates, dropping malformed and blocked rows", () => {
    const rows = {
      ...row("day13", "1448-2"),
      ...row("day15", "1448-2"),
      ...row("day13", "1448-12"), // 13 Dhul-Hijjah — Tashriq, never a fast
      ...row("day14", "1448-9"), // Ramadan — its own log
      ...row("day99", "1448-2"),
      bad: { id: "day14", monthKey: "nope" },
      junk: null,
    };
    expect(legacyWhiteDayFasts(rows)).toEqual([
      { key: "day13::1448-2", date: dateOf(1448, 2, 13), completedAt: TICK },
      { key: "day15::1448-2", date: dateOf(1448, 2, 15), completedAt: TICK },
    ]);
    expect(legacyWhiteDayFasts(null)).toEqual([]);
  });

  it("falls back to now for an unreadable tick time", () => {
    const rows = { x: { id: "day14", monthKey: "1448-3", completedAt: "??" } };
    expect(legacyWhiteDayFasts(rows, undefined, "2027-01-01T00:00:00.000Z")).toEqual([
      { key: "x", date: dateOf(1448, 3, 14), completedAt: "2027-01-01T00:00:00.000Z" },
    ]);
  });

  it("skips consumed rows and prefers a row's stored Gregorian date", () => {
    const rows = {
      a: { id: "day13", monthKey: "1448-2", completedAt: TICK, migratedDate: "2026-08-01" },
      b: { id: "day14", monthKey: "1448-2", completedAt: TICK, date: "2026-08-03" },
    };
    expect(legacyWhiteDayFasts(rows)).toEqual([
      { key: "b", date: "2026-08-03", completedAt: TICK },
    ]);
  });
});

describe("importLegacyWhiteDays (pure)", () => {
  it("never overrides an existing entry or tombstone", () => {
    const map = {
      "2026-07-27": { status: "intended" as const, updatedAt: "2026-07-26T00:00:00.000Z" },
      "2026-07-28": { status: "fasted" as const, deleted: true, updatedAt: "2026-07-29T00:00:00Z" },
    };
    const { map: next, added } = importLegacyWhiteDays(map, [
      { key: "a", date: "2026-07-27", completedAt: TICK },
      { key: "b", date: "2026-07-28", completedAt: TICK },
      { key: "c", date: "2026-07-29", completedAt: TICK },
    ]);
    expect(added).toBe(1);
    expect(next["2026-07-27"]).toEqual(map["2026-07-27"]);
    expect(next["2026-07-28"]).toEqual(map["2026-07-28"]);
    expect(next["2026-07-29"]).toEqual({ status: "fasted", updatedAt: TICK });
  });
});

describe("migrateLegacyWhiteDaysChecklist", () => {
  it("folds the old checklist into the fasting log once (idempotent), keeping the old key", async () => {
    const legacy = { ...row("day13", "1448-2"), ...row("day14", "1448-2") };
    await writeJSON(DB_KEYS.whiteDaysChecklist, legacy);

    expect(await migrateLegacyWhiteDaysChecklist()).toBe(2);
    expect(await migrateLegacyWhiteDaysChecklist()).toBe(0);

    const map = await readJSON<Record<string, { status: string }>>(DB_KEYS.voluntaryFasting, {});
    expect(map[dateOf(1448, 2, 13)]?.status).toBe("fasted");
    expect(map[dateOf(1448, 2, 14)]?.status).toBe("fasted");
    expect(Object.keys(map)).toHaveLength(2);
    expect(await readJSON(DB_KEYS.whiteDaysChecklist, {})).toMatchObject(legacy);
  });

  it("marks rows consumed: a later Hijri offset change never mints phantom fasts", async () => {
    const legacy = {
      ...row("day13", "1448-2"),
      ...row("day14", "1448-2"),
      ...row("day15", "1448-2"),
    };
    await writeJSON(DB_KEYS.whiteDaysChecklist, legacy);
    expect(await migrateLegacyWhiteDaysChecklist()).toBe(3);
    const day15Before = dateOf(1448, 2, 15);
    const before = await readJSON<Record<string, unknown>>(DB_KEYS.voluntaryFasting, {});

    const stored = await readJSON<Record<string, { migratedDate?: string }>>(
      DB_KEYS.whiteDaysChecklist,
      {},
    );
    expect(stored[whiteDaysCheckKey("day13", "1448-2")]?.migratedDate).toBe(dateOf(1448, 2, 13));

    setHijriAdjustment({ offsetDays: 1, updatedAt: "2026-11-23T00:00:00.000Z" });
    resetHijriAdjustmentCacheForTests();
    expect(dateOf(1448, 2, 15)).not.toBe(day15Before); // the mapping really moved

    expect(await migrateLegacyWhiteDaysChecklist()).toBe(0);
    expect(await readJSON(DB_KEYS.voluntaryFasting, {})).toEqual(before);
  });

  it("an install migrated by the earlier every-load run is not re-mapped after an offset change", async () => {
    // Pre-marker state: rows without `migratedDate`, fasts already in the log.
    const legacy = {
      ...row("day13", "1448-2"),
      ...row("day14", "1448-2"),
      ...row("day15", "1448-2"),
    };
    await writeJSON(DB_KEYS.whiteDaysChecklist, legacy);
    const before = Object.fromEntries(
      [13, 14, 15].map((d) => [dateOf(1448, 2, d), { status: "fasted", updatedAt: TICK }]),
    );
    await writeJSON(DB_KEYS.voluntaryFasting, before);

    setHijriAdjustment({ offsetDays: 1, updatedAt: "2026-11-23T00:00:00.000Z" });
    resetHijriAdjustmentCacheForTests();

    expect(await migrateLegacyWhiteDaysChecklist()).toBe(0);
    expect(await readJSON(DB_KEYS.voluntaryFasting, {})).toEqual(before);
  });

  it("runs when the fasting store loads, so /fasting sees legacy White Days", async () => {
    await writeJSON(DB_KEYS.whiteDaysChecklist, row("day15", "1448-2"));
    await voluntaryFastingStore.getState().load();
    expect(voluntaryFastingStore.getState().entries[dateOf(1448, 2, 15)]?.status).toBe("fasted");
  });

  it("a cleared (tombstoned) day is not resurrected by a later run", async () => {
    await writeJSON(DB_KEYS.whiteDaysChecklist, row("day13", "1448-2"));
    await voluntaryFastingStore.getState().load();
    await voluntaryFastingStore.getState().writeEntry(dateOf(1448, 2, 13), null);
    await voluntaryFastingStore.getState().load();
    expect(voluntaryFastingStore.getState().entries[dateOf(1448, 2, 13)]?.deleted).toBe(true);
  });

  it("legacy rows arriving later (old device, sync) reload a ready fasting store", async () => {
    await voluntaryFastingStore.getState().load();
    await writeJSON(DB_KEYS.whiteDaysChecklist, row("day14", "1448-3"));
    await whiteDaysChecklistStore.getState().load();
    expect(voluntaryFastingStore.getState().entries[dateOf(1448, 3, 14)]?.status).toBe("fasted");
  });
});
