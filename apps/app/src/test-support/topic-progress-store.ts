import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { readJSON } from "@/db/store";
import type { Store } from "@/stores/create-store";

type TopicProgressState = {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
};

export type TopicProgressStoreSpec = {
  store: Store<TopicProgressState>;
  /** `DB_KEYS` entry the store persists to. */
  storageKey: string;
  /** Two real topic ids from the shared content corpus. */
  topicIds: readonly [string, string];
  useReady: () => boolean;
  useTopicCompleted: (topicId: string) => boolean;
  useCompletedCount: () => number;
  useActions: () => { toggleTopic: (id: string) => Promise<void>; load: () => Promise<void> };
  useEnsureLoaded: () => void;
};

/**
 * Shared contract for the "completed topic ids" Learn progress stores
 * (aqeedah, battles, prophets, …), which are deliberately identical.
 *
 * `load()` reads the topic corpus via dynamic `import()`, which Jest cannot
 * evaluate without `--experimental-vm-modules`, so the hook tests swap in a
 * stub loader and the original is restored before each test.
 */
export function describeTopicProgressStore(name: string, spec: TopicProgressStoreSpec): void {
  const { store, storageKey, topicIds } = spec;
  const [firstId, secondId] = topicIds;
  const originalLoad = store.getState().load;

  describe(name, () => {
    beforeEach(async () => {
      await AsyncStorage.clear();
      store.setState({ completedTopicIds: [], isReady: false, load: originalLoad });
    });

    it("toggling a topic marks it completed and persists the list", async () => {
      await store.getState().toggleTopic(firstId);
      await store.getState().toggleTopic(secondId);

      expect(store.getState().isTopicCompleted(firstId)).toBe(true);
      expect(await readJSON(storageKey, [])).toEqual([firstId, secondId]);
    });

    it("toggling a completed topic again removes it", async () => {
      await store.getState().toggleTopic(firstId);
      await store.getState().toggleTopic(firstId);

      expect(store.getState().isTopicCompleted(firstId)).toBe(false);
      expect(await readJSON(storageKey, null)).toEqual([]);
    });

    function setupHooks() {
      const load = jest.fn(async () => {
        store.setState({ completedTopicIds: [firstId], isReady: true });
      });
      store.setState({ load });
      return renderHook(() => {
        spec.useEnsureLoaded();
        return {
          ready: spec.useReady(),
          first: spec.useTopicCompleted(firstId),
          second: spec.useTopicCompleted(secondId),
          count: spec.useCompletedCount(),
          actions: spec.useActions(),
          load,
        };
      });
    }

    it("hooks lazily load once and expose completion and count", async () => {
      const { result } = await setupHooks();

      await waitFor(() => expect(result.current.ready).toBe(true));
      expect(result.current.load).toHaveBeenCalledTimes(1);
      expect(result.current).toMatchObject({ first: true, second: false, count: 1 });
      expect(result.current.actions.load).toBe(result.current.load);
    });

    it("hook actions toggle topics", async () => {
      const { result } = await setupHooks();
      await waitFor(() => expect(result.current.ready).toBe(true));

      await act(async () => {
        await result.current.actions.toggleTopic(secondId);
      });

      expect(result.current).toMatchObject({ second: true, count: 2 });
    });
  });
}
