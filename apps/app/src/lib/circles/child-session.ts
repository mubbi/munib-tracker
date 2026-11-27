/**
 * Child-device session (NF-3.16, D7).
 *
 * After the parent's QR is redeemed, this device holds a SCOPED child bearer
 * (`mtc_…`: write own fard status, read own signals + kids content). There is no
 * email and no password on the child's device; the parent can revoke it.
 *
 * - The token lives in SecureStore (Keychain/Keystore; AsyncStorage on web) via
 *   `platform-secure-storage`, never in a synced store or a backup.
 * - Profile meta + a small offline cache of the child's own daily statuses live
 *   in one device-local AsyncStorage key (not `DB_KEYS`: never backed up, never
 *   synced). Both are cleared by unlink, revocation and "Reset app data".
 * - D34 (consent pending after a transfer): the server refuses new data with a
 *   typed 403 `CHILD_CONSENT_PENDING`. Taps stay queued here (nothing lost, no
 *   punishing UI — the shell shows a calm "Waiting for your parent" note) and
 *   upload once a parent re-confirms. If the profile is deleted (30 days
 *   without consent) the session is revoked and the queue is discarded.
 */
import {
  CHILD_CONSENT_PENDING_CODE,
  type FardStatusValue,
  type GraduationPromptStage,
} from "@munib-tracker/shared/circles";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  deletePlatformSecureItem,
  getPlatformSecureItem,
  setPlatformSecureItem,
} from "@/lib/storage/platform-secure-storage";
import { createStore, useStore } from "@/stores/create-store";

import {
  type ChildProfile,
  circleErrorCode,
  circleErrorStatus,
  getChildMe,
  putChildFardStatus,
} from "./api";

export const CHILD_TOKEN_KEY = "munib.circleChildToken";
export const CHILD_SESSION_META_KEY = "@munib_tracker_circle_child_session_v1";

/** Days of the child's own statuses kept for offline display / retry. */
const CACHE_DAYS = 14;

export type ChildDayEntry = { value: FardStatusValue; pending: boolean };

export type ChildSessionMeta = {
  child: ChildProfile;
  linkedAt: string;
  days: Record<string, ChildDayEntry>;
  /** E13: the graduation prompt stage the child last dismissed ("Not now"). */
  graduationDismissed?: GraduationPromptStage | null;
};

type ChildSessionState = {
  status: "idle" | "loading" | "ready";
  token: string | null;
  meta: ChildSessionMeta | null;
};

export const childSessionStore = createStore<ChildSessionState>(() => ({
  status: "idle",
  token: null,
  meta: null,
}));

function pruneDays(
  days: Record<string, ChildDayEntry>,
  today = getLocalDateString(),
): Record<string, ChildDayEntry> {
  const oldest = addDays(today, -(CACHE_DAYS - 1));
  return Object.fromEntries(Object.entries(days).filter(([date]) => date >= oldest));
}

async function writeMeta(meta: ChildSessionMeta | null): Promise<void> {
  if (meta) await AsyncStorage.setItem(CHILD_SESSION_META_KEY, JSON.stringify(meta));
  else await AsyncStorage.removeItem(CHILD_SESSION_META_KEY);
}

async function readMeta(): Promise<ChildSessionMeta | null> {
  try {
    const raw = await AsyncStorage.getItem(CHILD_SESSION_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChildSessionMeta;
    return parsed?.child?.id && parsed.child.circleId ? parsed : null;
  } catch {
    return null;
  }
}

/** Load the persisted child session once (idempotent). */
export async function loadChildSession(): Promise<void> {
  const state = childSessionStore.getState();
  if (state.status !== "idle") return;
  childSessionStore.setState({ status: "loading" });
  const [token, meta] = await Promise.all([
    getPlatformSecureItem(CHILD_TOKEN_KEY).catch(() => null),
    readMeta(),
  ]);
  if (token && meta) {
    childSessionStore.setState({ status: "ready", token, meta });
  } else {
    // Half-written state (e.g. token lost from the keychain) → start clean.
    if (token || meta) await clearChildSession();
    childSessionStore.setState({ status: "ready", token: null, meta: null });
  }
}

export async function saveChildSession(token: string, child: ChildProfile): Promise<void> {
  const meta: ChildSessionMeta = { child, linkedAt: new Date().toISOString(), days: {} };
  await setPlatformSecureItem(CHILD_TOKEN_KEY, token);
  await writeMeta(meta);
  childSessionStore.setState({ status: "ready", token, meta });
}

/** Unlink this device (local only; the parent revokes server-side). */
export async function clearChildSession(): Promise<void> {
  await Promise.all([
    deletePlatformSecureItem(CHILD_TOKEN_KEY).catch(() => {}),
    AsyncStorage.removeItem(CHILD_SESSION_META_KEY).catch(() => {}),
  ]);
  childSessionStore.setState({ token: null, meta: null, status: "ready" });
}

async function updateMeta(patch: (meta: ChildSessionMeta) => ChildSessionMeta): Promise<void> {
  const { meta } = childSessionStore.getState();
  if (!meta) return;
  const next = patch(meta);
  childSessionStore.setState({ meta: next });
  await writeMeta(next);
}

/**
 * Refresh the profile (nickname, age band, reward) from `/circle-child/me`.
 * A 401/403/404 means the parent revoked or deleted it → unlink locally.
 */
export async function refreshChildProfile(): Promise<"ok" | "revoked" | "offline"> {
  const { token } = childSessionStore.getState();
  if (!token) return "revoked";
  try {
    const child = await getChildMe(token);
    await updateMeta((meta) => ({ ...meta, child }));
    // D34: consent re-confirmed → upload anything queued while it was pending.
    if (!child.consentPending && hasPendingDays()) await flushPendingChildStatuses();
    return "ok";
  } catch (error) {
    const status = circleErrorStatus(error);
    if (status === 401 || status === 403 || status === 404) {
      await clearChildSession();
      return "revoked";
    }
    return "offline";
  }
}

function hasPendingDays(): boolean {
  const { meta } = childSessionStore.getState();
  return Object.values(meta?.days ?? {}).some((entry) => entry.pending);
}

/** Record that the child dismissed the graduation prompt at `stage` (E13). */
export async function dismissGraduationPrompt(stage: GraduationPromptStage): Promise<void> {
  await updateMeta((meta) => ({ ...meta, graduationDismissed: stage }));
}

/**
 * The child taps a prayer: save locally (pending) then push the closed
 * `fard_status` signal. Offline taps stay pending and are retried by
 * {@link flushPendingChildStatuses}.
 */
export async function setChildDayStatus(date: string, value: FardStatusValue): Promise<void> {
  await updateMeta((meta) => ({
    ...meta,
    days: pruneDays({ ...meta.days, [date]: { value, pending: true } }),
  }));
  await flushPendingChildStatuses();
}

let flushing: Promise<void> | null = null;

export function flushPendingChildStatuses(): Promise<void> {
  if (flushing) return flushing;
  flushing = (async () => {
    try {
      const { token, meta } = childSessionStore.getState();
      if (!token || !meta) return;
      for (const [date, entry] of Object.entries(meta.days)) {
        if (!entry.pending) continue;
        try {
          await putChildFardStatus(token, meta.child.circleId, { date, ...entry.value });
          await updateMeta((m) => {
            const current = m.days[date];
            // A newer tap during the request stays pending.
            if (!current || current.value !== entry.value) return m;
            return { ...m, days: { ...m.days, [date]: { ...current, pending: false } } };
          });
        } catch (error) {
          const status = circleErrorStatus(error);
          if (status === 403 && circleErrorCode(error) === CHILD_CONSENT_PENDING_CODE) {
            // D34: keep everything queued; the shell shows a calm waiting note.
            await updateMeta((m) => ({ ...m, child: { ...m.child, consentPending: true } }));
            return;
          }
          if (status === 401 || status === 403 || status === 404) {
            await clearChildSession();
            return;
          }
          if (status === 400) {
            // Outside the writable window — drop it rather than retry forever.
            await updateMeta((m) => {
              const { [date]: _dropped, ...rest } = m.days;
              return { ...m, days: rest };
            });
            continue;
          }
          return; // offline: keep pending
        }
      }
    } finally {
      flushing = null;
    }
  })();
  return flushing;
}

export function useChildSession(): ChildSessionState {
  return useStore(childSessionStore, (s) => s);
}

export function useIsChildDevice(): boolean {
  return useStore(childSessionStore, (s) => s.token != null);
}

/** Test helper: reset the in-memory store. */
export function __resetChildSessionStoreForTests(): void {
  childSessionStore.setState({ status: "idle", token: null, meta: null });
}
