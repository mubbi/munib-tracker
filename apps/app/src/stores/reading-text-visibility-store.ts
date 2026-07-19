import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

export type ReadingTextVisibility = {
  showTransliteration: boolean;
  showTranslation: boolean;
};

const DEFAULT_VISIBILITY: ReadingTextVisibility = {
  showTransliteration: true,
  showTranslation: true,
};

interface ReadingTextVisibilityState extends ReadingTextVisibility {
  isReady: boolean;
  load: () => Promise<void>;
  setShowTransliteration: (value: boolean) => Promise<void>;
  setShowTranslation: (value: boolean) => Promise<void>;
  toggleTransliteration: () => Promise<void>;
  toggleTranslation: () => Promise<void>;
}

async function persist(next: ReadingTextVisibility): Promise<void> {
  await writeJSON(DB_KEYS.readingTextVisibility, next);
}

export const readingTextVisibilityStore = createStore<ReadingTextVisibilityState>((set, get) => ({
  ...DEFAULT_VISIBILITY,
  isReady: false,

  async load() {
    const stored = await readJSON<ReadingTextVisibility>(
      DB_KEYS.readingTextVisibility,
      DEFAULT_VISIBILITY,
    );
    set({
      showTransliteration: stored.showTransliteration !== false,
      showTranslation: stored.showTranslation !== false,
      isReady: true,
    });
  },

  async setShowTransliteration(value) {
    const next = {
      showTransliteration: value,
      showTranslation: get().showTranslation,
    };
    set(next);
    await persist(next);
  },

  async setShowTranslation(value) {
    const next = {
      showTransliteration: get().showTransliteration,
      showTranslation: value,
    };
    set(next);
    await persist(next);
  },

  async toggleTransliteration() {
    await get().setShowTransliteration(!get().showTransliteration);
  },

  async toggleTranslation() {
    await get().setShowTranslation(!get().showTranslation);
  },
}));

export function useEnsureReadingTextVisibilityLoaded(): void {
  useEffect(() => {
    if (!readingTextVisibilityStore.getState().isReady) {
      void readingTextVisibilityStore.getState().load();
    }
  }, []);
}

export function useReadingTextVisibility(): ReadingTextVisibility {
  useEnsureReadingTextVisibilityLoaded();
  const showTransliteration = useStore(readingTextVisibilityStore, (s) => s.showTransliteration);
  const showTranslation = useStore(readingTextVisibilityStore, (s) => s.showTranslation);
  return { showTransliteration, showTranslation };
}

const readingTextVisibilityActions = {
  load: () => readingTextVisibilityStore.getState().load(),
  toggleTransliteration: () => readingTextVisibilityStore.getState().toggleTransliteration(),
  toggleTranslation: () => readingTextVisibilityStore.getState().toggleTranslation(),
} as const;

export function useReadingTextVisibilityActions() {
  return readingTextVisibilityActions;
}
