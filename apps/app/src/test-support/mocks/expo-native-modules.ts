/**
 * Fake optional Expo native modules. jest-expo's `requireOptionalNativeModule`
 * falls back to `globalThis.expo.modules[name]`, so no `jest.mock("expo")` is
 * needed. Subjects usually resolve their module at import time — load them via
 * `loadWithNativeModules()` (an isolated registry) to pick up per-test fakes:
 *
 *   const bridge = loadWithNativeModules({ MunibExternalCommands: fake }, () => require("./native-bridge"));
 *
 * Note: jest-expo wraps each function in its own `jest.fn`, which still calls
 * through to yours, so assert on the fakes you passed in.
 */

type ExpoGlobal = { expo?: { modules?: Record<string, unknown> } };

/** Registers `modules` on `globalThis.expo.modules`; returns a restore function. */
export function installNativeModules(modules: Record<string, unknown>): () => void {
  const holder = globalThis as ExpoGlobal;
  holder.expo ??= {};
  holder.expo.modules ??= {};
  const registry = holder.expo.modules;
  const previous = Object.keys(modules).map((name) => [name, registry[name]] as const);
  Object.assign(registry, modules);
  return () => {
    for (const [name, value] of previous) {
      if (value === undefined) delete registry[name];
      else registry[name] = value;
    }
  };
}

/** Requires `load()` in an isolated module registry while `modules` are installed. */
export function loadWithNativeModules<T>(modules: Record<string, unknown>, load: () => T): T {
  const restore = installNativeModules(modules);
  let loaded: T | undefined;
  try {
    jest.isolateModules(() => {
      loaded = load();
    });
  } finally {
    restore();
  }
  return loaded as T;
}

/**
 * `loadWithNativeModules` on an overridden platform. The override is applied
 * both outside and inside the isolated registry so import-time and call-time
 * `Platform.OS` checks agree. Call `restore()` in `afterEach`.
 */
export function loadOnPlatformWithNativeModules<T>(
  platform: import("@/test-support/platform").PlatformOverrides,
  modules: Record<string, unknown>,
  load: () => T,
): { module: T; restore: () => void } {
  const { setPlatform } =
    require("@/test-support/platform") as typeof import("@/test-support/platform");
  const restoreOuter = setPlatform(platform);
  let restoreInner: () => void = () => {};
  const module = loadWithNativeModules(modules, () => {
    const isolated = require("@/test-support/platform") as typeof import("@/test-support/platform");
    restoreInner = isolated.setPlatform(platform);
    return load();
  });
  return {
    module,
    restore: () => {
      restoreInner();
      restoreOuter();
    },
  };
}
