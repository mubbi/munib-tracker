import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON } from "@/db/store";

import {
  lastDayProgressStore,
  useEnsureLastDayProgressLoaded,
  useLastDayCharacterChecked,
  useLastDayCompletedCount,
  useLastDayProgressActions,
  useLastDayProgressReady,
  useLastDayRepentanceChecked,
  useLastDayTopicCompleted,
} from "./last-day-progress-store";

// load() pulls LAST_DAY_TOPICS via dynamic import(), which Jest cannot evaluate
// without --experimental-vm-modules; hook tests swap in a stub loader.
const originalLoad = lastDayProgressStore.getState().load;
const TODAY = "2026-07-03";
const TOMORROW = "2026-07-04";

beforeEach(async () => {
  await AsyncStorage.clear();
  lastDayProgressStore.setState({
    completedTopicIds: [],
    repentanceDate: null,
    characterDate: null,
    isReady: false,
    load: originalLoad,
  });
});

describe("lastDayProgressStore", () => {
  it("toggles topics and persists them alongside the daily check-ins", async () => {
    const store = lastDayProgressStore.getState();
    await store.toggleRepentance(TODAY);
    await store.toggleTopic("signs-minor");
    await store.toggleTopic("signs-major");

    expect(lastDayProgressStore.getState().isTopicCompleted("signs-minor")).toBe(true);
    expect(await readJSON(DB_KEYS.lastDayProgress, null)).toEqual({
      completedTopicIds: ["signs-minor", "signs-major"],
      repentanceDate: TODAY,
      characterDate: null,
    });

    await store.toggleTopic("signs-minor");
    expect(lastDayProgressStore.getState().completedTopicIds).toEqual(["signs-major"]);
  });

  it("repentance and character check-ins are scoped to the given day", async () => {
    const store = lastDayProgressStore.getState();

    await store.toggleRepentance(TODAY);
    await store.toggleCharacter(TODAY);
    expect(store.isRepentanceChecked(TODAY)).toBe(true);
    expect(store.isCharacterChecked(TODAY)).toBe(true);
    expect(store.isRepentanceChecked(TOMORROW)).toBe(false);
    expect(await readJSON(DB_KEYS.lastDayProgress, null)).toEqual({
      completedTopicIds: [],
      repentanceDate: TODAY,
      characterDate: TODAY,
    });

    // Toggling on a new day re-checks for that day instead of clearing.
    await store.toggleRepentance(TOMORROW);
    expect(store.isRepentanceChecked(TOMORROW)).toBe(true);

    await store.toggleRepentance(TOMORROW);
    await store.toggleCharacter(TODAY);
    expect(await readJSON(DB_KEYS.lastDayProgress, null)).toEqual({
      completedTopicIds: [],
      repentanceDate: null,
      characterDate: null,
    });
  });
});

describe("last day progress hooks", () => {
  it("lazily loads and reflects topic + check-in changes", async () => {
    const load = jest.fn(async () => {
      lastDayProgressStore.setState({ completedTopicIds: ["signs-minor"], isReady: true });
    });
    lastDayProgressStore.setState({ load });

    const { result } = await renderHook(() => {
      useEnsureLastDayProgressLoaded();
      return {
        ready: useLastDayProgressReady(),
        topic: useLastDayTopicCompleted("signs-minor"),
        count: useLastDayCompletedCount(),
        repentance: useLastDayRepentanceChecked(TODAY),
        character: useLastDayCharacterChecked(TODAY),
        actions: useLastDayProgressActions(),
      };
    });

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(load).toHaveBeenCalledTimes(1);
    expect(result.current.topic).toBe(true);
    expect(result.current.count).toBe(1);
    expect(result.current.repentance).toBe(false);

    await act(async () => {
      await result.current.actions.toggleRepentance(TODAY);
      await result.current.actions.toggleCharacter(TODAY);
      await result.current.actions.toggleTopic("signs-minor");
    });
    expect(result.current.repentance).toBe(true);
    expect(result.current.character).toBe(true);
    expect(result.current.topic).toBe(false);
    expect(result.current.actions.load).toBe(load);
  });
});
