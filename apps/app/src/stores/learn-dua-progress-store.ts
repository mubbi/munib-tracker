import { LEARN_DUA_TOPICS } from "@munib-tracker/shared/content";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface LearnDuaProgressState {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
}

export const learnDuaProgressStore = createStore<LearnDuaProgressState>((set, get) => ({
  completedTopicIds: [],
  isReady: false,

  async load() {
    const stored = await readJSON<string[]>(DB_KEYS.learnDuaProgress, []);
    const valid = new Set(LEARN_DUA_TOPICS.map((topic) => topic.id));
    const completedTopicIds = stored.filter((id) => valid.has(id));
    set({ completedTopicIds, isReady: true });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.learnDuaProgress, next);
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },
}));

export function useLearnDuaProgressReady(): boolean {
  return useStore(learnDuaProgressStore, (s) => s.isReady);
}

export function useLearnDuaTopicCompleted(topicId: string): boolean {
  return useStore(learnDuaProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useLearnDuaCompletedCount(): number {
  return useStore(learnDuaProgressStore, (s) => s.completedTopicIds.length);
}

export function useLearnDuaProgressActions() {
  return useStore(learnDuaProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    load: s.load,
  }));
}

export function useEnsureLearnDuaProgressLoaded(): void {
  const ready = useLearnDuaProgressReady();
  const load = useStore(learnDuaProgressStore, (s) => s.load);
  if (!ready) void load();
}
