import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface SalahGuideProgressState {
  completedTopicIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
}

export const salahGuideProgressStore = createStore<SalahGuideProgressState>((set, get) => ({
  completedTopicIds: [],
  isReady: false,

  async load() {
    const stored = await readJSON<string[]>(DB_KEYS.salahGuideProgress, []);
    const { SALAH_GUIDE_TOPICS } = await import("@munib-tracker/shared/content/salah-guide");
    const valid = new Set(SALAH_GUIDE_TOPICS.map((topic) => topic.id));
    const completedTopicIds = stored.filter((id) => valid.has(id));
    set({ completedTopicIds, isReady: true });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.salahGuideProgress, next);
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },
}));

export function useSalahGuideProgressReady(): boolean {
  return useStore(salahGuideProgressStore, (s) => s.isReady);
}

export function useSalahGuideTopicCompleted(topicId: string): boolean {
  return useStore(salahGuideProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useSalahGuideCompletedCount(): number {
  return useStore(salahGuideProgressStore, (s) => s.completedTopicIds.length);
}

export function useSalahGuideProgressActions() {
  return useStore(salahGuideProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    load: s.load,
  }));
}

export function useEnsureSalahGuideProgressLoaded(): void {
  const ready = useSalahGuideProgressReady();
  const load = useStore(salahGuideProgressStore, (s) => s.load);
  if (!ready) void load();
}
