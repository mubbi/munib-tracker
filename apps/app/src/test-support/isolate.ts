/**
 * Loads modules in a fresh Jest registry while sharing this test file's React,
 * so `renderHook` from the outer registry can still drive hooks from the
 * isolated module. Use it for modules that read platform or global state once
 * at import time (e.g. `const IS_WEB = Platform.OS === "web"`) or keep
 * module-level caches between tests.
 *
 *   const { useFoo } = isolateWithSharedReact(() => require("./use-foo") as typeof import("./use-foo"));
 *
 * Anything that must apply inside the isolated registry (e.g. `setPlatform`,
 * which patches that registry's own react-native `Platform`) must run inside
 * `load` too.
 */
export function isolateWithSharedReact<T>(load: () => T): T {
  const react = require("react");
  let loaded!: T;
  jest.isolateModules(() => {
    jest.doMock("react", () => react);
    loaded = load();
  });
  return loaded;
}
