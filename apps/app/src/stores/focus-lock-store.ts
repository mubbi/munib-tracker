import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { mergeEmergencyLog } from "@/lib/focus-lock/state";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.13 device-local focus-lock state (`DB_KEYS.focusLockDevice`, deviceLocal:
 * reset with the app, never synced or backed up). The synced part of the
 * feature is `UserPreferences.focusLock`; what lives here is specific to this
 * phone — whether setup finished, how many apps were picked, windows that ended
 * early, and the emergency-unlock log (shown only as a neutral weekly count).
 */
export interface FocusLockDeviceState {
  setupDone: boolean;
  appsCount: number;
  /** Window ids ended early (marked prayed / unlocked) — pruned to the last 2 days. */
  endedIds: string[];
  /** ISO times of emergency unlocks (last 35 days). */
  emergencyLog: string[];
}

export const EMPTY_FOCUS_LOCK_DEVICE: FocusLockDeviceState = {
  setupDone: false,
  appsCount: 0,
  endedIds: [],
  emergencyLog: [],
};

interface FocusLockStoreState extends FocusLockDeviceState {
  isReady: boolean;
  load: () => Promise<void>;
  patch: (patch: Partial<FocusLockDeviceState>) => Promise<void>;
  markEnded: (id: string) => Promise<void>;
  recordEmergency: (isoTimes: readonly string[]) => Promise<void>;
  /** Forget everything on this device (data reset path). */
  clear: () => Promise<void>;
}

/** Keep ended ids for windows of the last two local dates (ids start with `YYYY-MM-DD:`). */
export function pruneEndedIds(ids: readonly string[], today: string): string[] {
  const floor = addDays(today, -1);
  return [...new Set(ids)].filter((id) => {
    const date = id.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date >= floor : false;
  });
}

function sanitize(raw: unknown): FocusLockDeviceState {
  if (!raw || typeof raw !== "object") return EMPTY_FOCUS_LOCK_DEVICE;
  const v = raw as Partial<FocusLockDeviceState>;
  const strings = (x: unknown) =>
    Array.isArray(x) ? x.filter((s): s is string => typeof s === "string") : [];
  return {
    setupDone: v.setupDone === true,
    appsCount: typeof v.appsCount === "number" && v.appsCount > 0 ? Math.floor(v.appsCount) : 0,
    endedIds: strings(v.endedIds),
    emergencyLog: strings(v.emergencyLog),
  };
}

function persisted(s: FocusLockDeviceState): FocusLockDeviceState {
  return {
    setupDone: s.setupDone,
    appsCount: s.appsCount,
    endedIds: s.endedIds,
    emergencyLog: s.emergencyLog,
  };
}

export const focusLockStore = createStore<FocusLockStoreState>((set, get) => {
  async function write(next: (current: FocusLockDeviceState) => FocusLockDeviceState) {
    const saved = await updateJSON<FocusLockDeviceState>(
      DB_KEYS.focusLockDevice,
      EMPTY_FOCUS_LOCK_DEVICE,
      (current) => next(sanitize(current)),
    );
    set({ ...sanitize(saved), isReady: true });
  }

  return {
    ...EMPTY_FOCUS_LOCK_DEVICE,
    isReady: false,

    async load() {
      const raw = await readJSON<unknown>(DB_KEYS.focusLockDevice, EMPTY_FOCUS_LOCK_DEVICE);
      set({ ...sanitize(raw), isReady: true });
    },

    async patch(patch) {
      await write((current) => persisted({ ...current, ...patch }));
    },

    async markEnded(id) {
      if (get().endedIds.includes(id)) return;
      const today = getLocalDateString(new Date());
      await write((current) => ({
        ...current,
        endedIds: pruneEndedIds([...current.endedIds, id], today),
      }));
    },

    async recordEmergency(isoTimes) {
      if (isoTimes.length === 0) return;
      await write((current) => ({
        ...current,
        emergencyLog: mergeEmergencyLog(current.emergencyLog, isoTimes, new Date()),
      }));
    },

    async clear() {
      await write(() => EMPTY_FOCUS_LOCK_DEVICE);
    },
  };
});

export function useEnsureFocusLockLoaded(): void {
  useEffect(() => {
    if (!focusLockStore.getState().isReady) void focusLockStore.getState().load();
  }, []);
}

export function useFocusLockDevice(): FocusLockDeviceState & { isReady: boolean } {
  return useStore(focusLockStore, (s) => ({
    setupDone: s.setupDone,
    appsCount: s.appsCount,
    endedIds: s.endedIds,
    emergencyLog: s.emergencyLog,
    isReady: s.isReady,
  }));
}
