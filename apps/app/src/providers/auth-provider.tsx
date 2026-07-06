import type { AuthSessionResponseDto, AuthUserResponseDto } from "@munib-tracker/api-client";
import { setTokenRefresher } from "@munib-tracker/api-client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";

import {
  completeOAuth,
  deleteAccount as deleteAccountRequest,
  getCurrentUser,
  linkAccount,
  logout as logoutRequest,
  type OAuthProvider,
  refreshSession,
  requestGuestSession,
} from "@/api/endpoints";
import { SessionStore, type StoredSession } from "@/auth/session-store";
import { runSync } from "@/sync/sync-engine";

export type OAuthPayload = {
  code?: string;
  idToken?: string;
  accessToken?: string;
  codeVerifier?: string;
  email?: string;
  displayName?: string;
  redirectUri?: string;
};

/**
 * Result of a `syncNow()` call so callers (the manual "Sync now" control) can
 * give feedback. `syncNow` never rejects — background callers fire-and-forget it
 * and a rejected promise would surface as an unhandled rejection — so the outcome
 * is returned instead: `"ok"` on a completed sync, `"error"` when offline or the
 * server failed, `"skipped"` for a guest/no session or an already-running sync.
 */
export type ManualSyncOutcome = "ok" | "error" | "skipped";

interface AuthContextValue {
  session: StoredSession | null;
  user: AuthUserResponseDto | null;
  isReady: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  signInAsGuest: () => Promise<void>;
  signInWithProvider: (provider: OAuthProvider, payload?: OAuthPayload) => Promise<void>;
  linkProvider: (provider: OAuthProvider, payload?: OAuthPayload) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<ManualSyncOutcome>;
  /**
   * Permanently deletes the account. For a signed-in user this erases the server
   * account and all synced data first, then returns to a fresh guest session.
   * Returns `"error"` (having changed nothing) if the server can't be reached, so
   * the caller knows not to wipe local data — a still-existing account would just
   * repopulate on the next sync. `"ok"` for guests (nothing to delete server-side).
   */
  deleteAccount: () => Promise<"ok" | "error">;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toStored(dto: AuthSessionResponseDto): StoredSession {
  return {
    accessToken: dto.accessToken,
    refreshToken: dto.refreshToken,
    accountType: dto.accountType,
    userId: dto.userId,
    provider: dto.provider,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [user, setUser] = useState<AuthUserResponseDto | null>(null);
  const [isReady, setIsReady] = useState(false);
  const syncing = useRef(false);
  const refreshInFlight = useRef<Promise<StoredSession | null> | null>(null);

  // Access tokens are short-lived JWTs; rotate them (and the single-use refresh
  // token) using the stored refresh token. Refresh is single-flight: concurrent
  // callers (boot, foreground, a 401 retry) await the same rotation so the
  // one-time refresh token can't be double-spent into a revoked session.
  const refresh = useCallback((): Promise<StoredSession | null> => {
    if (refreshInFlight.current) return refreshInFlight.current;
    const run = (async (): Promise<StoredSession | null> => {
      const current = await SessionStore.get();
      if (current?.accountType !== "user" || !current.refreshToken) return current;
      try {
        const stored = toStored(await refreshSession(current.refreshToken));
        await SessionStore.set(stored);
        setSession(stored);
        return stored;
      } catch {
        // Offline, or the refresh token was revoked — keep the existing session.
        return current;
      }
    })();
    refreshInFlight.current = run;
    void run.finally(() => {
      refreshInFlight.current = null;
    });
    return run;
  }, []);

  const syncNow = useCallback(async (): Promise<ManualSyncOutcome> => {
    // Claim the guard synchronously, before any await, so two overlapping calls
    // can't both pass the check and interleave (duplicate pushes / double refresh).
    if (syncing.current) return "skipped";
    syncing.current = true;
    try {
      const current = await refresh();
      if (!current || current.accountType === "guest") return "skipped";
      await runSync(current);
      return "ok";
    } catch {
      // Offline or server error — try again on the next foreground.
      return "error";
    } finally {
      syncing.current = false;
    }
  }, [refresh]);

  // Let apiFetch transparently recover from an expired access token: on a 401 it
  // calls this to rotate the token and retry the request once.
  useEffect(() => {
    setTokenRefresher(async () => {
      const refreshed = await refresh();
      return refreshed?.accessToken ?? null;
    });
    return () => setTokenRefresher(null);
  }, [refresh]);

  const persist = useCallback(async (dto: AuthSessionResponseDto) => {
    const stored = toStored(dto);
    await SessionStore.set(stored);
    setSession(stored);
    if (stored.accountType === "user") {
      try {
        setUser(await getCurrentUser(stored.accessToken));
      } catch {
        // ignore; profile can be fetched later
      }
    } else {
      setUser(null);
    }
    return stored;
  }, []);

  const signInAsGuest = useCallback(async () => {
    const deviceId = await SessionStore.getDeviceId();
    const dto = await requestGuestSession(deviceId);
    await persist(dto);
  }, [persist]);

  const signInWithProvider = useCallback(
    async (provider: OAuthProvider, payload: OAuthPayload = {}) => {
      const dto = await completeOAuth(provider, payload);
      await persist(dto);
      void syncNow();
    },
    [persist, syncNow],
  );

  const linkProvider = useCallback(
    async (provider: OAuthProvider, payload: OAuthPayload = {}) => {
      // Use the freshest token (rotated first for a user session) so the link
      // request isn't rejected for an expired access token.
      const current = (await refresh()) ?? (await SessionStore.get());
      if (!current) {
        await signInWithProvider(provider, payload);
        return;
      }
      const dto = await linkAccount(current.accessToken, provider, payload);
      await persist(dto);
      // Push the guest's local data up to the newly linked account.
      void syncNow();
    },
    [persist, signInWithProvider, syncNow, refresh],
  );

  const signOut = useCallback(async () => {
    const current = await SessionStore.get();
    if (current) {
      try {
        await logoutRequest(current.accessToken);
      } catch {
        // best-effort
      }
    }
    await SessionStore.clear();
    setSession(null);
    setUser(null);
    // Return to a fresh guest session so local tracking keeps working.
    try {
      await signInAsGuest();
    } catch {
      // offline — stay signed out locally
    }
  }, [signInAsGuest]);

  const deleteAccount = useCallback(async (): Promise<"ok" | "error"> => {
    const current = await SessionStore.get();
    if (current?.accountType === "user") {
      // Use the freshest access token so the request isn't rejected as expired.
      const fresh = (await refresh()) ?? current;
      try {
        await deleteAccountRequest(fresh.accessToken);
      } catch {
        // Server unreachable or errored — leave everything intact so the caller
        // aborts the local wipe. The account still exists and must not appear gone.
        return "error";
      }
      // Server account and all its sessions are gone; drop the dead local session
      // and return to a fresh guest so local tracking keeps working.
      await SessionStore.clear();
      setSession(null);
      setUser(null);
      try {
        await signInAsGuest();
      } catch {
        // offline — a guest session initializes on next launch
      }
    }
    return "ok";
  }, [refresh, signInAsGuest]);

  // Boot: resume a stored session, or create a guest one (best-effort offline).
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const stored = await SessionStore.get();
      if (stored) {
        if (mounted) setSession(stored);
        if (stored.accountType === "user") {
          try {
            const profile = await getCurrentUser(stored.accessToken);
            if (mounted) setUser(profile);
          } catch {
            // offline
          }
          void syncNow();
        }
      } else {
        try {
          await signInAsGuest();
        } catch {
          // offline — local-only mode
        }
      }
      if (mounted) setIsReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, [signInAsGuest, syncNow]);

  // Sync when returning to the foreground.
  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status === "active") void syncNow();
    };
    const subscription = AppState.addEventListener("change", onChange);
    return () => subscription.remove();
  }, [syncNow]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isReady,
      isGuest: session?.accountType === "guest",
      isAuthenticated: session?.accountType === "user",
      signInAsGuest,
      signInWithProvider,
      linkProvider,
      signOut,
      syncNow,
      deleteAccount,
    }),
    [
      session,
      user,
      isReady,
      signInAsGuest,
      signInWithProvider,
      linkProvider,
      signOut,
      syncNow,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
