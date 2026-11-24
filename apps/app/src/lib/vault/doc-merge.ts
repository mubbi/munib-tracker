/**
 * Plaintext shape + merge rules shared by every vault document.
 *
 * A vault document is a map of independently edited items. Each item carries
 * its own `updatedAt` (per-item last-write-wins) and is never hard-deleted while
 * other devices may still hold it: deleting sets `deletedAt` (a tombstone), so
 * a delete on one device beats an older edit on another instead of being
 * resurrected by it. Single-value data (e.g. a wasiyyah's preamble) is modelled
 * as one item with a fixed id such as `"main"`.
 */

export interface VaultItemMeta {
  id: string;
  /** ISO time of the last edit (or of the delete, for tombstones). */
  updatedAt: string;
  /** Set when the item was deleted; the payload may be stripped. */
  deletedAt?: string;
}

export type VaultRecord<T> = T & VaultItemMeta;

export interface VaultDoc<T> {
  v: 1;
  items: Record<string, VaultRecord<T>>;
}

/** Tombstones older than this are dropped on write (a device offline longer may resurrect an item). */
export const VAULT_TOMBSTONE_TTL_DAYS = 180;

export function emptyVaultDoc<T>(): VaultDoc<T> {
  return { v: 1, items: {} };
}

export function isVaultDoc(value: unknown): value is VaultDoc<unknown> {
  return (
    value != null &&
    typeof value === "object" &&
    (value as VaultDoc<unknown>).v === 1 &&
    (value as VaultDoc<unknown>).items != null &&
    typeof (value as VaultDoc<unknown>).items === "object"
  );
}

/** Coerces unknown decrypted JSON into a document (unknown shapes become empty). */
export function asVaultDoc<T>(value: unknown): VaultDoc<T> {
  return isVaultDoc(value) ? (value as VaultDoc<T>) : emptyVaultDoc<T>();
}

/** Live (non-deleted) items, most recently edited first. */
export function liveItems<T>(doc: VaultDoc<T>): VaultRecord<T>[] {
  return Object.values(doc.items)
    .filter((item) => !item.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getLiveItem<T>(doc: VaultDoc<T>, id: string): VaultRecord<T> | undefined {
  const item = doc.items[id];
  return item && !item.deletedAt ? item : undefined;
}

/** Inserts or replaces one item, stamping `updatedAt` and clearing any tombstone. */
export function putItem<T>(doc: VaultDoc<T>, id: string, value: T, nowIso: string): VaultDoc<T> {
  const { deletedAt: _drop, ...rest } = value as T & Partial<VaultItemMeta>;
  const item = { ...rest, id, updatedAt: nowIso } as VaultRecord<T>;
  return { ...doc, items: { ...doc.items, [id]: item } };
}

/** Tombstones one item (payload stripped so deleted content doesn't linger in ciphertext). */
export function deleteItem<T>(doc: VaultDoc<T>, id: string, nowIso: string): VaultDoc<T> {
  if (!doc.items[id]) return doc;
  const tombstone = { id, updatedAt: nowIso, deletedAt: nowIso } as VaultRecord<T>;
  return { ...doc, items: { ...doc.items, [id]: tombstone } };
}

/** Drops tombstones older than {@link VAULT_TOMBSTONE_TTL_DAYS}. */
export function pruneTombstones<T>(
  doc: VaultDoc<T>,
  now: Date,
  ttlDays: number = VAULT_TOMBSTONE_TTL_DAYS,
): VaultDoc<T> {
  const cutoff = new Date(now.getTime() - ttlDays * 86_400_000).toISOString();
  let changed = false;
  const items: Record<string, VaultRecord<T>> = {};
  for (const [id, item] of Object.entries(doc.items)) {
    if (item.deletedAt && item.deletedAt < cutoff) {
      changed = true;
      continue;
    }
    items[id] = item;
  }
  return changed ? { ...doc, items } : doc;
}

/**
 * Per-item last-write-wins with tombstones. For equal timestamps a tombstone
 * wins (deletes are deliberate), then the lexically larger JSON — arbitrary but
 * identical on every device, so two devices always converge.
 */
export function mergeVaultDocs<T>(local: VaultDoc<T>, remote: VaultDoc<T>): VaultDoc<T> {
  const items: Record<string, VaultRecord<T>> = { ...local.items };
  for (const [id, theirs] of Object.entries(remote.items)) {
    const ours = items[id];
    if (!ours) {
      items[id] = theirs;
      continue;
    }
    if (theirs.updatedAt > ours.updatedAt) items[id] = theirs;
    else if (theirs.updatedAt === ours.updatedAt) {
      if (Boolean(theirs.deletedAt) !== Boolean(ours.deletedAt)) {
        if (theirs.deletedAt) items[id] = theirs;
      } else if (JSON.stringify(theirs) > JSON.stringify(ours)) {
        items[id] = theirs;
      }
    }
  }
  return { v: 1, items };
}

/** Order-insensitive structural equality, used to avoid re-encrypting unchanged merges. */
export function vaultDocsEqual(a: VaultDoc<unknown>, b: VaultDoc<unknown>): boolean {
  return canonical(a) === canonical(b);
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`)
    .join(",")}}`;
}
