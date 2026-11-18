import AsyncStorage from "@react-native-async-storage/async-storage";

import { buildGuestSession, buildStoredSession } from "@/test-support/fixtures/auth";
import {
  mockSecureStore,
  mockSetSecureItem,
  resetSafeSecureStoreMock,
} from "@/test-support/mocks/safe-secure-store";
import { loadOnPlatform } from "@/test-support/platform";

import type { SessionStore as SessionStoreType } from "./session-store";

jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);
jest.mock("expo-crypto", () => ({ randomUUID: jest.fn(() => "uuid-1") }));
// Instantiate the mocks in the main registry so isolated copies of the store share them.
require("@/lib/storage/safe-secure-store");
require("expo-crypto");

/**
 * The store decides web vs native once at import, so each platform gets its own
 * freshly-required copy.
 */
function loadSessionStore(os: "ios" | "web"): typeof SessionStoreType {
  return loadOnPlatform({ OS: os }, () => require("./session-store").SessionStore);
}

/** Minimal `sessionStorage` for the web path (absent in the Jest runtime). */
function installSessionStorage({ dropWrites = false } = {}) {
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (!dropWrites) data.set(key, value);
      },
      removeItem: (key: string) => data.delete(key),
    },
  });
  return data;
}

function removeSessionStorage() {
  Reflect.deleteProperty(globalThis, "sessionStorage");
}

beforeEach(async () => {
  resetSafeSecureStoreMock();
  await AsyncStorage.clear();
});

afterEach(removeSessionStorage);

describe("SessionStore on native", () => {
  const SessionStore = loadSessionStore("ios");

  it("round-trips a session through the keychain", async () => {
    const session = buildStoredSession();
    await SessionStore.set(session);
    expect(JSON.parse(mockSecureStore.get("munib.session") ?? "")).toEqual(session);
    await expect(SessionStore.get()).resolves.toEqual(session);
  });

  it("returns null when nothing is stored", async () => {
    await expect(SessionStore.get()).resolves.toBeNull();
  });

  it("returns null for a corrupt keychain value", async () => {
    mockSecureStore.set("munib.session", "{not json");
    await expect(SessionStore.get()).resolves.toBeNull();
  });

  it("throws SessionPersistError when the keychain drops the write", async () => {
    mockSetSecureItem.mockResolvedValueOnce(false);
    await expect(SessionStore.set(buildStoredSession())).rejects.toMatchObject({
      name: "SessionPersistError",
      message: "Failed to persist session to secure storage",
    });
  });

  it("clear deletes the keychain entry", async () => {
    await SessionStore.set(buildStoredSession());
    await SessionStore.clear();
    expect(mockSecureStore.has("munib.session")).toBe(false);
  });

  it("creates a device id once and reuses it", async () => {
    const id = await SessionStore.getDeviceId();
    expect(id).toBe("dev_uuid-1");
    await expect(SessionStore.getDeviceId()).resolves.toBe(id);
  });

  it("throws when the device id cannot be persisted", async () => {
    mockSetSecureItem.mockResolvedValueOnce(false);
    await expect(SessionStore.getDeviceId()).rejects.toThrow("Failed to persist device id");
  });
});

describe("SessionStore on web", () => {
  const SessionStore = loadSessionStore("web");

  it("keeps guest tokens in sessionStorage", async () => {
    const data = installSessionStorage();
    const session = buildGuestSession();
    await SessionStore.set(session);
    expect(data.get("munib.accessSession")).toBe("access-guest");
    expect(data.get("munib.refreshSession")).toBe("refresh-guest");
    await expect(SessionStore.get()).resolves.toEqual(session);
  });

  it("stores only the cookie marker for cookie sessions", async () => {
    const data = installSessionStorage();
    const session = buildStoredSession({ accessToken: "cookie", refreshToken: "ignored" });
    await SessionStore.set(session);
    expect(data.get("munib.refreshSession")).toBe("cookie");
    await expect(SessionStore.get()).resolves.toEqual({ ...session, refreshToken: "cookie" });
  });

  it.each([
    ["no metadata", { "munib.accessSession": "a", "munib.refreshSession": "r" }],
    [
      "no access token",
      { "munib.sessionMeta": JSON.stringify({ accountType: "guest", userId: "g" }) },
    ],
    [
      "no refresh token",
      {
        "munib.sessionMeta": JSON.stringify({ accountType: "guest", userId: "g" }),
        "munib.accessSession": "a",
      },
    ],
    ["corrupt metadata", { "munib.sessionMeta": "{", "munib.accessSession": "a" }],
  ])("returns null with %s", async (_label, entries) => {
    const data = installSessionStorage();
    for (const [key, value] of Object.entries(entries)) data.set(key, value);
    await expect(SessionStore.get()).resolves.toBeNull();
  });

  it("returns null when sessionStorage is unavailable", async () => {
    await expect(SessionStore.get()).resolves.toBeNull();
  });

  it("throws when the access token did not persist", async () => {
    installSessionStorage({ dropWrites: true });
    await expect(SessionStore.set(buildGuestSession())).rejects.toThrow(
      "Failed to persist web access token",
    );
  });

  it("throws (without crashing) when sessionStorage is unavailable", async () => {
    await expect(SessionStore.set(buildGuestSession())).rejects.toThrow(
      "Failed to persist web access token",
    );
  });

  it("clear wipes sessionStorage and the legacy AsyncStorage key", async () => {
    const data = installSessionStorage();
    await AsyncStorage.setItem("munib.session", "legacy");
    await SessionStore.set(buildGuestSession());
    await SessionStore.clear();
    expect(data.size).toBe(0);
    expect(await AsyncStorage.getItem("munib.session")).toBeNull();
  });

  it("clear tolerates storage failures", async () => {
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error("quota"));
    await expect(SessionStore.clear()).resolves.toBeUndefined();
  });

  it("creates the device id in AsyncStorage once", async () => {
    const id = await SessionStore.getDeviceId();
    expect(id).toBe("dev_uuid-1");
    expect(await AsyncStorage.getItem("munib.deviceId")).toBe(id);
    await expect(SessionStore.getDeviceId()).resolves.toBe(id);
  });
});
