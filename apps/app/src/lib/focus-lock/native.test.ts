import { loadOnPlatformWithNativeModules } from "@/test-support/mocks/expo-native-modules";
import type { PlatformOverrides } from "@/test-support/platform";

type Native = typeof import("./native");

function fakeModule() {
  return {
    isSupported: jest.fn(() => true),
    authorizationStatus: jest.fn(async () => "granted"),
    requestAuthorization: jest.fn(async () => "granted"),
    pickApps: jest.fn(async () => ({ count: 3 })),
    selectionCount: jest.fn(async () => 3),
    setPlan: jest.fn(async () => undefined),
    endWindowNow: jest.fn(async () => undefined),
    status: jest.fn(async () => ({ active: true, windowId: "w", emergencyLeft: 1 })),
    reset: jest.fn(async () => undefined),
    permissions: jest.fn(async () => ({
      usageAccess: true,
      overlay: false,
      exactAlarm: true,
      notifications: true,
      batteryUnrestricted: false,
    })),
    setBlockedPackages: jest.fn(async (pkgs: string[]) => ({ count: pkgs.length })),
  };
}

let restore: () => void = () => {};
const ENV = "EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS";
afterEach(() => {
  restore();
  delete process.env[ENV];
});

function load(module: ReturnType<typeof fakeModule> | null, platform: PlatformOverrides): Native {
  const loaded = loadOnPlatformWithNativeModules(
    platform,
    module ? { MunibFocusLock: module } : {},
    () => require("./native"),
  );
  restore = loaded.restore;
  return loaded.module as Native;
}

describe("soft fallback (no hard block)", () => {
  it.each([
    ["web", { OS: "web" as const }],
    ["Android TV", { OS: "android" as const, isTV: true }],
    ["iOS with the hard block switched off (D17, =0)", { OS: "ios" as const }],
  ])("no-ops on %s", async (_label, platform) => {
    process.env[ENV] = "0";
    const fake = fakeModule();
    const native = load(fake, platform);
    expect(native.focusLockCapability()).toBe("soft");
    expect(native.focusLockPlatform()).toBeNull();
    expect(await native.requestAuthorization()).toBe("denied");
    expect(await native.pickApps()).toEqual({ count: 0 });
    await native.setPlan([], {} as never);
    await native.endWindowNow("w");
    expect(await native.status()).toEqual({ active: false, emergencyLeft: 0 });
    expect(fake.setPlan).not.toHaveBeenCalled();
  });
});

describe("hard block", () => {
  it("calls through on Android", async () => {
    const fake = fakeModule();
    const native = load(fake, { OS: "android" });
    expect(native.focusLockCapability()).toBe("hard");
    expect(native.focusLockPlatform()).toBe("android");
    await native.setPlan([], {} as never);
    expect(fake.setPlan).toHaveBeenCalled();
    await native.endWindowNow();
    expect(fake.endWindowNow).toHaveBeenCalledWith(null);
    expect((await native.androidPermissions()).overlay).toBe(false);
    expect(await native.setBlockedPackages(["a", "b"])).toEqual({ count: 2 });
  });

  it("loads on iOS by default (Family Controls Distribution granted)", () => {
    const native = load(fakeModule(), { OS: "ios" });
    expect(native.focusLockCapability()).toBe("hard");
    expect(native.isHardIosFlagOn()).toBe(true);
  });

  it("swallows native failures with safe defaults", async () => {
    const fake = fakeModule();
    fake.status.mockRejectedValue(new Error("native"));
    fake.setPlan.mockRejectedValue(new Error("native"));
    fake.isSupported.mockImplementation(() => {
      throw new Error("native");
    });
    const native = load(fake, { OS: "android" });
    expect(native.focusLockCapability()).toBe("soft");
    await expect(native.setPlan([], {} as never)).resolves.toBeUndefined();
    expect(await native.status()).toEqual({ active: false, emergencyLeft: 0 });
  });
});
