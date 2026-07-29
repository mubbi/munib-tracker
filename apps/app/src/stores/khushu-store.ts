import type { PrayerId } from "@munib-tracker/shared/types";
import { useEffect } from "react";

import { createId } from "@/db/id";
import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";
import { clampRating, type KhushuEntry } from "@/lib/khushu";

import { createStore, useStore } from "./create-store";

/**
 * Post-salah khushu reflections (NF-2.12) — one optional rating + note per prayer
 * per day, keyed by `date:prayerId` so re-rating the same prayer overwrites in
 * place. Local-only (mirrors the custom-adhkar store); a purely personal journal.
 */
export interface KhushuInput {
  date: string;
  prayerId: PrayerId;
  rating: number;
  note?: string;
}

const collection = new KeyedCollection<KhushuEntry>(DB_KEYS.khushuJournal);

function entryKey(date: string, prayerId: PrayerId): string {
  return `${date}:${prayerId}`;
}

function sortItems(items: KhushuEntry[]): KhushuEntry[] {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

interface KhushuState {
  items: KhushuEntry[];
  isReady: boolean;
  load: () => Promise<void>;
  save: (input: KhushuInput) => Promise<void>;
  remove: (date: string, prayerId: PrayerId) => Promise<void>;
}

export const khushuStore = createStore<KhushuState>((set, get) => ({
  items: [],
  isReady: false,

  async load() {
    set({ items: sortItems(await collection.getAll()), isReady: true });
  },

  async save(input) {
    const key = entryKey(input.date, input.prayerId);
    const timestamp = new Date().toISOString();
    const existing = await collection.get(key);
    const entry: KhushuEntry = {
      id: existing?.id ?? createId("khushu"),
      date: input.date,
      prayerId: input.prayerId,
      rating: clampRating(input.rating),
      note: input.note?.trim() || undefined,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    await collection.upsert(key, entry);
    const rest = get().items.filter((item) => item.id !== entry.id);
    set({ items: sortItems([entry, ...rest]) });
  },

  async remove(date, prayerId) {
    await collection.remove(entryKey(date, prayerId));
    set({
      items: get().items.filter((item) => !(item.date === date && item.prayerId === prayerId)),
    });
  },
}));

export function useEnsureKhushuLoaded(): void {
  useEffect(() => {
    if (!khushuStore.getState().isReady) void khushuStore.getState().load();
  }, []);
}

export function useKhushuEntries(): KhushuEntry[] {
  return useStore(khushuStore, (s) => s.items);
}

const khushuActions = {
  load: () => khushuStore.getState().load(),
  save: (input: KhushuInput) => khushuStore.getState().save(input),
  remove: (date: string, prayerId: PrayerId) => khushuStore.getState().remove(date, prayerId),
} as const;

export function useKhushuActions() {
  return khushuActions;
}
