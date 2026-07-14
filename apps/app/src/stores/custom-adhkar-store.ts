import { USER_MEDIA_MAX_PER_ENTITY } from "@munib-tracker/shared/constants";
import { useEffect } from "react";
import { createId } from "@/db/id";
import { DB_KEYS } from "@/db/keys";
import { KeyedCollection } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * User-authored adhkar (NF-2.11) — personal collection stored locally and
 * cloud-synced for linked accounts. Optional attachments are private user-media
 * ids (Cloudinary via the API), never world-readable URLs.
 */
export interface CustomAdhkarImage {
  /** Server media id after upload to `/user-media`. */
  mediaId?: string;
  /** Local draft URI before upload (not synced across devices). */
  localUri?: string;
  mimeType: string;
  /** Original filename (useful for PDF open/share). */
  filename?: string;
}

export interface CustomAdhkar {
  id: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
  images?: CustomAdhkarImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomAdhkarInput {
  title: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  reference?: string;
  images?: CustomAdhkarImage[];
}

const collection = new KeyedCollection<CustomAdhkar>(DB_KEYS.customAdhkar);

function sortItems(items: CustomAdhkar[]): CustomAdhkar[] {
  return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function normalizeImages(images: CustomAdhkarImage[] | undefined): CustomAdhkarImage[] | undefined {
  if (!images?.length) return undefined;
  return images.slice(0, USER_MEDIA_MAX_PER_ENTITY).map((image) => ({
    mediaId: image.mediaId,
    localUri: image.mediaId ? undefined : image.localUri,
    mimeType: image.mimeType || "image/jpeg",
    filename: image.filename,
  }));
}

interface CustomAdhkarState {
  items: CustomAdhkar[];
  isReady: boolean;
  load: () => Promise<void>;
  create: (input: CustomAdhkarInput) => Promise<CustomAdhkar>;
  update: (id: string, input: CustomAdhkarInput) => Promise<CustomAdhkar | undefined>;
  remove: (id: string) => Promise<CustomAdhkar | undefined>;
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
      images: normalizeImages(input.images),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await collection.upsert(item.id, item);
    set({ items: sortItems([item, ...get().items]) });
    return item;
  },

  async update(id, input) {
    const existing = get().items.find((item) => item.id === id);
    if (!existing) return undefined;

    const next: CustomAdhkar = {
      ...existing,
      title: input.title.trim(),
      arabic: input.arabic.trim(),
      transliteration: input.transliteration?.trim() || undefined,
      translation: input.translation?.trim() || undefined,
      reference: input.reference?.trim() || undefined,
      images: input.images !== undefined ? normalizeImages(input.images) : existing.images,
      updatedAt: new Date().toISOString(),
    };
    await collection.upsert(id, next);
    set({ items: sortItems(get().items.map((item) => (item.id === id ? next : item))) });
    return next;
  },

  async remove(id) {
    const existing = get().items.find((item) => item.id === id);
    await collection.remove(id);
    set({ items: get().items.filter((item) => item.id !== id) });
    return existing;
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
  update: (id: string, input: CustomAdhkarInput) => customAdhkarStore.getState().update(id, input),
  remove: (id: string) => customAdhkarStore.getState().remove(id),
} as const;

export function useCustomAdhkarActions() {
  return customAdhkarActions;
}
