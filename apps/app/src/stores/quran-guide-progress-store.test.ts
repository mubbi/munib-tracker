import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

import {
  quranGuideProgressStore,
  useEnsureQuranGuideProgressLoaded,
  useQuranGuideApplyChallengeCompleted,
  useQuranGuideCompletedCount,
  useQuranGuideProgressActions,
  useQuranGuideProgressReady,
  useQuranGuideTopicCompleted,
} from "./quran-guide-progress-store";

// load() pulls QURAN_GUIDE_TOPICS via dynamic import(), which Jest cannot evaluate
// without --experimental-vm-modules; hook tests swap in a stub loader.
const originalLoad = quranGuideProgressStore.getState().load;

beforeEach(async () => {
  await AsyncStorage.clear();
  quranGuideProgressStore.setState({
    completedTopicIds: [],
    completedApplyChallengeIds: [],
    isReady: false,
    load: originalLoad,
  });
});

describe("quranGuideProgressStore", () => {
  it("toggles topics and apply-challenges independently and persists both", async () => {
    const store = quranGuideProgressStore.getState();

    await store.toggleTopic("intro");
    await store.toggleApplyChallenge("c1");
    await store.toggleApplyChallenge("c2");

    expect(store.isTopicCompleted("intro")).toBe(true);
    expect(store.isApplyChallengeCompleted("c1")).toBe(true);
    expect(await readJSON(DB_KEYS.quranGuideProgress, null)).toEqual({
      completedTopicIds: ["intro"],
      completedApplyChallengeIds: ["c1", "c2"],
    });

    await store.toggleApplyChallenge("c1");
    await store.toggleTopic("intro");
    expect(store.isApplyChallengeCompleted("c1")).toBe(false);
    expect(store.isTopicCompleted("intro")).toBe(false);
    expect(await readJSON(DB_KEYS.quranGuideProgress, null)).toEqual({
      completedTopicIds: [],
      completedApplyChallengeIds: ["c2"],
    });
  });
});

describe("quran guide progress hooks", () => {
  it("lazily loads and exposes topic/challenge completion", async () => {
    const load = jest.fn(async () => {
      quranGuideProgressStore.setState({
        completedTopicIds: ["intro"],
        completedApplyChallengeIds: ["c1"],
        isReady: true,
      });
    });
    quranGuideProgressStore.setState({ load });

    const { result } = await renderHook(() => {
      useEnsureQuranGuideProgressLoaded();
      return {
        ready: useQuranGuideProgressReady(),
        topic: useQuranGuideTopicCompleted("intro"),
        challenge: useQuranGuideApplyChallengeCompleted("c1"),
        count: useQuranGuideCompletedCount(),
        actions: useQuranGuideProgressActions(),
      };
    });

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(load).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({ topic: true, challenge: true, count: 1 });

    await act(async () => {
      await result.current.actions.toggleApplyChallenge("c1");
      await result.current.actions.toggleTopic("next");
    });
    expect(result.current.challenge).toBe(false);
    expect(result.current.count).toBe(2);
    expect(result.current.actions.load).toBe(load);
  });
});
