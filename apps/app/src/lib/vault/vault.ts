import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, withKeyLock, writeJSON } from "@/db/store";

import { vaultCrypto } from "./crypto";
import {
  asVaultDoc,
  emptyVaultDoc,
  pruneTombstones,
  type VaultDoc,
  vaultDocsEqual,
} from "./doc-merge";
import { wipeBytes } from "./encoding";
import {
  deriveKeyId,
  isVaultEnvelope,
  openDocument,
  sealDocument,
  VAULT_KEY_BYTES,
} from "./envelope";
import { isVaultError, VaultError } from "./errors";
import {
  createKeyring,
  isVaultKeyring,
  mergeKeyrings,
  regenerateRecoveryCode,
  rewrapPassphrase,
  unwrapWithPassphrase,
  unwrapWithRecoveryCode,
} from "./keyring";
import { readVaultSyncState, updateVaultSyncState, type VaultSyncState } from "./sync-state";
import type { VaultCryptoBackend, VaultEnvelope, VaultKeyring } from "./types";
import {
  VAULT_DOC_IDS,
  VAULT_DOC_STORAGE_KEYS,
  VAULT_KEYRING_ENTITY,
  type VaultDocId,
  type VaultSyncEntity,
  vaultDocEntity,
  vaultDocMerge,
} from "./vault-docs";
import {
  readSealedFile,
  reencryptVaultFiles,
  removeSealedFile,
  VAULT_MAX_FILE_BYTES,
  wipeVaultFiles,
  writeSealedFile,
} from "./vault-files";
// Eager domain merges (debts repayments, relatives' last contact): must be
// registered before the first sync merge, not when a feature screen loads.
import "./register-merges";

/**
 * The vault (plan §4.2, D2): an end-to-end-encrypted local store for the most
 * sensitive records (muhasabah, debts, wasiyyah, silat al-rahim relatives).
 *
 * At rest (always on): a random 256-bit DEK is created on first write and kept
 * in SecureStore (native) / behind a non-extractable IndexedDB key (web). Each
 * document is a `VaultEnvelope` (AES-256-GCM) in AsyncStorage.
 *
 * Opt-in sync: the user sets a passphrase; the DEK is wrapped under an scrypt
 * KEK and under a 24-word recovery code (the keyring) and both the keyring and
 * the envelopes sync as blob entities — the server never sees plaintext.
 *
 * Feature code uses the typed document API (`read` / `write` / `update` /
 * `subscribe`) or, better, `createVaultStore` in `vault-store.ts`.
 */

let backend: VaultCryptoBackend = vaultCrypto;
/**
 * The DEK once read. Only a real key is cached. "No key" and read errors are
 * re-checked on every access, because a locked Keychain (transient) must never
 * stick as "no key" for the rest of the process (M5).
 */
let cachedDek: Uint8Array | undefined;

/** Jest: swap in another backend (e.g. the web one) and drop cached key state. */
export function __setVaultBackendForTests(next: VaultCryptoBackend): void {
  backend = next;
  cachedDek = undefined;
}

export function getVaultBackend(): VaultCryptoBackend {
  return backend;
}

// ── Change notifications ────────────────────────────────────────────────────

export type VaultChange = VaultDocId | "status";
type VaultListener = (change: VaultChange) => void;
const listeners = new Set<VaultListener>();

/** Fires for document writes/merges (`docId`) and key/sync changes (`"status"`). */
export function onVaultChange(listener: VaultListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyVaultChange(change: VaultChange): void {
  for (const listener of [...listeners]) {
    try {
      listener(change);
    } catch {
      // a faulty subscriber must not break the writer
    }
  }
}

function notifyAll(): void {
  notifyVaultChange("status");
  for (const docId of VAULT_DOC_IDS) notifyVaultChange(docId);
}

// ── Key custody ─────────────────────────────────────────────────────────────

/**
 * Lock order: never take an earlier lock while holding a later one.
 *
 *   1. document locks (`VAULT_DOC_STORAGE_KEYS[docId]`, in `VAULT_DOC_IDS` order)
 *   2. `DEK_LOCK` (key custody: create / adopt / delete the DEK, sealed files)
 *   3. `DB_KEYS.vaultKeyring`
 *
 * A document write holds its document lock and may then need `DEK_LOCK` to
 * mint the first key, so anything that changes the key (`adoptDek`,
 * `deleteVaultKey`) takes every document lock first. Every use of the DEK
 * bytes runs under a document lock or `DEK_LOCK`, so a key change never
 * wipes a key that is still in use.
 */
const DEK_LOCK = "@munib-tracker/vault/dek";

function docLock(docId: VaultDocId): string {
  return VAULT_DOC_STORAGE_KEYS[docId];
}

/** Runs `task` holding every document lock (in `VAULT_DOC_IDS` order), then `DEK_LOCK`. */
function withAllVaultLocks<T>(task: () => Promise<T>): Promise<T> {
  const nest = (index: number): Promise<T> => {
    const docId = VAULT_DOC_IDS[index];
    if (docId === undefined) return withKeyLock(DEK_LOCK, task);
    return withKeyLock(docLock(docId), () => nest(index + 1));
  };
  return nest(0);
}

/**
 * The DEK, or `null` when this device has none. Throws `vault-key-unavailable`
 * when the key store is temporarily unreadable, and `vault-unavailable` when
 * there is no key store at all. Neither is cached.
 */
async function loadDek(): Promise<Uint8Array | null> {
  if (cachedDek) return cachedDek;
  let dek: Uint8Array | null;
  try {
    dek = await backend.loadDek();
  } catch (error) {
    if (error instanceof VaultError) throw error;
    throw new VaultError("vault-unavailable");
  }
  if (dek) cachedDek = dek;
  return dek;
}

/** Drops the in-memory DEK (next access re-reads secure storage). */
export function forgetVaultKeyCache(): void {
  cachedDek = undefined;
}

/**
 * Re-checks the key store after a transient `vault-key-unavailable`, e.g.
 * when the app comes to the foreground or the user taps "Try again". Status
 * and document stores reload through their change listeners.
 */
export function retryVaultKeyAccess(): void {
  if (cachedDek) return;
  notifyAll();
}

async function hasAnyCiphertext(): Promise<boolean> {
  for (const docId of VAULT_DOC_IDS) {
    if ((await readJSON<unknown>(VAULT_DOC_STORAGE_KEYS[docId], null)) != null) return true;
  }
  return false;
}

/** Caller holds `DEK_LOCK`. Throws `vault-locked` when ciphertext exists without a key. */
async function loadOrCreateDekLocked(): Promise<Uint8Array> {
  const existing = await loadDek();
  if (existing) return existing;
  if (await hasAnyCiphertext()) throw new VaultError("vault-locked");
  const dek = backend.randomBytes(VAULT_KEY_BYTES);
  await backend.saveDek(dek);
  cachedDek = dek;
  return dek;
}

/** The DEK, created on first use. Caller holds a document lock (never `DEK_LOCK`). */
async function ensureDek(): Promise<Uint8Array> {
  return (await loadDek()) ?? withKeyLock(DEK_LOCK, loadOrCreateDekLocked);
}

async function requireDek(): Promise<Uint8Array> {
  const dek = await loadDek();
  if (!dek) throw new VaultError("vault-locked");
  return dek;
}

export async function readLocalKeyring(): Promise<VaultKeyring | null> {
  const value = await readJSON<unknown>(DB_KEYS.vaultKeyring, null);
  return isVaultKeyring(value) ? value : null;
}

function inboxKeyring(state: VaultSyncState): VaultKeyring | null {
  const value = state.inbox[VAULT_KEYRING_ENTITY]?.value;
  return isVaultKeyring(value) ? value : null;
}

// ── Status ──────────────────────────────────────────────────────────────────

export interface VaultStatus {
  /**
   * `ready`: documents can be read/written (a fresh vault creates its DEK on
   * first write). `locked`: ciphertext exists that this device can't open yet.
   * `unavailable`: secure key storage / crypto is missing here.
   */
  state: "ready" | "locked" | "unavailable";
  /**
   * `no-key`: no DEK on this device (restored backup / new device).
   * `key-mismatch`: sync moved to another device's key.
   * `key-unavailable` (with state `unavailable`): the key store can't be read
   * right now, e.g. a locked iPhone. It is transient, so the UI says "try again"
   * and never offers "Start fresh".
   */
  lockReason: "no-key" | "key-mismatch" | "key-unavailable" | null;
  /** A keyring is available (local or pulled), so passphrase / recovery code can unlock. */
  canUnlock: boolean;
  syncEnabled: boolean;
  /** A passphrase + recovery code have been set up (local keyring). */
  hasKeyring: boolean;
  /** Another device synced a vault this device hasn't joined (needs that passphrase). */
  syncAvailableFromOtherDevice: boolean;
  /**
   * Documents whose sync is paused. A pulled copy is parked because this
   * device can't open it yet, or because merging it would go over the 256 KB
   * cap. This device won't push over it until the parked copy merges.
   */
  heldDocs: VaultDocId[];
}

function heldDocIds(sync: VaultSyncState): VaultDocId[] {
  return sync.enabled ? VAULT_DOC_IDS.filter((docId) => sync.inbox[vaultDocEntity(docId)]) : [];
}

export async function getVaultStatus(): Promise<VaultStatus> {
  const [keyring, sync] = await Promise.all([readLocalKeyring(), readVaultSyncState()]);
  const pulled = inboxKeyring(sync);
  let dek: Uint8Array | null;
  try {
    dek = await loadDek();
  } catch (error) {
    return {
      state: "unavailable",
      lockReason: isVaultError(error, "vault-key-unavailable") ? "key-unavailable" : null,
      canUnlock: false,
      syncEnabled: sync.enabled,
      hasKeyring: keyring != null,
      syncAvailableFromOtherDevice: false,
      heldDocs: heldDocIds(sync),
    };
  }
  const keyId = dek ? deriveKeyId(dek) : null;
  const canUnlock = keyring != null || pulled != null;
  let lockReason: VaultStatus["lockReason"] = null;
  if (!dek && (await hasAnyCiphertext())) lockReason = "no-key";
  else if (dek && sync.enabled && keyring && keyring.keyId !== keyId) lockReason = "key-mismatch";
  return {
    state: lockReason ? "locked" : "ready",
    lockReason,
    canUnlock,
    syncEnabled: sync.enabled,
    hasKeyring: keyring != null,
    syncAvailableFromOtherDevice:
      pulled != null && pulled.keyId !== keyId && (!keyring || keyring.keyId !== pulled.keyId),
    heldDocs: heldDocIds(sync),
  };
}

/** True when sync may push/apply vault documents: opted in and the keyring is this device's key. */
export async function canSyncVaultDocs(): Promise<boolean> {
  const [sync, keyring] = await Promise.all([readVaultSyncState(), readLocalKeyring()]);
  if (!sync.enabled || !keyring) return false;
  const dek = await loadDek().catch(() => null);
  return dek != null && deriveKeyId(dek) === keyring.keyId;
}

// ── Document API ────────────────────────────────────────────────────────────

async function readEnvelope(docId: VaultDocId): Promise<unknown> {
  return readJSON<unknown>(VAULT_DOC_STORAGE_KEYS[docId], null);
}

async function decryptRaw<T>(
  docId: VaultDocId,
  raw: unknown,
  dek: Uint8Array,
): Promise<VaultDoc<T>> {
  return asVaultDoc<T>(await openDocument<unknown>(backend, dek, docId, raw));
}

/** Caller holds the document lock. */
async function readUnlocked<T>(docId: VaultDocId): Promise<VaultDoc<T>> {
  const raw = await readEnvelope(docId);
  if (raw == null) return emptyVaultDoc<T>();
  return decryptRaw<T>(docId, raw, await requireDek());
}

/**
 * Decrypts a document (empty when never written). Throws `VaultError`.
 * Queued behind pending writes of the same document (read-your-writes), and
 * never runs while the key is being changed.
 */
export function read<T>(docId: VaultDocId): Promise<VaultDoc<T>> {
  return withKeyLock(docLock(docId), () => readUnlocked<T>(docId));
}

async function writeUnlocked<T>(
  docId: VaultDocId,
  doc: VaultDoc<T>,
  nowIso: string,
): Promise<void> {
  const dek = await ensureDek();
  const pruned = pruneTombstones(doc, new Date(nowIso));
  const envelope = await sealDocument(backend, dek, docId, pruned, nowIso);
  await writeJSON(VAULT_DOC_STORAGE_KEYS[docId], envelope);
}

/** Encrypts and stores a whole document. */
export async function write<T>(
  docId: VaultDocId,
  doc: VaultDoc<T>,
  nowIso: string = new Date().toISOString(),
): Promise<void> {
  await withKeyLock(docLock(docId), () => writeUnlocked(docId, doc, nowIso));
  notifyVaultChange(docId);
}

/** Read-modify-write under the document's key lock (safe against concurrent edits). */
export async function update<T>(
  docId: VaultDocId,
  mutate: (doc: VaultDoc<T>) => VaultDoc<T>,
  nowIso: string = new Date().toISOString(),
): Promise<VaultDoc<T>> {
  const next = await withKeyLock(docLock(docId), async () => {
    const current = await readUnlocked<T>(docId);
    const mutated = mutate(current);
    if (mutated !== current) await writeUnlocked(docId, mutated, nowIso);
    return mutated;
  });
  notifyVaultChange(docId);
  return next;
}

/** Subscribe to one document's changes (local writes, sync merges, resets). */
export function subscribe(docId: VaultDocId, listener: () => void): () => void {
  return onVaultChange((change) => {
    if (change === docId) listener();
  });
}

// ── Merge (used by vault sync and inbox processing) ─────────────────────────

export type EnvelopeMergeOutcome =
  | { kind: "merged"; value: unknown }
  /** The remote envelope can't be opened with this device's key — park it. */
  | { kind: "unreadable-remote"; value: unknown }
  /** The merged document would be over the 256 KB cap: keep local (`value`), park the remote. */
  | { kind: "too-large"; value: unknown };

/**
 * Decrypts both envelopes, runs the document's domain merge and re-encrypts.
 * Returns the local or remote envelope untouched when the merge equals it, so
 * a converged pair never re-encrypts (no fresh IV → no sync ping-pong).
 */
export async function mergeDocEnvelopes(
  docId: VaultDocId,
  localRaw: unknown,
  remoteRaw: unknown,
  nowIso: string = new Date().toISOString(),
): Promise<EnvelopeMergeOutcome> {
  // A cleared remote (vault reset elsewhere) never wipes local data silently.
  if (remoteRaw == null) return { kind: "merged", value: localRaw };
  const dek = await loadDek().catch(() => null);
  if (!dek || !isVaultEnvelope(remoteRaw)) return { kind: "unreadable-remote", value: localRaw };

  let remote: VaultDoc<unknown>;
  try {
    remote = await decryptRaw(docId, remoteRaw, dek);
  } catch {
    return { kind: "unreadable-remote", value: localRaw };
  }
  if (localRaw == null) return { kind: "merged", value: remoteRaw };

  let local: VaultDoc<unknown>;
  try {
    local = await decryptRaw(docId, localRaw, dek);
  } catch {
    // Local copy is damaged (or under an old key) — the readable remote heals it.
    return { kind: "merged", value: remoteRaw };
  }

  const merged = vaultDocMerge(docId)(local, remote);
  if (vaultDocsEqual(merged, remote)) return { kind: "merged", value: remoteRaw };
  if (vaultDocsEqual(merged, local)) return { kind: "merged", value: localRaw };
  const localAt = (localRaw as VaultEnvelope).updatedAt;
  const remoteAt = (remoteRaw as VaultEnvelope).updatedAt;
  const stamp = [nowIso, localAt, remoteAt].sort().at(-1) as string;
  try {
    return { kind: "merged", value: await sealDocument(backend, dek, docId, merged, stamp) };
  } catch (error) {
    // H2: if the union is over the sync cap, keep local and park the remote,
    // so this one document doesn't make every pull throw.
    if (isVaultError(error, "vault-too-large")) return { kind: "too-large", value: localRaw };
    throw error;
  }
}

// ── Opt-in sync: setup, unlock, passphrase & recovery management ────────────

/**
 * Read-modify-write of the local keyring under its key lock, so a keyring
 * merged by a sync pull meanwhile is never overwritten by a stale copy.
 * `next` returns the keyring to store, or `null` to leave it as is.
 */
async function updateLocalKeyring<R>(
  next: (current: VaultKeyring | null) => Promise<{ keyring: VaultKeyring | null; result: R }>,
): Promise<R> {
  return withKeyLock(DB_KEYS.vaultKeyring, async () => {
    const current = await readLocalKeyring();
    const { keyring, result } = await next(current);
    if (keyring && keyring !== current) await writeJSON(DB_KEYS.vaultKeyring, keyring);
    return result;
  });
}

/** Runs `task` with this device's DEK under `DEK_LOCK` (key changes wait for it). */
function withDek<T>(
  task: (dek: Uint8Array) => Promise<T>,
  { create = false }: { create?: boolean } = {},
): Promise<T> {
  return withKeyLock(DEK_LOCK, async () =>
    task(create ? await loadOrCreateDekLocked() : await requireDek()),
  );
}

/**
 * Turns on vault sync with a new passphrase (min 10 chars). Returns the 24
 * recovery words — show them once; they are never stored.
 *
 * Throws `vault-key-mismatch` when another device already synced a vault for
 * this account: the user must unlock with that passphrase instead.
 */
export async function setUpVaultSync(
  passphrase: string,
  nowIso: string = new Date().toISOString(),
): Promise<{ recoveryWords: string[] }> {
  const status = await getVaultStatus();
  if (status.state !== "ready")
    throw new VaultError(status.state === "locked" ? "vault-locked" : "vault-unavailable");
  if (status.syncAvailableFromOtherDevice) throw new VaultError("vault-key-mismatch");
  const { recoveryWords } = await withDek(
    async (dek) => {
      const created = await createKeyring(backend, dek, passphrase, nowIso);
      await withKeyLock(DB_KEYS.vaultKeyring, () =>
        writeJSON(DB_KEYS.vaultKeyring, created.keyring),
      );
      return created;
    },
    { create: true },
  );
  await updateVaultSyncState((state) => ({ ...state, enabled: true }));
  notifyVaultChange("status");
  return { recoveryWords };
}

/** Re-enables sync on a device that already holds the matching keyring (no passphrase needed). */
export async function resumeVaultSync(): Promise<void> {
  const keyring = await readLocalKeyring();
  if (!keyring) throw new VaultError("vault-no-keyring");
  const dek = await requireDek();
  if (deriveKeyId(dek) !== keyring.keyId) throw new VaultError("vault-key-mismatch");
  const sync = await readVaultSyncState();
  const pulled = inboxKeyring(sync);
  if (pulled && pulled.keyId !== keyring.keyId && mergeKeyrings(keyring, pulled) === pulled) {
    throw new VaultError("vault-key-mismatch");
  }
  await updateVaultSyncState((state) => ({ ...state, enabled: true }));
  await processVaultInbox();
  notifyVaultChange("status");
}

/** Stops pushing/pulling vault records on this device. The server copy is left as is. */
export async function disableVaultSync(): Promise<void> {
  await updateVaultSyncState((state) => ({ ...state, enabled: false }));
  notifyVaultChange("status");
}

export type VaultSecret = { passphrase: string } | { recoveryCode: string | readonly string[] };

/**
 * Unlocks with the passphrase or recovery code: on a new device / after a
 * restored backup, or after sync moved to another device's key. Adopts the
 * keyring's DEK (re-encrypting any local documents under it), applies parked
 * sync records, and — with `enableSync` — turns sync on.
 */
export async function unlockVault(
  secret: VaultSecret,
  options: { enableSync?: boolean } = {},
): Promise<void> {
  const [local, sync] = await Promise.all([readLocalKeyring(), readVaultSyncState()]);
  const pulled = inboxKeyring(sync);
  const keyring =
    local && pulled ? (mergeKeyrings(local, pulled) as VaultKeyring) : (local ?? pulled);
  if (!keyring) throw new VaultError("vault-no-keyring");

  const dek =
    "passphrase" in secret
      ? await unwrapWithPassphrase(backend, keyring, secret.passphrase)
      : await unwrapWithRecoveryCode(backend, keyring, secret.recoveryCode);

  // Re-merge under the lock: a sync pull may have stored a newer keyring while scrypt ran.
  await updateLocalKeyring(async (current) => {
    const merged = current ? mergeKeyrings(current, keyring) : null;
    return { keyring: merged?.keyId === keyring.keyId ? merged : keyring, result: undefined };
  });
  await adoptDek(dek);
  if (options.enableSync) await updateVaultSyncState((state) => ({ ...state, enabled: true }));
  await processVaultInbox();
  notifyAll();
}

/**
 * Makes `dek` this device's key. Documents sealed by the previous key are
 * re-encrypted (updatedAt kept); ones neither key can open are left in place.
 *
 * Holds every document lock and then `DEK_LOCK` (see the lock order above):
 * a first write waiting for `DEK_LOCK` while holding its document lock can
 * then never deadlock against the re-encryption, and no reader is still
 * using the previous key when it is wiped.
 */
async function adoptDek(dek: Uint8Array): Promise<void> {
  await withAllVaultLocks(async () => {
    // A temporarily unreadable key must not be treated as "no previous key":
    // the local documents would then never be re-encrypted under the new one.
    const previous = await loadDek().catch((error: unknown) => {
      if (isVaultError(error, "vault-key-unavailable")) throw error;
      return null;
    });
    const nextKeyId = deriveKeyId(dek);
    if (previous && deriveKeyId(previous) === nextKeyId) return;
    if (previous) {
      for (const docId of VAULT_DOC_IDS) {
        const raw = await readEnvelope(docId);
        if (!isVaultEnvelope(raw) || raw.keyId === nextKeyId) continue;
        try {
          const doc = await openDocument<unknown>(backend, previous, docId, raw);
          const resealed = await sealDocument(backend, dek, docId, doc, raw.updatedAt);
          await writeJSON(VAULT_DOC_STORAGE_KEYS[docId], resealed);
        } catch {
          // unreadable under both keys — leave it; reads report vault-key-mismatch/corrupt
        }
      }
      // Device-only encrypted files (debt photos) follow the key too.
      await reencryptVaultFiles(backend, previous, dek, nextKeyId);
    }
    await backend.saveDek(dek);
    if (previous && previous !== dek) wipeBytes(previous);
    cachedDek = dek;
  });
}

/**
 * Applies parked sync records this device can now open. Safe to call any time.
 * With `only`, just that entity is retried (the sync push path uses this).
 */
export async function processVaultInbox(
  nowIso: string = new Date().toISOString(),
  only?: VaultSyncEntity,
): Promise<void> {
  const sync = await readVaultSyncState();
  if (Object.keys(sync.inbox).length === 0) return;
  const applied = new Set<VaultSyncEntity>();

  const pulled =
    only == null || only === VAULT_KEYRING_ENTITY ? sync.inbox[VAULT_KEYRING_ENTITY] : null;
  if (pulled) {
    const dek = await loadDek().catch(() => null);
    const keyringApplied = await updateLocalKeyring(async (local) => {
      const merged = mergeKeyrings(local, pulled.value);
      // Only take a keyring for the key this device actually holds (others need unlockVault).
      if (merged && dek && merged.keyId === deriveKeyId(dek))
        return { keyring: merged, result: true };
      return { keyring: null, result: merged != null && merged === local };
    });
    if (keyringApplied) applied.add(VAULT_KEYRING_ENTITY);
  }

  for (const docId of VAULT_DOC_IDS) {
    const entity = vaultDocEntity(docId);
    if (only != null && only !== entity) continue;
    const entry = sync.inbox[entity];
    if (!entry) continue;
    const outcome = await withKeyLock(docLock(docId), async () => {
      const result = await mergeDocEnvelopes(docId, await readEnvelope(docId), entry.value, nowIso);
      if (result.kind === "merged" && result.value != null) {
        await writeJSON(VAULT_DOC_STORAGE_KEYS[docId], result.value);
      }
      return result;
    });
    if (outcome.kind === "merged") {
      applied.add(entity);
      notifyVaultChange(docId);
    }
  }

  if (applied.size === 0) return;
  await updateVaultSyncState((state) => {
    const inbox = { ...state.inbox };
    for (const entity of applied) {
      // Keep an entry that a newer pull replaced while we were merging.
      if (inbox[entity]?.updatedAt === sync.inbox[entity]?.updatedAt) delete inbox[entity];
    }
    return { ...state, inbox };
  });
}

/** Confirms the passphrase (e.g. before showing a new recovery code). */
export async function verifyVaultPassphrase(passphrase: string): Promise<boolean> {
  const keyring = await readLocalKeyring();
  if (!keyring) throw new VaultError("vault-no-keyring");
  try {
    const dek = await unwrapWithPassphrase(backend, keyring, passphrase);
    wipeBytes(dek);
    return true;
  } catch (error) {
    if (error instanceof VaultError && error.code === "vault-wrong-passphrase") return false;
    throw error;
  }
}

/** Sets a new passphrase (the current one isn't needed — the device holds the DEK). */
export async function changeVaultPassphrase(
  passphrase: string,
  nowIso: string = new Date().toISOString(),
): Promise<void> {
  await withDek((dek) =>
    updateLocalKeyring(async (keyring) => {
      if (!keyring) throw new VaultError("vault-no-keyring");
      return {
        keyring: await rewrapPassphrase(backend, keyring, dek, passphrase, nowIso),
        result: undefined,
      };
    }),
  );
  notifyVaultChange("status");
}

/** Issues a new 24-word code; the previous one stops working. */
export async function regenerateVaultRecoveryCode(
  nowIso: string = new Date().toISOString(),
): Promise<{ recoveryWords: string[] }> {
  const recoveryWords = await withDek((dek) =>
    updateLocalKeyring(async (keyring) => {
      if (!keyring) throw new VaultError("vault-no-keyring");
      const next = await regenerateRecoveryCode(backend, keyring, dek, nowIso);
      return { keyring: next.keyring, result: next.recoveryWords };
    }),
  );
  notifyVaultChange("status");
  return { recoveryWords };
}

// ── Reset / wipe ────────────────────────────────────────────────────────────

/** Caller holds every vault lock (`withAllVaultLocks`). */
async function deleteVaultKeyLocked(): Promise<void> {
  try {
    // Files sealed under the key are useless without it (reset / start fresh).
    await wipeVaultFiles();
    await backend.deleteDek();
  } finally {
    if (cachedDek) wipeBytes(cachedDek);
    cachedDek = undefined;
  }
}

/** Deletes the DEK from SecureStore / IndexedDB (DB_KEYS ciphertext is cleared by resetDatabase). */
export async function deleteVaultKey(): Promise<void> {
  try {
    await withAllVaultLocks(deleteVaultKeyLocked);
  } finally {
    notifyAll();
  }
}

/**
 * "Start fresh": deletes every vault document, the keyring, the sync state and
 * the DEK on this device. Used when the vault is locked and neither the
 * passphrase nor the recovery code is available. Never touches the server.
 */
export async function resetVaultOnDevice(): Promise<void> {
  try {
    await withAllVaultLocks(async () => {
      await Promise.all([
        ...VAULT_DOC_IDS.map((docId) => removeKey(VAULT_DOC_STORAGE_KEYS[docId])),
        withKeyLock(DB_KEYS.vaultKeyring, () => removeKey(DB_KEYS.vaultKeyring)),
        withKeyLock(DB_KEYS.vaultSyncState, () => removeKey(DB_KEYS.vaultSyncState)),
      ]);
      await deleteVaultKeyLocked();
    });
  } finally {
    notifyAll();
  }
}

// ── Device-only encrypted files (never synced / backed up; see vault-files.ts) ─

/** Seals `bytes` under the DEK and stores them on this device as `fileId`. */
export async function putVaultFile(fileId: string, bytes: Uint8Array): Promise<void> {
  if (bytes.length > VAULT_MAX_FILE_BYTES) throw new VaultError("vault-too-large");
  await withDek((dek) => writeSealedFile(backend, dek, fileId, bytes), { create: true });
}

/** The decrypted bytes, or `null` when the file isn't on this device. */
export async function readVaultFile(fileId: string): Promise<Uint8Array | null> {
  return withDek((dek) => readSealedFile(backend, dek, fileId));
}

export async function deleteVaultFile(fileId: string): Promise<void> {
  await removeSealedFile(fileId);
}

/** The typed per-document API in one object (`vault.read<T>(docId)` …). */
export const vault = {
  read,
  write,
  update,
  subscribe,
  status: getVaultStatus,
} as const;
