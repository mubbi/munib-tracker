import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { PrayerLog, UserPreferences } from "@munib-tracker/shared/types";

import { buildSyncRecords } from "./records";

const prefs: UserPreferences = {
  ...DEFAULT_USER_PREFERENCES,
  favoriteZikrIds: ["z1"],
  favoriteZikrOrder: ["z1"],
};

const log: PrayerLog = {
  id: "p1",
  prayerId: "fajr",
  date: "2026-07-03",
  status: "completed",
  updatedAt: "2026-07-03T05:00:00.000Z",
  source: "manual",
};

describe("buildSyncRecords", () => {
  const records = buildSyncRecords({
    nowIso: "2026-07-03T12:00:00.000Z",
    prayerLogs: [log],
    zikrProgress: [
      { id: "z", zikrId: "morning-1", date: "2026-07-03", count: 33, target: 33, completed: true },
    ],
    qazaCounters: [{ prayerId: "fajr", remaining: 4, completed: 1 }],
    roza: { remaining: 2, completed: 0 },
    preferences: prefs,
  });

  it("emits one record per entity type", () => {
    const entities = new Set(records.map((r) => r.entity));
    expect(entities).toEqual(
      new Set(["prayer_logs", "zikr_progress", "qaza_entries", "preferences", "favorites"]),
    );
  });

  it("uses the prayer log's own updatedAt", () => {
    const prayer = records.find((r) => r.entity === "prayer_logs");
    expect(prayer?.updatedAt).toBe("2026-07-03T05:00:00.000Z");
  });

  it("includes a roza record under qaza_entries", () => {
    const roza = records.find((r) => r.entity === "qaza_entries" && r.id === "roza");
    expect(roza?.data.remaining).toBe(2);
  });

  it("captures favorites order", () => {
    const fav = records.find((r) => r.entity === "favorites");
    expect(fav?.data.order).toEqual(["z1"]);
  });

  it("uses the record's own updatedAt when available", () => {
    const zikr = records.find((r) => r.entity === "zikr_progress");
    // The seeded zikr entry has no updatedAt, so it falls back to nowIso.
    expect(zikr?.updatedAt).toBe("2026-07-03T12:00:00.000Z");
  });
});
