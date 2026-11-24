/**
 * Web storage for sealed vault files: an IndexedDB object store (ciphertext
 * only; see `vault-files.ts`). Same API as the native `vault-file-store.ts`.
 * Never backed up, never synced.
 */
const DB_NAME = "munib-vault-files";
const STORE = "files";
const NAME_RE = /^[\w-]{1,80}$/;

let dbPromise: Promise<IDBDatabase> | null = null;

function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexeddb"));
  });
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("indexeddb-unavailable"));
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
  };
  dbPromise = idbRequest(request).catch((error) => {
    dbPromise = null;
    throw error;
  });
  return dbPromise;
}

async function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  return idbRequest(run(db.transaction(STORE, mode).objectStore(STORE)));
}

function checkName(name: string): string {
  if (!NAME_RE.test(name)) throw new Error("vault-file-name");
  return name;
}

export async function putFile(name: string, bytes: Uint8Array): Promise<void> {
  await withStore("readwrite", (s) => s.put(bytes, checkName(name)));
}

export async function getFile(name: string): Promise<Uint8Array | null> {
  const value = await withStore("readonly", (s) => s.get(checkName(name)));
  return value instanceof Uint8Array ? value : null;
}

export async function deleteFile(name: string): Promise<void> {
  await withStore("readwrite", (s) => s.delete(checkName(name)));
}

export async function listFiles(): Promise<string[]> {
  const keys = await withStore("readonly", (s) => s.getAllKeys());
  return keys.filter((k): k is string => typeof k === "string");
}

export async function wipeFiles(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  await withStore("readwrite", (s) => s.clear());
}
