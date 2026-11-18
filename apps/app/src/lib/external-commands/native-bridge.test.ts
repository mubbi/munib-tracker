import { loadOnPlatformWithNativeModules } from "@/test-support/mocks/expo-native-modules";

type Bridge = typeof import("./native-bridge");

const COMMAND = { type: "mark-current-obligatory" as const, source: "widget" as const };

function fakeModule(overrides: Record<string, jest.Mock> = {}) {
  return {
    enqueueCommand: jest.fn(async () => undefined),
    drainCommands: jest.fn(async () => [JSON.stringify(COMMAND), "{bad json"]),
    sendWidgetMarkBroadcast: jest.fn(async () => undefined),
    pushWearSnapshot: jest.fn(async () => undefined),
    pushWatchSnapshot: jest.fn(async () => undefined),
    activateWatchSession: jest.fn(async () => undefined),
    publishAndroidWidgetPreviews: jest.fn(async () => 1),
    updateOngoingNotification: jest.fn(async () => undefined),
    cancelOngoingNotification: jest.fn(async () => undefined),
    applyOngoingPhasePayload: jest.fn(async () => undefined),
    canPostPromotedNotifications: jest.fn(async () => true),
    openPromotedNotificationSettings: jest.fn(async () => undefined),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    ...overrides,
  };
}

let restorePlatform: () => void = () => {};
afterEach(() => restorePlatform());

/** Loads the bridge on `OS` with `module` (or none) registered as MunibExternalCommands. */
function load(module: ReturnType<typeof fakeModule> | null, OS: "ios" | "android" | "web" = "ios") {
  const loaded = loadOnPlatformWithNativeModules(
    { OS },
    module ? { MunibExternalCommands: module } : {},
    () => require("./native-bridge"),
  );
  restorePlatform = loaded.restore;
  return loaded.module as Bridge;
}

const failing = () => jest.fn(async () => Promise.reject(new Error("native")));

describe("without the native module", () => {
  it("no-ops everything", async () => {
    const bridge = load(null);
    expect(bridge.isExternalCommandsSupported()).toBe(false);
    await expect(bridge.nativeEnqueueCommand(COMMAND)).resolves.toBeUndefined();
    expect(await bridge.nativeDrainCommands()).toEqual([]);
    await expect(bridge.nativeSendWidgetMarkBroadcast(COMMAND)).resolves.toBeUndefined();
    await expect(bridge.nativePushWearSnapshot("{}")).resolves.toBeUndefined();
    await expect(bridge.nativePushWatchSnapshot("{}")).resolves.toBeUndefined();
    await expect(bridge.nativeActivateWatchSession()).resolves.toBeUndefined();
    expect(bridge.subscribeNativeCommands(jest.fn())).toEqual(expect.any(Function));
  });

  it("never loads the module on web", () => {
    expect(load(fakeModule(), "web").isExternalCommandsSupported()).toBe(false);
  });
});

describe("with the native module", () => {
  it("enqueues commands as JSON", async () => {
    const module = fakeModule();
    await load(module).nativeEnqueueCommand(COMMAND);
    expect(module.enqueueCommand).toHaveBeenCalledWith(JSON.stringify(COMMAND));
  });

  it("drains commands and skips malformed entries", async () => {
    expect(await load(fakeModule()).nativeDrainCommands()).toEqual([COMMAND]);
  });

  it("returns no commands when draining fails", async () => {
    expect(await load(fakeModule({ drainCommands: failing() })).nativeDrainCommands()).toEqual([]);
  });

  it.each([
    ["nativeEnqueueCommand", "enqueueCommand", [COMMAND]],
    ["nativeSendWidgetMarkBroadcast", "sendWidgetMarkBroadcast", [COMMAND]],
    ["nativePushWearSnapshot", "pushWearSnapshot", ["{}"]],
    ["nativePushWatchSnapshot", "pushWatchSnapshot", ["{}"]],
    ["nativeActivateWatchSession", "activateWatchSession", []],
  ] as const)("%s swallows native failures", async (fn, method, args) => {
    const bridge = load(fakeModule({ [method]: failing() }));
    await expect(
      (bridge[fn] as (...a: unknown[]) => Promise<void>)(...args),
    ).resolves.toBeUndefined();
  });

  it.each([
    [
      "nativeSendWidgetMarkBroadcast",
      "sendWidgetMarkBroadcast",
      [COMMAND],
      JSON.stringify(COMMAND),
    ],
    ["nativePushWearSnapshot", "pushWearSnapshot", ['{"w":1}'], '{"w":1}'],
    ["nativePushWatchSnapshot", "pushWatchSnapshot", ['{"i":1}'], '{"i":1}'],
  ] as const)("%s forwards to the module", async (fn, method, args, expected) => {
    const module = fakeModule();
    await (load(module)[fn] as (...a: unknown[]) => Promise<void>)(...args);
    expect(module[method]).toHaveBeenCalledWith(expected);
  });

  it("subscribes and unsubscribes to command availability", () => {
    const remove = jest.fn();
    const module = fakeModule({ addListener: jest.fn(() => ({ remove })) });
    const listener = jest.fn();
    const unsubscribe = load(module).subscribeNativeCommands(listener);
    expect(module.addListener).toHaveBeenCalledWith("onCommandsAvailable", listener);
    unsubscribe();
    expect(remove).toHaveBeenCalled();
  });

  it("tolerates a throwing addListener", () => {
    const module = fakeModule({
      addListener: jest.fn(() => {
        throw new Error("no events");
      }),
    });
    expect(() => load(module).subscribeNativeCommands(jest.fn())()).not.toThrow();
  });
});

describe("Android-only surfaces", () => {
  it("are no-ops on iOS", async () => {
    const module = fakeModule();
    const bridge = load(module, "ios");
    expect(await bridge.nativePublishAndroidWidgetPreviews("{}")).toBe(false);
    expect(await bridge.nativeCanPostPromotedNotifications()).toBe(false);
    await bridge.nativeUpdateOngoingNotification("{}");
    await bridge.nativeCancelOngoingNotification();
    await bridge.nativeApplyOngoingPhasePayload("{}");
    await bridge.nativeOpenPromotedNotificationSettings();
    expect(module.updateOngoingNotification).not.toHaveBeenCalled();
    expect(module.openPromotedNotificationSettings).not.toHaveBeenCalled();
  });

  it("forward to the module on Android", async () => {
    const module = fakeModule();
    const bridge = load(module, "android");
    expect(await bridge.nativePublishAndroidWidgetPreviews("{}")).toBe(true);
    expect(await bridge.nativeCanPostPromotedNotifications()).toBe(true);
    await bridge.nativeUpdateOngoingNotification('{"a":1}');
    await bridge.nativeCancelOngoingNotification();
    await bridge.nativeApplyOngoingPhasePayload('{"p":1}');
    await bridge.nativeOpenPromotedNotificationSettings();
    expect(module.updateOngoingNotification).toHaveBeenCalledWith('{"a":1}');
    expect(module.cancelOngoingNotification).toHaveBeenCalled();
    expect(module.applyOngoingPhasePayload).toHaveBeenCalledWith('{"p":1}');
    expect(module.openPromotedNotificationSettings).toHaveBeenCalled();
  });

  it("swallow native failures on Android", async () => {
    const module = fakeModule({
      publishAndroidWidgetPreviews: failing(),
      canPostPromotedNotifications: failing(),
      updateOngoingNotification: failing(),
      cancelOngoingNotification: failing(),
      applyOngoingPhasePayload: failing(),
      openPromotedNotificationSettings: failing(),
    });
    const bridge = load(module, "android");
    expect(await bridge.nativePublishAndroidWidgetPreviews("{}")).toBe(false);
    expect(await bridge.nativeCanPostPromotedNotifications()).toBe(false);
    await expect(bridge.nativeUpdateOngoingNotification("{}")).resolves.toBeUndefined();
    await expect(bridge.nativeCancelOngoingNotification()).resolves.toBeUndefined();
    await expect(bridge.nativeApplyOngoingPhasePayload("{}")).resolves.toBeUndefined();
    await expect(bridge.nativeOpenPromotedNotificationSettings()).resolves.toBeUndefined();
  });
});
