import type { TasbeehAppearance } from "@munib-tracker/shared/types";
import { useMemo } from "react";

import { isTV } from "@/lib/platform/is-tv";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

import {
  mergeTasbeehAppearance,
  type ResolvedTasbeehAppearance,
  resolveTasbeehAppearance,
} from "./designs";

/** The stored (synced) appearance — `undefined` until the person picks a style (Ring, D10). */
export function useStoredTasbeehAppearance(): TasbeehAppearance | undefined {
  return useStore(preferencesStore, (s) => s.prefs.tasbeehAppearance);
}

/** The appearance to render on this device (defaults filled, TV-safe). */
export function useTasbeehAppearance(): ResolvedTasbeehAppearance {
  const stored = useStoredTasbeehAppearance();
  const tv = isTV();
  return useMemo(() => resolveTasbeehAppearance(stored, { tv }), [stored, tv]);
}

/**
 * Persists an edit through the synced `preferences` entity. Changes apply at
 * once (no Save button); older clients ignore the field.
 */
export function updateTasbeehAppearance(patch: Partial<TasbeehAppearance>): Promise<void> {
  const state = preferencesStore.getState();
  const next = mergeTasbeehAppearance(state.prefs.tasbeehAppearance, patch);
  return state.update({ tasbeehAppearance: next });
}
