import { loadOnPlatformWithNativeModules } from "@/test-support/mocks/expo-native-modules";
import type { PlatformOverrides } from "@/test-support/platform";

type Native = typeof import("./native");

const STATE = { phase: "countdown" } as never;

function fakeModule(overrides: Record<string, jest.Mock> = {}) {
  return {
    isSupported: jest.fn(() => true),
    isRunning: jest.fn(() => true),
    start: jest.fn(async () => "id"),
    update: jest.fn(async () => undefined),
    end: jest.fn(async () => undefined),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    ...overrides,
  };
}

let restore: () => void = () => {};
afterEach(() => restore());

function load(
  module: ReturnType<typeof fakeModule> | null,
  platform: PlatformOverrides = { OS: "ios" },
) {
  const loaded = loadOnPlatformWithNativeModules(
    platform,
    module ? { MunibLiveActivity: module } : {},
    () => require("./native"),
  );
  restore = loaded.restore;
  return loaded.module as Native;
}

const throwing = () =>
  jest.fn(() => {
    throw new Error("native");
  });
const rejecting = () => jest.fn(async () => Promise.reject(new Error("native")));

describe("without ActivityKit", () => {
  it.each([
    ["Android", { OS: "android" as const }],
    ["iOS without the module", { OS: "ios" as const }],
  ])("no-ops on %s", async (_label, platform) => {
    const native = load(_label === "Android" ? fakeModule() : null, platform);
    expect(native.isLiveActivitySupported()).toBe(false);
    expect(native.isLiveActivityRunning()).toBe(false);
    await native.startLiveActivity(STATE);
    await native.updateLiveActivity(STATE);
    await native.endLiveActivity();
    expect(native.subscribeLiveActivityPushTokens(jest.fn())).toEqual(expect.any(Function));
    expect(native.subscribeLiveActivityLifecycle(jest.fn())).toEqual(expect.any(Function));
  });

  it("is unsupported on Apple TV", () => {
    expect(load(fakeModule(), { OS: "ios", isTV: true }).isLiveActivitySupported()).toBe(false);
  });
});

describe("with ActivityKit", () => {
  it("reports support and running state", () => {
    const native = load(fakeModule());
    expect(native.isLiveActivitySupported()).toBe(true);
    expect(native.isLiveActivityRunning()).toBe(true);
  });

  it("treats throwing probes as unsupported / not running", () => {
    const native = load(fakeModule({ isSupported: throwing(), isRunning: throwing() }));
    expect(native.isLiveActivitySupported()).toBe(false);
    expect(native.isLiveActivityRunning()).toBe(false);
  });

  it("forwards start / update / end", async () => {
    const module = fakeModule();
    const native = load(module);
    await native.startLiveActivity(STATE);
    await native.updateLiveActivity(STATE);
    await native.endLiveActivity();
    expect(module.start).toHaveBeenCalledWith(STATE);
    expect(module.update).toHaveBeenCalledWith(STATE);
    expect(module.end).toHaveBeenCalled();
  });

  it("swallows start / update / end failures", async () => {
    const native = load(fakeModule({ start: rejecting(), update: rejecting(), end: rejecting() }));
    await expect(native.startLiveActivity(STATE)).resolves.toBeUndefined();
    await expect(native.updateLiveActivity(STATE)).resolves.toBeUndefined();
    await expect(native.endLiveActivity()).resolves.toBeUndefined();
  });

  it.each([
    ["subscribeLiveActivityPushTokens", "onPushToken"],
    ["subscribeLiveActivityLifecycle", "onActivityState"],
  ] as const)("%s subscribes to %s and unsubscribes", (fn, event) => {
    const remove = jest.fn();
    const module = fakeModule({ addListener: jest.fn(() => ({ remove })) });
    const listener = jest.fn();
    const unsubscribe = load(module)[fn](listener);
    expect(module.addListener).toHaveBeenCalledWith(event, listener);
    unsubscribe();
    expect(remove).toHaveBeenCalled();
  });

  it.each(["subscribeLiveActivityPushTokens", "subscribeLiveActivityLifecycle"] as const)(
    "%s tolerates a throwing addListener",
    (fn) => {
      const native = load(fakeModule({ addListener: throwing() }));
      expect(() => native[fn](jest.fn())()).not.toThrow();
    },
  );
});
