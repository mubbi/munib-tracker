import { loadOnPlatformWithNativeModules } from "@/test-support/mocks/expo-native-modules";
import type { PlatformOverrides } from "@/test-support/platform";

type Native = typeof import("./native");

function fakeModule() {
  const listeners = new Map<string, (payload: unknown) => void>();
  return {
    listeners,
    isSupported: jest.fn(() => true),
    authorizationStatus: jest.fn(() => "notDetermined"),
    getState: jest.fn(() => "poweredOn"),
    locationServicesEnabled: jest.fn(() => false),
    requestAuthorization: jest.fn(async () => "granted"),
    startAdvertising: jest.fn(async () => undefined),
    stopAdvertising: jest.fn(async () => undefined),
    startScanning: jest.fn(async () => undefined),
    stopScanning: jest.fn(async () => undefined),
    addListener: jest.fn((event: string, listener: (payload: unknown) => void) => {
      listeners.set(event, listener);
      return { remove: jest.fn(() => listeners.delete(event)) };
    }),
  };
}

let restore: () => void = () => {};
afterEach(() => restore());

function load(module: ReturnType<typeof fakeModule> | null, platform: PlatformOverrides): Native {
  const loaded = loadOnPlatformWithNativeModules(
    platform,
    module ? { MunibNearby: module } : {},
    () => require("./native"),
  );
  restore = loaded.restore;
  return loaded.module as Native;
}

describe("unavailable (QR / code only)", () => {
  it.each([
    ["web", { OS: "web" as const }],
    ["Android TV", { OS: "android" as const, isTV: true }],
    ["Apple TV", { OS: "ios" as const, isTV: true }],
  ])("no-ops on %s even when a module is registered", async (_label, platform) => {
    const fake = fakeModule();
    const native = load(fake, platform);
    expect(native.isNearbyAvailable()).toBe(false);
    expect(native.nearbyRadioState()).toBe("unsupported");
    expect(native.nearbyAuthorizationStatus()).toBe("denied");
    expect(await native.requestNearbyAuthorization()).toBe("denied");
    await expect(native.startNearbyAdvertising("x", 1000)).rejects.toMatchObject({
      code: "ERR_UNSUPPORTED",
    });
    await expect(native.startNearbyScanning("x", 1000)).rejects.toMatchObject({
      code: "ERR_UNSUPPORTED",
    });
    await native.stopNearbyAdvertising();
    await native.stopNearbyScanning();
    expect(native.addNearbyListener("onDiscovered", jest.fn())).toEqual(expect.any(Function));
    expect(fake.startAdvertising).not.toHaveBeenCalled();
  });

  it("is unavailable in a phone build without the module (Expo Go)", () => {
    expect(load(null, { OS: "ios" }).isNearbyAvailable()).toBe(false);
  });
});

describe("phone build with the module", () => {
  it("forwards calls and events", async () => {
    const fake = fakeModule();
    const native = load(fake, { OS: "android" });
    expect(native.isNearbyAvailable()).toBe(true);
    expect(native.nearbyAuthorizationStatus()).toBe("notDetermined");
    expect(native.nearbyLocationServicesEnabled()).toBe(false);
    await native.startNearbyAdvertising("uuid", 600_000);
    expect(fake.startAdvertising).toHaveBeenCalledWith("uuid", 600_000);
    await native.startNearbyScanning("9a3c5e71-2b84-4f06", 600_000);
    expect(fake.startScanning).toHaveBeenCalledWith("9a3c5e71-2b84-4f06", 600_000);

    const seen = jest.fn();
    const off = native.addNearbyListener("onDiscovered", seen);
    fake.listeners.get("onDiscovered")?.({ serviceUuid: "u", rssi: -50 });
    expect(seen).toHaveBeenCalledWith({ serviceUuid: "u", rssi: -50 });
    off();
    expect(fake.listeners.has("onDiscovered")).toBe(false);
  });

  it("swallows stop failures and degrades a throwing isSupported to unavailable", async () => {
    const fake = fakeModule();
    fake.stopAdvertising.mockRejectedValue(new Error("off"));
    fake.isSupported.mockImplementation(() => {
      throw new Error("boom");
    });
    const native = load(fake, { OS: "ios" });
    await expect(native.stopNearbyAdvertising()).resolves.toBeUndefined();
    expect(native.isNearbyAvailable()).toBe(false);
  });

  it("reads the native rejection code", () => {
    const native = load(fakeModule(), { OS: "ios" });
    expect(native.nearbyErrorCode(Object.assign(new Error(), { code: "ERR_BLUETOOTH_OFF" }))).toBe(
      "ERR_BLUETOOTH_OFF",
    );
    expect(native.nearbyErrorCode(new Error("x"))).toBe("ERR_UNKNOWN");
    expect(native.nearbyErrorCode({ code: "ERR_SOMETHING_ELSE" })).toBe("ERR_UNKNOWN");
  });
});
