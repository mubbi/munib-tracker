jest.mock("expo-constants", () => require("@/test-support/mocks/expo-constants").expoConstantsMock);

type SentryMock = {
  init: jest.Mock;
  captureException: jest.Mock;
  expoRouterIntegration: jest.Mock;
};

const ENV_KEYS = ["EXPO_PUBLIC_SENTRY_DSN", "EXPO_PUBLIC_SENTRY_ENABLED_IN_DEV"] as const;
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

type Constants = typeof import("@/test-support/mocks/expo-constants").mockExpoConstants;

/**
 * Fresh module (DSN + `initialized` are module state) with the given env and
 * expo-constants overrides (applied to the isolated registry's mock).
 */
function setup(
  env: Partial<Record<(typeof ENV_KEYS)[number], string>> = {},
  constants: Partial<Constants> = {},
) {
  for (const key of ENV_KEYS) {
    if (env[key] === undefined) delete process.env[key];
    else process.env[key] = env[key];
  }
  let subject!: typeof import("@/lib/sentry");
  let sentry!: SentryMock;
  jest.isolateModules(() => {
    Object.assign(require("@/test-support/mocks/expo-constants").mockExpoConstants, constants);
    sentry = require("@sentry/react-native");
    subject = require("@/lib/sentry");
  });
  sentry.init.mockClear();
  return { ...subject, sentry };
}

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

describe("initSentry", () => {
  it("initializes once with the app release and router integration", () => {
    const { initSentry, sentry } = setup({}, { expoConfig: { slug: "munib", version: "2.1.0" } });
    initSentry();
    initSentry();
    expect(sentry.init).toHaveBeenCalledTimes(1);
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ release: "munib@2.1.0", attachStacktrace: true }),
    );
    expect(sentry.expoRouterIntegration).toHaveBeenCalledWith({ enableTimeToInitialDisplay: true });
  });

  it("falls back to default release names without an expo config", () => {
    const { initSentry, sentry } = setup({}, { expoConfig: null });
    initSentry();
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ release: "munib-tracker@0.0.0" }),
    );
  });

  it("disables native frame tracking inside Expo Go", () => {
    const { initSentry, sentry } = setup({}, { executionEnvironment: "storeClient" });
    initSentry();
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ enableNativeFramesTracking: false }),
    );
  });

  it.each([
    [{}, false],
    [{ EXPO_PUBLIC_SENTRY_ENABLED_IN_DEV: "true" }, true],
  ])("in dev builds, env %p → enabled=%p", (env, enabled) => {
    const { initSentry, sentry } = setup(env);
    initSentry();
    expect(sentry.init).toHaveBeenCalledWith(expect.objectContaining({ enabled, debug: enabled }));
  });

  it("enables production sampling in release builds", () => {
    const g = globalThis as { __DEV__?: boolean };
    const dev = g.__DEV__;
    g.__DEV__ = false;
    try {
      const { initSentry, sentry } = setup();
      initSentry();
      expect(sentry.init).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: true,
          debug: false,
          environment: "production",
          tracesSampleRate: 0.2,
        }),
      );
    } finally {
      g.__DEV__ = dev;
    }
  });

  it("stays off without a DSN", () => {
    const { initSentry, sentry } = setup({ EXPO_PUBLIC_SENTRY_DSN: "   " });
    initSentry();
    expect(sentry.init).not.toHaveBeenCalled();
  });

  it("uses a custom DSN from the environment", () => {
    const { initSentry, sentry } = setup({ EXPO_PUBLIC_SENTRY_DSN: " https://key@sentry.test/1 " });
    initSentry();
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: "https://key@sentry.test/1" }),
    );
  });
});

describe("captureAppException", () => {
  it("drops errors before Sentry is initialized", () => {
    const { captureAppException, sentry } = setup();
    captureAppException(new Error("early"));
    expect(sentry.captureException).not.toHaveBeenCalled();
  });

  it("forwards errors and context once initialized", () => {
    const { initSentry, captureAppException, sentry } = setup();
    initSentry();
    const error = new Error("boom");
    captureAppException(error, { tags: { area: "test" } });
    expect(sentry.captureException).toHaveBeenCalledWith(error, { tags: { area: "test" } });
  });
});

describe("credential scrubbing", () => {
  type Options = {
    beforeBreadcrumb: (b: Record<string, unknown>) => Record<string, unknown> | null;
    beforeSend: (e: Record<string, unknown>) => Record<string, unknown> | null;
  };

  function initOptions(): Options {
    const { initSentry, sentry } = setup();
    initSentry();
    return sentry.init.mock.calls[0][0] as Options;
  }

  it("filters OAuth codes, kids link tokens and TV pairing codes from URLs", () => {
    const { scrubSensitiveUrl } = setup();
    expect(scrubSensitiveUrl("/oauth2redirect?code=4/abc&state=xyz&lang=en")).toBe(
      "/oauth2redirect?code=[Filtered]&state=[Filtered]&lang=en",
    );
    expect(scrubSensitiveUrl("https://my.munibtracker.app/kids/link?token=mtl_secret")).toBe(
      "https://my.munibtracker.app/kids/link?token=[Filtered]",
    );
    expect(scrubSensitiveUrl("https://api.x/api/v1/auth/tv/pairing/AB12CD")).toBe(
      "https://api.x/api/v1/auth/tv/pairing/[Filtered]",
    );
    expect(scrubSensitiveUrl("/circles?tab=feed")).toBe("/circles?tab=feed");
  });

  it("scrubs navigation and fetch breadcrumbs", () => {
    const { beforeBreadcrumb } = initOptions();
    expect(
      beforeBreadcrumb({
        category: "navigation",
        message: "/oauth/apple?code=c1",
        data: { from: "/", to: "/tv-pair?code=AB12", params: { token: "mtl_x" }, status: 200 },
      }),
    ).toEqual({
      category: "navigation",
      message: "/oauth/apple?code=[Filtered]",
      data: {
        from: "/",
        to: "/tv-pair?code=[Filtered]",
        params: { token: "[Filtered]" },
        status: 200,
      },
    });
  });

  it("scrubs the request URL of error events", () => {
    const { beforeSend } = initOptions();
    expect(
      beforeSend({
        request: { url: "https://my.munibtracker.app/?code=x", query_string: "code=x" },
      }),
    ).toEqual({
      request: {
        url: "https://my.munibtracker.app/?code=[Filtered]",
        query_string: "code=[Filtered]",
      },
    });
  });
});
