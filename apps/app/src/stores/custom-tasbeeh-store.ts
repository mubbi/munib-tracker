import { useEffect } from "react";

import { createId } from "@/db/id";
import { DB_KEYS } from "@/db/keys";
import { KeyedCollection, readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

export type CustomTasbeeh = {
  id: string;
  title: string;
  description: string;
  /** 0 means unlimited. */
  target: number;
  count: number;
  createdAt: string;
  updatedAt: string;
};

export type CustomTasbeehInput = {
  title: string;
  description: string;
  target: number;
};

const collection = new KeyedCollection<CustomTasbeeh>(DB_KEYS.customTasbeeh);

function sortItems(items: CustomTasbeeh[]): CustomTasbeeh[] {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Bumps the blob-level watermark used for last-write-wins over the whole list. */
async function touchCustomTasbeeh(): Promise<void> {
  await writeJSON(DB_KEYS.customTasbeehUpdatedAt, nowIso());
}

/** The custom-tasbeeh payload the sync engine pushes as a single blob record. */
export interface CustomTasbeehBlob {
  items: CustomTasbeeh[];
  updatedAt?: string;
}

/** Reads the persisted blob directly (used by the sync snapshot builder). */
export async function readCustomTasbeehBlob(): Promise<CustomTasbeehBlob> {
  const [items, updatedAt] = await Promise.all([
    collection.getAll(),
    readJSON<string | undefined>(DB_KEYS.customTasbeehUpdatedAt, undefined),
  ]);
  return { items, updatedAt };
}

/** Replaces the whole custom-tasbeeh list with a pulled one, newest-wins on the blob. */
export async function applyRemoteCustomTasbeeh(
  items: CustomTasbeeh[],
  updatedAt?: string,
): Promise<void> {
  const local = await readJSON<string | undefined>(DB_KEYS.customTasbeehUpdatedAt, undefined);
  if (local && updatedAt && local >= updatedAt) return;
  const map: Record<string, CustomTasbeeh> = {};
  for (const item of items) map[item.id] = item;
  await writeJSON(DB_KEYS.customTasbeeh, map);
  if (updatedAt) await writeJSON(DB_KEYS.customTasbeehUpdatedAt, updatedAt);
  if (customTasbeehStore.getState().isReady) {
    customTasbeehStore.setState({ items: sortItems(items) });
  }
}

function clampCount(count: number, target: number): number {
  if (target <= 0) return Math.max(0, count);
  return Math.max(0, Math.min(count, target));
}

function nowIso(): string {
  return new Date().toISOString();
}

interface CustomTasbeehState {
  items: CustomTasbeeh[];
  isReady: boolean;
  load: () => Promise<void>;
  create: (input: CustomTasbeehInput) => Promise<CustomTasbeeh>;
  update: (id: string, input: Partial<CustomTasbeehInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setCount: (id: string, count: number) => Promise<void>;
}

export const customTasbeehStore = createStore<CustomTasbeehState>((set, get) => ({
  items: [],
  isReady: false,

  async load() {
    const items = sortItems(await collection.getAll());
    set({ items, isReady: true });
  },

  async create(input) {
    const timestamp = nowIso();
    const item: CustomTasbeeh = {
      id: createId("tasbeeh"),
      title: input.title.trim(),
      description: input.description.trim(),
      target: input.target,
      count: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.upsert(item.id, item);
    await touchCustomTasbeeh();
    const items = sortItems([item, ...get().items]);
    set({ items });
    return item;
  },

  async update(id, input) {
    const existing = get().items.find((item) => item.id === id);
    if (!existing) return;

    const target = input.target ?? existing.target;
    const next: CustomTasbeeh = {
      ...existing,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      description:
        input.description !== undefined ? input.description.trim() : existing.description,
      target,
      count: clampCount(existing.count, target),
      updatedAt: nowIso(),
    };
    await collection.upsert(id, next);
    await touchCustomTasbeeh();
    set({ items: sortItems(get().items.map((item) => (item.id === id ? next : item))) });
  },

  async remove(id) {
    await collection.remove(id);
    await touchCustomTasbeeh();
    set({ items: get().items.filter((item) => item.id !== id) });
  },

  async setCount(id, count) {
    const existing = get().items.find((item) => item.id === id);
    if (!existing) return;

    const next: CustomTasbeeh = {
      ...existing,
      count: clampCount(count, existing.target),
      updatedAt: nowIso(),
    };
    await collection.upsert(id, next);
    await touchCustomTasbeeh();
    set({ items: sortItems(get().items.map((item) => (item.id === id ? next : item))) });
  },
}));

export function useEnsureCustomTasbeehLoaded(): void {
  useEffect(() => {
    if (!customTasbeehStore.getState().isReady) {
      void customTasbeehStore.getState().load();
    }
  }, []);
}

export function useCustomTasbeehList(): CustomTasbeeh[] {
  return useStore(customTasbeehStore, (s) => s.items);
}

export function useCustomTasbeeh(id: string | undefined): CustomTasbeeh | undefined {
  return useStore(customTasbeehStore, (s) => s.items.find((item) => item.id === id));
}

const customTasbeehActions = {
  load: (...args: Parameters<CustomTasbeehState["load"]>) =>
    customTasbeehStore.getState().load(...args),
  create: (...args: Parameters<CustomTasbeehState["create"]>) =>
    customTasbeehStore.getState().create(...args),
  update: (...args: Parameters<CustomTasbeehState["update"]>) =>
    customTasbeehStore.getState().update(...args),
  remove: (...args: Parameters<CustomTasbeehState["remove"]>) =>
    customTasbeehStore.getState().remove(...args),
  setCount: (...args: Parameters<CustomTasbeehState["setCount"]>) =>
    customTasbeehStore.getState().setCount(...args),
} as const;

export function useCustomTasbeehActions() {
  return customTasbeehActions;
}
