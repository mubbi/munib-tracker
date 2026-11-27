import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import type { KhushuEntry } from "@/lib/khushu";
import { khushuStore } from "@/stores/khushu-store";

import type { VaultMirror } from "./vault-mirror";

/**
 * D46 vault document `khushu`: the khushu journal (ratings + private notes)
 * syncs only here, as ciphertext. The local `khushu_journal` collection
 * (`Record<"date:prayerId", KhushuEntry>`) stays the source of truth; the old
 * plaintext `khushu_journal` sync entity is retired.
 *
 * Items wrap the entry (`{ entry }`) so its own `id` / `updatedAt` survive the
 * vault's per-item metadata. When both sides edited the same reflection, the
 * one with the newer `entry.updatedAt` wins.
 */
export interface KhushuItem {
  entry: KhushuEntry;
}

async function readLocal(): Promise<Record<string, KhushuItem>> {
  const map = await readJSON<Record<string, KhushuEntry>>(DB_KEYS.khushuJournal, {});
  const items: Record<string, KhushuItem> = {};
  for (const [key, entry] of Object.entries(map ?? {})) {
    if (entry && typeof entry === "object") items[key] = { entry };
  }
  return items;
}

async function applyToLocal(changes: Record<string, KhushuItem | null>): Promise<void> {
  await updateJSON<Record<string, KhushuEntry>>(DB_KEYS.khushuJournal, {}, (current) => {
    const next = { ...current };
    for (const [key, item] of Object.entries(changes)) {
      if (item?.entry) next[key] = item.entry;
      else delete next[key];
    }
    return next;
  });
  if (khushuStore.getState().isReady) await khushuStore.getState().load();
}

export const khushuMirror: VaultMirror<KhushuItem> = {
  docId: "khushu",
  readLocal,
  applyToLocal,
  docWins: (local, doc) => (doc.entry?.updatedAt ?? "") > (local.entry?.updatedAt ?? ""),
};
