import { createPronunciationClient } from "./client.ts";
import { QuranLabError, quranLabKeyFor, toQuranLabCode } from "./types";

describe("toQuranLabCode", () => {
  it("passes through known codes", () => {
    for (const code of [
      "invalid_key",
      "storage_full",
      "microphone_denied",
      "not_configured",
    ] as const) {
      expect(toQuranLabCode({ code })).toBe(code);
    }
  });

  it("maps SDK state errors and anything else to engine_failed", () => {
    expect(toQuranLabCode({ code: "client_exists" })).toBe("engine_failed");
    expect(toQuranLabCode({ code: "session_open" })).toBe("engine_failed");
    expect(toQuranLabCode({ code: 42 })).toBe("engine_failed");
    expect(toQuranLabCode(new Error("x"))).toBe("engine_failed");
    expect(toQuranLabCode(null)).toBe("engine_failed");
  });
});

describe("quranLabKeyFor", () => {
  const keys = {
    ios: "EXPO_PUBLIC_QURANLAB_KEY_IOS",
    android: "EXPO_PUBLIC_QURANLAB_KEY_ANDROID",
    web: "EXPO_PUBLIC_QURANLAB_KEY_WEB",
  } as const;

  afterEach(() => {
    for (const k of Object.values(keys)) delete process.env[k];
  });

  it("reads and trims the per-platform key", () => {
    process.env[keys.ios] = " i ";
    process.env[keys.android] = "a";
    process.env[keys.web] = "w";
    expect(quranLabKeyFor("ios")).toBe("i");
    expect(quranLabKeyFor("android")).toBe("a");
    expect(quranLabKeyFor("web")).toBe("w");
  });

  it("returns null when missing or blank", () => {
    expect(quranLabKeyFor("ios")).toBeNull();
    process.env[keys.web] = "   ";
    expect(quranLabKeyFor("web")).toBeNull();
  });
});

describe("QuranLabError", () => {
  it("defaults the message to the code", () => {
    const error = new QuranLabError("cancelled");
    expect(error.code).toBe("cancelled");
    expect(error.message).toBe("cancelled");
    expect(new QuranLabError("cancelled", "why").message).toBe("why");
  });
});

describe("fallback pronunciation client", () => {
  it("rejects SDK calls and returns empty state", async () => {
    const client = createPronunciationClient();
    expect(client.available).toBe(false);
    await expect(client.configure()).rejects.toMatchObject({ code: "runtime_unsupported" });
    await expect(client.prefetch(jest.fn())).rejects.toBeInstanceOf(QuranLabError);
    await expect(client.openModel()).rejects.toBeInstanceOf(QuranLabError);
    await expect(client.startTake([], jest.fn(), jest.fn())).rejects.toBeInstanceOf(QuranLabError);
    await expect(client.finishTake()).rejects.toBeInstanceOf(QuranLabError);
    await client.cancelTake();
    await client.removeModels();
    await client.setSharingOn(true);
    await client.close();
    expect(await client.storageBytes()).toBe(0);
    expect(await client.sharingState()).toEqual({
      isAvailable: false,
      isOn: false,
      recoveryCode: null,
    });
    expect(await client.deleteShared()).toBe(false);
  });
});
