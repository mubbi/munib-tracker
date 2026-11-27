import { useEffect } from "react";
import { AppState } from "react-native";

import { createStore, type Store, useStore } from "@/stores/create-store";

import {
  deleteItem,
  emptyVaultDoc,
  getLiveItem,
  liveItems,
  putItem,
  type VaultDoc,
  type VaultRecord,
} from "./doc-merge";
import { VaultError, type VaultErrorCode } from "./errors";
import {
  getVaultStatus,
  onVaultChange,
  read,
  retryVaultKeyAccess,
  update,
  type VaultStatus,
  write,
} from "./vault";
import { registerVaultDocMerge, type VaultDocId, type VaultDocMerge } from "./vault-docs";

/**
 * `createStore` for a vault document. Feature stores (muhasabah, debts,
 * wasiyyah, relatives) are one line:
 *
 *   export const debtsVault = createVaultStore<DebtEntry>("debts");
 *   // screens: debtsVault.useEnsureLoaded(); const debts = debtsVault.useItems();
 *   // actions: debtsVault.actions.put(id, entry) / .remove(id)
 *
 * The store decrypts on `load()`, re-encrypts on every write, and reloads
 * itself whenever the document changes underneath it (sync merge, backup
 * restore, reset) — so feature code never touches crypto or `DB_KEYS`.
 */
export interface VaultStoreState<T> {
  doc: VaultDoc<T>;
  /** Live (non-deleted) items, most recently edited first. */
  items: VaultRecord<T>[];
  /** `locked`: ciphertext exists that this device can't open yet (see `VaultStatus`). */
  status: "idle" | "loading" | "ready" | "locked" | "error";
  error: VaultErrorCode | null;
  isReady: boolean;
  load: () => Promise<void>;
  put: (id: string, value: T) => Promise<void>;
  remove: (id: string) => Promise<void>;
  /** Replaces the whole document (import / bulk edit). */
  replace: (doc: VaultDoc<T>) => Promise<void>;
}

export interface VaultStore<T> {
  docId: VaultDocId;
  store: Store<VaultStoreState<T>>;
  useEnsureLoaded: () => void;
  useItems: () => VaultRecord<T>[];
  useItem: (id: string) => VaultRecord<T> | undefined;
  useStatus: () => Pick<VaultStoreState<T>, "status" | "error">;
  /** Stable action singleton (doesn't subscribe). */
  actions: {
    load: () => Promise<void>;
    put: (id: string, value: T) => Promise<void>;
    remove: (id: string) => Promise<void>;
    replace: (doc: VaultDoc<T>) => Promise<void>;
  };
}

const registry = new Map<VaultDocId, VaultStore<unknown>>();

function codeOf(error: unknown): VaultErrorCode {
  return error instanceof VaultError ? error.code : "vault-unavailable";
}

export function createVaultStore<T>(
  docId: VaultDocId,
  options: { merge?: VaultDocMerge } = {},
): VaultStore<T> {
  const existing = registry.get(docId);
  if (existing) return existing as VaultStore<T>;
  if (options.merge) registerVaultDocMerge(docId, options.merge);

  const store = createStore<VaultStoreState<T>>((set, get) => {
    const applyDoc = (doc: VaultDoc<T>) =>
      set({ doc, items: liveItems(doc), status: "ready", error: null, isReady: true });
    const fail = (error: unknown) => {
      const code = codeOf(error);
      set({
        status: code === "vault-locked" || code === "vault-key-mismatch" ? "locked" : "error",
        error: code,
        isReady: true,
      });
      throw error;
    };

    return {
      doc: emptyVaultDoc<T>(),
      items: [],
      status: "idle",
      error: null,
      isReady: false,

      async load() {
        if (!get().isReady) set({ status: "loading" });
        try {
          applyDoc(await read<T>(docId));
        } catch (error) {
          try {
            fail(error);
          } catch {
            // load never rejects — the state carries the error code
          }
        }
      },

      async put(id, value) {
        const now = new Date().toISOString();
        try {
          applyDoc(await update<T>(docId, (doc) => putItem(doc, id, value, now), now));
        } catch (error) {
          fail(error);
        }
      },

      async remove(id) {
        const now = new Date().toISOString();
        try {
          applyDoc(await update<T>(docId, (doc) => deleteItem(doc, id, now), now));
        } catch (error) {
          fail(error);
        }
      },

      async replace(doc) {
        try {
          await write<T>(docId, doc);
          applyDoc(doc);
        } catch (error) {
          fail(error);
        }
      },
    };
  });

  // Reload on changes from sync merges / restore / reset / unlock. Our own
  // writes also notify; the reload is cheap and keeps one code path.
  onVaultChange((change) => {
    if ((change === docId || change === "status") && store.getState().isReady) {
      void store.getState().load();
    }
  });

  const ensureLoaded = (): void => {
    if (!store.getState().isReady) void store.getState().load();
  };

  const actions = {
    load: () => store.getState().load(),
    put: (id: string, value: T) => store.getState().put(id, value),
    remove: (id: string) => store.getState().remove(id),
    replace: (doc: VaultDoc<T>) => store.getState().replace(doc),
  };

  const vaultStore: VaultStore<T> = {
    docId,
    store,
    useEnsureLoaded() {
      // biome-ignore lint/correctness/useExhaustiveDependencies: `ensureLoaded` is created once per store (factory scope), not per render.
      useEffect(() => ensureLoaded(), []);
    },
    useItems: () => useStore(store, (s) => s.items),
    useItem: (id: string) => useStore(store, (s) => getLiveItem(s.doc, id)),
    useStatus: () => useStore(store, (s) => ({ status: s.status, error: s.error })),
    actions,
  };
  registry.set(docId, vaultStore as VaultStore<unknown>);
  return vaultStore;
}

/** Reloads every vault store that has loaded once (restore / reset path). */
export async function reloadVaultStores(): Promise<void> {
  await Promise.all([
    vaultStatusStore.getState().status ? vaultStatusStore.getState().refresh() : null,
    ...[...registry.values()]
      .filter((entry) => entry.store.getState().isReady)
      .map((entry) => entry.store.getState().load()),
  ]);
}

// ── Vault status (settings rows, unlock sheets) ─────────────────────────────

interface VaultStatusState {
  status: VaultStatus | null;
  refresh: () => Promise<void>;
}

export const vaultStatusStore = createStore<VaultStatusState>((set) => ({
  status: null,
  async refresh() {
    const status = await getVaultStatus();
    if (status.lockReason === "key-unavailable") wireForegroundRetry();
    set({ status });
  },
}));

let foregroundRetryWired = false;

/**
 * M5: after a transient key-store failure (locked Keychain), re-check when the
 * app comes back to the foreground. Nothing was cached, so the next read may
 * simply succeed.
 */
function wireForegroundRetry(): void {
  if (foregroundRetryWired) return;
  foregroundRetryWired = true;
  AppState.addEventListener("change", (next) => {
    if (next !== "active") return;
    if (vaultStatusStore.getState().status?.lockReason === "key-unavailable") retryVaultKeyAccess();
  });
}

onVaultChange((change) => {
  if (change === "status" && vaultStatusStore.getState().status) {
    void vaultStatusStore.getState().refresh();
  }
});

/** Current vault status (loads on first use; refreshes on key/sync changes). */
export function useVaultStatus(): VaultStatus | null {
  useEffect(() => {
    if (!vaultStatusStore.getState().status) void vaultStatusStore.getState().refresh();
  }, []);
  return useStore(vaultStatusStore, (s) => s.status);
}
