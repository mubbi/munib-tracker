import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { TaughtPattern } from "@/lib/tasbeeh-voice/matcher";
import {
  capPatterns,
  decodePattern,
  encodePattern,
  type StoredPatterns,
  sanitizeStoredPatterns,
  toStoredFile,
} from "@/lib/tasbeeh-voice/template-store";

import { createStore, useStore } from "./create-store";

/**
 * Taught zikr voice patterns for hands-free tasbeeh (NF-3.20, D48): per zikr
 * (`voiceZikrKey`), the numeric features of 1–3 samples — never audio.
 * `deviceLocal`: never synced, uploaded or backed up; cleared by Reset app data
 * (derived from `KEY_PERSISTENCE`) and by "Forget taught zikr voices".
 */

interface TemplatesState {
  patterns: StoredPatterns;
  isReady: boolean;
  load: () => Promise<void>;
  /** Save (or replace) what was taught for one zikr. */
  save: (key: string, pattern: TaughtPattern) => Promise<void>;
  /** Forget one zikr's pattern, or every pattern when no key is given. */
  forget: (key?: string) => Promise<void>;
}

export const tasbeehVoiceTemplatesStore = createStore<TemplatesState>((set, get) => {
  const persist = async (patterns: StoredPatterns) => {
    set({ patterns });
    await writeJSON(DB_KEYS.tasbeehVoiceTemplates, toStoredFile(patterns));
  };
  return {
    patterns: {},
    isReady: false,
    async load() {
      const raw = await readJSON<unknown>(DB_KEYS.tasbeehVoiceTemplates, null);
      set({ patterns: sanitizeStoredPatterns(raw), isReady: true });
    },
    async save(key, pattern) {
      if (!get().isReady) await get().load();
      const next = capPatterns({
        ...get().patterns,
        [key]: encodePattern(pattern, new Date().toISOString()),
      });
      await persist(next);
    },
    async forget(key) {
      if (!get().isReady) await get().load();
      if (!key) {
        await persist({});
        return;
      }
      const next = { ...get().patterns };
      delete next[key];
      await persist(next);
    },
  };
});

/** The decoded pattern for a zikr, or null when it hasn't been taught on this device. */
export function taughtPatternFor(key: string | null | undefined): TaughtPattern | null {
  if (!key) return null;
  return decodePattern(tasbeehVoiceTemplatesStore.getState().patterns[key]);
}

export function useEnsureTasbeehVoiceTemplatesLoaded(): void {
  useEffect(() => {
    if (!tasbeehVoiceTemplatesStore.getState().isReady) {
      void tasbeehVoiceTemplatesStore.getState().load();
    }
  }, []);
}

/** Whether a zikr has a taught voice pattern on this device. */
export function useIsZikrTaught(key: string | null | undefined): boolean {
  return useStore(tasbeehVoiceTemplatesStore, (s) => (key ? key in s.patterns : false));
}

/** Keys of every taught zikr (most recent first). */
export function useTaughtZikrKeys(): string[] {
  return useStore(tasbeehVoiceTemplatesStore, (s) =>
    Object.entries(s.patterns)
      .sort((a, b) => b[1].at.localeCompare(a[1].at))
      .map(([key]) => key),
  );
}

export function useHasTaughtZikrs(): boolean {
  return useStore(tasbeehVoiceTemplatesStore, (s) => Object.keys(s.patterns).length > 0);
}
