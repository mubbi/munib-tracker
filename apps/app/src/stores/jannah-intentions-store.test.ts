import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import {
  jannahIntentionsStore,
  useEnsureJannahIntentionsLoaded,
  useJannahIntention,
  useJannahIntentionActions,
  useJannahIntentionsReady,
} from "./jannah-intentions-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  jannahIntentionsStore.setState({ byDate: {}, isReady: false });
});

describe("jannahIntentionsStore", () => {
  it("loads persisted flags and marks the store ready", async () => {
    const today = getLocalDateString();
    await writeJSON(DB_KEYS.jannahIntentions, { [today]: { charity: true } });

    await jannahIntentionsStore.getState().load();

    const state = jannahIntentionsStore.getState();
    expect(state.isReady).toBe(true);
    expect(state.isSet("charity")).toBe(true);
    expect(state.isSet("tawbah")).toBe(false);
  });

  it("toggles today's flag and persists it, preserving other days", async () => {
    const today = getLocalDateString();
    await writeJSON(DB_KEYS.jannahIntentions, { "2020-01-01": { tawbah: true } });
    await jannahIntentionsStore.getState().load();

    await jannahIntentionsStore.getState().toggle("character");
    expect(jannahIntentionsStore.getState().isSet("character")).toBe(true);
    expect(await readJSON(DB_KEYS.jannahIntentions, {})).toEqual({
      "2020-01-01": { tawbah: true },
      [today]: { character: true },
    });

    await jannahIntentionsStore.getState().toggle("character");
    expect(jannahIntentionsStore.getState().isSet("character")).toBe(false);
  });
});

describe("jannah intention hooks", () => {
  it("loads on render and reflects toggles", async () => {
    const { result } = await renderHook(() => {
      useEnsureJannahIntentionsLoaded();
      return {
        ready: useJannahIntentionsReady(),
        tawbah: useJannahIntention("tawbah"),
        actions: useJannahIntentionActions(),
      };
    });

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.tawbah).toBe(false);

    await act(async () => {
      await result.current.actions.toggle("tawbah");
    });
    expect(result.current.tawbah).toBe(true);
  });
});
