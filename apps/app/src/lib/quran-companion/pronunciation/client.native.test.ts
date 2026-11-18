import { Platform } from "react-native";

type Listener = (e: Record<string, unknown>) => void;

const mockListeners = new Map<string, Listener>();
const mockRemove = jest.fn();
const mockModule = {
  configure: jest.fn(async (_key: string) => undefined),
  prefetch: jest.fn(async () => undefined),
  openModel: jest.fn(async () => ({
    version: "1",
    build: "b",
    defaultContext: "ctx",
    calibrationJson: '{"t":0.5}' as string | null,
  })),
  startTake: jest.fn(async (_heads: string[], _ms: number) => undefined),
  finishTake: jest.fn(async () => ({
    heads: [{ name: "madd", frameMs: 20, frames: 1, classes: 2, values: [0.1, 0.9] }],
  })),
  cancelTake: jest.fn(async () => undefined),
  removeModels: jest.fn(async () => undefined),
  storageBytes: jest.fn(async () => 1234),
  sharingState: jest.fn(async () => ({ isAvailable: true, isOn: false, recoveryCode: "abc" })),
  setSharingOn: jest.fn(async (_on: boolean) => undefined),
  deleteShared: jest.fn(async () => true),
  close: jest.fn(async () => undefined),
  addListener: jest.fn((event: string, fn: Listener) => {
    mockListeners.set(event, fn);
    return { remove: mockRemove };
  }),
};
let mockModulePresent = true;
jest.mock("./native-module", () => ({
  __esModule: true,
  get default() {
    return mockModulePresent ? mockModule : null;
  },
}));

import { setPlatform } from "@/test-support/platform";

import { createPronunciationClient } from "./client.native";

const ENV_IOS = "EXPO_PUBLIC_QURANLAB_KEY_IOS";
const ENV_ANDROID = "EXPO_PUBLIC_QURANLAB_KEY_ANDROID";

describe("pronunciation client (native)", () => {
  const restores: (() => void)[] = [];
  const onDevice = (OS: typeof Platform.OS, version: string | number, isTV = false) => {
    restores.push(setPlatform({ OS, isTV }));
    const spy = jest.spyOn(Platform, "Version", "get").mockReturnValue(version as never);
    restores.push(() => spy.mockRestore());
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockListeners.clear();
    mockModulePresent = true;
    process.env[ENV_IOS] = " ios-key ";
    process.env[ENV_ANDROID] = "android-key";
    onDevice("ios", "17.2");
  });

  afterEach(() => {
    while (restores.length) restores.pop()?.();
    delete process.env[ENV_IOS];
    delete process.env[ENV_ANDROID];
  });

  it("is available on iOS 15+ with a key and the native module", async () => {
    const client = createPronunciationClient();
    expect(client.available).toBe(true);
    await client.configure();
    await client.configure();
    expect(mockModule.configure).toHaveBeenCalledTimes(1);
    expect(mockModule.configure).toHaveBeenCalledWith("ios-key");
  });

  it.each([
    ["ios", "14.8", false],
    ["android", 25, false],
    ["android", 33, true],
  ] as const)("on %s %s availability is %s", (os, version, expected) => {
    onDevice(os, version);
    expect(createPronunciationClient().available).toBe(expected);
  });

  it("reports not_configured on platforms without a key slot", async () => {
    onDevice("web", "1");
    const client = createPronunciationClient();
    expect(client.available).toBe(false);
    await expect(client.configure()).rejects.toMatchObject({ code: "not_configured" });
  });

  it("reports runtime_unsupported on TV", async () => {
    onDevice("ios", "17", true);
    const client = createPronunciationClient();
    expect(client.available).toBe(false);
    await expect(client.configure()).rejects.toMatchObject({ code: "runtime_unsupported" });
  });

  it("is unavailable without the native module", () => {
    mockModulePresent = false;
    expect(createPronunciationClient().available).toBe(false);
  });

  it("is unavailable without a key", () => {
    delete process.env[ENV_IOS];
    expect(createPronunciationClient().available).toBe(false);
  });

  it("prefetch forwards progress and always removes its listener", async () => {
    const client = createPronunciationClient();
    const onProgress = jest.fn();
    mockModule.prefetch.mockImplementationOnce(async () => {
      mockListeners.get("onProgress")?.({ done: 5, total: 10 });
    });
    await client.prefetch(onProgress);
    expect(onProgress).toHaveBeenCalledWith(5, 10);
    expect(mockRemove).toHaveBeenCalledTimes(1);

    mockModule.prefetch.mockRejectedValueOnce(
      Object.assign(new Error("net"), { code: "needs_connection" }),
    );
    await expect(client.prefetch(onProgress)).rejects.toMatchObject({
      code: "needs_connection",
      message: "net",
    });
    expect(mockRemove).toHaveBeenCalledTimes(2);
  });

  it("openModel parses calibration JSON, tolerating none or garbage", async () => {
    const client = createPronunciationClient();
    await expect(client.openModel()).resolves.toEqual({
      version: "1",
      build: "b",
      defaultContext: "ctx",
      calibration: { t: 0.5 },
    });
    mockModule.openModel.mockResolvedValueOnce({
      version: "1",
      build: "b",
      defaultContext: "c",
      calibrationJson: null,
    });
    expect((await client.openModel()).calibration).toBeNull();
    mockModule.openModel.mockResolvedValueOnce({
      version: "1",
      build: "b",
      defaultContext: "c",
      calibrationJson: "{bad",
    });
    expect((await client.openModel()).calibration).toBeNull();
  });

  it("runs a take: forwards speech + end events and reports heard speech", async () => {
    const client = createPronunciationClient();
    const onSpeech = jest.fn();
    const onEnded = jest.fn();
    await client.startTake(["madd"], onSpeech, onEnded);
    expect(mockModule.startTake).toHaveBeenCalledWith(["madd"], 1500);
    mockListeners.get("onChunk")?.({ speech: false });
    mockListeners.get("onChunk")?.({ speech: true });
    mockListeners.get("onEnded")?.({ reason: "silence" });
    expect(onSpeech.mock.calls).toEqual([[false], [true]]);
    expect(onEnded).toHaveBeenCalledWith("silence");

    const result = await client.finishTake();
    expect(result.heardSpeech).toBe(true);
    expect(result.heads[0].name).toBe("madd");
    expect(mockRemove).toHaveBeenCalledTimes(2);

    // A new take resets heardSpeech.
    await client.startTake(["madd"], onSpeech, onEnded);
    mockModule.finishTake.mockRejectedValueOnce(new Error("x"));
    await expect(client.finishTake()).rejects.toMatchObject({ code: "engine_failed" });
  });

  it("finishTake without a module is runtime_unsupported", async () => {
    const client = createPronunciationClient();
    mockModulePresent = false;
    await expect(client.finishTake()).rejects.toMatchObject({ code: "runtime_unsupported" });
    await expect(client.cancelTake()).resolves.toBeUndefined();
    await expect(client.close()).resolves.toBeUndefined();
  });

  it("cancelTake swallows native errors", async () => {
    const client = createPronunciationClient();
    mockModule.cancelTake.mockRejectedValueOnce(new Error("ended"));
    await expect(client.cancelTake()).resolves.toBeUndefined();
    expect(mockModule.cancelTake).toHaveBeenCalled();
  });

  it("manages models, storage and sharing", async () => {
    const client = createPronunciationClient();
    await client.removeModels();
    expect(mockModule.removeModels).toHaveBeenCalled();
    expect(await client.storageBytes()).toBe(1234);
    mockModule.storageBytes.mockRejectedValueOnce(new Error("io"));
    expect(await client.storageBytes()).toBe(0);
    expect(await client.sharingState()).toEqual({
      isAvailable: true,
      isOn: false,
      recoveryCode: "abc",
    });
    await client.setSharingOn(true);
    expect(mockModule.setSharingOn).toHaveBeenCalledWith(true);
    expect(await client.deleteShared()).toBe(true);
  });

  it("short-circuits model and sharing calls when unavailable", async () => {
    delete process.env[ENV_IOS];
    const client = createPronunciationClient();
    await client.removeModels();
    expect(mockModule.removeModels).not.toHaveBeenCalled();
    expect(await client.storageBytes()).toBe(0);
    expect(await client.sharingState()).toEqual({
      isAvailable: false,
      isOn: false,
      recoveryCode: null,
    });
    await expect(client.setSharingOn(true)).rejects.toMatchObject({ code: "not_configured" });
    await expect(client.deleteShared()).rejects.toMatchObject({ code: "not_configured" });
  });

  it("close is a no-op until configured, then closes once and swallows errors", async () => {
    const client = createPronunciationClient();
    await client.close();
    expect(mockModule.close).not.toHaveBeenCalled();
    await client.configure();
    mockModule.close.mockRejectedValueOnce(new Error("gone"));
    await client.close();
    expect(mockModule.close).toHaveBeenCalledTimes(1);
    await client.close();
    expect(mockModule.close).toHaveBeenCalledTimes(1);
    // Configure again after close.
    await client.configure();
    expect(mockModule.configure).toHaveBeenCalledTimes(2);
  });
});
