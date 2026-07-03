import { useCallback, useRef, useSyncExternalStore } from "react";

type Listener = () => void;

export type SetState<T> = (partial: Partial<T> | ((prev: T) => Partial<T>)) => void;

export interface Store<T> {
  getState: () => T;
  setState: SetState<T>;
  subscribe: (listener: Listener) => () => void;
}

/**
 * Minimal zustand-style store. Pure JS (no native dep) and backed by React's
 * `useSyncExternalStore`, so it works identically on iOS, Android, and Web.
 */
export function createStore<T extends object>(
  create: (set: SetState<T>, get: () => T) => T,
): Store<T> {
  let state: T;
  const listeners = new Set<Listener>();

  const getState = () => state;
  const setState: SetState<T> = (partial) => {
    const next = typeof partial === "function" ? partial(state) : partial;
    const merged = { ...state, ...next };
    // Skip the notification (and keep the reference stable) on no-op writes.
    if (shallowEqual(state, merged)) return;
    state = merged;
    for (const listener of listeners) listener();
  };
  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  state = create(setState, getState);
  return { getState, setState, subscribe };
}

function shallowEqual<S>(a: S, b: S): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return false;
  }
  const aKeys = Object.keys(a as object);
  const bKeys = Object.keys(b as object);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }
  return true;
}

/** Subscribe to a selected slice of a store, re-rendering only on shallow change. */
export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  const cache = useRef<{ value: S } | null>(null);
  const getSnapshot = useCallback(() => {
    const next = selector(store.getState());
    if (cache.current && shallowEqual(cache.current.value, next)) {
      return cache.current.value;
    }
    cache.current = { value: next };
    return next;
  }, [store, selector]);
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
