import type {
  SyncPullResponseDto,
  SyncPushResponseDto,
  SyncRecordDto,
} from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { syncPull, syncPush } from "@/api/endpoints";
import type { StoredSession } from "@/auth/session-store";
import {
  HadithRepository,
  PrayerRepository,
  PreferencesRepository,
  QazaRepository,
  QuranRepository,
  TombstoneRepository,
} from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { readCustomTasbeehBlob } from "@/stores/custom-tasbeeh-store";
import { applyRemoteDuaFavorites, readDuaFavoritesBlob } from "@/stores/dua-favorites-store";

import { runSync } from "./sync-engine";

// jest.mock is hoisted above the imports by babel-jest, so the endpoints module
// is mocked before sync-engine (and this file) import it.
jest.mock("@/api/endpoints", () => ({
  syncPull: jest.fn(),
  syncPush: jest.fn(),
}));

const mockPush = syncPush as jest.MockedFunction<typeof syncPush>;
const mockPull = syncPull as jest.MockedFunction<typeof syncPull>;

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
  mockPush.mockReset();
  mockPull.mockReset();
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

  it("applies conflict records returned by push", async () => {
    mockPush.mockResolvedValue(
      pushResult({
        conflicts: [
          {
            entity: "qaza_entries",
            id: "fajr",
            data: { prayerId: "fajr", remaining: 7, completed: 2 },
            updatedAt: "2026-07-04T00:00:00.000Z",
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

  it("pushes the expanded blob entities (dua favorites, bookmarks, tasbeeh)", async () => {
    await runSync(user);
    const pushed = mockPush.mock.calls[0]?.[1] as SyncRecordDto[];
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

  it("keeps newer local dua favorites when the pulled blob is older (last-write-wins)", async () => {
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

    expect((await readDuaFavoritesBlob()).order).toEqual(["local"]);
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
});
