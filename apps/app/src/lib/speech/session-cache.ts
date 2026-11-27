import { AppState, type AppStateStatus } from "react-native";

import type { LoadedModelAssets } from "@/lib/quran-companion/model/types";

import type { OrtInferenceSession } from "./fastconformer-runner";

/**
 * Ref-counted cache of the large on-device speech sessions (FastConformer
 * ≈ 88 MB, Zipformer ≈ 69 MB). Qur'an practice, the pronunciation check and
 * hands-free tasbeeh all open the same FastConformer model; without this each
 * one created its own ORT session (model weights + optimised graph + arena) and
 * switching features re-paid the load, optimisation and warm-up every time.
 *
 * - `acquireSpeechSession(key, create)` returns a *lease*: the shared session
 *   behind a `release()` that only drops this holder's reference.
 * - When the last lease is released the session stays warm for
 *   {@link SPEECH_SESSION_IDLE_MS}, then is released. Going to the background
 *   releases idle sessions at once (the OS reclaims memory from background apps
 *   first, and iOS may kill us for it).
 * - Before a session for a different model is created, every idle session is
 *   released first, so at most one large *idle* session is ever alive. Sessions
 *   still held by a feature are never pulled out from under it.
 * - `run` calls on a shared session are serialised (ORT web runs on a single
 *   wasm instance; native sessions are thread-safe but two concurrent runs would
 *   only compete for the same intra-op threads).
 */

export type SpeechSession = OrtInferenceSession;

/** How long an unused session stays warm. */
export const SPEECH_SESSION_IDLE_MS = 60_000;

type Entry = {
  key: string;
  ready: Promise<SpeechSession>;
  session: SpeechSession | null;
  refs: number;
  idleTimer: ReturnType<typeof setTimeout> | null;
  /** Tail of the serialised `run` queue. */
  queue: Promise<unknown>;
};

const entries = new Map<string, Entry>();
let appStateArmed = false;

function armAppState(): void {
  if (appStateArmed) return;
  appStateArmed = true;
  try {
    AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "background") void releaseIdleSpeechSessions();
    });
  } catch {
    // No AppState (non-RN test host): idle timers still apply.
  }
}

async function disposeEntry(entry: Entry): Promise<void> {
  if (entries.get(entry.key) === entry) entries.delete(entry.key);
  if (entry.idleTimer) clearTimeout(entry.idleTimer);
  entry.idleTimer = null;
  let session: SpeechSession | null = null;
  try {
    session = await entry.ready;
  } catch {
    return; // never created
  }
  try {
    await session.release?.();
  } catch {
    // already released
  }
}

/** Release every session no feature holds (optionally keeping `exceptKey`). */
export async function releaseIdleSpeechSessions(exceptKey?: string): Promise<void> {
  const idle = [...entries.values()].filter((e) => e.refs === 0 && e.key !== exceptKey);
  await Promise.all(idle.map(disposeEntry));
}

function dropRef(entry: Entry): void {
  entry.refs = Math.max(0, entry.refs - 1);
  if (entry.refs > 0 || entries.get(entry.key) !== entry) return;
  if (AppState.currentState === "background") {
    void disposeEntry(entry);
    return;
  }
  entry.idleTimer = setTimeout(() => {
    entry.idleTimer = null;
    if (entry.refs === 0) void disposeEntry(entry);
  }, SPEECH_SESSION_IDLE_MS);
  // Node hosts (tests, eval scripts): an idle timer must not keep the process alive.
  (entry.idleTimer as { unref?: () => void }).unref?.();
}

function lease(entry: Entry, session: SpeechSession): SpeechSession {
  let released = false;
  return {
    get outputNames() {
      return session.outputNames;
    },
    get inputNames() {
      return session.inputNames;
    },
    run(feeds) {
      if (released) return Promise.reject(new Error("speech session released"));
      const next = entry.queue.then(() => session.run(feeds));
      entry.queue = next.catch(() => undefined);
      return next;
    },
    async release() {
      if (released) return;
      released = true;
      dropRef(entry);
    },
  };
}

/**
 * Lease the session for `key`, creating it with `create` when none is cached.
 * `create` should also warm the session up (it runs once per session). Rejects
 * with `create`'s error; a failed creation is not cached.
 */
export async function acquireSpeechSession(
  key: string,
  create: () => Promise<SpeechSession>,
): Promise<SpeechSession> {
  armAppState();
  let entry = entries.get(key);
  if (!entry) {
    const created: Entry = {
      key,
      ready: Promise.resolve(null as never),
      session: null,
      refs: 0,
      idleTimer: null,
      queue: Promise.resolve(),
    };
    // Free idle sessions of other models before loading another large one.
    created.ready = releaseIdleSpeechSessions(key)
      .then(create)
      .then((session) => {
        created.session = session;
        return session;
      });
    created.ready.catch(() => {
      if (entries.get(key) === created) entries.delete(key);
    });
    entries.set(key, created);
    entry = created;
  }
  entry.refs += 1;
  if (entry.idleTimer) {
    clearTimeout(entry.idleTimer);
    entry.idleTimer = null;
  }
  try {
    return lease(entry, await entry.ready);
  } catch (error) {
    entry.refs = Math.max(0, entry.refs - 1);
    throw error;
  }
}

/** Cached sessions and their holder counts (diagnostics / tests). */
export function speechSessionStats(): { key: string; refs: number }[] {
  return [...entries.values()].map(({ key, refs }) => ({ key, refs }));
}

/** FNV-1a over a few slices of the model bytes (web: no path to key on). */
function bytesFingerprint(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  const slice = 4096;
  const starts = [0, Math.max(0, (view.length >> 1) - slice / 2), Math.max(0, view.length - slice)];
  let hash = 0x811c9dc5;
  for (const start of starts) {
    const end = Math.min(view.length, start + slice);
    for (let i = start; i < end; i++) {
      hash ^= view[i];
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
  }
  return hash.toString(16);
}

/**
 * Cache key for the model in `assets`: the file path on native; on the web
 * (bytes only) the size plus a fingerprint. The pinned models are
 * SHA-256-checked by the model store, so equal keys mean the same weights.
 */
export function speechSessionKey(assets: LoadedModelAssets): string | null {
  if (assets.modelPath) return `path:${assets.modelPath}`;
  if (assets.modelBytes)
    return `bytes:${assets.modelBytes.byteLength}:${bytesFingerprint(assets.modelBytes)}`;
  return null;
}
