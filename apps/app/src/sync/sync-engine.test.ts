import type {
  SyncPullResponseDto,
  SyncPushResponseDto,
  SyncRecordDto,
} from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncPull, syncPush } from "@/api/endpoints";
import type { StoredSession } from "@/auth/session-store";
import { SessionStore } from "@/auth/session-store";
import {
  HadithRepository,
  PrayerRepository,
  PreferencesRepository,
  QazaRepository,
  QuranRepository,
  TombstoneRepository,
  ZikrRepository,
} from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { isAppReloadInProgress } from "@/lib/cloud-api-reload-gate";
import {
  clearPreferencesDirty,
  hasPendingPreferenceChanges,
  markPreferencesDirty,
} from "@/lib/sync/preferences-cloud-sync";
import { wipeLocalDeviceData } from "@/lib/wipe-local-data";
import { customTasbeehStore, readCustomTasbeehBlob } from "@/stores/custom-tasbeeh-store";
import { applyRemoteDuaFavorites, readDuaFavoritesBlob } from "@/stores/dua-favorites-store";
import { readDuroodFavoritesBlob } from "@/stores/durood-favorites-store";
import { readNameFavoritesBlob } from "@/stores/name-favorites-store";
import { quranStore } from "@/stores/quran-store";

import { __setBlobSyncModuleForTests, readSyncMetadata, runSync } from "./sync-engine";

// jest.mock is hoisted above the imports by babel-jest, so the endpoints module
// is mocked before sync-engine (and this file) import it.
jest.mock("@/api/endpoints", () => ({
  syncPull: jest.fn(),
  syncPush: jest.fn(),
}));

jest.mock("@/lib/cloud-api-reload-gate", () => ({
  isAppReloadInProgress: jest.fn(() => false),
}));

jest.mock("@/lib/wipe-local-data", () => ({
  wipeLocalDeviceData: jest.fn(async () => undefined),
}));

// Jest can't `import()` without --experimental-vm-modules; inject blob-sync after
// mocks so suite-level mocks still apply (do not require sync-engine from jest.setup).
__setBlobSyncModuleForTests(require("./blob-sync") as typeof import("./blob-sync"));

const mockPush = syncPush as jest.MockedFunction<typeof syncPush>;
const mockPull = syncPull as jest.MockedFunction<typeof syncPull>;
const mockReloadInProgress = isAppReloadInProgress as jest.MockedFunction<
  typeof isAppReloadInProgress
>;
const mockWipeLocalDeviceData = wipeLocalDeviceData as jest.MockedFunction<
  typeof wipeLocalDeviceData
>;

const user: StoredSession = {
  accessToken: "access",
  refreshToken: "refresh",
  accountType: "user",
  userId: "u1",
};

function pushResult(over: Partial<SyncPushResponseDto> = {}): SyncPushResponseDto {
  return { accepted: 0, conflicts: [], ...over };
}
function pullResult(over: Partial<SyncPullResponseDto> = {}): SyncPullResponseDto {
  return { changes: [], serverTime: "2026-07-04T00:00:00.000Z", ...over };
}

beforeEach(async () => {
  await AsyncStorage.clear();
  mockReloadInProgress.mockReturnValue(false);
  clearPreferencesDirty();
  mockPush.mockReset();
  mockPull.mockReset();
  mockWipeLocalDeviceData.mockClear();
  mockPush.mockResolvedValue(pushResult());
  mockPull.mockResolvedValue(pullResult());
});

describe("runSync", () => {
  it("never syncs a guest account", async () => {
    const res = await runSync({ ...user, accountType: "guest" });
    expect(res).toEqual({ status: "skipped", reason: "guest" });
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockPull).not.toHaveBeenCalled();
  });

  it("skips sync while a native reload is in progress", async () => {
    mockReloadInProgress.mockReturnValue(true);
    const res = await runSync(user);
    expect(res).toEqual({ status: "skipped", reason: "reload" });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("pushes local records and stores the server time as the next pull cursor", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "fajr",
      date: "2026-07-03",
      status: "completed",
      updatedAt: "2026-07-03T05:00:00.000Z",
      source: "manual",
    });
    mockPull.mockResolvedValue(pullResult({ serverTime: "2026-07-04T10:00:00.000Z" }));

    const res = await runSync(user);

    expect(res.status).toBe("ok");
    const pushed = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    expect(pushed.some((r) => r.entity === "prayer_logs")).toBe(true);
    const meta = await readJSON<{ lastSyncedAt?: string }>(DB_KEYS.syncMetadata, {});
    expect(meta.lastSyncedAt).toBe("2026-07-04T10:00:00.000Z");
  });

  it("skips the push request when no local records changed", async () => {
    await writeJSON(DB_KEYS.syncMetadata, {
      privacyCleanup: 1,
      lastPushedAt: "2999-01-01T00:00:00.000Z",
      lastSyncedAt: "2026-07-04T00:00:00.000Z",
    });

    const result = await runSync(user);

    expect(result.status).toBe("ok");
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockPull).toHaveBeenCalledTimes(1);
  });

  it("applies a pulled prayer log into the local store", async () => {
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "prayer_logs",
            id: "dhuhr::2026-07-03",
            data: {
              id: "x",
              prayerId: "dhuhr",
              date: "2026-07-03",
              status: "completed",
              updatedAt: "2026-07-03T13:00:00.000Z",
              source: "sync",
            },
            updatedAt: "2026-07-03T13:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    const log = await PrayerRepository.getLog("dhuhr", "2026-07-03");
    expect(log?.status).toBe("completed");
  });

  it("keeps a newer local log when the pulled copy is older (last-write-wins)", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "fajr",
      date: "2026-07-03",
      status: "completed",
      updatedAt: "2026-07-03T10:00:00.000Z",
      source: "manual",
    });
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "prayer_logs",
            id: "fajr::2026-07-03",
            data: {
              id: "old",
              prayerId: "fajr",
              date: "2026-07-03",
              status: "missed",
              updatedAt: "2026-07-03T05:00:00.000Z",
              source: "sync",
            },
            updatedAt: "2026-07-03T05:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    const log = await PrayerRepository.getLog("fajr", "2026-07-03");
    expect(log?.status).toBe("completed");
  });

  it("removes a local log when a deletion is pulled", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "asr",
      date: "2026-07-03",
      status: "completed",
      updatedAt: "2026-07-03T10:00:00.000Z",
      source: "manual",
    });
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "prayer_logs",
            id: "asr::2026-07-03",
            data: { prayerId: "asr", date: "2026-07-03" },
            updatedAt: "2026-07-03T11:00:00.000Z",
            deletedAt: "2026-07-03T11:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    expect(await PrayerRepository.getLog("asr", "2026-07-03")).toBeUndefined();
  });

  it("wipes stale local data when a server reset marker is pulled", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "maghrib",
      date: "2026-07-03",
      status: "completed",
      updatedAt: "2026-07-03T19:00:00.000Z",
      source: "manual",
    });
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "data_reset",
            id: "data_reset",
            data: { resetAt: "2026-07-04T00:00:00.000Z" },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    expect(mockWipeLocalDeviceData).toHaveBeenCalledTimes(1);
  });

  it("applies conflict records returned by push", async () => {
    // Local must emit a record so push runs and can return conflicts.
    await QazaRepository.setCounter("fajr", 1, 0);
    const newer = new Date(Date.now() + 60_000).toISOString();
    mockPush.mockResolvedValue(
      pushResult({
        conflicts: [
          {
            entity: "qaza_entries",
            id: "fajr",
            data: { prayerId: "fajr", remaining: 7, completed: 2, updatedAt: newer },
            updatedAt: newer,
          },
        ],
      }),
    );

    await runSync(user);

    const counter = await QazaRepository.getCounter("fajr");
    expect(counter.remaining).toBe(7);
    expect(counter.completed).toBe(2);
  });

  it("applies pulled favorites and preferences", async () => {
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "favorites",
            id: "favorites",
            data: { ids: ["z9"], order: ["z9"] },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
          {
            entity: "preferences",
            id: "preferences",
            data: { locale: "ur" },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    const prefs = await PreferencesRepository.get();
    expect(prefs.favoriteZikrIds).toEqual(["z9"]);
    expect(prefs.locale).toBe("ur");
  });

  it("does not overwrite a pending local locale from a pulled preferences record", async () => {
    await PreferencesRepository.update({ locale: "en" });
    markPreferencesDirty();

    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "preferences",
            id: "preferences",
            data: { locale: "ur" },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    const prefs = await PreferencesRepository.get();
    expect(prefs.locale).toBe("en");
    expect(hasPendingPreferenceChanges()).toBe(false);
  });

  it("omits pristine typed defaults from the first push", async () => {
    await runSync(user);
    // Empty guest defaults must not push — avoids LWW-clobbering cloud qaza/prefs.
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("pushes touched favorites, bookmarks, and tasbeeh blobs", async () => {
    await writeJSON(DB_KEYS.duaFavorites, ["d1"]);
    await writeJSON(DB_KEYS.duaFavoritesUpdatedAt, "2026-07-03T12:00:00.000Z");
    await writeJSON(DB_KEYS.duroodFavorites, ["r1"]);
    await writeJSON(DB_KEYS.duroodFavoritesUpdatedAt, "2026-07-03T12:00:00.000Z");
    await writeJSON(DB_KEYS.nameFavorites, ["n1"]);
    await writeJSON(DB_KEYS.nameFavoritesUpdatedAt, "2026-07-03T12:00:00.000Z");
    await QuranRepository.toggleBookmark(2, 255);
    await HadithRepository.toggleBookmark({
      id: "bukhari:1",
      collection: "bukhari",
      number: 1,
    });
    await writeJSON(DB_KEYS.customTasbeeh, {
      t1: {
        id: "t1",
        title: "SubhanAllah",
        description: "",
        target: 33,
        count: 0,
        createdAt: "2026-07-03T00:00:00.000Z",
        updatedAt: "2026-07-03T00:00:00.000Z",
      },
    });
    await writeJSON(DB_KEYS.customTasbeehUpdatedAt, "2026-07-03T12:00:00.000Z");

    await runSync(user);
    const pushed = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    expect(pushed).toBeDefined();
    const entities = new Set(pushed.map((r) => r.entity));
    expect(entities).toContain("dua_favorites");
    expect(entities).toContain("durood_favorites");
    expect(entities).toContain("name_favorites");
    expect(entities).toContain("quran_bookmarks");
    expect(entities).toContain("hadith_bookmarks");
    expect(entities).toContain("custom_tasbeeh");
  });

  it("round-trips pulled dua favorites, bookmarks, last-read and tasbeeh", async () => {
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "dua_favorites",
            id: "dua_favorites",
            data: { order: ["d1", "d2"] },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
          {
            entity: "quran_bookmarks",
            id: "quran_bookmarks",
            data: {
              bookmarks: [
                { id: "qbm1", surah: 2, ayah: 255, createdAt: "2026-07-03T00:00:00.000Z" },
              ],
            },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
          {
            entity: "quran_last_read",
            id: "quran_last_read",
            data: { surah: 18, ayah: 10, updatedAt: "2026-07-04T00:00:00.000Z" },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
          {
            entity: "hadith_bookmarks",
            id: "hadith_bookmarks",
            data: {
              bookmarks: [
                {
                  id: "hbm1",
                  hadithId: "bukhari:1",
                  collection: "bukhari",
                  number: "1",
                  createdAt: "2026-07-03T00:00:00.000Z",
                },
              ],
            },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
          {
            entity: "custom_tasbeeh",
            id: "custom_tasbeeh",
            data: {
              items: [
                {
                  id: "t1",
                  title: "Test",
                  description: "",
                  target: 33,
                  count: 5,
                  createdAt: "2026-07-03T00:00:00.000Z",
                  updatedAt: "2026-07-03T00:00:00.000Z",
                },
              ],
            },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    expect((await readDuaFavoritesBlob()).order).toEqual(["d1", "d2"]);
    expect(await QuranRepository.getBookmarks()).toHaveLength(1);
    expect((await QuranRepository.getLastRead())?.surah).toBe(18);
    expect(await HadithRepository.getBookmarks()).toHaveLength(1);
    expect((await readCustomTasbeehBlob()).items).toHaveLength(1);
  });

  it("union-merges older remote dua favorites into newer local order", async () => {
    await applyRemoteDuaFavorites(["local"], "2026-07-04T12:00:00.000Z");
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "dua_favorites",
            id: "dua_favorites",
            data: { order: ["old"] },
            updatedAt: "2026-07-04T06:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    expect((await readDuaFavoritesBlob()).order).toEqual(["local", "old"]);
    expect((await readDuaFavoritesBlob()).updatedAt).toBe("2026-07-04T12:00:00.000Z");
  });

  it("pushes newly-synced blob entities (fasting, learning progress, qaza schedule)", async () => {
    await writeJSON(DB_KEYS.fasting, { "2026-03-01": "fasted" });
    await writeJSON(DB_KEYS.salahGuideProgress, ["intro"]);
    await writeJSON(DB_KEYS.qazaSchedule, { targets: { fajr: 3 } });

    await runSync(user);

    const pushed = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    const entities = new Set(pushed.map((r) => r.entity));
    expect(entities).toContain("fasting");
    expect(entities).toContain("salah_guide_progress");
    expect(entities).toContain("qaza_schedule");
    // An untouched blob entity must not be pushed (can't clobber another device).
    expect(entities).not.toContain("hifz");
  });

  it("round-trips a pulled blob entity into local storage", async () => {
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "fasting",
            id: "fasting",
            data: { value: { "2026-03-10": "exempt" } },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
          {
            entity: "learn_dua_progress",
            id: "learn_dua_progress",
            data: { value: ["morning"] },
            updatedAt: "2026-07-04T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    expect(await readJSON(DB_KEYS.fasting, null)).toEqual({ "2026-03-10": "exempt" });
    expect(await readJSON(DB_KEYS.learnDuaProgress, null)).toEqual(["morning"]);
  });

  it("union-merges fasting days when local is newer than a remote sibling key", async () => {
    // Establish local fasting content stamped at a late time via a first sync.
    await writeJSON(DB_KEYS.fasting, { local: "fasted" });
    await runSync(user);
    mockPush.mockResolvedValue(pushResult());
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "fasting",
            id: "fasting",
            data: { value: { old: "missed" } },
            updatedAt: "2000-01-01T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    expect(await readJSON(DB_KEYS.fasting, null)).toEqual({
      old: "missed",
      local: "fasted",
    });
  });

  it("emits then clears local deletion tombstones after a successful push", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "maghrib",
      date: "2026-07-03",
      status: "completed",
      updatedAt: "2026-07-03T10:00:00.000Z",
      source: "manual",
    });
    await PrayerRepository.remove("maghrib", "2026-07-03"); // records a tombstone

    await runSync(user);

    const pushed = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    expect(pushed.some((r) => r.deletedAt && r.id === "maghrib::2026-07-03")).toBe(true);
    expect(await TombstoneRepository.getAll()).toHaveLength(0);
  });

  it("keeps local deletion tombstones when pull fails after a successful push", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "isha",
      date: "2026-07-03",
      status: "completed",
      updatedAt: "2026-07-03T10:00:00.000Z",
      source: "manual",
    });
    await PrayerRepository.remove("isha", "2026-07-03");

    mockPull.mockRejectedValueOnce(new Error("network down"));

    await expect(runSync(user)).rejects.toThrow("network down");

    expect(mockPush).toHaveBeenCalled();
    expect(await TombstoneRepository.getAll()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ entity: "prayer_logs", id: "isha::2026-07-03" }),
      ]),
    );
  });
});

describe("runSync applying pulled records", () => {
  const T = "2026-07-04T00:00:00.000Z";
  const record = (
    entity: string,
    data: Record<string, unknown>,
    over: Partial<SyncRecordDto> = {},
  ) => ({ entity, id: entity, data, updatedAt: T, ...over }) as SyncRecordDto;

  async function pull(...changes: SyncRecordDto[]) {
    mockPull.mockResolvedValue(pullResult({ changes }));
    return runSync(user);
  }

  it("applies zikr progress and ignores a zikr deletion", async () => {
    await pull(
      record("zikr_progress", {
        id: "zp",
        zikrId: "z1",
        date: "2026-07-03",
        count: 4,
        target: 10,
        completed: false,
        updatedAt: T,
      }),
      record("zikr_progress", { zikrId: "z2", date: "2026-07-03" }, { deletedAt: T }),
    );
    expect((await ZikrRepository.getProgress("z1", "2026-07-03"))?.count).toBe(4);
    expect(await ZikrRepository.getAll()).toHaveLength(1);
  });

  it("applies qaza counters and the roza counter, skipping unknown ids", async () => {
    await pull(
      record("qaza_entries", { remaining: 3, completed: 1 }, { id: "asr" }),
      record("qaza_entries", { remaining: 2, estimatedMissed: 30 }, { id: "roza" }),
      record("qaza_entries", {}, { id: "roza-legacy" }),
      record("qaza_entries", {}, { id: "witr" }),
    );
    expect(await QazaRepository.getCounter("asr")).toMatchObject({ remaining: 3, completed: 1 });
    expect(await QazaRepository.getRoza()).toMatchObject({
      remaining: 2,
      completed: 0,
      estimatedMissed: 30,
    });
  });

  it("defaults missing qaza counts to zero", async () => {
    await pull(
      record("qaza_entries", {}, { id: "isha" }),
      record("qaza_entries", {}, { id: "roza" }),
    );
    expect(await QazaRepository.getCounter("isha")).toMatchObject({ remaining: 0, completed: 0 });
    expect((await QazaRepository.getRoza()).estimatedMissed).toBeUndefined();
  });

  it("applies durood and name favorites", async () => {
    await pull(
      record("durood_favorites", { order: ["d1"] }),
      record("name_favorites", { order: ["n1"] }),
    );
    expect((await readDuroodFavoritesBlob()).order).toEqual(["d1"]);
    expect((await readNameFavoritesBlob()).order).toEqual(["n1"]);
  });

  it("uses favorite ids as the order when no order is sent", async () => {
    await pull(record("favorites", { ids: ["z1", "z2"] }));
    expect(await PreferencesRepository.get()).toMatchObject({
      favoriteZikrIds: ["z1", "z2"],
      favoriteZikrOrder: ["z1", "z2"],
    });
  });

  it("treats malformed list payloads as empty", async () => {
    await pull(
      record("favorites", { ids: "nope" }),
      record("dua_favorites", { order: "nope" }),
      record("durood_favorites", {}),
      record("name_favorites", {}),
      record("quran_bookmarks", {}),
      record("hadith_bookmarks", {}),
      record("custom_tasbeeh", {}),
    );
    expect((await PreferencesRepository.get()).favoriteZikrIds).toEqual([]);
    expect(await QuranRepository.getBookmarks()).toEqual([]);
    expect(await HadithRepository.getBookmarks()).toEqual([]);
    expect((await readCustomTasbeehBlob()).items).toEqual([]);
  });

  it("ignores deletions of blob-like typed entities", async () => {
    const deleted = { deletedAt: T };
    await pull(
      record("dua_favorites", { order: ["x"] }, deleted),
      record("durood_favorites", { order: ["x"] }, deleted),
      record("name_favorites", { order: ["x"] }, deleted),
      record("quran_bookmarks", { bookmarks: [{ surah: 1, ayah: 1 }] }, deleted),
      record("quran_last_read", { surah: 1, ayah: 1 }, deleted),
      record("hadith_bookmarks", { bookmarks: [{ hadithId: "x" }] }, deleted),
      record("custom_tasbeeh", { items: [{ id: "x" }] }, deleted),
    );
    expect((await readDuaFavoritesBlob()).order).toEqual([]);
    expect(await QuranRepository.getLastRead()).toBeNull();
  });

  it("ignores a last-read position without numbers and stamps one without its own time", async () => {
    await pull(record("quran_last_read", { surah: "x", ayah: 1 }));
    expect(await QuranRepository.getLastRead()).toBeNull();

    await pull(record("quran_last_read", { surah: 2, ayah: 3 }));
    expect(await QuranRepository.getLastRead()).toEqual({ surah: 2, ayah: 3, updatedAt: T });
  });

  it("skips a prayer deletion that lacks its prayer and date", async () => {
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "fajr",
      date: "2026-07-03",
      status: "completed",
      updatedAt: T,
      source: "manual",
    });
    await pull(record("prayer_logs", {}, { deletedAt: T }));
    expect(await PrayerRepository.getAll()).toHaveLength(1);
  });
});

describe("runSync session and store refresh", () => {
  afterEach(() => jest.restoreAllMocks());

  it("pulls with the token persisted by a refresh during push", async () => {
    jest.spyOn(SessionStore, "get").mockResolvedValueOnce({ ...user, accessToken: "rotated" });
    await runSync(user);
    expect(mockPull).toHaveBeenCalledWith("rotated", undefined);
  });

  it("reloads the Qur'an and tasbeeh stores when they are live", async () => {
    const quranLoad = jest.fn(async () => {});
    const tasbeehLoad = jest.fn(async () => {});
    const quran = quranStore.getState();
    const tasbeeh = customTasbeehStore.getState();
    quranStore.setState({ isReady: true, load: quranLoad });
    customTasbeehStore.setState({ isReady: true, load: tasbeehLoad });

    await runSync(user);

    quranStore.setState(quran);
    customTasbeehStore.setState(tasbeeh);
    expect(quranLoad).toHaveBeenCalledTimes(1);
    expect(tasbeehLoad).toHaveBeenCalledTimes(1);
  });

  it("readSyncMetadata exposes the stored sync outcome", async () => {
    await runSync(user);
    await expect(readSyncMetadata()).resolves.toMatchObject({
      lastSyncedAt: "2026-07-04T00:00:00.000Z",
      lastPulled: 0,
      lastConflicts: 0,
    });
  });
});

describe("runSync — sync cursors are per account", () => {
  const OLD_CURSOR = "2026-07-01T00:00:00.000Z";

  async function seedCursorsFor(accountId: string | undefined) {
    await writeJSON(DB_KEYS.syncMetadata, {
      ...(accountId ? { accountId } : {}),
      privacyCleanup: 1,
      lastSyncedAt: OLD_CURSOR,
      lastPushedAt: "2999-01-01T00:00:00.000Z",
    });
    await writeJSON(DB_KEYS.blobSyncState, { fasting: { hash: "h", updatedAt: OLD_CURSOR } });
    await writeJSON(DB_KEYS.blobSyncHold, { quran_notes: { value: {}, updatedAt: OLD_CURSOR } });
    await writeJSON(DB_KEYS.vaultSyncState, {
      enabled: true,
      inbox: { vault_debts: { value: { ct: "x" }, updatedAt: OLD_CURSOR } },
    });
    await PrayerRepository.upsertLog({
      id: "p",
      prayerId: "fajr",
      date: "2026-06-01",
      status: "completed",
      updatedAt: "2026-06-01T05:00:00.000Z",
      source: "manual",
    });
  }

  it("does a full push + pull after signing in to a different account", async () => {
    await seedCursorsFor("someone-else");

    await runSync(user);

    // Full pull (no `since`) and the old row is offered to the new account.
    expect(mockPull).toHaveBeenCalledWith("access", undefined);
    const pushed = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    expect(pushed.some((r) => r.entity === "prayer_logs")).toBe(true);
    expect(await readJSON(DB_KEYS.blobSyncHold, null)).toBeNull();
    const fingerprints = await readJSON<Record<string, unknown>>(DB_KEYS.blobSyncState, {});
    expect(fingerprints.fasting).toBeUndefined();
    // The other account's parked vault ciphertext is dropped; the opt-in stays.
    await expect(readJSON(DB_KEYS.vaultSyncState, null)).resolves.toEqual({
      enabled: true,
      inbox: {},
    });
    await expect(readSyncMetadata()).resolves.toMatchObject({ accountId: user.userId });
  });

  it("keeps the cursors of the same account", async () => {
    await seedCursorsFor(user.userId);

    await runSync(user);

    expect(mockPull).toHaveBeenCalledWith("access", OLD_CURSOR);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("adopts cursors written before they were tagged with an account", async () => {
    await seedCursorsFor(undefined);

    await runSync(user);

    expect(mockPull).toHaveBeenCalledWith("access", OLD_CURSOR);
    await expect(readSyncMetadata()).resolves.toMatchObject({ accountId: user.userId });
  });
});

describe("runSync — D46 private fields never leave the device in plaintext", () => {
  const EXCUSED_LOG = {
    id: "p-ex",
    prayerId: "dhuhr" as const,
    date: "2026-06-02",
    status: "pending" as const,
    isExcused: true,
    excusedReason: "hayd" as const,
    updatedAt: "2026-06-02T05:00:00.000Z",
    source: "manual" as const,
  };

  async function seedPrivate() {
    await PrayerRepository.upsertLog(EXCUSED_LOG);
    await PreferencesRepository.update({
      activeExcusedReason: "hayd",
      updatedAt: "2026-06-02T06:00:00.000Z",
    });
    await writeJSON(DB_KEYS.khushuJournal, {
      "2026-06-01:fajr": { id: "k", date: "2026-06-01", note: "private reflection" },
    });
  }

  function pushedPayload(): string {
    return JSON.stringify(mockPush.mock.calls.flatMap((call) => call[1] as SyncRecordDto[]));
  }

  it("pushes no excused reason, no khushu journal and only rounded coordinates", async () => {
    await seedPrivate();
    await writeJSON(DB_KEYS.location, {
      latitude: 24.894812,
      longitude: 91.871534,
      label: "Sylhet",
      method: "Karachi",
      madhab: "hanafi",
      source: "gps",
      updatedAt: "2026-06-01T00:00:00.000Z",
    });

    await runSync(user);

    const payload = pushedPayload();
    expect(payload).not.toContain("hayd");
    expect(payload).not.toContain("activeExcusedReason");
    expect(payload).not.toContain("private reflection");
    expect(payload).not.toContain("24.894812");
    const records = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    expect(records.find((r) => r.entity === "prayer_logs")?.data).toMatchObject({
      isExcused: true,
    });
    expect(records.find((r) => r.entity === "location")?.data).toMatchObject({
      value: { latitude: 24.89, longitude: 91.87 },
    });
    // The device keeps its exact fix and its private data.
    await expect(readJSON(DB_KEYS.location, null)).resolves.toMatchObject({ latitude: 24.894812 });
    await expect(PreferencesRepository.get()).resolves.toMatchObject({
      activeExcusedReason: "hayd",
    });
  });

  it("re-pushes old records once without their plaintext and clears the retired khushu entity", async () => {
    await seedPrivate();
    // A device that already synced before D46: the watermark is past every record.
    await writeJSON(DB_KEYS.syncMetadata, {
      accountId: user.userId,
      lastPushedAt: "2026-07-01T00:00:00.000Z",
      lastSyncedAt: "2026-07-01T00:00:00.000Z",
    });

    await runSync(user);

    const first = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
    expect(first.map((r) => r.entity).sort()).toEqual(
      ["khushu_journal", "preferences", "prayer_logs"].sort(),
    );
    const retired = first.find((r) => r.entity === "khushu_journal");
    expect(retired).toMatchObject({ data: { value: null }, deletedAt: expect.any(String) });
    expect(first.find((r) => r.entity === "prayer_logs")?.updatedAt).toBe(EXCUSED_LOG.updatedAt);
    expect(JSON.stringify(first)).not.toContain("hayd");
    await expect(readSyncMetadata()).resolves.toMatchObject({ privacyCleanup: 1 });

    mockPush.mockClear();
    await runSync(user);
    // Only new edits go now (the active period carries today's logs forward).
    const second = (mockPush.mock.calls[0]?.[1] as SyncRecordDto[] | undefined) ?? [];
    expect(second.map((r) => r.entity)).not.toContain("khushu_journal");
    expect(second.map((r) => r.entity)).not.toContain("preferences");
    expect(second.some((r) => r.id === "dhuhr::2026-06-02")).toBe(false);
    expect(JSON.stringify(second)).not.toContain("hayd");
  });

  it("never applies a plaintext excused period pulled from the server", async () => {
    await PreferencesRepository.update({
      activeExcusedReason: null,
      updatedAt: "2026-06-01T00:00:00.000Z",
    });
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "preferences",
            id: "preferences",
            data: { activeExcusedReason: "hayd", locale: "ur" },
            updatedAt: "2026-06-05T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    const prefs = await PreferencesRepository.get();
    expect(prefs.locale).toBe("ur");
    expect(prefs.activeExcusedReason).toBeNull();
  });

  it("keeps this device's excused reason when the pulled log has none", async () => {
    await PrayerRepository.upsertLog(EXCUSED_LOG);
    mockPull.mockResolvedValue(
      pullResult({
        changes: [
          {
            entity: "prayer_logs",
            id: "dhuhr::2026-06-02",
            data: {
              ...EXCUSED_LOG,
              excusedReason: undefined,
              notes: "edited elsewhere",
              updatedAt: "2026-06-03T00:00:00.000Z",
            },
            updatedAt: "2026-06-03T00:00:00.000Z",
          },
        ],
      }),
    );

    await runSync(user);

    await expect(PrayerRepository.getLog("dhuhr", "2026-06-02")).resolves.toMatchObject({
      excusedReason: "hayd",
      notes: "edited elsewhere",
    });
  });
});
