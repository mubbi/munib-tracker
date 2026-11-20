import { ApiError } from "@munib-tracker/api-client";
import { act, render, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";

import type { StoredSession } from "@/auth/session-store";
import { __resetTrackingChangesForTests, markTrackingChanged } from "@/lib/sync/tracking-changes";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { captureAppStateListener } from "@/test-support/app-state";
import {
  buildAuthSessionDto,
  buildAuthUser,
  buildGuestSession,
  buildStoredSession,
} from "@/test-support/fixtures/auth";

jest.unmock("@/providers/auth-provider");

type Refresher = (() => Promise<string | null>) | null;

/** Mutable world the module mocks read from (in-memory session store, gates). */
const mockState: {
  session: StoredSession | null;
  refresher: Refresher;
  online: boolean;
  reloading: boolean;
} = { session: null, refresher: null, online: true, reloading: false };

jest.mock("@munib-tracker/api-client", () => ({
  ...jest.requireActual("@munib-tracker/api-client"),
  setTokenRefresher: (fn: Refresher) => {
    mockState.refresher = fn;
  },
}));

jest.mock("@/auth/session-store", () => {
  class SessionPersistError extends Error {}
  return {
    SessionPersistError,
    SessionStore: {
      get: jest.fn(async () => mockState.session),
      set: jest.fn(async (s: StoredSession) => {
        mockState.session = s;
      }),
      clear: jest.fn(async () => {
        mockState.session = null;
      }),
      getDeviceId: jest.fn(async () => "device-1"),
    },
  };
});

jest.mock("@/api/endpoints", () => ({
  authApple: jest.fn(),
  authAppleOauth: jest.fn(),
  authGoogle: jest.fn(),
  authGoogleOauth: jest.fn(),
  completeOAuth: jest.fn(),
  deleteAccount: jest.fn(),
  getCurrentUser: jest.fn(),
  linkAccount: jest.fn(),
  logout: jest.fn(),
  refreshSession: jest.fn(),
  requestGuestSession: jest.fn(),
  resetAppData: jest.fn(),
  WEB_COOKIE_SESSION_TOKEN: "cookie",
}));

jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  recordReviewErrorMarker: jest.fn(),
}));
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => mockState.online }));
jest.mock("@/lib/auth/auth-session-bootstrap", () => ({}));
jest.mock("@/lib/cloud-api-reload-gate", () => ({
  isAppReloadInProgress: () => mockState.reloading,
}));
jest.mock("@/lib/report-oss-content-download-failure", () => ({
  flushPendingOssContentFailures: jest.fn(),
}));
jest.mock("@/sync/sync-engine", () => ({ runSync: jest.fn() }));

const api = jest.requireMock("@/api/endpoints") as Record<string, jest.Mock>;
const { SessionStore, SessionPersistError } = jest.requireMock("@/auth/session-store") as {
  SessionStore: Record<"get" | "set" | "clear" | "getDeviceId", jest.Mock>;
  SessionPersistError: new () => Error;
};
const { runSync } = jest.requireMock("@/sync/sync-engine") as { runSync: jest.Mock };
const { recordReviewErrorMarker } = jest.requireMock(
  "@/features/reviews/lib/reviewEngagementBridge",
) as { recordReviewErrorMarker: jest.Mock };
const { flushPendingOssContentFailures } = jest.requireMock(
  "@/lib/report-oss-content-download-failure",
) as { flushPendingOssContentFailures: jest.Mock };

const guest = buildGuestSession();
const user = buildStoredSession();
const profile = buildAuthUser();
const guestDto = (accessToken: string) =>
  buildAuthSessionDto({ accessToken, refreshToken: "refresh-guest", accountType: "guest" });
const revoked = () => new ApiError("revoked", 401);
const deleteBody = { reasons: [], confirm: true } as never;

let appState: ReturnType<typeof captureAppStateListener>;

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

/** Lets fire-and-forget work (`void syncNow()`) settle inside act. */
async function flush() {
  await act(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });
}

/** Runs an auth action inside act, settles follow-up work and returns its result. */
async function perform<T>(action: () => Promise<T>): Promise<T> {
  let value!: T;
  await act(async () => {
    value = await action();
  });
  await flush();
  return value;
}

/**
 * Renders the provider with `stored` as the persisted session (`null` = nothing
 * stored) and waits for boot. `guestFails` makes the boot guest request fail.
 */
async function setup({
  stored = null,
  guestFails = false,
}: {
  stored?: StoredSession | null;
  guestFails?: boolean;
} = {}) {
  mockState.session = stored;
  if (guestFails) api.requestGuestSession.mockRejectedValueOnce(new Error("offline"));
  const utils = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(utils.result.current.isReady).toBe(true));
  await flush();
  return utils;
}

/** Renders without waiting for boot, so a test can unmount while boot is pending. */
async function setupPending() {
  return renderHook(() => useAuth(), { wrapper });
}

const refreshToken = () => perform(async () => (await mockState.refresher?.()) ?? null);

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function AuthThrower() {
  useAuth();
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.assign(mockState, { session: null, refresher: null, online: true, reloading: false });
  appState = captureAppStateListener();
  __resetTrackingChangesForTests();
  api.requestGuestSession.mockResolvedValue(guestDto("access-guest"));
  api.getCurrentUser.mockResolvedValue(profile);
  api.refreshSession.mockImplementation(async (token: string) =>
    token === "refresh-guest"
      ? guestDto("access-guest-2")
      : buildAuthSessionDto({ accessToken: "access-user-2" }),
  );
  for (const fn of ["linkAccount", "completeOAuth", "authGoogle", "authGoogleOauth"]) {
    api[fn].mockResolvedValue(buildAuthSessionDto());
  }
  for (const fn of ["authApple", "authAppleOauth"]) {
    api[fn].mockResolvedValue(buildAuthSessionDto({ provider: "apple" }));
  }
  for (const fn of ["deleteAccount", "logout", "resetAppData"]) {
    api[fn].mockResolvedValue(undefined);
  }
  runSync.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("AuthProvider boot", () => {
  it("creates a guest session from the device id when nothing is stored", async () => {
    const { result } = await setup();
    expect(api.requestGuestSession).toHaveBeenCalledWith("device-1");
    expect(result.current).toMatchObject({ isGuest: true, isAuthenticated: false, user: null });
  });

  it("flushes queued OSS content failure reports once a token exists", async () => {
    await setup();
    expect(flushPendingOssContentFailures).toHaveBeenCalled();
  });

  it("stays signed out (local-only) when the guest request fails", async () => {
    const { result } = await setup({ guestFails: true });
    expect(result.current.session).toBeNull();
    expect(flushPendingOssContentFailures).not.toHaveBeenCalled();
  });

  it("resumes a stored guest session without fetching a profile", async () => {
    const { result } = await setup({ stored: guest });
    expect(result.current.session).toEqual(guest);
    expect(api.getCurrentUser).not.toHaveBeenCalled();
  });

  it("resumes a stored user session with its profile", async () => {
    const { result } = await setup({ stored: user });
    expect(result.current).toMatchObject({ isAuthenticated: true, user: profile });
  });

  it("syncs a resumed user session", async () => {
    await setup({ stored: user });
    expect(runSync).toHaveBeenCalledWith(user);
  });

  it.each([
    ["signs in as a new guest", "access-guest"],
    ["stays local-only when the guest request fails", null],
  ])("when the profile fetch revoked the session, %s", async (_label, expectedToken) => {
    api.getCurrentUser.mockImplementation(async () => {
      mockState.session = null;
      throw revoked();
    });
    if (expectedToken === null) api.requestGuestSession.mockRejectedValue(new Error("offline"));
    const { result } = await setup({ stored: user });
    await waitFor(() => expect(result.current.session?.accessToken ?? null).toBe(expectedToken));
    expect(runSync).not.toHaveBeenCalled();
  });

  it("mirrors a downgrade to guest without requesting another guest session", async () => {
    api.getCurrentUser.mockImplementation(async () => {
      mockState.session = guest;
      throw new Error("boom");
    });
    const { result } = await setup({ stored: user });
    expect(result.current.session).toEqual(guest);
    expect(api.requestGuestSession).not.toHaveBeenCalled();
  });

  it.each([401, 403])("force-logs out a user session rejected with %i", async (status) => {
    api.getCurrentUser.mockRejectedValue(new ApiError("denied", status));
    const { result } = await setup({ stored: user });
    await waitFor(() => expect(result.current.isGuest).toBe(true));
    expect(api.logout).toHaveBeenCalledWith("access-user");
  });

  it("keeps the stored user session on a 5xx profile error", async () => {
    api.getCurrentUser.mockRejectedValue(new ApiError("server", 500));
    const { result } = await setup({ stored: user });
    expect(result.current).toMatchObject({ isAuthenticated: true, user: null });
  });

  it("does not become ready after unmounting mid-boot", async () => {
    const pending = deferred<StoredSession | null>();
    SessionStore.get.mockImplementationOnce(() => pending.promise);
    const { result, unmount } = await setupPending();
    await unmount();
    await act(async () => pending.resolve(guest));
    await flush();
    expect(result.current.isReady).toBe(false);
  });

  it.each([
    ["resolves", (d: ReturnType<typeof deferred<typeof profile>>) => d.resolve(profile), user],
    ["fails", (d: ReturnType<typeof deferred<typeof profile>>) => d.reject(new Error("x")), user],
    [
      "fails after revocation",
      (d: ReturnType<typeof deferred<typeof profile>>) => d.reject(new Error("x")),
      null,
    ],
  ])("ignores a profile fetch that %s after unmount", async (_label, settle, remaining) => {
    mockState.session = user;
    const pending = deferred<typeof profile>();
    api.getCurrentUser.mockImplementationOnce(() => pending.promise);
    const { result, unmount } = await setupPending();
    await flush();
    await unmount();
    mockState.session = remaining;
    await act(async () => settle(pending));
    await flush();
    expect(result.current.user).toBeNull();
  });

  it("unregisters the token refresher on unmount", async () => {
    const { unmount } = await setup();
    await unmount();
    expect(mockState.refresher).toBeNull();
  });
});

describe("useAuth", () => {
  it("throws outside the provider", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(render(<AuthThrower />)).rejects.toThrow(
      "useAuth must be used within an AuthProvider",
    );
    spy.mockRestore();
  });
});

describe("token refresher", () => {
  it("rotates tokens and returns the new access token", async () => {
    const { result } = await setup({ stored: user });
    expect(await refreshToken()).toBe("access-user-2");
    expect(api.refreshSession).toHaveBeenCalledWith("refresh-user");
    expect(result.current.session?.accessToken).toBe("access-user-2");
  });

  it("returns the cookie marker for cookie sessions", async () => {
    await setup({ stored: user });
    api.refreshSession.mockResolvedValueOnce(buildAuthSessionDto({ accessToken: "cookie" }));
    expect(await refreshToken()).toBe("cookie");
  });

  it("returns null when there is no session", async () => {
    await setup({ guestFails: true });
    expect(await refreshToken()).toBeNull();
    expect(api.refreshSession).not.toHaveBeenCalled();
  });

  it("returns the existing token when the session has no refresh token", async () => {
    await setup({ stored: buildStoredSession({ refreshToken: "" }) });
    expect(await refreshToken()).toBe("access-user");
    expect(api.refreshSession).not.toHaveBeenCalled();
  });

  it("shares one rotation between concurrent callers", async () => {
    await setup({ stored: user });
    const pending = deferred<ReturnType<typeof buildAuthSessionDto>>();
    api.refreshSession.mockImplementationOnce(() => pending.promise);
    const tokens = await perform(async () => {
      const both = Promise.all([mockState.refresher?.(), mockState.refresher?.()]);
      pending.resolve(buildAuthSessionDto({ accessToken: "access-user-3" }));
      return both;
    });
    expect(tokens).toEqual(["access-user-3", "access-user-3"]);
    expect(api.refreshSession).toHaveBeenCalledTimes(1);
  });

  it("drops the session when rotated tokens cannot be persisted", async () => {
    const { result } = await setup({ stored: user });
    SessionStore.set.mockRejectedValueOnce(new SessionPersistError());
    expect(await refreshToken()).toBeNull();
    await waitFor(() => expect(result.current.isGuest).toBe(true));
  });

  it.each([
    [
      "persisting fails for another reason",
      () => SessionStore.set.mockRejectedValueOnce(new Error("disk")),
    ],
    [
      "the server returns 5xx",
      () => api.refreshSession.mockRejectedValueOnce(new ApiError("down", 503)),
    ],
  ])("keeps the current token when %s", async (_label, arrange) => {
    await setup({ stored: user });
    arrange();
    expect(await refreshToken()).toBe("access-user");
    expect(api.logout).not.toHaveBeenCalled();
  });

  it("signs out locally on a 401 even when every cleanup step fails", async () => {
    const { result } = await setup({ stored: user });
    api.refreshSession.mockRejectedValueOnce(revoked());
    api.logout.mockRejectedValueOnce(new Error("logout"));
    api.requestGuestSession.mockRejectedValueOnce(new Error("offline"));
    expect(await refreshToken()).toBeNull();
    expect(result.current).toMatchObject({ session: null, user: null });
  });
});

describe("signOut", () => {
  it("returns to a guest session", async () => {
    const { result } = await setup({ stored: user });
    await perform(() => result.current.signOut());
    expect(result.current).toMatchObject({ isGuest: true, user: null });
  });

  it("ignores an overlapping sign-out", async () => {
    const { result } = await setup({ stored: user });
    await perform(() => Promise.all([result.current.signOut(), result.current.signOut()]));
    expect(api.logout).toHaveBeenCalledTimes(1);
  });

  it("skips the server logout when nothing is stored", async () => {
    const { result } = await setup({ guestFails: true });
    await perform(() => result.current.signOut());
    expect(api.logout).not.toHaveBeenCalled();
  });
});

describe("syncNow", () => {
  it.each([
    ["for guests", guest, false],
    ["while the app reloads", user, true],
  ])("skips %s", async (_label, session, reloading) => {
    const { result } = await setup({ stored: guest });
    mockState.session = session;
    mockState.reloading = reloading;
    expect(await perform(() => result.current.syncNow())).toBe("skipped");
    expect(runSync).not.toHaveBeenCalled();
  });

  it("reports isSyncing and skips an overlapping call", async () => {
    const { result } = await setup({ stored: guest });
    mockState.session = user;
    const pending = deferred<void>();
    runSync.mockImplementationOnce(() => pending.promise);
    let first!: Promise<string>;
    await act(async () => {
      first = result.current.syncNow();
    });
    expect(result.current.isSyncing).toBe(true);
    expect(await perform(() => result.current.syncNow())).toBe("skipped");
    pending.resolve();
    expect(await perform(() => first)).toBe("ok");
    expect(result.current.isSyncing).toBe(false);
  });

  it("returns error and records a review error marker when sync fails", async () => {
    const { result } = await setup({ stored: guest });
    mockState.session = user;
    runSync.mockRejectedValueOnce(new Error("offline"));
    expect(await perform(() => result.current.syncNow())).toBe("error");
    expect(recordReviewErrorMarker).toHaveBeenCalled();
  });
});

describe("background sync triggers", () => {
  async function foreground(state = "active") {
    await act(async () => appState.emit(state));
    await flush();
  }

  it("skips a foreground sync within five minutes of the last success", async () => {
    jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    await setup({ stored: user });
    await foreground();
    expect(runSync).toHaveBeenCalledTimes(1);
  });

  it("syncs on foreground once the interval has elapsed", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    await setup({ stored: user });
    now.mockReturnValue(1_000_000 + 6 * 60 * 1000);
    await foreground();
    expect(runSync).toHaveBeenCalledTimes(2);
  });

  it("ignores non-active app state changes", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    await setup({ stored: user });
    now.mockReturnValue(1_000_000 + 6 * 60 * 1000);
    await foreground("background");
    expect(runSync).toHaveBeenCalledTimes(1);
  });

  it("removes the AppState listener on unmount", async () => {
    const { unmount } = await setup();
    const subscription = appState.spy.mock.results[0]?.value as { remove: jest.Mock };
    await unmount();
    expect(subscription.remove).toHaveBeenCalled();
  });

  it("syncs when connectivity returns", async () => {
    mockState.online = false;
    const { rerender } = await setup({ stored: guest });
    mockState.session = user;
    mockState.online = true;
    await rerender({});
    await flush();
    expect(runSync).toHaveBeenCalledWith(user);
  });
});

describe("tracking change sync (zikr counts …)", () => {
  /** Records a local tracking edit, as the tracker store does after a zikr write. */
  async function recordZikr() {
    await act(async () => markTrackingChanged());
  }

  it("pushes a recorded change after a short quiet period for a signed-in user", async () => {
    await setup({ stored: user });
    expect(runSync).toHaveBeenCalledTimes(1); // boot sync
    jest.useFakeTimers();
    try {
      await recordZikr();
      await recordZikr(); // a burst of taps …
      await act(async () => {
        jest.advanceTimersByTime(3_000);
      });
      expect(runSync).toHaveBeenCalledTimes(1); // … still debouncing
      await act(async () => {
        jest.advanceTimersByTime(1_500);
      });
    } finally {
      jest.useRealTimers();
    }
    await flush();
    expect(runSync).toHaveBeenCalledTimes(2); // … becomes one sync
    expect(runSync).toHaveBeenLastCalledWith(user);
  });

  it("flushes unsynced changes when the app goes to the background", async () => {
    await setup({ stored: user });
    await recordZikr();
    await act(async () => appState.emit("background"));
    await flush();
    expect(runSync).toHaveBeenCalledTimes(2);
  });

  it("does not sync again on background when a sync already covered the change", async () => {
    const { result } = await setup({ stored: user });
    await recordZikr();
    await perform(() => result.current.syncNow());
    expect(runSync).toHaveBeenCalledTimes(2);
    await act(async () => appState.emit("background"));
    await flush();
    expect(runSync).toHaveBeenCalledTimes(2);
  });

  it("never pushes tracking changes for guests", async () => {
    await setup({ stored: guest });
    await recordZikr();
    await act(async () => appState.emit("background"));
    await flush();
    expect(runSync).not.toHaveBeenCalled();
  });
});

describe("applySessionDto / signInWithProvider", () => {
  it("stores a user session with its profile and syncs", async () => {
    const { result } = await setup();
    await perform(() => result.current.applySessionDto(buildAuthSessionDto()));
    expect(result.current).toMatchObject({ isAuthenticated: true, user: profile });
    expect(runSync).toHaveBeenCalled();
  });

  it("tolerates a failing profile fetch", async () => {
    const { result } = await setup();
    api.getCurrentUser.mockRejectedValueOnce(new Error("offline"));
    await perform(() => result.current.applySessionDto(buildAuthSessionDto()));
    expect(result.current).toMatchObject({ isAuthenticated: true, user: null });
  });

  it("clears the user for guest sessions", async () => {
    const { result } = await setup({ stored: user });
    await perform(() => result.current.applySessionDto(guestDto("access-guest-9")));
    expect(result.current).toMatchObject({ isGuest: true, user: null });
  });

  it("signInWithProvider completes OAuth with an empty default payload", async () => {
    const { result } = await setup();
    await perform(() => result.current.signInWithProvider("facebook"));
    expect(api.completeOAuth).toHaveBeenCalledWith("facebook", {});
    expect(result.current.isAuthenticated).toBe(true);
  });
});

describe("completeSocialSession", () => {
  type Kind = "accessToken" | "identityToken" | "googleOauth" | "appleOauth";
  const fullPayload = {
    accessToken: "gat",
    identityToken: "it",
    code: "c",
    codeVerifier: "v",
    redirectUri: "r",
    displayName: "Ali",
  };

  it.each<[Kind, "google" | "apple", string, unknown]>([
    ["accessToken", "google", "authGoogle", ""],
    ["identityToken", "apple", "authApple", { identityToken: "", displayName: undefined }],
    ["googleOauth", "google", "authGoogleOauth", { code: "", redirectUri: "", codeVerifier: "" }],
    [
      "appleOauth",
      "apple",
      "authAppleOauth",
      { code: "", redirectUri: "", codeVerifier: "", displayName: undefined },
    ],
  ])(
    "signs in fresh via %s with empty defaults when signed out",
    async (kind, provider, fn, arg) => {
      const { result } = await setup({ guestFails: true });
      await perform(() => result.current.completeSocialSession(provider, kind, {}));
      expect(api[fn]).toHaveBeenCalledWith(arg);
      expect(api.linkAccount).not.toHaveBeenCalled();
    },
  );

  it.each<[Kind, "google" | "apple", string, unknown]>([
    ["accessToken", "google", "authGoogle", "gat"],
    ["identityToken", "apple", "authApple", { identityToken: "it", displayName: "Ali" }],
    [
      "googleOauth",
      "google",
      "authGoogleOauth",
      { code: "c", redirectUri: "r", codeVerifier: "v" },
    ],
  ])("forwards %s payload fields for a signed-in user", async (kind, provider, fn, arg) => {
    const { result } = await setup({ stored: user });
    await perform(() => result.current.completeSocialSession(provider, kind, fullPayload));
    expect(api[fn]).toHaveBeenCalledWith(arg);
  });

  it.each<[Kind, "google" | "apple", Record<string, unknown>]>([
    ["accessToken", "google", { accessToken: "gat" }],
    ["identityToken", "apple", { idToken: "it", displayName: "Ali" }],
    ["appleOauth", "apple", { code: "c", codeVerifier: "v", redirectUri: "r", displayName: "Ali" }],
  ])("links a guest via %s with the rotated guest token", async (kind, provider, linkPayload) => {
    const { result } = await setup({ stored: guest });
    await perform(() => result.current.completeSocialSession(provider, kind, fullPayload));
    expect(api.linkAccount).toHaveBeenCalledWith("access-guest-2", provider, linkPayload);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("falls back to idToken when linking an identityToken without one", async () => {
    const { result } = await setup({ stored: guest });
    await perform(() =>
      result.current.completeSocialSession("apple", "identityToken", { idToken: "idt" }),
    );
    expect(api.linkAccount).toHaveBeenCalledWith("access-guest-2", "apple", {
      idToken: "idt",
      displayName: undefined,
    });
  });

  it.each([409, 401])("signs in fresh when linking fails with %i", async (status) => {
    const { result } = await setup({ stored: guest });
    api.linkAccount.mockRejectedValueOnce(new ApiError("conflict", status));
    await perform(() =>
      result.current.completeSocialSession("google", "accessToken", { accessToken: "gat" }),
    );
    expect(api.authGoogle).toHaveBeenCalledWith("gat");
  });

  it.each([
    ["an ApiError 500", new ApiError("server", 500)],
    ["a network error", new Error("network")],
  ])("rethrows %s from linking", async (_label, error) => {
    const { result } = await setup({ stored: guest });
    api.linkAccount.mockRejectedValueOnce(error);
    await act(async () => {
      await expect(
        result.current.completeSocialSession("google", "accessToken", { accessToken: "gat" }),
      ).rejects.toThrow(error.message);
    });
    expect(api.authGoogle).not.toHaveBeenCalled();
  });

  it("links with a re-read guest session when the refresh drops the old one", async () => {
    const { result } = await setup({ stored: guest });
    api.refreshSession.mockRejectedValueOnce(revoked());
    api.requestGuestSession.mockResolvedValueOnce(guestDto("access-guest-new"));
    await perform(() =>
      result.current.completeSocialSession("google", "accessToken", { accessToken: "gat" }),
    );
    expect(api.linkAccount).toHaveBeenCalledWith("access-guest-new", "google", {
      accessToken: "gat",
    });
  });

  it("signs in fresh when the refreshed session is no longer a guest", async () => {
    const { result } = await setup({ stored: guest });
    api.refreshSession.mockResolvedValueOnce(buildAuthSessionDto());
    await perform(() =>
      result.current.completeSocialSession("google", "accessToken", { accessToken: "gat" }),
    );
    expect(api.linkAccount).not.toHaveBeenCalled();
    expect(api.authGoogle).toHaveBeenCalledWith("gat");
  });
});

describe("linkProvider", () => {
  it("signs in directly when there is no session", async () => {
    api.requestGuestSession.mockRejectedValue(new Error("offline"));
    const { result } = await setup();
    await perform(() => result.current.linkProvider("facebook"));
    expect(api.completeOAuth).toHaveBeenCalledWith("facebook", {});
    expect(api.linkAccount).not.toHaveBeenCalled();
  });

  it("links the current session with a rotated token", async () => {
    const { result } = await setup({ stored: guest });
    await perform(() => result.current.linkProvider("facebook", { code: "c" }));
    expect(api.linkAccount).toHaveBeenCalledWith("access-guest-2", "facebook", { code: "c" });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("signs in instead when the identity belongs to another account", async () => {
    const { result } = await setup({ stored: guest });
    api.linkAccount.mockRejectedValueOnce(new ApiError("conflict", 409));
    await perform(() => result.current.linkProvider("facebook"));
    expect(api.completeOAuth).toHaveBeenCalledWith("facebook", {});
  });

  it.each([
    ["an ApiError 500", new ApiError("server", 500)],
    ["a network error", new Error("network")],
  ])("rethrows %s", async (_label, error) => {
    const { result } = await setup({ stored: guest });
    api.linkAccount.mockRejectedValueOnce(error);
    await act(async () => {
      await expect(result.current.linkProvider("facebook")).rejects.toThrow(error.message);
    });
    expect(api.completeOAuth).not.toHaveBeenCalled();
  });

  it("re-reads the store when refresh returns null", async () => {
    const { result } = await setup({ stored: user });
    api.refreshSession.mockRejectedValueOnce(revoked());
    await perform(() => result.current.linkProvider("facebook"));
    expect(api.linkAccount).toHaveBeenCalledWith("access-guest", "facebook", {});
  });
});

describe("deleteAccount", () => {
  it("is a no-op for guests", async () => {
    const { result } = await setup({ stored: guest });
    expect(await perform(() => result.current.deleteAccount(deleteBody))).toBe("ok");
    expect(api.deleteAccount).not.toHaveBeenCalled();
  });

  it("closes the server account with a rotated token and returns to guest", async () => {
    const { result } = await setup({ stored: user });
    expect(await perform(() => result.current.deleteAccount(deleteBody))).toBe("ok");
    expect(api.deleteAccount).toHaveBeenCalledWith("access-user-2", deleteBody);
    expect(result.current.isGuest).toBe(true);
  });

  it("returns error and keeps the session when the server request fails", async () => {
    const { result } = await setup({ stored: user });
    api.deleteAccount.mockRejectedValueOnce(new Error("offline"));
    expect(await perform(() => result.current.deleteAccount(deleteBody))).toBe("error");
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("uses the stored token when refresh returns null", async () => {
    const { result } = await setup({ stored: user });
    api.refreshSession.mockRejectedValueOnce(revoked());
    await perform(() => result.current.deleteAccount(deleteBody));
    expect(api.deleteAccount).toHaveBeenCalledWith("access-user", deleteBody);
  });
});

describe("resetAppData", () => {
  it("is a no-op for guests", async () => {
    const { result } = await setup({ stored: guest });
    expect(await perform(() => result.current.resetAppData())).toBe("ok");
    expect(api.resetAppData).not.toHaveBeenCalled();
  });

  it("resets cloud data with a rotated token", async () => {
    const { result } = await setup({ stored: user });
    expect(await perform(() => result.current.resetAppData())).toBe("ok");
    expect(api.resetAppData).toHaveBeenCalledWith("access-user-2");
    expect(result.current.isSyncing).toBe(false);
  });

  it("uses the stored token when refresh returns null", async () => {
    const { result } = await setup({ stored: user });
    api.refreshSession.mockRejectedValueOnce(revoked());
    await perform(() => result.current.resetAppData());
    expect(api.resetAppData).toHaveBeenCalledWith("access-user");
  });

  it("returns error when the server cannot confirm the reset", async () => {
    const { result } = await setup({ stored: user });
    api.resetAppData.mockRejectedValueOnce(new Error("offline"));
    expect(await perform(() => result.current.resetAppData())).toBe("error");
  });

  it("refuses while a sync is running", async () => {
    const { result } = await setup({ stored: user });
    const pending = deferred<void>();
    runSync.mockImplementationOnce(() => pending.promise);
    let sync!: Promise<string>;
    await act(async () => {
      sync = result.current.syncNow();
    });
    expect(await perform(() => result.current.resetAppData())).toBe("error");
    pending.resolve();
    await perform(() => sync);
    expect(api.resetAppData).not.toHaveBeenCalled();
  });
});
