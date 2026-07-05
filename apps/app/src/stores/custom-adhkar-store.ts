import { useEffect } from "react";

import { createId } from "@/db/id";
import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * User-authored adhkar (NF-2.11) — a personal dhikr collection stored locally.
 * Each entry carries the Arabic text plus optional transliteration/translation
 * and reference, and renders through the shared `ReadingCard`, just like the
 * bundled adhkar. Local-only (mirrors the custom-tasbeeh store).
 */
export interface CustomAdhkar {
  id: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomAdhkarInput {
  title: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
}

const collection = new KeyedCollection<CustomAdhkar>(DB_KEYS.customAdhkar);

function sortItems(items: CustomAdhkar[]): CustomAdhkar[] {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

interface CustomAdhkarState {
  items: CustomAdhkar[];
  isReady: boolean;
  load: () => Promise<void>;
  create: (input: CustomAdhkarInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const customAdhkarStore = createStore<CustomAdhkarState>((set, get) => ({
  items: [],
  isReady: false,

  async load() {
    set({ items: sortItems(await collection.getAll()), isReady: true });
  },

  async create(input) {
    const timestamp = new Date().toISOString();
    const item: CustomAdhkar = {
      id: createId("adhkar"),
      title: input.title.trim(),
      arabic: input.arabic.trim(),
      transliteration: input.transliteration?.trim() || undefined,
      translation: input.translation?.trim() || undefined,
      reference: input.reference?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.upsert(item.id, item);
    set({ items: sortItems([item, ...get().items]) });
  },

  async remove(id) {
    await collection.remove(id);
    set({ items: get().items.filter((item) => item.id !== id) });
  },
}));

export function useEnsureCustomAdhkarLoaded(): void {
  useEffect(() => {
    if (!customAdhkarStore.getState().isReady) void customAdhkarStore.getState().load();
  }, []);
}

export function useCustomAdhkarList(): CustomAdhkar[] {
  return useStore(customAdhkarStore, (s) => s.items);
}

const customAdhkarActions = {
  load: () => customAdhkarStore.getState().load(),
  create: (input: CustomAdhkarInput) => customAdhkarStore.getState().create(input),
  remove: (id: string) => customAdhkarStore.getState().remove(id),
} as const;

export function useCustomAdhkarActions() {
  return customAdhkarActions;
}
