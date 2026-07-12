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
    const stored = await readJSON<string[]>(DB_KEYS.taharahProgress, []);
    const { TAHARAH_TOPICS } = await import("@munib-tracker/shared/content/taharah");
    const valid = new Set(TAHARAH_TOPICS.map((topic) => topic.id));
    const completedTopicIds = stored.filter((id) => valid.has(id));
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
