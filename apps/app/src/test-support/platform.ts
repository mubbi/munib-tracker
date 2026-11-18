import { Platform } from "react-native";

export type PlatformOverrides = {
  OS?: typeof Platform.OS;
  /** Drives `isTV()` (`src/lib/platform/is-tv.ts`), which reads `Platform.isTV`. */
  isTV?: boolean;
};

type PlatformKey = keyof PlatformOverrides | "select";

/** `Platform.select` resolved against an overridden OS (RN's own is bound to the test platform). */
function selectFor(os: string) {
  return <T>(spec: Partial<Record<string, T>>): T | undefined => {
    if (os in spec) return spec[os];
    if (os !== "web" && "native" in spec) return spec.native;
    return spec.default;
  };
}

/** Redefines a (possibly getter-backed) Platform property; returns its restore fn. */
function overrideProperty(key: PlatformKey, value: unknown): () => void {
  const previous = Object.getOwnPropertyDescriptor(Platform, key);
  Object.defineProperty(Platform, key, { configurable: true, enumerable: true, get: () => value });
  return () => {
    if (previous) Object.defineProperty(Platform, key, previous);
    else delete (Platform as Record<string, unknown>)[key];
  };
}

/**
 * Temporarily overrides `Platform.OS` / `Platform.isTV`. Returns a restore
 * function. Prefer `usePlatform()` for whole `describe` blocks.
 */
export function setPlatform(overrides: PlatformOverrides): () => void {
  const restores = (Object.keys(overrides) as (keyof PlatformOverrides)[])
    .filter((key) => overrides[key] !== undefined)
    .map((key) => overrideProperty(key, overrides[key]));
  if (overrides.OS !== undefined)
    restores.push(overrideProperty("select", selectFor(overrides.OS)));
  return () => {
    for (const restore of restores.reverse()) restore();
  };
}

/**
 * Applies platform overrides for every test in the enclosing `describe` and
 * restores them afterwards. Replaces hand-rolled `Platform.OS = …` swaps and
 * `jest.mock("@/lib/platform/is-tv")` stubs.
 *
 * @example describe("on web", () => { usePlatform({ OS: "web" }); … });
 */
export function usePlatform(overrides: PlatformOverrides): void {
  let restore: () => void = () => {};
  beforeEach(() => {
    restore = setPlatform(overrides);
  });
  afterEach(() => restore());
}

/**
 * Requires `load()` in an isolated module registry with the platform overridden,
 * for subjects that read `Platform.OS` once at import time. Mocks already
 * instantiated in the main registry (e.g. AsyncStorage) are shared.
 *
 * @example const store = loadOnPlatform({ OS: "web" }, () => require("./session-store").SessionStore);
 */
export function loadOnPlatform<T>(overrides: PlatformOverrides, load: () => T): T {
  let result!: T;
  let restore: () => void = () => {};
  jest.isolateModules(() => {
    // The isolated registry has its own `react-native`, so override that copy.
    const isolated = require("./platform") as { setPlatform: typeof setPlatform };
    restore = isolated.setPlatform(overrides);
    result = load();
  });
  restore();
  return result;
}

/**
 * For tests that pick (or change) the platform inside an `it`: returns a setter
 * that layers overrides via `setPlatform` and undoes all of them after each
 * test. Use instead of `usePlatform` (not alongside it) in the same `describe`.
 *
 * @example const onPlatform = usePlatformSwitch(); it("…", () => { onPlatform({ OS: "web" }); … });
 */
export function usePlatformSwitch(): (overrides: PlatformOverrides) => void {
  const restores: (() => void)[] = [];
  afterEach(() => {
    while (restores.length > 0) restores.pop()?.();
  });
  return (overrides) => {
    restores.push(setPlatform(overrides));
  };
}
