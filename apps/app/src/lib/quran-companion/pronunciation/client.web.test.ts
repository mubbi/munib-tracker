import { createPronunciationClient } from "./client.web";

const g = globalThis as Record<string, unknown>;
const KEY = "EXPO_PUBLIC_QURANLAB_KEY_WEB";

describe("pronunciation client (web)", () => {
  afterEach(() => {
    delete process.env[KEY];
    delete g.window;
    delete g.AudioWorkletNode;
  });

  function secureBrowser() {
    process.env[KEY] = "web-key";
    g.window = { isSecureContext: true };
    g.AudioWorkletNode = class {};
  }

  it("is unavailable without a key and reports not_configured", async () => {
    const client = createPronunciationClient();
    expect(client.available).toBe(false);
    await expect(client.configure()).rejects.toMatchObject({ code: "not_configured" });
    await expect(client.prefetch(jest.fn())).rejects.toMatchObject({ code: "not_configured" });
    await expect(client.openModel()).rejects.toMatchObject({ code: "not_configured" });
    await expect(client.startTake([], jest.fn(), jest.fn())).rejects.toMatchObject({
      code: "not_configured",
    });
    await expect(client.removeModels()).rejects.toMatchObject({ code: "not_configured" });
    await expect(client.setSharingOn(true)).rejects.toMatchObject({ code: "not_configured" });
    await expect(client.deleteShared()).rejects.toMatchObject({ code: "not_configured" });
    expect(await client.storageBytes()).toBe(0);
    expect(await client.sharingState()).toEqual({
      isAvailable: false,
      isOn: false,
      recoveryCode: null,
    });
  });

  it("is unavailable outside a secure context even with a key", async () => {
    process.env[KEY] = "web-key";
    g.window = { isSecureContext: false };
    g.AudioWorkletNode = class {};
    const client = createPronunciationClient();
    expect(client.available).toBe(false);
    await expect(client.configure()).rejects.toMatchObject({ code: "runtime_unsupported" });
  });

  it("is available in a secure browser with WebAssembly + AudioWorklet", () => {
    secureBrowser();
    expect(createPronunciationClient().available).toBe(true);
  });

  it("maps SDK load failures to engine_failed and storage to 0", async () => {
    secureBrowser();
    const client = createPronunciationClient();
    // The SDK chunk cannot be loaded under Jest (dynamic import), which exercises
    // the load-failure path the UI shows as "engine failed".
    await expect(client.configure()).rejects.toMatchObject({ code: "engine_failed" });
    expect(await client.storageBytes()).toBe(0);
  });

  it("finishTake without a take is cancelled; cancel and close are safe no-ops", async () => {
    const client = createPronunciationClient();
    await expect(client.finishTake()).rejects.toMatchObject({ code: "cancelled" });
    await expect(client.cancelTake()).resolves.toBeUndefined();
    await expect(client.close()).resolves.toBeUndefined();
  });
});
