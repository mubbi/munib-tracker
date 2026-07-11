import { LAST_DAY_TOPICS } from "@munib-tracker/shared/content/last-day";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface LastDayProgressState {
  completedTopicIds: string[];
  repentanceToday: boolean;
  characterToday: boolean;
  repentanceDate: string | null;
  characterDate: string | null;
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
  toggleRepentance: (today: string) => Promise<void>;
  toggleCharacter: (today: string) => Promise<void>;
  isRepentanceChecked: (today: string) => boolean;
  isCharacterChecked: (today: string) => boolean;
}

interface LastDayProgressPersisted {
  completedTopicIds: string[];
  repentanceDate: string | null;
  characterDate: string | null;
}

export const lastDayProgressStore = createStore<LastDayProgressState>((set, get) => ({
  completedTopicIds: [],
  repentanceToday: false,
  characterToday: false,
  repentanceDate: null,
  characterDate: null,
  isReady: false,

  async load() {
    const data = await readJSON<LastDayProgressPersisted>(DB_KEYS.lastDayProgress, {
      completedTopicIds: [],
      repentanceDate: null,
      characterDate: null,
    });
    const valid = new Set(LAST_DAY_TOPICS.map((topic) => topic.id));
    set({
      completedTopicIds: data.completedTopicIds.filter((id) => valid.has(id)),
      repentanceDate: data.repentanceDate,
      characterDate: data.characterDate,
      isReady: true,
    });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.lastDayProgress, {
      completedTopicIds: next,
      repentanceDate: get().repentanceDate,
      characterDate: get().characterDate,
    });
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },

  async toggleRepentance(today) {
    const next = get().repentanceDate === today ? null : today;
    set({ repentanceDate: next });
    await writeJSON(DB_KEYS.lastDayProgress, {
      completedTopicIds: get().completedTopicIds,
      repentanceDate: next,
      characterDate: get().characterDate,
    });
  },

  async toggleCharacter(today) {
    const next = get().characterDate === today ? null : today;
    set({ characterDate: next });
    await writeJSON(DB_KEYS.lastDayProgress, {
      completedTopicIds: get().completedTopicIds,
      repentanceDate: get().repentanceDate,
      characterDate: next,
    });
  },

  isRepentanceChecked(today) {
    return get().repentanceDate === today;
  },

  isCharacterChecked(today) {
    return get().characterDate === today;
  },
}));

export function useLastDayProgressReady(): boolean {
  return useStore(lastDayProgressStore, (s) => s.isReady);
}

export function useLastDayTopicCompleted(topicId: string): boolean {
  return useStore(lastDayProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useLastDayCompletedCount(): number {
  return useStore(lastDayProgressStore, (s) => s.completedTopicIds.length);
}

export function useLastDayProgressActions() {
  return useStore(lastDayProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    toggleRepentance: s.toggleRepentance,
    toggleCharacter: s.toggleCharacter,
    load: s.load,
  }));
}

export function useLastDayRepentanceChecked(today: string): boolean {
  return useStore(lastDayProgressStore, (s) => s.isRepentanceChecked(today));
}

export function useLastDayCharacterChecked(today: string): boolean {
  return useStore(lastDayProgressStore, (s) => s.isCharacterChecked(today));
}

export function useEnsureLastDayProgressLoaded(): void {
  const ready = useLastDayProgressReady();
  const load = useStore(lastDayProgressStore, (s) => s.load);
  if (!ready) void load();
}
