import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";
import {
  type DeviceCalibration,
  sanitizeDeviceCalibration,
} from "@/lib/quran-pronunciation/calibration";
import { clampCalibrationOffset } from "@/lib/quran-pronunciation/verdict";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.24 device-local calibration ("Read this ayah once to calibrate"): one
 * offset that relaxes the flag thresholds for THIS device's microphone and
 * voice. `deviceLocal` — never synced, never backed up, cleared by Reset app
 * data (derived from `KEY_PERSISTENCE`). No audio or scores are kept.
 */

interface CalibrationState {
  calibration: DeviceCalibration | null;
  isReady: boolean;
  load: () => Promise<void>;
  setOffset: (offset: number) => Promise<void>;
  clear: () => Promise<void>;
}

export const pronunciationCalibrationStore = createStore<CalibrationState>((set, get) => ({
  calibration: null,
  isReady: false,
  async load() {
    const raw = await readJSON<unknown>(DB_KEYS.quranPronunciationCalibration, null);
    set({ calibration: sanitizeDeviceCalibration(raw), isReady: true });
  },
  async setOffset(offset) {
    if (!get().isReady) await get().load();
    const next: DeviceCalibration = {
      offset: clampCalibrationOffset(offset),
      at: new Date().toISOString(),
    };
    set({ calibration: next });
    await writeJSON(DB_KEYS.quranPronunciationCalibration, next);
  },
  async clear() {
    set({ calibration: null });
    await removeKey(DB_KEYS.quranPronunciationCalibration);
  },
}));

export function useEnsurePronunciationCalibrationLoaded(): void {
  useEffect(() => {
    if (!pronunciationCalibrationStore.getState().isReady) {
      void pronunciationCalibrationStore.getState().load();
    }
  }, []);
}

export function usePronunciationCalibration(): DeviceCalibration | null {
  return useStore(pronunciationCalibrationStore, (s) => s.calibration);
}
