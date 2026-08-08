import { sanitizeLogArgs, sanitizeLogValue, shouldSuppressDevLog } from "./dev-log-filter";

describe("shouldSuppressDevLog", () => {
  it("drops the VirtualizedList false-positive warning", () => {
    expect(
      shouldSuppressDevLog([
        "VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices as much as possible.",
      ]),
    ).toBe(true);
  });

  it("keeps unrelated messages", () => {
    expect(shouldSuppressDevLog(["hydration complete"])).toBe(false);
    expect(shouldSuppressDevLog([42])).toBe(false);
  });
});

describe("sanitizeLogValue", () => {
  it("redacts App Store Connect env names embedded in strings", () => {
    expect(sanitizeLogValue("EXPO_ASC_API_KEY_ISSUER_ID=abc")).toBe("[REDACTED]=abc");
    expect(sanitizeLogValue("missing APP_STORE_CONNECT_API_ISSUER_ID")).toBe("missing [REDACTED]");
  });

  it("leaves ordinary strings alone", () => {
    expect(sanitizeLogValue("hydration complete")).toBe("hydration complete");
  });

  it("redacts secret-like object keys without touching other fields", () => {
    expect(
      sanitizeLogValue({
        EXPO_ASC_API_KEY_ISSUER_ID: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        token: "opaque",
        locale: "en",
      }),
    ).toEqual({
      EXPO_ASC_API_KEY_ISSUER_ID: "[REDACTED]",
      token: "[REDACTED]",
      locale: "en",
    });
  });

  it("walks arrays and nested plain objects", () => {
    expect(
      sanitizeLogValue([{ password: "secret", ok: true }, "EXPO_ASC_ISSUER_ID present"]),
    ).toEqual([{ password: "[REDACTED]", ok: true }, "[REDACTED] present"]);
  });

  it("does not throw on circular objects", () => {
    const cyclic: { self?: unknown; label: string } = { label: "cycle" };
    cyclic.self = cyclic;
    expect(sanitizeLogValue(cyclic)).toEqual({ label: "cycle", self: "[Circular]" });
  });

  it("treats null-prototype objects as plain", () => {
    const value = Object.assign(Object.create(null), { locale: "en" });
    expect(sanitizeLogValue(value)).toEqual({ locale: "en" });
  });
});

describe("sanitizeLogArgs", () => {
  it("sanitizes each argument independently", () => {
    expect(sanitizeLogArgs(["ok", { authorization: "Bearer x" }])).toEqual([
      "ok",
      { authorization: "[REDACTED]" },
    ]);
  });
});

describe("dev console filter", () => {
  const originalLog = console.log;
  const originalDev = (globalThis as { __DEV__?: boolean }).__DEV__;

  afterEach(() => {
    console.log = originalLog;
    (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
    jest.resetModules();
  });

  it("suppresses VirtualizedList noise and redacts secrets in __DEV__", () => {
    const log = jest.fn();
    console.log = log;
    (globalThis as { __DEV__: boolean }).__DEV__ = true;

    jest.isolateModules(() => {
      require("./dev-log-filter");
    });

    console.log("VirtualizedList: You have a large list that is slow to update. Make sure…");
    expect(log).not.toHaveBeenCalled();

    console.log("ready", { token: "opaque", locale: "en" });
    expect(log).toHaveBeenCalledWith("ready", { token: "[REDACTED]", locale: "en" });
  });

  it("does not wrap console.log outside __DEV__", () => {
    const log = jest.fn();
    console.log = log;
    (globalThis as { __DEV__: boolean }).__DEV__ = false;

    jest.isolateModules(() => {
      require("./dev-log-filter");
    });

    expect(console.log).toBe(log);
    console.log("VirtualizedList: You have a large list that is slow to update.");
    expect(log).toHaveBeenCalledWith(
      "VirtualizedList: You have a large list that is slow to update.",
    );
  });
});
