import { useEffect, useSyncExternalStore } from "react";

/**
 * Boot brand color — matches native splash / PWA theme until the first real
 * destination (intro or home) has painted.
 */
export const BOOT_BACKGROUND = "#152921";

let painted = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): boolean {
  return painted;
}

function getServerSnapshot(): boolean {
  return false;
}

/** Call once the first user-facing destination screen has mounted. */
export function markColdStartReady(): void {
  if (painted) return;
  painted = true;
  for (const listener of listeners) {
    listener();
  }
}

export function useColdStartReady(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Marks cold start ready on mount of intro / home (or other first destinations). */
export function useMarkColdStartReady(): void {
  useEffect(() => {
    markColdStartReady();
  }, []);
}

/** Jest-only: reset module state between tests. */
export function __resetColdStartForTests(): void {
  painted = false;
  for (const listener of listeners) {
    listener();
  }
}
