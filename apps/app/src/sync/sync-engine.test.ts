import type {
  SyncPullResponseDto,
  SyncPushResponseDto,
  SyncRecordDto,
} from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { syncPull, syncPush } from "@/api/endpoints";
import type { StoredSession } from "@/auth/session-store";
import { PrayerRepository, PreferencesRepository, QazaRepository, TombstoneRepository } from "@/db";
import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

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
