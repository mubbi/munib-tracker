import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";
import { deleteSecureItem, getSecureItem, setSecureItem } from "@/lib/storage/safe-secure-store";

/**
 * Persisted auth session. Tokens live in the OS keychain on native.
 *
 * Web: after Google/Apple sign-in the API sets HttpOnly cookies (`mt_access_token`,
 * `mt_refresh_token`). We store only session metadata plus the `"cookie"` marker
 * so `credentials: "include"` requests authenticate without exposing JWTs to JS.
 * Guest sessions on web still keep short-lived tokens in sessionStorage for the
 * guest bootstrap path.
 */
export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  accountType: "guest" | "user";
  userId: string;
  provider?: "google" | "apple" | "facebook";
}

const SESSION_KEY = "munib.session";
const DEVICE_ID_KEY = "munib.deviceId";
const WEB_ACCESS_KEY = "munib.accessSession";
const WEB_REFRESH_KEY = "munib.refreshSession";
const WEB_META_KEY = "munib.sessionMeta";
const COOKIE_MARKER = "cookie" as const; // keep in sync with WEB_COOKIE_SESSION_TOKEN

const isWeb = Platform.OS === "web";

async function getNativeItem(key: string): Promise<string | null> {
  return getSecureItem(key);
}

async function setNativeItem(key: string, value: string): Promise<boolean> {
  return setSecureItem(key, value);
}

async function deleteNativeItem(key: string): Promise<void> {
  await deleteSecureItem(key);
}

function readWebAccess(): string | null {
  try {
    return sessionStorage.getItem(WEB_ACCESS_KEY);
  } catch {
    return null;
  }
}

function writeWebAccess(value: string | null): void {
  try {
    if (value == null) sessionStorage.removeItem(WEB_ACCESS_KEY);
    else sessionStorage.setItem(WEB_ACCESS_KEY, value);
  } catch {
    // private mode / quota — treat as failed persist below
  }
}

function readWebRefresh(): string | null {
  try {
    return sessionStorage.getItem(WEB_REFRESH_KEY);
  } catch {
    return null;
  }
}

function writeWebRefresh(value: string | null): void {
  try {
    if (value == null) sessionStorage.removeItem(WEB_REFRESH_KEY);
    else sessionStorage.setItem(WEB_REFRESH_KEY, value);
  } catch {
    // ignore
  }
}

function readWebMeta(): Omit<StoredSession, "accessToken" | "refreshToken"> | null {
  try {
    const raw = sessionStorage.getItem(WEB_META_KEY);
    return raw ? (JSON.parse(raw) as Omit<StoredSession, "accessToken" | "refreshToken">) : null;
  } catch {
    return null;
  }
}

function writeWebMeta(meta: Omit<StoredSession, "accessToken" | "refreshToken"> | null): void {
  try {
    if (meta == null) sessionStorage.removeItem(WEB_META_KEY);
    else sessionStorage.setItem(WEB_META_KEY, JSON.stringify(meta));
  } catch {
    // ignore
  }
}

export class SessionPersistError extends Error {
  constructor(message = "Failed to persist session to secure storage") {
    super(message);
    this.name = "SessionPersistError";
  }
}

export const SessionStore = {
  async get(): Promise<StoredSession | null> {
    try {
      if (isWeb) {
        const meta = readWebMeta();
        const accessToken = readWebAccess();
        if (!meta || !accessToken) return null;
        if (accessToken === COOKIE_MARKER) {
          return {
            ...meta,
            accessToken: COOKIE_MARKER,
            refreshToken: COOKIE_MARKER,
          };
        }
        const refreshToken = readWebRefresh();
        if (!refreshToken) return null;
        return { ...meta, accessToken, refreshToken };
      }
      const raw = await getNativeItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  },

  /**
   * Persists the session. Throws {@link SessionPersistError} when the native
   * keychain write is dropped (e.g. device locked) so callers do not treat a
   * rotated refresh token as safely stored.
   */
  async set(session: StoredSession): Promise<void> {
    if (isWeb) {
      const meta = {
        accountType: session.accountType,
        userId: session.userId,
        provider: session.provider,
      };
      writeWebMeta(meta);
      writeWebAccess(session.accessToken);
      if (session.accessToken === COOKIE_MARKER) {
        writeWebRefresh(COOKIE_MARKER);
      } else {
        writeWebRefresh(session.refreshToken);
      }
      if (readWebAccess() !== session.accessToken) {
        throw new SessionPersistError("Failed to persist web access token");
      }
      return;
    }
    const ok = await setNativeItem(SESSION_KEY, JSON.stringify(session));
    if (!ok) throw new SessionPersistError();
  },

  async clear(): Promise<void> {
    if (isWeb) {
      writeWebMeta(null);
      writeWebAccess(null);
      writeWebRefresh(null);
      try {
        await AsyncStorage.removeItem(SESSION_KEY);
      } catch {
        // ignore
      }
      return;
    }
    await deleteNativeItem(SESSION_KEY);
  },

  /** A stable per-install device id used to create/resume the guest session. */
  async getDeviceId(): Promise<string> {
    if (isWeb) {
      const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (existing) return existing;
      const id = `dev_${Crypto.randomUUID()}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, id);
      return id;
    }
    const existing = await getNativeItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = `dev_${Crypto.randomUUID()}`;
    const ok = await setNativeItem(DEVICE_ID_KEY, id);
    if (!ok) throw new SessionPersistError("Failed to persist device id");
    return id;
  },
};
