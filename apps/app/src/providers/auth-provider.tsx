import type { AuthSessionResponseDto, AuthUserResponseDto } from "@munib-tracker/api-client";
import { ApiError, setTokenRefresher } from "@munib-tracker/api-client";
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
  authApple,
  authAppleOauth,
  authGoogle,
  authGoogleOauth,
  completeOAuth,
  deleteAccount as deleteAccountRequest,
  getCurrentUser,
  linkAccount,
  logout as logoutRequest,
  type OAuthProvider,
  refreshSession,
  requestGuestSession,
  WEB_COOKIE_SESSION_TOKEN,
} from "@/api/endpoints";
import { SessionPersistError, SessionStore, type StoredSession } from "@/auth/session-store";
import { recordReviewErrorMarker } from "@/features/reviews/lib/reviewEngagementBridge";
import { useIsOnline } from "@/hooks/use-is-online";
import type { DeleteAccountRequestBody } from "@/lib/auth/account-closure-reasons";
import "@/lib/auth/auth-session-bootstrap";
import { isAppReloadInProgress } from "@/lib/cloud-api-reload-gate";
import { flushPendingOssContentFailures } from "@/lib/report-oss-content-download-failure";
import { runSync } from "@/sync/sync-engine";

export type OAuthPayload = {
  code?: string;
  idToken?: string;
  accessToken?: string;
  identityToken?: string;
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

const FOREGROUND_SYNC_MIN_INTERVAL_MS = 5 * 60 * 1000;

interface AuthContextValue {
  session: StoredSession | null;
  user: AuthUserResponseDto | null;
  isReady: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  signInAsGuest: () => Promise<void>;
  signInWithProvider: (provider: OAuthProvider, payload?: OAuthPayload) => Promise<void>;
  linkProvider: (provider: OAuthProvider, payload?: OAuthPayload) => Promise<void>;
  /** Persist a session DTO from dedicated Google/Apple auth routes. */
  applySessionDto: (dto: AuthSessionResponseDto) => Promise<void>;
  /**
   * Complete Google/Apple sign-in or guest link using dedicated API routes
   * (access token / identity token / code) instead of the unified oauth path.
   */
  completeSocialSession: (
    provider: "google" | "apple",
    kind: "accessToken" | "identityToken" | "googleOauth" | "appleOauth",
    payload: OAuthPayload,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<ManualSyncOutcome>;
  /** True while a cloud sync round-trip is in progress. */
  isSyncing: boolean;
  /**
   * Closes the account on the server (signed-in users) with survey + confirmation.
   * Returns `"error"` if the server can't be reached so the caller skips local wipe.
   */
  deleteAccount: (body: DeleteAccountRequestBody) => Promise<"ok" | "error">;
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
  const [isSyncing, setIsSyncing] = useState(false);
  const syncing = useRef(false);
  const refreshInFlight = useRef<Promise<StoredSession | null> | null>(null);
  const lastSuccessfulSyncAt = useRef(0);

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
        try {
          await SessionStore.set(stored);
        } catch (error) {
          // Server already rotated the one-time refresh token — if we cannot
          // persist it, drop the session rather than keeping a zombie in memory.
          if (error instanceof SessionPersistError) {
            await SessionStore.clear();
            setSession(null);
            setUser(null);
            return null;
          }
          throw error;
        }
        setSession(stored);
        return stored;
      } catch (error) {
        // Revoked / expired refresh — clear so the UI does not look signed in.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          await SessionStore.clear();
          setSession(null);
          setUser(null);
          return null;
        }
        // Offline or 5xx — keep the existing session for a later retry.
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
    if (isAppReloadInProgress()) return "skipped";
    syncing.current = true;
    setIsSyncing(true);
    try {
      // apiFetch refreshes reactively on 401. Avoid rotating a valid access token
      // before every sync (especially on web tab focus).
      const current = await SessionStore.get();
      if (!current || current.accountType === "guest") return "skipped";
      await runSync(current);
      lastSuccessfulSyncAt.current = Date.now();
      return "ok";
    } catch {
      // Offline or server error — try again on the next foreground.
      recordReviewErrorMarker();
      return "error";
    } finally {
      syncing.current = false;
      setIsSyncing(false);
    }
  }, []);

  const syncAfterForeground = useCallback(() => {
    if (Date.now() - lastSuccessfulSyncAt.current < FOREGROUND_SYNC_MIN_INTERVAL_MS) {
      return;
    }
    void syncNow();
  }, [syncNow]);

  // Let apiFetch transparently recover from an expired access token: on a 401 it
  // calls this to rotate the token and retry the request once.
  useEffect(() => {
    setTokenRefresher(async () => {
      const refreshed = await refresh();
      if (!refreshed) return null;
      // Cookie sessions keep the marker; Bearer sessions return the new JWT.
      return refreshed.accessToken === WEB_COOKIE_SESSION_TOKEN
        ? WEB_COOKIE_SESSION_TOKEN
        : refreshed.accessToken;
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

  const applySessionDto = useCallback(
    async (dto: AuthSessionResponseDto) => {
      await persist(dto);
      void syncNow();
    },
    [persist, syncNow],
  );

  const completeSocialSession = useCallback(
    async (
      provider: "google" | "apple",
      kind: "accessToken" | "identityToken" | "googleOauth" | "appleOauth",
      payload: OAuthPayload,
    ) => {
      const runFresh = async () => {
        switch (kind) {
          case "accessToken":
            return authGoogle(payload.accessToken ?? "");
          case "identityToken":
            return authApple({
              identityToken: payload.identityToken ?? payload.idToken ?? "",
              displayName: payload.displayName,
            });
          case "googleOauth":
            return authGoogleOauth({
              code: payload.code ?? "",
              redirectUri: payload.redirectUri ?? "",
              codeVerifier: payload.codeVerifier ?? "",
            });
          case "appleOauth":
            return authAppleOauth({
              code: payload.code ?? "",
              redirectUri: payload.redirectUri ?? "",
              codeVerifier: payload.codeVerifier ?? "",
              displayName: payload.displayName,
            });
        }
      };

      const current = await SessionStore.get();
      if (current?.accountType === "guest") {
        const linkPayload: OAuthPayload =
          kind === "accessToken"
            ? { accessToken: payload.accessToken }
            : kind === "identityToken"
              ? {
                  idToken: payload.identityToken ?? payload.idToken,
                  displayName: payload.displayName,
                }
              : {
                  code: payload.code,
                  codeVerifier: payload.codeVerifier,
                  redirectUri: payload.redirectUri,
                  displayName: payload.displayName,
                };
        try {
          const dto = await linkAccount(current.accessToken, provider, linkPayload);
          await persist(dto);
          void syncNow();
          return;
        } catch (error) {
          // Returning user: this OAuth identity already owns another account.
          // Fall through to normal sign-in instead of failing the "Sign in" button.
          if (!(error instanceof ApiError) || error.status !== 409) throw error;
        }
      }

      const dto = await runFresh();
      await persist(dto);
      void syncNow();
    },
    [persist, syncNow],
  );

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
      try {
        const dto = await linkAccount(current.accessToken, provider, payload);
        await persist(dto);
        // Push the guest's local data up to the newly linked account.
        void syncNow();
      } catch (error) {
        // Provider identity already belongs to another user — sign into that
        // account instead of leaving the guest stranded on a 409.
        if (!(error instanceof ApiError) || error.status !== 409) throw error;
        await signInWithProvider(provider, payload);
      }
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

  const deleteAccount = useCallback(
    async (body: DeleteAccountRequestBody): Promise<"ok" | "error"> => {
      const current = await SessionStore.get();
      if (current?.accountType === "user") {
        const fresh = (await refresh()) ?? current;
        try {
          await deleteAccountRequest(fresh.accessToken, body);
        } catch {
          return "error";
        }
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
    },
    [refresh, signInAsGuest],
  );

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

  // Flush OSS CDN failure reports that queued before a guest/user token existed.
  useEffect(() => {
    if (!session?.accessToken) return;
    flushPendingOssContentFailures();
  }, [session?.accessToken]);

  // Sync when returning to the foreground.
  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status === "active") syncAfterForeground();
    };
    const subscription = AppState.addEventListener("change", onChange);
    return () => subscription.remove();
  }, [syncAfterForeground]);

  // Sync when connectivity returns (native NetInfo / web online event).
  const online = useIsOnline();
  const wasOnline = useRef(true);
  useEffect(() => {
    if (online && !wasOnline.current) void syncNow();
    wasOnline.current = online;
  }, [online, syncNow]);

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
      applySessionDto,
      completeSocialSession,
      signOut,
      syncNow,
      deleteAccount,
      isSyncing,
    }),
    [
      session,
      user,
      isReady,
      signInAsGuest,
      signInWithProvider,
      linkProvider,
      applySessionDto,
      completeSocialSession,
      signOut,
      syncNow,
      deleteAccount,
      isSyncing,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
