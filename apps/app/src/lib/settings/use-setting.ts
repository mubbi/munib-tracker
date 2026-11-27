import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

import { getSetting, isSettingEnabled, settingValuesEqual } from "./registry";
import { runSideEffects } from "./side-effects";
import { getSettingsSnapshot, subscribeSettings } from "./snapshot";
import type { AnySettingDef, SettingId, SettingsSnapshot } from "./types";

/**
 * Subscribe to a derived slice of every settings store. Re-renders only when the
 * selected value changes (structural compare), so a long settings screen doesn't
 * repaint every row on each write.
 */
export function useSettingsSelector<T>(selector: (snapshot: SettingsSnapshot) => T): T {
  "use no memo";
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const cache = useRef<{ value: T } | null>(null);
  const getSnapshot = useCallback(() => {
    const next = selectorRef.current(getSettingsSnapshot());
    if (cache.current && settingValuesEqual(cache.current.value, next)) return cache.current.value;
    cache.current = { value: next };
    return next;
  }, []);
  return useSyncExternalStore(subscribeSettings, getSnapshot, getSnapshot);
}

export interface UseSettingResult<V> {
  value: V;
  /** The single write path: store action + declared side effects (reschedule…). */
  setValue: (value: V) => Promise<void>;
  def: AnySettingDef;
  enabled: boolean;
}

/** Write a setting through its def and run its side effects (non-hook form). */
export async function writeSetting(def: AnySettingDef, value: unknown): Promise<void> {
  await def.write(value);
  await runSideEffects(def.sideEffects);
}

/**
 * `useSetting(id)` → `{ value, setValue, def, enabled }` (§4.5.4). Settings rows
 * and every in-context shortcut use this so both places share one value, one
 * validation path and one set of side effects.
 */
export function useSetting<V = unknown>(id: SettingId): UseSettingResult<V> {
  const def = getSetting(id);
  if (!def) throw new Error(`Unknown setting: ${id}`);
  const value = useSettingsSelector((s) => def.read(s) as V);
  const enabled = useSettingsSelector((s) => isSettingEnabled(def, s));
  const setValue = useCallback((next: V) => writeSetting(def, next), [def]);
  return useMemo(() => ({ value, setValue, def, enabled }), [value, setValue, def, enabled]);
}
