import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface TaharahProgressState {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
}

export const taharahProgressStore = createStore<TaharahProgressState>((set, get) => ({
  completedTopicIds: [],
  isReady: false,

  async load() {
    const completedTopicIds = await readJSON<string[]>(DB_KEYS.taharahProgress, []);
    set({ completedTopicIds, isReady: true });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.taharahProgress, next);
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },
}));

export function useTaharahProgressReady(): boolean {
  return useStore(taharahProgressStore, (s) => s.isReady);
}

export function useTaharahTopicCompleted(topicId: string): boolean {
  return useStore(taharahProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useTaharahCompletedCount(): number {
  return useStore(taharahProgressStore, (s) => s.completedTopicIds.length);
}

export function useTaharahProgressActions() {
  return useStore(taharahProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    load: s.load,
  }));
}

export function useEnsureTaharahProgressLoaded(): void {
  const ready = useTaharahProgressReady();
  const load = useStore(taharahProgressStore, (s) => s.load);
  if (!ready) void load();
}
