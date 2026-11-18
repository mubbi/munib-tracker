type Store = typeof import("./safe-secure-store");
type SecureStoreModule = typeof import("expo-secure-store");

/** Keychain items keyed by `${keychainAccessible ?? "default"}:${key}`. */
const mockKeychain = new Map<string, string>();
const slot = (key: string, options?: { keychainAccessible?: unknown }) =>
  `${String(options?.keychainAccessible ?? "default")}:${key}`;

jest.mock("expo-secure-store", () => ({
  WHEN_UNLOCKED: "WHEN_UNLOCKED",
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: "WHEN_UNLOCKED_THIS_DEVICE_ONLY",
  getItemAsync: jest.fn(
    async (key: string, options?: { keychainAccessible?: unknown }) =>
      mockKeychain.get(slot(key, options)) ?? null,
  ),
  setItemAsync: jest.fn(
    async (key: string, value: string, options?: { keychainAccessible?: unknown }) => {
      mockKeychain.set(slot(key, options), value);
    },
  ),
  deleteItemAsync: jest.fn(async (key: string, options?: { keychainAccessible?: unknown }) => {
    mockKeychain.delete(slot(key, options));
  }),
}));

let getSecureItem: Store["getSecureItem"];
let setSecureItem: Store["setSecureItem"];
let deleteSecureItem: Store["deleteSecureItem"];
let isSecureStoreAccessDeniedError: Store["isSecureStoreAccessDeniedError"];
let getItemAsync: jest.Mock;
let setItemAsync: jest.Mock;
let deleteItemAsync: jest.Mock;

const LOCKED = new Error("User interaction is not allowed.");
const BROKEN = new Error("keychain exploded");

/**
 * jest.setup already loaded the subject against the real expo-secure-store, so
 * load a fresh copy wired to the mock above.
 */
beforeEach(() => {
  mockKeychain.clear();
  jest.isolateModules(() => {
    ({ getSecureItem, setSecureItem, deleteSecureItem, isSecureStoreAccessDeniedError } =
      require("./safe-secure-store") as Store);
    const secureStore = require("expo-secure-store") as SecureStoreModule;
    getItemAsync = jest.mocked(secureStore.getItemAsync);
    setItemAsync = jest.mocked(secureStore.setItemAsync);
    deleteItemAsync = jest.mocked(secureStore.deleteItemAsync);
  });
});

describe("isSecureStoreAccessDeniedError", () => {
  it.each([
    [LOCKED, true],
    [new Error("Calling the 'getValueWithKeyAsync' function has failed"), true],
    [new Error("setValueWithKeyAsync failed"), true],
    [new Error("deleteValueWithKeyAsync failed"), true],
    [BROKEN, false],
    ["User interaction is not allowed", false],
  ])("%p → %p", (error, expected) => {
    expect(isSecureStoreAccessDeniedError(error)).toBe(expected);
  });
});

describe("getSecureItem", () => {
  it("reads the device-only item", async () => {
    await setSecureItem("k", "v");
    expect(await getSecureItem("k")).toBe("v");
  });

  it("migrates a legacy WHEN_UNLOCKED item to the device-only slot", async () => {
    mockKeychain.set("WHEN_UNLOCKED:k", "legacy");
    expect(await getSecureItem("k")).toBe("legacy");
    expect(mockKeychain.get("WHEN_UNLOCKED:k")).toBeUndefined();
    expect(mockKeychain.get("WHEN_UNLOCKED_THIS_DEVICE_ONLY:k")).toBe("legacy");
  });

  it("still returns the legacy value when deleting it fails", async () => {
    mockKeychain.set("WHEN_UNLOCKED:k", "legacy");
    deleteItemAsync.mockRejectedValueOnce(BROKEN);
    expect(await getSecureItem("k")).toBe("legacy");
  });

  it("reads an item stored without options", async () => {
    mockKeychain.set("default:k", "plain");
    expect(await getSecureItem("k")).toBe("plain");
  });

  it("returns null when nothing is stored", async () => {
    expect(await getSecureItem("missing")).toBeNull();
    expect(getItemAsync).toHaveBeenCalledTimes(3);
  });

  it("returns null when the keychain is locked", async () => {
    getItemAsync.mockRejectedValueOnce(LOCKED);
    expect(await getSecureItem("k")).toBeNull();
  });

  it("rethrows other errors", async () => {
    getItemAsync.mockRejectedValueOnce(BROKEN);
    await expect(getSecureItem("k")).rejects.toBe(BROKEN);
  });
});

describe("setSecureItem", () => {
  it("writes with device-only accessibility", async () => {
    expect(await setSecureItem("k", "v")).toBe(true);
    expect(setItemAsync).toHaveBeenCalledWith("k", "v", {
      keychainAccessible: "WHEN_UNLOCKED_THIS_DEVICE_ONLY",
    });
  });

  it("drops the write when the keychain is locked", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    setItemAsync.mockRejectedValueOnce(LOCKED);
    expect(await setSecureItem("k", "v")).toBe(false);
    warn.mockRestore();
  });

  it("rethrows other errors", async () => {
    setItemAsync.mockRejectedValueOnce(BROKEN);
    await expect(setSecureItem("k", "v")).rejects.toBe(BROKEN);
  });
});

describe("deleteSecureItem", () => {
  it("deletes every accessibility variant", async () => {
    mockKeychain.set("WHEN_UNLOCKED:k", "a");
    mockKeychain.set("WHEN_UNLOCKED_THIS_DEVICE_ONLY:k", "b");
    mockKeychain.set("default:k", "c");
    await deleteSecureItem("k");
    expect(mockKeychain.size).toBe(0);
  });

  it("ignores a locked keychain", async () => {
    deleteItemAsync.mockRejectedValueOnce(LOCKED);
    await expect(deleteSecureItem("k")).resolves.toBeUndefined();
  });

  it("rethrows other errors", async () => {
    deleteItemAsync.mockRejectedValueOnce(BROKEN);
    await expect(deleteSecureItem("k")).rejects.toBe(BROKEN);
  });
});
