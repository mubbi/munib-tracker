import { mergeUmrahSessions } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";
import { BLOB_ENTITIES } from "@/sync/blob-sync";
import { defined } from "@/test-support/assert";

import { umrahSessionActions as actions, umrahSessionStore } from "./umrah-session-store";

async function reload() {
  umrahSessionStore.setState({ sessions: {}, isReady: false });
  await umrahSessionStore.getState().load();
}

beforeEach(async () => {
  await AsyncStorage.clear();
  await act(async () => {
    umrahSessionStore.setState({ sessions: {}, isReady: false });
  });
});

describe("umrah-session-store", () => {
  it("starts a session and persists every step and round, resuming after a relaunch", async () => {
    const started = await actions.start();
    await actions.goTo("tawaf");
    await actions.countRound("tawaf");
    await actions.countRound("tawaf");
    await actions.undoRound("tawaf");
    await actions.countRound("tawaf");

    await reload();
    const session = defined(umrahSessionStore.getState().sessions[started.id], "session");
    expect(session.step).toBe("tawaf");
    expect(session.tawafLaps).toBe(2);
    expect(session.tawafLapTimes).toHaveLength(2);
    expect(session.log.map((entry) => entry.step)).toEqual(["prepare", "tawaf"]);
  });

  it("keeps a completed session as the current one, and a new start replaces it", async () => {
    const first = await actions.start();
    await actions.goTo("complete");
    const stored = await readJSON<Record<string, { completedAt?: string }>>(
      DB_KEYS.umrahSessions,
      {},
    );
    expect(stored[first.id]?.completedAt).toBeDefined();
    // "Back" from the congratulations view reopens the last step.
    await actions.back();
    expect(umrahSessionStore.getState().sessions[first.id]?.step).toBe("halq_taqsir");
  });

  it("ending Umrah mode tombstones the session so the removal syncs", async () => {
    const started = await actions.start();
    await actions.discard();
    await reload();
    expect(umrahSessionStore.getState().sessions[started.id]?.deleted).toBe(true);
    // No session is in progress any more — later actions are no-ops.
    await actions.countRound("sai");
    expect(umrahSessionStore.getState().sessions[started.id]?.saiLaps).toBe(0);
  });

  it("is a blob-synced entity with the per-session merge", () => {
    const entity = BLOB_ENTITIES.find((e) => e.entity === "umrah_sessions");
    expect(entity?.storageKey).toBe(DB_KEYS.umrahSessions);
    expect(entity?.merge).toBe(mergeUmrahSessions);
  });
});
