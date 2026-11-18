/**
 * Test-only Babel plugin (wired via `env.test` in babel.config.js — never runs
 * for Metro / production bundles).
 *
 * babel-preset-expo leaves `import()` as native dynamic import, which Jest
 * cannot execute without `--experimental-vm-modules`
 * (ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG). That made every lazy-loaded
 * path (locale packs, Qur'an engine, expo-notifications listeners…) untestable.
 *
 * Rewrites `import(x)` → `Promise.resolve().then(() => interopWildcard(require(x)))`,
 * keeping ES-module namespace semantics and routing through Jest's module
 * registry so `jest.mock()` applies to lazily imported modules too.
 */
module.exports = function jestDynamicImport({ template }) {
  const build = template.expression("Promise.resolve().then(() => INTEROP(require(SOURCE)))");
  return {
    name: "jest-dynamic-import",
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.type !== "Import") return;
        const [source] = path.node.arguments;
        if (!source) return;
        path.replaceWith(
          build({ INTEROP: state.file.addHelper("interopRequireWildcard"), SOURCE: source }),
        );
      },
    },
  };
};
