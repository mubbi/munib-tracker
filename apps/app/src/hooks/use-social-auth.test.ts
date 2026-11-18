import { act, renderHook } from "@testing-library/react-native";
import * as Linking from "expo-linking";
import type { Platform } from "react-native";

import { authAppleOauthSession } from "@/api/endpoints";
import { isAppleAuthAvailable, signInWithAppleNative } from "@/lib/auth/appleAuth";
import { isAppleConfigured } from "@/lib/auth/oauth-config";
import {
  clearAppleAuthorizationCodeExchangeGuard,
  getOrCreateAppleOAuthExchange,
  shouldSkipAppleAuthorizationCodeExchange,
} from "@/lib/oauth/apple-oauth-exchange-guard";
import { exchangeGoogleCodeAndClearPending } from "@/lib/oauth/complete-google-oauth";
import { clearGoogleAuthorizationCodeExchangeGuard } from "@/lib/oauth/google-oauth-exchange-guard";
import {
  clearAppleOAuthPendingSession,
  clearGoogleOAuthPendingSession,
  loadAppleOAuthPendingSession,
  loadGoogleOAuthPendingSession,
  saveAppleOAuthPendingSession,
  saveGoogleOAuthPendingSession,
} from "@/lib/oauth/oauth-pending";
import { parseAppleOAuthReturnUrl, parseOAuthReturnUrl } from "@/lib/oauth/parse-oauth-return-url";
import { setPlatform } from "@/test-support/platform";

import { OAUTH_CANCELLED, useSocialAuth } from "./use-social-auth";

type Kind = "google" | "apple" | "facebook";
type Request = { codeVerifier?: string; state?: string; makeAuthUrlAsync?: jest.Mock } | null;
type Response = { type: string; params?: Record<string, string> } | null;

const mockRequests: Record<Kind, Request> = { google: null, apple: null, facebook: null };
const mockResponses: Record<Kind, Response> = { google: null, apple: null, facebook: null };
const mockPrompts: Record<Kind, jest.Mock> = {
  google: jest.fn(),
  apple: jest.fn(),
  facebook: jest.fn(),
};

function mockKindOf(config: { scopes: string[] }): Kind {
  if (config.scopes.includes("openid")) return "google";
  if (config.scopes.includes("public_profile")) return "facebook";
  return "apple";
}

jest.mock("expo-auth-session", () => ({
  ResponseType: { Code: "code" },
  useAutoDiscovery: (issuer: string) => ({ issuer }),
  useAuthRequest: (config: { scopes: string[] }) => {
    const kind = mockKindOf(config);
    return [mockRequests[kind], mockResponses[kind], mockPrompts[kind]];
  },
}));

jest.mock("expo-linking", () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn(async () => null),
}));

jest.mock("@/api/endpoints", () => ({
  WEB_COOKIE_SESSION_TOKEN: "__cookie__",
  authAppleOauthSession: jest.fn(async () => undefined),
  refreshSession: jest.fn(async () => ({})),
}));

jest.mock("@/lib/auth/appleAuth", () => ({
  isAppleAuthAvailable: jest.fn(async () => true),
  signInWithAppleNative: jest.fn(),
}));

jest.mock("@/lib/auth/oauth-config", () => ({
  getAppleOAuthReturnUrl: () => "https://app.example/return",
  getAppleRedirectUri: () => "https://api.example/apple/callback",
  getAppleServicesId: () => mockConfig.appleServicesId,
  getFacebookAppId: () => "fb-app",
  getFacebookRedirectUri: () => "app://fb",
  getGoogleRedirectUri: () => "app://google",
  isAppleConfigured: jest.fn(() => mockConfig.apple),
  isFacebookConfigured: () => mockConfig.facebook,
  isGoogleConfigured: () => mockConfig.google,
  resolveGoogleClientId: () => " google-client ",
}));

jest.mock("@/lib/oauth/apple-oauth-exchange-guard", () => ({
  clearAppleAuthorizationCodeExchangeGuard: jest.fn(),
  getOrCreateAppleOAuthExchange: jest.fn(async (_code: string, run: () => Promise<void>) => {
    await run();
    return true;
  }),
  shouldSkipAppleAuthorizationCodeExchange: jest.fn(() => false),
}));

jest.mock("@/lib/oauth/complete-google-oauth", () => ({
  exchangeGoogleCodeAndClearPending: jest.fn(async () => "access-token"),
}));

jest.mock("@/lib/oauth/google-oauth-exchange-guard", () => ({
  clearGoogleAuthorizationCodeExchangeGuard: jest.fn(),
}));

jest.mock("@/lib/oauth/oauth-pending", () => ({
  clearAppleOAuthPendingSession: jest.fn(async () => undefined),
  clearGoogleOAuthPendingSession: jest.fn(async () => undefined),
  loadAppleOAuthPendingSession: jest.fn(async () => null),
  loadGoogleOAuthPendingSession: jest.fn(async () => null),
  saveAppleOAuthPendingSession: jest.fn(async () => undefined),
  saveGoogleOAuthPendingSession: jest.fn(async () => undefined),
}));

jest.mock("@/lib/oauth/parse-oauth-return-url", () => ({
  parseAppleOAuthReturnUrl: jest.fn(() => null),
  parseOAuthReturnUrl: jest.fn(() => null),
}));

jest.mock("@/providers/auth-provider", () => ({
  useAuth: () => mockAuth,
}));

let mockConfig: { google: boolean; apple: boolean; facebook: boolean; appleServicesId: string };
let mockAuth: {
  isGuest: boolean;
  linkProvider: jest.Mock;
  signInWithProvider: jest.Mock;
  completeSocialSession: jest.Mock;
  applySessionDto: jest.Mock;
};

const parseGoogle = parseOAuthReturnUrl as jest.Mock;
const parseApple = parseAppleOAuthReturnUrl as jest.Mock;
const loadGoogle = loadGoogleOAuthPendingSession as jest.Mock;
const loadApple = loadAppleOAuthPendingSession as jest.Mock;
const exchangeGoogle = exchangeGoogleCodeAndClearPending as jest.Mock;
const appleExchange = getOrCreateAppleOAuthExchange as jest.Mock;
const skipApple = shouldSkipAppleAuthorizationCodeExchange as jest.Mock;
const nativeApple = signInWithAppleNative as jest.Mock;
const appleAvailable = isAppleAuthAvailable as jest.Mock;

const platformRestores: Array<() => void> = [];

function setOS(os: typeof Platform.OS) {
  platformRestores.push(setPlatform({ OS: os }));
}

async function setup() {
  const hook = await renderHook(() => useSocialAuth());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

type Hook = Awaited<ReturnType<typeof setup>>;

/** Starts a sign-in that waits on an auth-session response; returns its settled outcome. */
async function startPending(hook: Hook, provider: Kind) {
  const outcome: { done: boolean; error?: Error } = { done: false };
  await act(async () => {
    hook.result.current.signIn(provider).then(
      () => {
        outcome.done = true;
      },
      (error: Error) => {
        outcome.done = true;
        outcome.error = error;
      },
    );
  });
  return outcome;
}

async function respond(hook: Hook, kind: Kind, response: Response) {
  mockResponses[kind] = response;
  await hook.rerender({});
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockConfig = { google: true, apple: true, facebook: true, appleServicesId: "svc.id" };
  mockAuth = {
    isGuest: false,
    linkProvider: jest.fn(async () => undefined),
    signInWithProvider: jest.fn(async () => undefined),
    completeSocialSession: jest.fn(async () => undefined),
    applySessionDto: jest.fn(async () => undefined),
  };
  mockRequests.google = { codeVerifier: " gv ", state: " gs " };
  mockRequests.apple = {
    codeVerifier: "av",
    state: "as",
    makeAuthUrlAsync: jest.fn(async () => "https://appleid.apple.com/auth"),
  };
  mockRequests.facebook = { codeVerifier: "fv", state: "fs" };
  mockResponses.google = null;
  mockResponses.apple = null;
  mockResponses.facebook = null;
  for (const kind of ["google", "apple", "facebook"] as Kind[]) {
    mockPrompts[kind].mockReset().mockResolvedValue({ type: "opened" });
  }
  appleAvailable.mockResolvedValue(true);
});

afterEach(() => {
  while (platformRestores.length) platformRestores.pop()?.();
});

describe("useSocialAuth — setup", () => {
  it("reports configured providers and corrects Apple availability on iOS", async () => {
    appleAvailable.mockResolvedValueOnce(false);
    const { result, unmount } = await setup();
    expect(result.current.busy).toBeNull();
    expect(result.current.googleConfigured).toBe(true);
    expect(result.current.facebookConfigured).toBe(true);
    expect(isAppleConfigured).toHaveBeenCalledWith(true);
    expect(isAppleConfigured).toHaveBeenLastCalledWith(false);
    await unmount();
  });

  it("resumes OAuth from the launch URL and incoming links on native", async () => {
    setOS("android");
    const remove = jest.fn();
    let onUrl: ((e: { url: string }) => void) | undefined;
    (Linking.addEventListener as jest.Mock).mockImplementationOnce((_t, cb) => {
      onUrl = cb;
      return { remove };
    });
    (Linking.getInitialURL as jest.Mock).mockResolvedValueOnce("app://oauth?code=1");
    const { unmount } = await setup();
    expect(appleAvailable).not.toHaveBeenCalled();
    expect(parseGoogle).toHaveBeenCalledWith("app://oauth?code=1");
    expect(parseApple).toHaveBeenCalledWith("app://oauth?code=1");

    await act(async () => {
      onUrl?.({ url: "app://other" });
    });
    expect(parseGoogle).toHaveBeenLastCalledWith("app://other");
    await unmount();
    expect(remove).toHaveBeenCalled();
  });

  it("ignores an empty launch URL", async () => {
    const { unmount } = await setup();
    expect(Linking.getInitialURL).toHaveBeenCalled();
    expect(parseGoogle).not.toHaveBeenCalled();
    await unmount();
  });
});

describe("useSocialAuth — web Apple return", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

  function installWindow(search: string) {
    const win = {
      location: { search, pathname: "/settings", hash: "#x", assign: jest.fn() },
      history: { replaceState: jest.fn() },
    };
    Object.defineProperty(globalThis, "window", { configurable: true, value: win });
    return win;
  }

  afterEach(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  });

  it("strips the success flag from the URL and tries to restore the cookie session", async () => {
    setOS("web");
    const win = installWindow("?apple_oauth=success");
    const { unmount } = await setup();
    expect(Linking.addEventListener).not.toHaveBeenCalled();
    expect(win.history.replaceState).toHaveBeenCalledWith(null, "", "/settings#x");
    await unmount();
  });

  it("does nothing without the success flag", async () => {
    setOS("web");
    const win = installWindow("?foo=bar");
    const { unmount } = await setup();
    expect(win.history.replaceState).not.toHaveBeenCalled();
    await unmount();
  });

  it("starts Apple form_post on web and navigates to Apple", async () => {
    setOS("web");
    const win = installWindow("");
    const hook = await setup();
    const { result } = hook;
    await act(async () => {
      await result.current.signIn("apple");
    });
    expect(authAppleOauthSession).toHaveBeenCalledWith({
      codeVerifier: "av",
      redirectUri: "https://api.example/apple/callback",
      returnUrl: "https://app.example/return",
    });
    expect(mockRequests.apple?.makeAuthUrlAsync).toHaveBeenCalled();
    expect(win.location.assign).toHaveBeenCalledWith("https://appleid.apple.com/auth");
    expect(result.current.busy).toBeNull();

    // Apple responses are handled by the API callback on web.
    await respond(hook, "apple", { type: "success", params: { code: "c" } });
    expect(appleExchange).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("completes Google on web through the API code exchange", async () => {
    setOS("web");
    installWindow("");
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    await respond(hook, "google", { type: "success", params: { code: " gc " } });
    expect(clearGoogleOAuthPendingSession).toHaveBeenCalled();
    expect(mockAuth.completeSocialSession).toHaveBeenCalledWith("google", "googleOauth", {
      code: "gc",
      redirectUri: "app://google",
      codeVerifier: "gv",
    });
    expect(outcome).toEqual({ done: true });
    await hook.unmount();
  });
});

describe("useSocialAuth — resumeGoogleFromUrl", () => {
  const pending = { codeVerifier: "v", redirectUri: "r", clientId: "c", state: "s" };

  it("skips URLs that are not OAuth returns or have no pending session", async () => {
    const { result, unmount } = await setup();
    await expect(result.current.resumeGoogleFromUrl("x")).resolves.toBe("skipped");
    parseGoogle.mockReturnValue({ code: "c", state: "s" });
    await expect(result.current.resumeGoogleFromUrl("x")).resolves.toBe("skipped");
    await unmount();
  });

  it("fails on a state mismatch", async () => {
    parseGoogle.mockReturnValue({ code: "c", state: "other" });
    loadGoogle.mockResolvedValue(pending);
    const { result, unmount } = await setup();
    await expect(result.current.resumeGoogleFromUrl("x")).resolves.toBe("failed");
    expect(clearGoogleOAuthPendingSession).toHaveBeenCalled();
    await unmount();
  });

  it("skips when the exchange returns no token", async () => {
    parseGoogle.mockReturnValue({ code: "c", state: null });
    loadGoogle.mockResolvedValue(pending);
    exchangeGoogle.mockResolvedValueOnce(null);
    const { result, unmount } = await setup();
    await expect(result.current.resumeGoogleFromUrl("x")).resolves.toBe("skipped");
    await unmount();
  });

  it("completes the session and resolves a waiting sign-in", async () => {
    setOS("android");
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    expect(mockPrompts.google).toHaveBeenCalledWith({ showInRecents: true });
    expect(hook.result.current.busy).toBe("google");
    parseGoogle.mockReturnValue({ code: "c", state: "s" });
    loadGoogle.mockResolvedValue(pending);
    let status: string | undefined;
    await act(async () => {
      status = await hook.result.current.resumeGoogleFromUrl("x");
    });
    expect(status).toBe("success");
    expect(mockAuth.completeSocialSession).toHaveBeenCalledWith("google", "accessToken", {
      accessToken: "access-token",
    });
    expect(outcome).toEqual({ done: true });
    expect(hook.result.current.busy).toBeNull();
    // No waiter left: a second resume still succeeds.
    await act(async () => {
      status = await hook.result.current.resumeGoogleFromUrl("x");
    });
    expect(status).toBe("success");
    await hook.unmount();
  });

  it("fails and rejects a waiting sign-in when the exchange throws", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    parseGoogle.mockReturnValue({ code: "c", state: "s" });
    loadGoogle.mockResolvedValue(pending);
    exchangeGoogle.mockRejectedValueOnce("nope");
    let status: string | undefined;
    await act(async () => {
      status = await hook.result.current.resumeGoogleFromUrl("x");
    });
    expect(status).toBe("failed");
    expect(outcome.error?.message).toBe("nope");
    exchangeGoogle.mockRejectedValueOnce(new Error("again"));
    await act(async () => {
      status = await hook.result.current.resumeGoogleFromUrl("x");
    });
    expect(status).toBe("failed");
    await hook.unmount();
  });
});

describe("useSocialAuth — resumeAppleFromUrl", () => {
  const pending = { codeVerifier: "v", redirectUri: "r", state: "s" };

  it("skips non-returns, already-exchanged codes and missing pending sessions", async () => {
    const { result, unmount } = await setup();
    await expect(result.current.resumeAppleFromUrl("x")).resolves.toBe("skipped");
    parseApple.mockReturnValue({ code: "c", state: "s" });
    skipApple.mockReturnValueOnce(true);
    await expect(result.current.resumeAppleFromUrl("x")).resolves.toBe("skipped");
    await expect(result.current.resumeAppleFromUrl("x")).resolves.toBe("skipped");
    await unmount();
  });

  it("fails on a state mismatch", async () => {
    parseApple.mockReturnValue({ code: "c", state: "zzz" });
    loadApple.mockResolvedValue(pending);
    const { result, unmount } = await setup();
    await expect(result.current.resumeAppleFromUrl("x")).resolves.toBe("failed");
    expect(clearAppleOAuthPendingSession).toHaveBeenCalled();
    await unmount();
  });

  it("skips when another exchange already owns the code", async () => {
    parseApple.mockReturnValue({ code: "c", state: null });
    loadApple.mockResolvedValue(pending);
    appleExchange.mockResolvedValueOnce(null);
    const { result, unmount } = await setup();
    await expect(result.current.resumeAppleFromUrl("x")).resolves.toBe("skipped");
    await unmount();
  });

  it("completes and resolves a waiting Android sign-in", async () => {
    setOS("android");
    const hook = await setup();
    const outcome = await startPending(hook, "apple");
    expect(clearAppleAuthorizationCodeExchangeGuard).toHaveBeenCalled();
    expect(saveAppleOAuthPendingSession).toHaveBeenCalledWith({
      codeVerifier: "av",
      redirectUri: "https://api.example/apple/callback",
      state: "as",
    });
    expect(mockPrompts.apple).toHaveBeenCalledWith({ showInRecents: true });
    parseApple.mockReturnValue({ code: "c", state: "s" });
    loadApple.mockResolvedValue(pending);
    let status: string | undefined;
    await act(async () => {
      status = await hook.result.current.resumeAppleFromUrl("x");
    });
    expect(status).toBe("success");
    expect(mockAuth.completeSocialSession).toHaveBeenCalledWith("apple", "appleOauth", {
      code: "c",
      redirectUri: "r",
      codeVerifier: "v",
    });
    expect(outcome).toEqual({ done: true });
    await act(async () => {
      status = await hook.result.current.resumeAppleFromUrl("x");
    });
    expect(status).toBe("success");
    await hook.unmount();
  });

  it("fails and rejects a waiting sign-in when the exchange throws", async () => {
    setOS("android");
    const hook = await setup();
    const outcome = await startPending(hook, "apple");
    parseApple.mockReturnValue({ code: "c", state: "s" });
    loadApple.mockResolvedValue(pending);
    appleExchange.mockRejectedValueOnce(new Error("x"));
    let status: string | undefined;
    await act(async () => {
      status = await hook.result.current.resumeAppleFromUrl("x");
    });
    expect(status).toBe("failed");
    expect(outcome.error?.message).toBe("Apple sign-in failed.");
    appleExchange.mockRejectedValueOnce(new Error("x"));
    await act(async () => {
      status = await hook.result.current.resumeAppleFromUrl("x");
    });
    expect(status).toBe("failed");
    await hook.unmount();
  });
});

describe("useSocialAuth — Google response", () => {
  it("exchanges the code on native and resolves the sign-in", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    expect(clearGoogleAuthorizationCodeExchangeGuard).toHaveBeenCalled();
    expect(saveGoogleOAuthPendingSession).toHaveBeenCalledWith({
      codeVerifier: "gv",
      redirectUri: "app://google",
      clientId: "google-client",
      state: "gs",
    });
    expect(mockPrompts.google).toHaveBeenCalledWith(undefined);
    await respond(hook, "google", { type: "success", params: { code: "gc" } });
    expect(exchangeGoogle).toHaveBeenCalledWith(
      { codeVerifier: "gv", redirectUri: "app://google", clientId: "google-client", state: "gs" },
      "gc",
    );
    expect(outcome).toEqual({ done: true });
    await hook.unmount();
  });

  it("passes returnTo into the pending session", async () => {
    const hook = await setup();
    await act(async () => {
      hook.result.current.signIn("google", { returnTo: "/settings" }).catch(() => {});
    });
    expect(saveGoogleOAuthPendingSession).toHaveBeenCalledWith(
      expect.objectContaining({ returnTo: "/settings" }),
    );
    await hook.unmount();
  });

  it("uses the request verifier when no sign-in is waiting, and stops on no token", async () => {
    mockRequests.google = { codeVerifier: "rv" };
    exchangeGoogle.mockResolvedValueOnce(null);
    const hook = await setup();
    await respond(hook, "google", { type: "success", params: { code: "gc" } });
    expect(exchangeGoogle).toHaveBeenCalledWith(
      expect.objectContaining({ codeVerifier: "rv", state: "" }),
      "gc",
    );
    expect(mockAuth.completeSocialSession).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("ignores a blank code", async () => {
    const hook = await setup();
    await respond(hook, "google", { type: "success", params: { code: "  " } });
    expect(exchangeGoogle).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("rejects when the PKCE verifier was lost", async () => {
    setOS("android");
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    // Android dismiss clears the verifier but keeps the waiter for the App Link.
    await respond(hook, "google", { type: "dismiss" });
    expect(outcome.done).toBe(false);
    expect(clearGoogleOAuthPendingSession).not.toHaveBeenCalled();
    mockRequests.google = {};
    await respond(hook, "google", { type: "success", params: { code: "gc" } });
    expect(outcome.error?.message).toBe("Sign-in lost PKCE verifier; try again.");
    await hook.unmount();
  });

  it("returns silently when the verifier is lost with no waiter", async () => {
    mockRequests.google = {};
    const hook = await setup();
    await respond(hook, "google", { type: "success", params: { code: "gc" } });
    expect(exchangeGoogle).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("rejects a waiting sign-in when the exchange fails", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    exchangeGoogle.mockRejectedValueOnce("bad");
    await respond(hook, "google", { type: "success", params: { code: "gc" } });
    expect(outcome.error?.message).toBe("bad");
    expect(clearGoogleOAuthPendingSession).toHaveBeenCalled();
    await hook.unmount();
  });

  it("swallows an exchange failure with no waiter", async () => {
    exchangeGoogle.mockRejectedValueOnce(new Error("bad"));
    const hook = await setup();
    await respond(hook, "google", { type: "success", params: { code: "gc" } });
    expect(clearGoogleOAuthPendingSession).toHaveBeenCalled();
    await hook.unmount();
  });

  it("rejects with OAUTH_CANCELLED when dismissed on iOS", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "google");
    await respond(hook, "google", { type: "cancel" });
    expect(outcome.error?.message).toBe(OAUTH_CANCELLED);
    expect(clearGoogleOAuthPendingSession).toHaveBeenCalled();
    await respond(hook, "google", { type: "error" });
    await respond(hook, "google", { type: "locked" });
    await hook.unmount();
  });
});

describe("useSocialAuth — Apple response (native OAuth)", () => {
  beforeEach(() => {
    setOS("android");
  });

  it("exchanges the code and resolves the sign-in", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "apple");
    await respond(hook, "apple", { type: "success", params: { code: " ac " } });
    expect(mockAuth.completeSocialSession).toHaveBeenCalledWith("apple", "appleOauth", {
      code: "ac",
      redirectUri: "https://api.example/apple/callback",
      codeVerifier: "av",
    });
    expect(clearAppleOAuthPendingSession).toHaveBeenCalled();
    expect(outcome).toEqual({ done: true });
    await hook.unmount();
  });

  it("succeeds without a waiter using the request verifier", async () => {
    const hook = await setup();
    await respond(hook, "apple", { type: "success", params: { code: "ac" } });
    expect(appleExchange).toHaveBeenCalledWith("ac", expect.any(Function));
    expect(clearAppleOAuthPendingSession).toHaveBeenCalled();
    await hook.unmount();
  });

  it("skips blank or already-exchanged codes", async () => {
    const hook = await setup();
    await respond(hook, "apple", { type: "success", params: { code: " " } });
    skipApple.mockReturnValueOnce(true);
    await respond(hook, "apple", { type: "success", params: { code: "dup" } });
    expect(appleExchange).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("stops when another exchange owns the code", async () => {
    appleExchange.mockResolvedValueOnce(null);
    const hook = await setup();
    await respond(hook, "apple", { type: "success", params: { code: "ac" } });
    expect(clearAppleOAuthPendingSession).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("rejects when the verifier was lost", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "apple");
    await respond(hook, "apple", { type: "dismiss" });
    expect(outcome.done).toBe(false);
    mockRequests.apple = { state: "as" };
    await respond(hook, "apple", { type: "success", params: { code: "ac" } });
    expect(outcome.error?.message).toBe("Sign-in lost PKCE verifier; try again.");
    await hook.unmount();
  });

  it("returns silently when the verifier is lost with no waiter", async () => {
    mockRequests.apple = {};
    const hook = await setup();
    await respond(hook, "apple", { type: "success", params: { code: "ac" } });
    expect(appleExchange).not.toHaveBeenCalled();
    await hook.unmount();
  });

  it("rejects a waiting sign-in when the exchange fails", async () => {
    const hook = await setup();
    const outcome = await startPending(hook, "apple");
    appleExchange.mockRejectedValueOnce("broken");
    await respond(hook, "apple", { type: "success", params: { code: "ac" } });
    expect(outcome.error?.message).toBe("broken");
    await hook.unmount();
  });

  it("swallows an exchange failure with no waiter", async () => {
    appleExchange.mockRejectedValueOnce(new Error("broken"));
    const hook = await setup();
    await respond(hook, "apple", { type: "success", params: { code: "ac" } });
    expect(clearAppleOAuthPendingSession).toHaveBeenCalled();
    await hook.unmount();
  });

  it("rejects with OAUTH_CANCELLED on iOS Services ID cancel", async () => {
    setOS("ios");
    appleAvailable.mockResolvedValue(false);
    const hook = await setup();
    const outcome = await startPending(hook, "apple");
    await respond(hook, "apple", { type: "cancel" });
    expect(outcome.error?.message).toBe(OAUTH_CANCELLED);
    await respond(hook, "apple", { type: "error" });
    await respond(hook, "apple", { type: "locked" });
    await hook.unmount();
  });
});

describe("useSocialAuth — signIn guards", () => {
  async function expectSignInError(provider: string, message: string) {
    const hook = await setup();
    let error: Error | undefined;
    await act(async () => {
      await hook.result.current.signIn(provider as Kind).catch((e: Error) => {
        error = e;
      });
    });
    expect(error?.message).toBe(message);
    expect(hook.result.current.busy).toBeNull();
    await hook.unmount();
  }

  it("rejects unknown providers", async () => {
    await expectSignInError("twitter", "twitter sign-in is not available yet.");
  });

  it("rejects Google when not configured or not ready", async () => {
    mockConfig.google = false;
    await expectSignInError("google", "Google sign-in is not configured yet.");
    mockConfig.google = true;
    mockRequests.google = null;
    await expectSignInError("google", "Google sign-in is not configured yet.");
    mockRequests.google = { codeVerifier: "v" };
    await expectSignInError("google", "Sign-in is not ready yet; try again.");
    mockRequests.google = { state: "s" };
    await expectSignInError("google", "Sign-in is not ready yet; try again.");
  });

  it("rejects Apple when not configured or not ready", async () => {
    setOS("android");
    mockConfig.apple = false;
    await expectSignInError("apple", "Apple sign-in is not configured yet.");
    mockConfig.apple = true;
    mockConfig.appleServicesId = "";
    await expectSignInError("apple", "Apple sign-in is not configured yet.");
    mockConfig.appleServicesId = "svc.id";
    mockRequests.apple = null;
    await expectSignInError("apple", "Apple sign-in is not configured yet.");
    mockRequests.apple = { state: "s" };
    await expectSignInError("apple", "Sign-in is not ready yet; try again.");
    mockRequests.apple = { codeVerifier: "v" };
    await expectSignInError("apple", "Sign-in is not ready yet; try again.");
  });

  it("rejects Facebook when not configured", async () => {
    mockConfig.facebook = false;
    await expectSignInError("facebook", "Facebook sign-in is not configured yet.");
    mockConfig.facebook = true;
    mockRequests.facebook = null;
    await expectSignInError("facebook", "Facebook sign-in is not configured yet.");
  });

  it("maps Facebook prompt outcomes to errors", async () => {
    mockPrompts.facebook.mockResolvedValue({ type: "cancel" });
    await expectSignInError("facebook", OAUTH_CANCELLED);
    mockPrompts.facebook.mockResolvedValue({ type: "dismiss" });
    await expectSignInError("facebook", OAUTH_CANCELLED);
    mockPrompts.facebook.mockResolvedValue({ type: "error" });
    await expectSignInError("facebook", "Sign-in was not completed.");
    mockPrompts.facebook.mockResolvedValue({ type: "success", params: {} });
    await expectSignInError("facebook", "The provider did not return an authorization code.");
  });
});

describe("useSocialAuth — Facebook", () => {
  it("signs in with the code", async () => {
    mockPrompts.facebook.mockResolvedValue({ type: "success", params: { code: " fc " } });
    const { result, unmount } = await setup();
    await act(async () => {
      await result.current.signIn("facebook");
    });
    expect(mockAuth.signInWithProvider).toHaveBeenCalledWith("facebook", {
      code: "fc",
      codeVerifier: "fv",
      redirectUri: "app://fb",
    });
    expect(mockAuth.linkProvider).not.toHaveBeenCalled();
    await unmount();
  });

  it("links the provider for guests", async () => {
    mockAuth.isGuest = true;
    mockPrompts.facebook.mockResolvedValue({ type: "success", params: { code: "fc" } });
    const { result, unmount } = await setup();
    await act(async () => {
      await result.current.signIn("facebook");
    });
    expect(mockAuth.linkProvider).toHaveBeenCalledWith("facebook", expect.any(Object));
    await unmount();
  });
});

describe("useSocialAuth — native Apple (iOS)", () => {
  it("completes with the identity token and display name", async () => {
    nativeApple.mockResolvedValueOnce({
      identityToken: " tok ",
      fullName: { givenName: " Amina ", familyName: "Khan" },
    });
    const { result, unmount } = await setup();
    await act(async () => {
      await result.current.signIn("apple");
    });
    expect(mockAuth.completeSocialSession).toHaveBeenCalledWith("apple", "identityToken", {
      identityToken: "tok",
      displayName: "Amina Khan",
    });
    await unmount();
  });

  it("omits an empty display name", async () => {
    nativeApple.mockResolvedValueOnce({ identityToken: "tok", fullName: null });
    const { result, unmount } = await setup();
    await act(async () => {
      await result.current.signIn("apple");
    });
    expect(mockAuth.completeSocialSession).toHaveBeenCalledWith("apple", "identityToken", {
      identityToken: "tok",
      displayName: undefined,
    });
    await unmount();
  });

  async function nativeError(failure: unknown) {
    nativeApple.mockRejectedValueOnce(failure);
    const { result, unmount } = await setup();
    let error: Error | undefined;
    await act(async () => {
      await result.current.signIn("apple").catch((e: Error) => {
        error = e;
      });
    });
    await unmount();
    return error;
  }

  it("maps cancellation codes and messages to OAUTH_CANCELLED", async () => {
    expect((await nativeError({ code: "ERR_REQUEST_CANCELED" }))?.message).toBe(OAUTH_CANCELLED);
    expect((await nativeError({ code: "OTHER" }))?.message).toBeUndefined();
    expect((await nativeError(new Error("User canceled")))?.message).toBe(OAUTH_CANCELLED);
    expect((await nativeError("cancelled by user"))?.message).toBe(OAUTH_CANCELLED);
  });

  it("rethrows other failures, including a missing identity token", async () => {
    expect((await nativeError(new Error("boom")))?.message).toBe("boom");
    nativeApple.mockResolvedValueOnce({ identityToken: null });
    const { result, unmount } = await setup();
    let error: Error | undefined;
    await act(async () => {
      await result.current.signIn("apple").catch((e: Error) => {
        error = e;
      });
    });
    expect(error?.message).toBe("Apple did not return an identity token.");
    await unmount();
  });
});
