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
  resetAppData as resetAppDataRequest,
  WEB_COOKIE_SESSION_TOKEN,
} from "@/api/endpoints";
import { SessionPersistError, SessionStore, type StoredSession } from "@/auth/session-store";
import { recordReviewErrorMarker } from "@/features/reviews/lib/reviewEngagementBridge";
import { useIsOnline } from "@/hooks/use-is-online";
import type { DeleteAccountRequestBody } from "@/lib/auth/account-closure-reasons";
import "@/lib/auth/auth-session-bootstrap";
import { isAppReloadInProgress } from "@/lib/cloud-api-reload-gate";
import { removeServerInAppNotifications } from "@/lib/in-app-notifications/storage";
import { flushPendingOssContentFailures } from "@/lib/report-oss-content-download-failure";
import {
  hasUnsyncedTrackingChanges,
  markTrackingSynced,
  onTrackingChanged,
  trackingChangeVersion,
} from "@/lib/sync/tracking-changes";
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
/**
 * Quiet period after a tracking edit (zikr counts …) before pushing it — long
 * enough that a run of tasbeeh taps becomes a single sync.
 */
const TRACKING_SYNC_DEBOUNCE_MS = 4000;
/** Give up re-queuing after this many back-to-back "another sync is running" skips. */
const TRACKING_SYNC_MAX_SKIPS = 5;

/**
 * Why the last guest sign-in failed, for the screens that need a session
 * (group khatm, joining a circle): `offline` — no connection; `network` — the
 * connection is up but the server couldn't be reached; `rateLimited` — the API
 * answered 429 (`apps/api` caps guest sessions per device / IP); `server` —
 * any other server answer.
 */
export type GuestSessionError = "offline" | "network" | "rateLimited" | "server";

/**
 * `idle` — a session exists or nothing has been tried yet; `connecting` — a
 * guest sign-in is in flight; `error` — the last attempt failed (see
 * {@link GuestSessionError}).
 */
export type SessionStatus = "idle" | "connecting" | "error";

/** Automatic (foreground / reconnect) retry delays after consecutive failures. */
export const GUEST_RETRY_BACKOFF_MS = [15_000, 60_000, 5 * 60_000, 15 * 60_000] as const;
/** After a 429 even a manual "Try again" waits this long — retrying only extends the window. */
export const GUEST_RATE_LIMIT_COOLDOWN_MS = 10 * 60_000;

/** Delay before the next automatic guest retry after `failures` consecutive failures. */
export function guestRetryDelayMs(failures: number, error: GuestSessionError | null): number {
  if (failures <= 0) return 0;
  const backoff =
    GUEST_RETRY_BACKOFF_MS[Math.min(failures, GUEST_RETRY_BACKOFF_MS.length) - 1] ?? 0;
  return error === "rateLimited" ? Math.max(backoff, GUEST_RATE_LIMIT_COOLDOWN_MS) : backoff;
}

/** Maps a failed guest sign-in onto a reason the UI can explain. */
export function classifyGuestSessionError(error: unknown, online: boolean): GuestSessionError {
  if (error instanceof ApiError) return error.status === 429 ? "rateLimited" : "server";
  return online ? "network" : "offline";
}

export type EnsureSessionOptions = {
  /**
   * Manual "Try again" (and boot / reconnect): skip the automatic backoff —
   * a 429 cooldown still applies. Foreground retries leave it off.
   */
  force?: boolean;
};

interface AuthContextValue {
  session: StoredSession | null;
  user: AuthUserResponseDto | null;
  isReady: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  signInAsGuest: () => Promise<void>;
  /**
   * Makes sure a session (guest or account) exists, creating a guest one when
   * missing. Single-flight; resolves `true` once a session exists. Also retried
   * automatically on foreground and when connectivity returns.
   */
  ensureSession: (options?: EnsureSessionOptions) => Promise<boolean>;
  /** Progress of the guest sign-in that {@link ensureSession} drives. */
  sessionStatus: SessionStatus;
  /** Reason for the last failure while `sessionStatus` is `"error"`. */
  sessionError: GuestSessionError | null;
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
  /**
   * Clears cloud app data without changing the account or session.
   * Returns `"error"` when the server cannot confirm the reset.
   */
  resetAppData: () => Promise<"ok" | "error">;
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
  const invalidatingSession = useRef(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [sessionError, setSessionError] = useState<GuestSessionError | null>(null);
  const ensureInFlight = useRef<Promise<boolean> | null>(null);
  const guestFailures = useRef(0);
  const lastGuestFailureAt = useRef(0);
  const lastGuestError = useRef<GuestSessionError | null>(null);
  const online = useIsOnline();
  const onlineRef = useRef(online);
  onlineRef.current = online;

  const clearSessionState = useCallback(async () => {
    await SessionStore.clear();
    setSession(null);
    setUser(null);
  }, []);

  const signInAsGuest = useCallback(async () => {
    const deviceId = await SessionStore.getDeviceId();
    const dto = await requestGuestSession(deviceId);
    const stored = toStored(dto);
    await SessionStore.set(stored);
    setSession(stored);
    setUser(null);
  }, []);

  const ensureSession = useCallback(
    (options: EnsureSessionOptions = {}): Promise<boolean> => {
      if (ensureInFlight.current) return ensureInFlight.current;
      const run = (async (): Promise<boolean> => {
        const stored = await SessionStore.get();
        if (stored) {
          setSession(stored);
          setSessionStatus("idle");
          setSessionError(null);
          return true;
        }
        const sinceFailure = Date.now() - lastGuestFailureAt.current;
        const rateLimited = lastGuestError.current === "rateLimited";
        const wait = options.force
          ? rateLimited
            ? GUEST_RATE_LIMIT_COOLDOWN_MS
            : 0
          : guestRetryDelayMs(guestFailures.current, lastGuestError.current);
        if (guestFailures.current > 0 && sinceFailure < wait) {
          // Still backing off — keep showing the last failure.
          setSessionStatus("error");
          return false;
        }
        setSessionStatus("connecting");
        setSessionError(null);
        try {
          await signInAsGuest();
          guestFailures.current = 0;
          lastGuestError.current = null;
          setSessionStatus("idle");
          return true;
        } catch (error) {
          const reason = classifyGuestSessionError(error, onlineRef.current);
          guestFailures.current += 1;
          lastGuestFailureAt.current = Date.now();
          lastGuestError.current = reason;
          setSessionError(reason);
          setSessionStatus("error");
          return false;
        }
      })();
      ensureInFlight.current = run;
      void run.finally(() => {
        ensureInFlight.current = null;
      });
      return run;
    },
    [signInAsGuest],
  );

  /** Drop a revoked session and return to guest so the UI never stays "signed in". */
  const invalidateAuthSession = useCallback(async () => {
    if (invalidatingSession.current) return;
    invalidatingSession.current = true;
    try {
      const current = await SessionStore.get();
      if (current) {
        try {
          const { deleteSurfacePushRegistration } = await import("@/lib/surface-push/register");
          const { unregisterPushTokenWithApi, unsubscribeWebPushSubscription } = await import(
            "@/lib/notifications/register-push-token"
          );
          // While the session is still valid: this device stops receiving the
          // account's broadcasts / circle pushes before logout revokes it.
          await unregisterPushTokenWithApi(current.accessToken);
          await deleteSurfacePushRegistration(current.accessToken);
          await unsubscribeWebPushSubscription();
        } catch {
          // best-effort cleanup
        }
        try {
          // Best-effort: clears HttpOnly web cookies when the access token still works.
          await logoutRequest(current.accessToken);
        } catch {
          // ignore — local clear below still fixes the zombie signed-in UI
        }
      }
      await clearSessionState();
      // The account's server inbox (announcements, circle events) must not stay
      // visible to whoever uses this device next.
      await removeServerInAppNotifications().catch(() => {});
      // Offline — stay signed out locally; retried on foreground / reconnect.
      await ensureSession({ force: true });
    } finally {
      invalidatingSession.current = false;
    }
  }, [clearSessionState, ensureSession]);

  // Access tokens are short-lived JWTs; rotate them (and the single-use refresh
  // token) using the stored refresh token. Guests must refresh too — Google /
  // Apple sign-in links the guest via Bearer auth, and a stale guest JWT surfaces
  // as "Invalid or expired access token". Refresh is single-flight: concurrent
  // callers (boot, foreground, a 401 retry) await the same rotation so the
  // one-time refresh token can't be double-spent into a revoked session.
  const refresh = useCallback((): Promise<StoredSession | null> => {
    if (refreshInFlight.current) return refreshInFlight.current;
    const run = (async (): Promise<StoredSession | null> => {
      const current = await SessionStore.get();
      if (!current?.refreshToken) return current;
      try {
        const stored = toStored(await refreshSession(current.refreshToken));
        try {
          await SessionStore.set(stored);
        } catch (error) {
          // Server already rotated the one-time refresh token — if we cannot
          // persist it, drop the session rather than keeping a zombie in memory.
          if (error instanceof SessionPersistError) {
            await invalidateAuthSession();
            return null;
          }
          throw error;
        }
        setSession(stored);
        return stored;
      } catch (error) {
        // Revoked / expired refresh — clear so the UI does not look signed in.
        // Only 401/403 clear; network/5xx keep the existing tokens for retry.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          await invalidateAuthSession();
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
  }, [invalidateAuthSession]);

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
      // Edits made after this point may be missed by this push — only the ones
      // already recorded are covered when it succeeds.
      const trackingUpTo = trackingChangeVersion();
      await runSync(current);
      markTrackingSynced(trackingUpTo);
      lastSuccessfulSyncAt.current = Date.now();
      return "ok";
    } catch {
      // Offline or server error — try again on the next foreground. Holds off a
      // review request for this session only (a lost connection isn't a crash).
      recordReviewErrorMarker("session");
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
        // Rotate the guest access JWT before linking — guests share the same
        // short-lived TTL as signed-in users.
        const fresh = (await refresh()) ?? (await SessionStore.get());
        if (fresh?.accountType === "guest") {
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
            const dto = await linkAccount(fresh.accessToken, provider, linkPayload);
            await persist(dto);
            void syncNow();
            return;
          } catch (error) {
            // 409: OAuth identity already owns another account → sign into that one.
            // 401: guest session unusable after refresh → still complete OAuth sign-in.
            if (!(error instanceof ApiError) || (error.status !== 409 && error.status !== 401)) {
              throw error;
            }
          }
        }
      }

      const dto = await runFresh();
      await persist(dto);
      void syncNow();
    },
    [persist, refresh, syncNow],
  );

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
        // 409: identity belongs to another user. 401: guest JWT unusable.
        // Either way, complete a normal OAuth sign-in instead of stranding the UI.
        if (!(error instanceof ApiError) || (error.status !== 409 && error.status !== 401)) {
          throw error;
        }
        await signInWithProvider(provider, payload);
      }
    },
    [persist, signInWithProvider, syncNow, refresh],
  );

  const signOut = useCallback(async () => {
    await invalidateAuthSession();
  }, [invalidateAuthSession]);

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
        await invalidateAuthSession();
      }
      return "ok";
    },
    [refresh, invalidateAuthSession],
  );

  const resetAppData = useCallback(async (): Promise<"ok" | "error"> => {
    if (syncing.current) return "error";
    const current = await SessionStore.get();
    if (current?.accountType !== "user") return "ok";
    syncing.current = true;
    setIsSyncing(true);
    try {
      const fresh = (await refresh()) ?? current;
      await resetAppDataRequest(fresh.accessToken);
      return "ok";
    } catch {
      return "error";
    } finally {
      syncing.current = false;
      setIsSyncing(false);
    }
  }, [refresh]);

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
          } catch (error) {
            // apiFetch already tried refresh on 401. If refresh revoked the
            // session, storage is cleared — mirror that in React and restore guest.
            const remaining = await SessionStore.get();
            if (remaining?.accountType !== "user") {
              if (mounted) {
                setSession(remaining);
                setUser(null);
              }
              // Offline — local-only mode; retried on foreground / reconnect.
              if (!remaining) await ensureSession({ force: true });
            } else if (
              error instanceof ApiError &&
              (error.status === 401 || error.status === 403)
            ) {
              // Refresh did not clear (e.g. refresher not registered yet) — force logout.
              await invalidateAuthSession();
            }
            // Offline / 5xx: keep the stored user session for a later retry.
          }
          const stillUser = (await SessionStore.get())?.accountType === "user";
          if (stillUser) void syncNow();
        }
      } else {
        // Offline — local-only mode; retried on foreground / reconnect.
        await ensureSession({ force: true });
      }
      if (mounted) setIsReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, [ensureSession, syncNow, invalidateAuthSession]);

  // Flush OSS CDN failure reports that queued before a guest/user token existed.
  useEffect(() => {
    if (!session?.accessToken) return;
    flushPendingOssContentFailures();
  }, [session?.accessToken]);

  // Push local tracking edits (zikr counts …) for signed-in users shortly after
  // they happen, and flush before the app is backgrounded/closed, so another
  // device sees them without waiting for a later foreground sync.
  const isUserSession = session?.accountType === "user";
  useEffect(() => {
    if (!isUserSession) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let skips = 0;

    const flush = async () => {
      if (timer) clearTimeout(timer);
      timer = null;
      if (disposed || !hasUnsyncedTrackingChanges()) return;
      const outcome = await syncNow();
      if (disposed) return;
      if (outcome === "skipped") {
        // Another sync was mid-flight (it may have read before this edit) — retry.
        skips += 1;
        if (skips <= TRACKING_SYNC_MAX_SKIPS) schedule();
        return;
      }
      skips = 0;
      // "error" (offline / 5xx) is retried by the reconnect + foreground syncs.
      if (outcome === "ok" && hasUnsyncedTrackingChanges()) schedule();
    };

    function schedule() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void flush(), TRACKING_SYNC_DEBOUNCE_MS);
    }

    const unsubscribe = onTrackingChanged(schedule);
    const appState = AppState.addEventListener("change", (status: AppStateStatus) => {
      if (status === "background" || status === "inactive") void flush();
    });
    // Edits recorded while this effect was not listening (e.g. right after sign-in).
    if (hasUnsyncedTrackingChanges()) schedule();

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      unsubscribe();
      appState.remove();
    };
  }, [isUserSession, syncNow]);

  // Sync when returning to the foreground, and retry a guest session the boot
  // pass could not create (offline launch, server hiccup) within the backoff.
  const hasSession = session != null;
  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status !== "active") return;
      if (isReady && !hasSession) void ensureSession();
      syncAfterForeground();
    };
    const subscription = AppState.addEventListener("change", onChange);
    return () => subscription.remove();
  }, [syncAfterForeground, ensureSession, isReady, hasSession]);

  // Sync (or create the missing guest session) when connectivity returns
  // (native NetInfo / web online event).
  const wasOnline = useRef(true);
  useEffect(() => {
    if (online && !wasOnline.current) {
      // Back online is new evidence, so skip the offline backoff.
      if (isReady && !hasSession) void ensureSession({ force: true });
      else void syncNow();
    }
    wasOnline.current = online;
  }, [online, syncNow, ensureSession, isReady, hasSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      isReady,
      isGuest: session?.accountType === "guest",
      isAuthenticated: session?.accountType === "user",
      signInAsGuest,
      ensureSession,
      sessionStatus: session != null ? "idle" : sessionStatus,
      sessionError: session != null ? null : sessionError,
      signInWithProvider,
      linkProvider,
      applySessionDto,
      completeSocialSession,
      signOut,
      syncNow,
      deleteAccount,
      resetAppData,
      isSyncing,
    }),
    [
      session,
      user,
      isReady,
      signInAsGuest,
      ensureSession,
      sessionStatus,
      sessionError,
      signInWithProvider,
      linkProvider,
      applySessionDto,
      completeSocialSession,
      signOut,
      syncNow,
      deleteAccount,
      resetAppData,
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
