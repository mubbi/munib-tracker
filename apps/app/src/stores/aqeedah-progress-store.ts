import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface AqeedahProgressState {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
}

export const aqeedahProgressStore = createStore<AqeedahProgressState>((set, get) => ({
  completedTopicIds: [],
  isReady: false,

  async load() {
    const stored = await readJSON<string[]>(DB_KEYS.aqeedahProgress, []);
    const { AQEDAH_TOPICS } = await import("@munib-tracker/shared/content/aqeedah");
    const valid = new Set(AQEDAH_TOPICS.map((topic) => topic.id));
    const completedTopicIds = stored.filter((id) => valid.has(id));
    set({ completedTopicIds, isReady: true });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.aqeedahProgress, next);
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },
}));

export function useAqeedahProgressReady(): boolean {
  return useStore(aqeedahProgressStore, (s) => s.isReady);
}

export function useAqeedahTopicCompleted(topicId: string): boolean {
  return useStore(aqeedahProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useAqeedahCompletedCount(): number {
  return useStore(aqeedahProgressStore, (s) => s.completedTopicIds.length);
}

export function useAqeedahProgressActions() {
  return useStore(aqeedahProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    load: s.load,
  }));
}

export function useEnsureAqeedahProgressLoaded(): void {
  const ready = useAqeedahProgressReady();
  const load = useStore(aqeedahProgressStore, (s) => s.load);
  if (!ready) void load();
}
