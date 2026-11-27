import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { clampOffset, type TasbeehVoiceCalibration } from "@/lib/tasbeeh-voice/gate";
import { isPhraseKey, type PhraseKey } from "@/lib/tasbeeh-voice/phrases";

import { createStore, useStore } from "./create-store";

/**
 * Hands-free tasbeeh personal calibration (NF-3.20): one threshold offset per
 * phrase, for THIS device's microphone and voice. `deviceLocal` — never synced,
 * never backed up, cleared by Reset app data (derived from `KEY_PERSISTENCE`).
 * No audio or scores are kept, only the offset and when it was set.
 */

interface CalibrationState {
  calibration: TasbeehVoiceCalibration;
  isReady: boolean;
  load: () => Promise<void>;
  setOffset: (phrase: PhraseKey, thresholdOffset: number) => Promise<void>;
  clear: (phrase?: PhraseKey) => Promise<void>;
}

function sanitize(value: unknown): TasbeehVoiceCalibration {
  if (!value || typeof value !== "object") return {};
  const out: TasbeehVoiceCalibration = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!isPhraseKey(key) || !entry || typeof entry !== "object") continue;
    const { thresholdOffset, at } = entry as { thresholdOffset?: unknown; at?: unknown };
    if (typeof thresholdOffset !== "number" || typeof at !== "string") continue;
    out[key] = { thresholdOffset: clampOffset(thresholdOffset), at };
  }
  return out;
}

export const tasbeehVoiceCalibrationStore = createStore<CalibrationState>((set, get) => ({
  calibration: {},
  isReady: false,
  async load() {
    const raw = await readJSON<unknown>(DB_KEYS.tasbeehVoiceCalibration, {});
    set({ calibration: sanitize(raw), isReady: true });
  },
  async setOffset(phrase, thresholdOffset) {
    if (!get().isReady) await get().load();
    const next: TasbeehVoiceCalibration = {
      ...get().calibration,
      [phrase]: { thresholdOffset: clampOffset(thresholdOffset), at: new Date().toISOString() },
    };
    set({ calibration: next });
    await writeJSON(DB_KEYS.tasbeehVoiceCalibration, next);
  },
  async clear(phrase) {
    if (!get().isReady) await get().load();
    const next: TasbeehVoiceCalibration = { ...get().calibration };
    if (phrase) delete next[phrase];
    else for (const key of Object.keys(next)) delete next[key as PhraseKey];
    set({ calibration: next });
    await writeJSON(DB_KEYS.tasbeehVoiceCalibration, next);
  },
}));

export function useEnsureTasbeehVoiceCalibrationLoaded(): void {
  useEffect(() => {
    if (!tasbeehVoiceCalibrationStore.getState().isReady) {
      void tasbeehVoiceCalibrationStore.getState().load();
    }
  }, []);
}

export function useTasbeehVoiceCalibration(): TasbeehVoiceCalibration {
  return useStore(tasbeehVoiceCalibrationStore, (s) => s.calibration);
}
