import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Endpoints from "@/api/endpoints";
import { SessionStore } from "@/auth/session-store";
import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { pushPreferencesNow } from "@/lib/sync/push-preferences";

const prefs = {
  ...DEFAULT_USER_PREFERENCES,
  updatedAt: "2026-07-03T05:00:00.000Z",
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe("pushPreferencesNow", () => {
  it("does not advance lastPushedAt (avoids skipping older tracking deltas)", async () => {
    jest.spyOn(SessionStore, "get").mockResolvedValue({
      accessToken: "access",
      refreshToken: "refresh",
      accountType: "user",
      userId: "u1",
    });
    const pushSpy = jest.spyOn(Endpoints, "syncPush").mockResolvedValue({
      accepted: 1,
      conflicts: [],
      serverTime: "2026-07-04T00:00:00.000Z",
    });
    await writeJSON(DB_KEYS.syncMetadata, {
      lastPushedAt: "2026-07-01T00:00:00.000Z",
      lastSyncedAt: "2026-07-01T00:00:00.000Z",
    });

    const ok = await pushPreferencesNow(prefs);

    expect(ok).toBe(true);
    expect(pushSpy).toHaveBeenCalledTimes(1);
    const meta = await readJSON<{ lastPushedAt?: string; lastOutcomeAt?: string }>(
      DB_KEYS.syncMetadata,
      {},
    );
    expect(meta.lastPushedAt).toBe("2026-07-01T00:00:00.000Z");
    expect(meta.lastOutcomeAt).toBeDefined();
  });

  it("skips guests", async () => {
    jest.spyOn(SessionStore, "get").mockResolvedValue({
      accessToken: "access",
      refreshToken: "refresh",
      accountType: "guest",
      userId: "g1",
    });
    const pushSpy = jest.spyOn(Endpoints, "syncPush");

    expect(await pushPreferencesNow(prefs)).toBe(false);
    expect(pushSpy).not.toHaveBeenCalled();
  });
});
