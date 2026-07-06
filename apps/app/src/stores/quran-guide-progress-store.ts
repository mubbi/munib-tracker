import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

interface QuranGuideProgressState {
  completedTopicIds: string[];
  completedApplyChallengeIds: string[];
  isReady: boolean;
  load: () => Promise<void>;
  toggleTopic: (topicId: string) => Promise<void>;
  toggleApplyChallenge: (challengeId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
  isApplyChallengeCompleted: (challengeId: string) => boolean;
}

interface QuranGuideProgressPersisted {
  completedTopicIds: string[];
  completedApplyChallengeIds: string[];
}

const EMPTY: QuranGuideProgressPersisted = {
  completedTopicIds: [],
  completedApplyChallengeIds: [],
};

export const quranGuideProgressStore = createStore<QuranGuideProgressState>((set, get) => ({
  completedTopicIds: [],
  completedApplyChallengeIds: [],
  isReady: false,

  async load() {
    const data = await readJSON<QuranGuideProgressPersisted>(DB_KEYS.quranGuideProgress, EMPTY);
    set({
      completedTopicIds: data.completedTopicIds,
      completedApplyChallengeIds: data.completedApplyChallengeIds,
      isReady: true,
    });
  },

  async toggleTopic(topicId) {
    const prev = get().completedTopicIds;
    const next = prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId];
    set({ completedTopicIds: next });
    await writeJSON(DB_KEYS.quranGuideProgress, {
      completedTopicIds: next,
      completedApplyChallengeIds: get().completedApplyChallengeIds,
    });
  },

  async toggleApplyChallenge(challengeId) {
    const prev = get().completedApplyChallengeIds;
    const next = prev.includes(challengeId)
      ? prev.filter((id) => id !== challengeId)
      : [...prev, challengeId];
    set({ completedApplyChallengeIds: next });
    await writeJSON(DB_KEYS.quranGuideProgress, {
      completedTopicIds: get().completedTopicIds,
      completedApplyChallengeIds: next,
    });
  },

  isTopicCompleted(topicId) {
    return get().completedTopicIds.includes(topicId);
  },

  isApplyChallengeCompleted(challengeId) {
    return get().completedApplyChallengeIds.includes(challengeId);
  },
}));

export function useQuranGuideProgressReady(): boolean {
  return useStore(quranGuideProgressStore, (s) => s.isReady);
}

export function useQuranGuideTopicCompleted(topicId: string): boolean {
  return useStore(quranGuideProgressStore, (s) => s.isTopicCompleted(topicId));
}

export function useQuranGuideApplyChallengeCompleted(challengeId: string): boolean {
  return useStore(quranGuideProgressStore, (s) => s.isApplyChallengeCompleted(challengeId));
}

export function useQuranGuideCompletedCount(): number {
  return useStore(quranGuideProgressStore, (s) => s.completedTopicIds.length);
}

export function useQuranGuideProgressActions() {
  return useStore(quranGuideProgressStore, (s) => ({
    toggleTopic: s.toggleTopic,
    toggleApplyChallenge: s.toggleApplyChallenge,
    load: s.load,
  }));
}

export function useEnsureQuranGuideProgressLoaded(): void {
  const ready = useQuranGuideProgressReady();
  const load = useStore(quranGuideProgressStore, (s) => s.load);
  if (!ready) void load();
}
