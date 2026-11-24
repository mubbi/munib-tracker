import type {
  UmrahHairChoice,
  UmrahRoundKind,
  UmrahSession,
  UmrahSessionMap,
  UmrahStep,
  UmrahTravelMode,
} from "@munib-tracker/shared/types";
import {
  activeUmrahSession,
  advanceUmrahSession,
  asUmrahSessionMap,
  backUmrahSession,
  countUmrahRound,
  createUmrahSession,
  currentUmrahSession,
  goToUmrahStep,
  setUmrahHairChoice,
  setUmrahTravel,
  undoUmrahRound,
} from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { createId } from "@/db/id";
import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Umrah mode sessions (NF-3.4) — a map of id → session, synced as the blob
 * entity `umrah_sessions` with a per-session last-write-wins merge
 * (`mergeUmrahSessions`). It sits beside the `umrah_checklist` store and never
 * replaces it. Offline-first: every action is a local AsyncStorage write.
 *
 * All transitions are the pure functions in `@munib-tracker/shared/utils`
 * (`umrah-session.ts`); this store only persists their results.
 */

const STORAGE_KEY = DB_KEYS.umrahSessions;

interface UmrahSessionState {
  /** Every session including tombstones (use the selectors). */
  sessions: UmrahSessionMap;
  isReady: boolean;
  load: () => Promise<void>;
  /** Starts a new session (the current one, if any, is kept as-is). */
  start: () => Promise<UmrahSession>;
  /** Applies a pure transition to the active session and persists it. */
  update: (transform: (session: UmrahSession, now: string) => UmrahSession) => Promise<void>;
  /** Tombstones the current session ("End Umrah mode"). */
  discardActive: () => Promise<void>;
}

function nowIso(): string {
  return new Date().toISOString();
}

export const umrahSessionStore = createStore<UmrahSessionState>((set, get) => ({
  sessions: {},
  isReady: false,

  async load() {
    const raw = await readJSON<unknown>(STORAGE_KEY, {});
    set({ sessions: asUmrahSessionMap(raw), isReady: true });
  },

  async start() {
    const session = createUmrahSession(createId("umrah"), nowIso());
    const next = await updateJSON<UmrahSessionMap>(STORAGE_KEY, {}, (stored) => ({
      ...asUmrahSessionMap(stored),
      [session.id]: session,
    }));
    set({ sessions: next, isReady: true });
    return session;
  },

  async update(transform) {
    const active = currentUmrahSession(get().sessions, new Date());
    if (!active) return;
    const next = await updateJSON<UmrahSessionMap>(STORAGE_KEY, {}, (stored) => {
      const current = asUmrahSessionMap(stored);
      const session = current[active.id] ?? active;
      const changed = transform(session, nowIso());
      if (changed === session) return current;
      current[active.id] = changed;
      return current;
    });
    set({ sessions: next, isReady: true });
  },

  async discardActive() {
    await get().update((session, now) => ({ ...session, deleted: true, updatedAt: now }));
  },
}));

export function useEnsureUmrahSessionsLoaded(): void {
  useEffect(() => {
    if (!umrahSessionStore.getState().isReady) void umrahSessionStore.getState().load();
  }, []);
}

export function useUmrahSessionsReady(): boolean {
  return useStore(umrahSessionStore, (s) => s.isReady);
}

/** The session in progress (null when none). */
export function useActiveUmrahSession(): UmrahSession | null {
  return useStore(umrahSessionStore, (s) => activeUmrahSession(s.sessions));
}

/** What the screen shows: the active session, or one completed in the last 12 h. */
export function useCurrentUmrahSession(): UmrahSession | null {
  return useStore(umrahSessionStore, (s) => currentUmrahSession(s.sessions, new Date()));
}

/** All rows including tombstones (pass to the pure selectors). */
export function useUmrahSessions(): UmrahSessionMap {
  return useStore(umrahSessionStore, (s) => s.sessions);
}

const update = (transform: (session: UmrahSession, now: string) => UmrahSession) =>
  umrahSessionStore.getState().update(transform);

/** Stable action singleton — also importable outside React (tests, deep links). */
export const umrahSessionActions = {
  load: () => umrahSessionStore.getState().load(),
  start: () => umrahSessionStore.getState().start(),
  discard: () => umrahSessionStore.getState().discardActive(),
  advance: () => update(advanceUmrahSession),
  back: () => update(backUmrahSession),
  goTo: (step: UmrahStep) => update((session, now) => goToUmrahStep(session, step, now)),
  countRound: (kind: UmrahRoundKind) =>
    update((session, now) => countUmrahRound(session, kind, now)),
  undoRound: (kind: UmrahRoundKind) => update((session, now) => undoUmrahRound(session, kind, now)),
  setTravel: (patch: { travelMode?: UmrahTravelMode; flightMiqatAt?: string | null }) =>
    update((session, now) => setUmrahTravel(session, patch, now)),
  setHairChoice: (choice: UmrahHairChoice) =>
    update((session, now) => setUmrahHairChoice(session, choice, now)),
} as const;

/** Stable action singleton (does not subscribe). */
export function useUmrahSessionActions() {
  return umrahSessionActions;
}
