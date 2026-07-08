import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { deleteSecureItem, getSecureItem, setSecureItem } from "@/lib/storage/safe-secure-store";

/** Persisted auth session. Tokens live in the OS keychain on native, AsyncStorage on web. */
export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  accountType: "guest" | "user";
  userId: string;
  provider?: "google" | "apple" | "facebook";
}

const SESSION_KEY = "munib.session";
const DEVICE_ID_KEY = "munib.deviceId";

const isWeb = Platform.OS === "web";

// Native reads/writes go through safeSecureStore, which pins the keychain items
// to WHEN_UNLOCKED_THIS_DEVICE_ONLY so bearer tokens are never synced to iCloud
// Keychain or included in an encrypted device backup (from where they could be
// exfiltrated), and transparently migrates any legacy WHEN_UNLOCKED items.
async function getItem(key: string): Promise<string | null> {
  if (isWeb) return AsyncStorage.getItem(key);
  return getSecureItem(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(key, value);
    return;
  }
  await setSecureItem(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(key);
    return;
  }
  await deleteSecureItem(key);
}

export const SessionStore = {
  async get(): Promise<StoredSession | null> {
    try {
      const raw = await getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  },

  async set(session: StoredSession): Promise<void> {
    await setItem(SESSION_KEY, JSON.stringify(session));
  },

  async clear(): Promise<void> {
    await deleteItem(SESSION_KEY);
  },

  /** A stable per-install device id used to create/resume the guest session. */
  async getDeviceId(): Promise<string> {
    const existing = await getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    // The deviceId is a bearer credential for the guest account (it can create or
    // resume a session), so it must be cryptographically random and unguessable —
    // never Date.now()/Math.random(). expo-crypto is already a dependency.
    const id = `dev_${Crypto.randomUUID()}`;
    await setItem(DEVICE_ID_KEY, id);
    return id;
  },
};
