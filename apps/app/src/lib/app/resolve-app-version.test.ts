jest.mock("expo-constants", () => require("@/test-support/mocks/expo-constants").expoConstantsMock);

type ConstantsMock = typeof import("@/test-support/mocks/expo-constants");

/**
 * jest.setup already loaded this module against the real expo-constants, so
 * load a fresh copy (and its matching mock instance) per test.
 */
function load(config: Record<string, unknown> | null = { version: "1.0.0" }) {
  let resolveAppVersion: () => string = () => "";
  jest.isolateModules(() => {
    const constants = require("@/test-support/mocks/expo-constants") as ConstantsMock;
    constants.mockExpoConstants.expoConfig = config;
    resolveAppVersion = require("./resolve-app-version").resolveAppVersion;
  });
  return resolveAppVersion;
}

// babel-preset-expo inlines `process.env.EXPO_OS` ("ios" under jest-expo), so
// only the iOS branch is reachable from Jest.
describe("on iOS builds", () => {
  const extraKey = "iosAppVersion";

  it("prefers the platform version from app.config extra", () => {
    expect(load({ version: "1.0.0", extra: { [extraKey]: " 2.3.4 " } })()).toBe("2.3.4");
  });

  it.each([
    ["a blank extra version", { version: "1.5.0", extra: { [extraKey]: "  " } }],
    ["a non-string extra version", { version: "1.5.0", extra: { [extraKey]: 3 } }],
    ["no extra", { version: "1.5.0" }],
  ])("falls back to expo.version with %s", (_label, config) => {
    expect(load(config)()).toBe("1.5.0");
  });

  it("falls back to 1.0.0 without any config", () => {
    expect(load(null)()).toBe("1.0.0");
  });
});
