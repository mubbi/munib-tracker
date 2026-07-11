import { BATTLES_TOPICS } from "@munib-tracker/shared/content/battles";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface BattlesProgressState {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
}

export const battlesProgressStore = createStore<BattlesProgressState>((set, get) => ({
  completedTopicIds: [],
  isReady: false,

  async load() {
    const stored = await readJSON<string[]>(DB_KEYS.battlesProgress, []);
    const valid = new Set(BATTLES_TOPICS.map((topic) => topic.id));
    const completedTopicIds = stored.filter((id) => valid.has(id));
    set({ completedTopicIds, isReady: true });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.battlesProgress, next);
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },
}));

export function useBattlesProgressReady(): boolean {
  return useStore(battlesProgressStore, (s) => s.isReady);
}

export function useBattlesTopicCompleted(topicId: string): boolean {
  return useStore(battlesProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useBattlesCompletedCount(): number {
  return useStore(battlesProgressStore, (s) => s.completedTopicIds.length);
}

export function useBattlesProgressActions() {
  return useStore(battlesProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    load: s.load,
  }));
}

export function useEnsureBattlesProgressLoaded(): void {
  const ready = useBattlesProgressReady();
  const load = useStore(battlesProgressStore, (s) => s.load);
  if (!ready) void load();
}
