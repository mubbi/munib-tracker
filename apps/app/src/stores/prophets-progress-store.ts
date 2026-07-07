import { PROPHETS_TOPICS } from "@munib-tracker/shared/content";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface ProphetsProgressState {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
}

export const prophetsProgressStore = createStore<ProphetsProgressState>((set, get) => ({
  completedTopicIds: [],
  isReady: false,

  async load() {
    const stored = await readJSON<string[]>(DB_KEYS.prophetsProgress, []);
    const valid = new Set(PROPHETS_TOPICS.map((topic) => topic.id));
    const completedTopicIds = stored.filter((id) => valid.has(id));
    set({ completedTopicIds, isReady: true });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.prophetsProgress, next);
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },
}));

export function useProphetsProgressReady(): boolean {
  return useStore(prophetsProgressStore, (s) => s.isReady);
}

export function useProphetsTopicCompleted(topicId: string): boolean {
  return useStore(prophetsProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useProphetsCompletedCount(): number {
  return useStore(prophetsProgressStore, (s) => s.completedTopicIds.length);
}

export function useProphetsProgressActions() {
  return useStore(prophetsProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    load: s.load,
  }));
}

export function useEnsureProphetsProgressLoaded(): void {
  const ready = useProphetsProgressReady();
  const load = useStore(prophetsProgressStore, (s) => s.load);
  if (!ready) void load();
}
