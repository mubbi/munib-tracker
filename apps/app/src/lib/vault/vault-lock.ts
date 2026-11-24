import { useEffect } from "react";
import { AppState } from "react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { createStore, useStore } from "@/stores/create-store";

/**
 * "Lock private journals" (plan §4.2 Lock): when on, and the app PIN lock is
 * set up, every vault screen asks for the PIN (or biometrics) first.
 *
 * Device-scoped (`DB_KEYS.vaultLockJournals`, `deviceLocal`): it guards this
 * device's PIN, which is itself device-local in SecureStore, so syncing it
 * would turn the lock on for devices that have no PIN to unlock with.
 *
 * Once unlocked, vault screens stay open for {@link VAULT_UNLOCK_GRACE_MS} or
 * until the app goes to the background, whichever is first.
 */
export const VAULT_UNLOCK_GRACE_MS = 5 * 60_000;

interface VaultLockPrefState {
  lockJournals: boolean;
  isReady: boolean;
  load: () => Promise<void>;
  setLockJournals: (value: boolean) => Promise<void>;
}

export const vaultLockPrefStore = createStore<VaultLockPrefState>((set) => ({
  lockJournals: false,
  isReady: false,
  async load() {
    set({ lockJournals: await readJSON<boolean>(DB_KEYS.vaultLockJournals, false), isReady: true });
  },
  async setLockJournals(value) {
    await writeJSON(DB_KEYS.vaultLockJournals, value);
    set({ lockJournals: value, isReady: true });
    if (!value) clearVaultUnlockSession();
  },
}));

export function useVaultLockJournals(): boolean {
  useEffect(() => {
    if (!vaultLockPrefStore.getState().isReady) void vaultLockPrefStore.getState().load();
  }, []);
  return useStore(vaultLockPrefStore, (s) => s.lockJournals);
}

const vaultLockActions = {
  setLockJournals: (value: boolean) => vaultLockPrefStore.getState().setLockJournals(value),
} as const;

export function useVaultLockActions() {
  return vaultLockActions;
}

// ── Unlock session ──────────────────────────────────────────────────────────

let unlockedAt: number | null = null;
let appStateWired = false;

function wireAppState(): void {
  if (appStateWired) return;
  appStateWired = true;
  AppState.addEventListener("change", (next) => {
    if (next !== "active") clearVaultUnlockSession();
  });
}

export function markVaultUnlocked(now: number = Date.now()): void {
  wireAppState();
  unlockedAt = now;
}

export function clearVaultUnlockSession(): void {
  unlockedAt = null;
}

export function isVaultSessionUnlocked(now: number = Date.now()): boolean {
  return unlockedAt != null && now - unlockedAt < VAULT_UNLOCK_GRACE_MS;
}

/**
 * Pure decision: prompt for the app PIN before a vault screen? Only when the
 * pref is on **and** a PIN exists (web and devices without a PIN can't prompt —
 * the settings row should say "set up app lock first").
 */
export function shouldPromptVaultUnlock(input: {
  lockJournals: boolean;
  pinEnabled: boolean;
  sessionUnlocked: boolean;
}): boolean {
  return input.lockJournals && input.pinEnabled && !input.sessionUnlocked;
}
