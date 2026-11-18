import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { toursStore, useEnsureToursLoaded, useHasSeenTour, useToursActions } from "./tours-store";

beforeEach(async () => {
  await AsyncStorage.clear();
  toursStore.setState({ seen: [], isReady: false });
});

describe("toursStore", () => {
  it("markSeen appends and persists a tour id", async () => {
    await toursStore.getState().markSeen("home");
    expect(await readJSON(DB_KEYS.toursSeen, [])).toEqual(["home"]);
  });

  it("markSeen ignores an id that is already seen", async () => {
    await toursStore.getState().markSeen("home");
    const before = toursStore.getState();
    await toursStore.getState().markSeen("home");
    expect(toursStore.getState()).toBe(before);
  });

  it("reset forgets every tour", async () => {
    await toursStore.getState().markSeen("home");
    await toursStore.getState().reset();
    expect(await readJSON(DB_KEYS.toursSeen, null)).toEqual([]);
  });
});

describe("hooks", () => {
  function setup(id: string) {
    return renderHook(() => {
      useEnsureToursLoaded();
      return { seen: useHasSeenTour(id), actions: useToursActions() };
    });
  }

  it("load seen tours on mount", async () => {
    await writeJSON(DB_KEYS.toursSeen, ["qibla"]);
    const { result } = await setup("qibla");
    await waitFor(() => expect(result.current.seen).toBe(true));
  });

  it("route actions to the store", async () => {
    const { result } = await setup("qibla");
    await act(async () => {
      await result.current.actions.load();
      await result.current.actions.markSeen("qibla");
    });
    expect(result.current.seen).toBe(true);
    await act(async () => {
      await result.current.actions.reset();
    });
    expect(result.current.seen).toBe(false);
  });

  it("skip loading when ready", async () => {
    toursStore.setState({ isReady: true });
    await writeJSON(DB_KEYS.toursSeen, ["qibla"]);
    const { result } = await setup("qibla");
    expect(result.current.seen).toBe(false);
  });
});
