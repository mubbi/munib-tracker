import type { AuthSessionResponseDto, AuthUserResponseDto } from "@munib-tracker/api-client";
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
  syncNow: () => Promise<void>;
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

  // Access tokens are short-lived JWTs; rotate them (and the refresh token) using
  // the stored refresh token. Returns the freshest session we could obtain.
  const refresh = useCallback(async (): Promise<StoredSession | null> => {
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
  }, []);

  const syncNow = useCallback(async () => {
    if (syncing.current) return;
    const current = await refresh();
    if (!current || current.accountType === "guest") return;
    syncing.current = true;
    try {
      await runSync(current);
    } catch {
      // Offline or server error — try again on the next foreground.
    } finally {
      syncing.current = false;
    }
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
      const current = await SessionStore.get();
      if (!current) {
        await signInWithProvider(provider, payload);
        return;
      }
      const dto = await linkAccount(current.accessToken, provider, payload);
      await persist(dto);
      // Push the guest's local data up to the newly linked account.
      void syncNow();
    },
    [persist, signInWithProvider, syncNow],
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
    }),
    [session, user, isReady, signInAsGuest, signInWithProvider, linkProvider, signOut, syncNow],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
