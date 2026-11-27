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

type SessionMeta = Omit<StoredSession, "accessToken" | "refreshToken">;

/**
 * One `sessionStorage` entry on web. Reads resolve `null` and writes are
 * dropped when storage is unavailable (private mode, quota); `set` callers
 * verify the access token was persisted.
 */
function webSessionItem(key: string) {
  return {
    get(): string | null {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(value: string | null): void {
      try {
        if (value == null) sessionStorage.removeItem(key);
        else sessionStorage.setItem(key, value);
      } catch {
        // private mode / quota
      }
    },
  };
}

const webAccess = webSessionItem(WEB_ACCESS_KEY);
const webRefresh = webSessionItem(WEB_REFRESH_KEY);
const webMetaItem = webSessionItem(WEB_META_KEY);

function readWebMeta(): SessionMeta | null {
  const raw = webMetaItem.get();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionMeta;
  } catch {
    return null;
  }
}

function writeWebMeta(meta: SessionMeta | null): void {
  webMetaItem.set(meta == null ? null : JSON.stringify(meta));
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
        const accessToken = webAccess.get();
        if (!meta || !accessToken) return null;
        if (accessToken === COOKIE_MARKER) {
          return {
            ...meta,
            accessToken: COOKIE_MARKER,
            refreshToken: COOKIE_MARKER,
          };
        }
        const refreshToken = webRefresh.get();
        if (!refreshToken) return null;
        return { ...meta, accessToken, refreshToken };
      }
      const raw = await getSecureItem(SESSION_KEY);
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
      webAccess.set(session.accessToken);
      if (session.accessToken === COOKIE_MARKER) {
        webRefresh.set(COOKIE_MARKER);
      } else {
        webRefresh.set(session.refreshToken);
      }
      if (webAccess.get() !== session.accessToken) {
        throw new SessionPersistError("Failed to persist web access token");
      }
      return;
    }
    const ok = await setSecureItem(SESSION_KEY, JSON.stringify(session));
    if (!ok) throw new SessionPersistError();
  },

  async clear(): Promise<void> {
    if (isWeb) {
      writeWebMeta(null);
      webAccess.set(null);
      webRefresh.set(null);
      try {
        await AsyncStorage.removeItem(SESSION_KEY);
      } catch {
        // ignore
      }
      return;
    }
    await deleteSecureItem(SESSION_KEY);
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
    const existing = await getSecureItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const id = `dev_${Crypto.randomUUID()}`;
    const ok = await setSecureItem(DEVICE_ID_KEY, id);
    if (!ok) throw new SessionPersistError("Failed to persist device id");
    return id;
  },
};
