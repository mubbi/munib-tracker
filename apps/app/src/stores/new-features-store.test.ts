import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { NewFeaturesSeenMap } from "@/lib/new-features";

import {
  newFeaturesStore,
  useEnsureNewFeaturesLoaded,
  useNewFeatureIds,
} from "./new-features-store";
import { preferencesStore } from "./preferences-store";

const originalPrefs = preferencesStore.getState();
const RECENT = new Date().toISOString();
const STALE = "2000-01-01T00:00:00.000Z";

function setupPrefs({ ready, order }: { ready: boolean; order?: string[] }) {
  const update = jest.fn(async () => {});
  preferencesStore.setState({
    isReady: ready,
    prefs: { ...originalPrefs.prefs, quickActionOrder: order },
    update,
  });
  return update;
}

beforeEach(async () => {
  await AsyncStorage.clear();
  newFeaturesStore.setState({ seen: {}, isReady: false });
});

afterEach(() => {
  preferencesStore.setState({
    isReady: originalPrefs.isReady,
    prefs: originalPrefs.prefs,
    update: originalPrefs.update,
  });
});

const storedSeen = () => readJSON<NewFeaturesSeenMap>(DB_KEYS.newFeaturesSeen, {});

describe("load", () => {
  it("stamps first-seen times and persists them before preferences are ready", async () => {
    const update = setupPrefs({ ready: false });
    await newFeaturesStore.getState().load();
    expect((await storedSeen()).quranPractice).toEqual({ firstSeenAt: expect.any(String) });
    expect(newFeaturesStore.getState().isReady).toBe(true);
    expect(update).not.toHaveBeenCalled();
  });

  it("adds a new tile after its anchor in a customised home grid", async () => {
    const update = setupPrefs({ ready: true, order: ["zikr", "quran", "dua"] });
    await newFeaturesStore.getState().load();
    expect(update).toHaveBeenCalledWith({
      quickActionOrder: ["zikr", "quran", "quranPractice", "dua"],
    });
    expect((await storedSeen()).quranPractice?.homeIntroduced).toBe(true);
  });

  it("only marks the feature introduced for the default home grid", async () => {
    const update = setupPrefs({ ready: true });
    await newFeaturesStore.getState().load();
    expect(update).not.toHaveBeenCalled();
    expect((await storedSeen()).quranPractice?.homeIntroduced).toBe(true);
  });

  it("does not rewrite storage when nothing changed", async () => {
    setupPrefs({ ready: true });
    await writeJSON(DB_KEYS.newFeaturesSeen, {
      quranPractice: { firstSeenAt: STALE, homeIntroduced: true },
    });
    const setItem = AsyncStorage.setItem as jest.Mock;
    setItem.mockClear();
    await newFeaturesStore.getState().load();
    expect(setItem).not.toHaveBeenCalled();
  });

  it("shares one in-flight load between callers", async () => {
    setupPrefs({ ready: false });
    const first = newFeaturesStore.getState().load();
    expect(newFeaturesStore.getState().load()).toBe(first);
    await first;
  });
});

describe("hooks", () => {
  function setup(prefsReady: boolean) {
    return renderHook(() => {
      useEnsureNewFeaturesLoaded(prefsReady);
      return useNewFeatureIds();
    });
  }

  it("wait for preferences before loading", async () => {
    const { result } = await setup(false);
    expect(newFeaturesStore.getState().isReady).toBe(false);
    expect(result.current.size).toBe(0);
  });

  it("badge a feature inside its window", async () => {
    setupPrefs({ ready: true });
    await writeJSON(DB_KEYS.newFeaturesSeen, {
      quranPractice: { firstSeenAt: RECENT, homeIntroduced: true },
    });
    const { result } = await setup(true);
    await waitFor(() => expect(result.current.has("quranPractice")).toBe(true));
  });

  it("drop the badge once the window has passed", async () => {
    newFeaturesStore.setState({
      isReady: true,
      seen: { quranPractice: { firstSeenAt: STALE, homeIntroduced: true } },
    });
    const { result } = await setup(true);
    expect(result.current.size).toBe(0);
  });

  it("re-run the home pass for a ready store that has not introduced the tile", async () => {
    setupPrefs({ ready: true });
    newFeaturesStore.setState({ isReady: true, seen: { quranPractice: { firstSeenAt: RECENT } } });
    await setup(true);
    await waitFor(async () =>
      expect((await storedSeen()).quranPractice?.homeIntroduced).toBe(true),
    );
  });
});
