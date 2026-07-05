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

/** Empty defaults for the blob entities so each test can focus on what it seeds. */
const blobFields = {
  duaFavorites: { order: [] },
  duroodFavorites: { order: [] },
  nameFavorites: { order: [] },
  quranBookmarks: [],
  quranLastRead: null,
  hadithBookmarks: [],
  customTasbeeh: { items: [] },
} as const;

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
    tombstones: [],
    ...blobFields,
  });

  it("emits one record per entity type", () => {
    const entities = new Set(records.map((r) => r.entity));
    expect(entities).toEqual(
      new Set([
        "prayer_logs",
        "zikr_progress",
        "qaza_entries",
        "preferences",
        "favorites",
        "dua_favorites",
        "durood_favorites",
        "name_favorites",
        "quran_bookmarks",
        "hadith_bookmarks",
        "custom_tasbeeh",
      ]),
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

  it("emits deletions as records with deletedAt so they propagate", () => {
    const withTombstone = buildSyncRecords({
      nowIso: "2026-07-03T12:00:00.000Z",
      prayerLogs: [],
      zikrProgress: [],
      qazaCounters: [],
      roza: { remaining: 0, completed: 0 },
      preferences: prefs,
      tombstones: [
        { entity: "prayer_logs", id: "fajr::2026-07-01", deletedAt: "2026-07-03T09:00:00.000Z" },
      ],
      ...blobFields,
    });
    const deletion = withTombstone.find((r) => r.deletedAt);
    expect(deletion?.entity).toBe("prayer_logs");
    expect(deletion?.id).toBe("fajr::2026-07-01");
    expect(deletion?.deletedAt).toBe("2026-07-03T09:00:00.000Z");
    // The payload carries enough to apply the delete on the other device.
    expect(deletion?.data).toMatchObject({ prayerId: "fajr", date: "2026-07-01" });
  });
});
