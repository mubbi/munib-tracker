import type { NotificationPreferences, UserPreferences } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import type { QuranPrefs } from "@/db/repositories/quran-repository";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Device preferences (NF-3.0b, settings audit B4): values that only make sense
 * on THIS device — never synced, never backed up (`DB_KEYS.devicePreferences`
 * is `deviceLocal`), wiped on reset.
 *
 * They used to live in the synced `UserPreferences` / `QuranPrefs`, so every
 * device copied every other device's haptics, cache toggles, volume, exact-alarm
 * state, Live Activity opt-in, gallery path and TTS voice ids. On first load the
 * legacy values are copied here once ({@link migrateDevicePreferences}); from
 * then on writes go here (the preferences and Qur'an stores divert them) and
 * readers see the device value first. The legacy fields are dropped from the
 * types one release later.
 */
export interface DevicePreferences {
  hapticsEnabled: boolean;
  cacheAudioLocally: boolean;
  cacheQuranEditionsLocally: boolean;
  cacheHadithLocally: boolean;
  /** 0–1 */
  audioVolume: number;
  preciseAdhan?: boolean;
  liveActivityEnabled?: boolean;
  avatarUri?: string;
  ttsVoiceByLang: Record<string, string>;
  /** "Finish setting up": when the app language was confirmed (ISO). */
  languageConfirmedAt?: string;
  /** "Finish setting up": when the calculation method was reviewed (ISO). */
  methodReviewedAt?: string;
  /**
   * First-run setup in progress (`lib/onboarding/setup-flow.ts`): the step to
   * resume after a restart (an RTL language switch reloads the app) and where
   * to go when it finishes. Cleared once the core steps are done.
   */
  setupProgress?: { step: string; next?: "/login" };
  /** "Keep current" on the suggested calculation method (`"PK:Karachi"`). */
  methodSuggestionDismissed?: string;
}

export const DEFAULT_DEVICE_PREFERENCES: DevicePreferences = {
  hapticsEnabled: true,
  cacheAudioLocally: true,
  cacheQuranEditionsLocally: true,
  cacheHadithLocally: true,
  audioVolume: 1,
  ttsVoiceByLang: {},
};

/** Top-level `UserPreferences` fields that are device preferences now. */
export const DEVICE_USER_PREF_KEYS = [
  "hapticsEnabled",
  "cacheAudioLocally",
  "cacheQuranEditionsLocally",
  "cacheHadithLocally",
  "audioVolume",
  "liveActivityEnabled",
  "avatarUri",
] as const satisfies readonly (keyof UserPreferences & keyof DevicePreferences)[];

export type DeviceUserPrefKey = (typeof DEVICE_USER_PREF_KEYS)[number];

/** Stored blob: only explicitly-set values, plus the one-time migration stamp. */
export type StoredDevicePreferences = Partial<DevicePreferences> & { migratedAt?: string };

type LegacyUser = Partial<Omit<UserPreferences, "notificationPrefs">> & {
  notificationPrefs?: Partial<NotificationPreferences>;
};

/**
 * Pure one-time migration: copies each legacy value into the device blob when
 * the device value is unset, then fills the required fields with defaults so a
 * later sync pull (from an older client still writing the legacy fields) can
 * never change this device. Idempotent once `migratedAt` is stamped.
 */
export function migrateDevicePreferences(
  stored: StoredDevicePreferences | null | undefined,
  legacyUser: LegacyUser | null | undefined,
  legacyQuran: Partial<QuranPrefs> | null | undefined,
  nowIso: string = new Date().toISOString(),
): StoredDevicePreferences {
  const current: StoredDevicePreferences = { ...(stored ?? {}) };
  if (current.migratedAt) return current;
  const next: StoredDevicePreferences = { ...current };
  const user = legacyUser ?? {};
  for (const key of DEVICE_USER_PREF_KEYS) {
    if (next[key] === undefined && user[key] !== undefined && user[key] !== null) {
      (next as Record<string, unknown>)[key] = user[key];
    }
  }
  if (
    next.preciseAdhan === undefined &&
    typeof user.notificationPrefs?.preciseAdhan === "boolean"
  ) {
    next.preciseAdhan = user.notificationPrefs.preciseAdhan;
  }
  if (next.ttsVoiceByLang === undefined && legacyQuran?.ttsVoiceByLang) {
    next.ttsVoiceByLang = { ...legacyQuran.ttsVoiceByLang };
  }
  return { ...DEFAULT_DEVICE_PREFERENCES, ...next, migratedAt: nowIso };
}

/** Device value first, then the legacy synced value, then the default. */
export function resolveDevicePreferences(
  device: Partial<DevicePreferences>,
  legacyUser?: LegacyUser | null,
  legacyQuran?: Partial<QuranPrefs> | null,
): DevicePreferences {
  const user = legacyUser ?? {};
  return {
    hapticsEnabled:
      device.hapticsEnabled ?? user.hapticsEnabled ?? DEFAULT_DEVICE_PREFERENCES.hapticsEnabled,
    cacheAudioLocally:
      device.cacheAudioLocally ??
      user.cacheAudioLocally ??
      DEFAULT_DEVICE_PREFERENCES.cacheAudioLocally,
    cacheQuranEditionsLocally:
      device.cacheQuranEditionsLocally ??
      user.cacheQuranEditionsLocally ??
      DEFAULT_DEVICE_PREFERENCES.cacheQuranEditionsLocally,
    cacheHadithLocally:
      device.cacheHadithLocally ??
      user.cacheHadithLocally ??
      DEFAULT_DEVICE_PREFERENCES.cacheHadithLocally,
    audioVolume: device.audioVolume ?? user.audioVolume ?? DEFAULT_DEVICE_PREFERENCES.audioVolume,
    preciseAdhan: device.preciseAdhan ?? user.notificationPrefs?.preciseAdhan,
    liveActivityEnabled: device.liveActivityEnabled ?? user.liveActivityEnabled,
    avatarUri: device.avatarUri ?? user.avatarUri,
    ttsVoiceByLang:
      device.ttsVoiceByLang ??
      legacyQuran?.ttsVoiceByLang ??
      DEFAULT_DEVICE_PREFERENCES.ttsVoiceByLang,
    languageConfirmedAt: device.languageConfirmedAt,
    methodReviewedAt: device.methodReviewedAt,
    setupProgress: device.setupProgress,
    methodSuggestionDismissed: device.methodSuggestionDismissed,
  };
}

/**
 * Splits a `UserPreferences` patch into its device part and the synced rest
 * (`notificationPrefs.preciseAdhan` is a device value too).
 */
export function splitDeviceUserPatch(patch: Partial<UserPreferences>): {
  device: Partial<DevicePreferences>;
  rest: Partial<UserPreferences>;
} {
  const device: Partial<DevicePreferences> = {};
  const rest: Partial<UserPreferences> = { ...patch };
  for (const key of DEVICE_USER_PREF_KEYS) {
    if (Object.hasOwn(rest, key)) {
      (device as Record<string, unknown>)[key] = rest[key];
      delete rest[key];
    }
  }
  if (rest.notificationPrefs && Object.hasOwn(rest.notificationPrefs, "preciseAdhan")) {
    const { preciseAdhan, ...notificationPrefs } = rest.notificationPrefs;
    device.preciseAdhan = preciseAdhan;
    rest.notificationPrefs = notificationPrefs as NotificationPreferences;
  }
  return { device, rest };
}

/**
 * The in-memory view readers see: legacy synced fields replaced by the device
 * values that are set. Never persisted into the synced blob.
 */
export function overlayDeviceOnUserPrefs(
  prefs: UserPreferences,
  device: Partial<DevicePreferences>,
): UserPreferences {
  let next: UserPreferences | null = null;
  for (const key of DEVICE_USER_PREF_KEYS) {
    const value = device[key];
    if (value !== undefined && prefs[key] !== value) {
      next ??= { ...prefs };
      (next as unknown as Record<string, unknown>)[key] = value;
    }
  }
  if (
    device.preciseAdhan !== undefined &&
    prefs.notificationPrefs.preciseAdhan !== device.preciseAdhan
  ) {
    next ??= { ...prefs };
    next.notificationPrefs = { ...prefs.notificationPrefs, preciseAdhan: device.preciseAdhan };
  }
  return next ?? prefs;
}

/** Same as {@link overlayDeviceOnUserPrefs} for the Qur'an prefs (`ttsVoiceByLang`). */
export function overlayDeviceOnQuranPrefs<T extends Partial<QuranPrefs>>(
  prefs: T,
  device: Partial<DevicePreferences>,
): T {
  if (device.ttsVoiceByLang === undefined || prefs.ttsVoiceByLang === device.ttsVoiceByLang) {
    return prefs;
  }
  return { ...prefs, ttsVoiceByLang: device.ttsVoiceByLang };
}

/** Strips the device fields from a preferences payload before it is pushed to the cloud. */
export function stripDevicePreferenceFields(
  prefs: Partial<UserPreferences>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...prefs };
  for (const key of DEVICE_USER_PREF_KEYS) delete out[key];
  if (prefs.notificationPrefs && Object.hasOwn(prefs.notificationPrefs, "preciseAdhan")) {
    const { preciseAdhan: _device, ...notificationPrefs } = prefs.notificationPrefs;
    out.notificationPrefs = notificationPrefs;
  }
  return out;
}

interface DevicePreferencesState {
  /** Explicitly-set device values (unset ⇒ readers fall back to legacy, then default). */
  prefs: Partial<DevicePreferences>;
  isReady: boolean;
  /** Hydrate (running the one-time legacy migration). */
  load: () => Promise<void>;
  update: (patch: Partial<DevicePreferences>) => Promise<void>;
}

let loading: Promise<void> | null = null;

function withoutStamp(stored: StoredDevicePreferences): Partial<DevicePreferences> {
  const { migratedAt: _stamp, ...prefs } = stored;
  return prefs;
}

export const devicePreferencesStore = createStore<DevicePreferencesState>((set, get) => ({
  prefs: {},
  isReady: false,

  load() {
    loading ??= (async () => {
      try {
        const stored = await readJSON<StoredDevicePreferences | null>(
          DB_KEYS.devicePreferences,
          null,
        );
        let next = stored ?? {};
        if (!stored?.migratedAt) {
          const [legacyUser, legacyQuran] = await Promise.all([
            readJSON<LegacyUser | null>(DB_KEYS.userPreferences, null),
            readJSON<Partial<QuranPrefs> | null>(DB_KEYS.quranPrefs, null),
          ]);
          next = migrateDevicePreferences(stored, legacyUser, legacyQuran);
          await writeJSON(DB_KEYS.devicePreferences, next);
        }
        set({ prefs: withoutStamp(next), isReady: true });
      } catch {
        set({ isReady: true });
      } finally {
        loading = null;
      }
    })();
    return loading;
  },

  async update(patch) {
    const prefs = { ...get().prefs, ...patch };
    set({ prefs });
    try {
      const stored = await readJSON<StoredDevicePreferences | null>(
        DB_KEYS.devicePreferences,
        null,
      );
      await writeJSON(DB_KEYS.devicePreferences, {
        migratedAt: stored?.migratedAt ?? new Date().toISOString(),
        ...prefs,
      } satisfies StoredDevicePreferences);
    } catch {
      // Quota / private mode — keep the in-memory value for this session.
    }
  },
}));

/** Current value of one device preference (device → legacy fallback is applied by the stores' overlay). */
export function getDevicePreference<K extends keyof DevicePreferences>(
  key: K,
): DevicePreferences[K] | undefined {
  return devicePreferencesStore.getState().prefs[key];
}

export function setDevicePreferences(patch: Partial<DevicePreferences>): Promise<void> {
  return devicePreferencesStore.getState().update(patch);
}

export function useDevicePreferences(): Partial<DevicePreferences> {
  return useStore(devicePreferencesStore, (s) => s.prefs);
}

/** Test / reset helper: forget in-memory device values (storage is cleared separately). */
export function resetDevicePreferencesStore(): void {
  loading = null;
  devicePreferencesStore.setState({ prefs: {}, isReady: false });
}
