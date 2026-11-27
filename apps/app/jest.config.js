const path = require("node:path");
const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  // Only crawl folders that hold tests or the code they import. The haste map
  // otherwise walks `dist/` (web export, GBs), `android/` / `ios/` build trees,
  // `coverage/` and `store-assets/` before the first test starts. Modules
  // outside these roots (assets, packages/*) still resolve normally.
  roots: ["<rootDir>/src", "<rootDir>/plugins", "<rootDir>/modules"],
  // CI: a stable, repo-local transform cache that the workflow persists between
  // runs (`.github/workflows/ci.yml` → "Cache Jest transforms") — a cold run
  // spends ~45% of its time in Babel / istanbul transforms. Locally keep Jest's
  // default (the OS temp dir), which is usually the fastest disk; a repo on a
  // spinning disk made a repo-local cache I/O-bound. `JEST_CACHE_DIRECTORY`
  // overrides both.
  ...(process.env.JEST_CACHE_DIRECTORY || process.env.GITHUB_ACTIONS === "true"
    ? {
        cacheDirectory:
          process.env.JEST_CACHE_DIRECTORY ??
          path.join(__dirname, "../../node_modules/.cache/jest"),
      }
    : {}),
  // CI runners are dedicated: use every core (Jest defaults to cores − 1, i.e.
  // 3 of 4 on GitHub's runners). Locally keep the default headroom.
  // `GITHUB_ACTIONS`, not `CI`: turbo's strict env mode only passes the vars in
  // `turbo.json` `globalPassThroughEnv` through to tasks.
  ...(process.env.GITHUB_ACTIONS === "true" ? { maxWorkers: "100%" } : {}),
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Component suites render real provider/theme trees; the first test in a file
  // can exceed Jest's 5s default on a loaded CI runner. One budget for all suites
  // instead of per-file `jest.setTimeout` calls.
  testTimeout: 30_000,
  // ~740 suites × provider trees + coverage instrumentation grow each worker's
  // heap until the machine swaps (31 min locally vs a few minutes). Recycle a
  // worker once it idles above this budget.
  workerIdleMemoryLimit: "768MB",
  moduleNameMapper: {
    // The `@/assets/*` alias points at the app root, not src/. Register it
    // before the generic `@/*` mapper injected from tsconfig paths.
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    ...(expoPreset.moduleNameMapper ?? {}),
  },
  // @noble/hashes and @scure/bip39 (vault crypto) ship ESM only — let Babel
  // transform them like the react-native packages the preset already allows.
  transformIgnorePatterns: (expoPreset.transformIgnorePatterns ?? []).map((pattern, index) =>
    index === 0 ? pattern.replace("(?!(", "(?!(@noble|@scure|") : pattern,
  ),
  testMatch: [
    "**/__tests__/**/*.(test|spec|feature.test).[jt]s?(x)",
    "**/*.(test|spec|feature.test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.{test,spec,feature.test}.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/test-support/**",
    "!src/app/**",
    "!src/**/*.d.ts",
    "!src/i18n/*.json",
    // Generated require-maps (scripts/build-data, generate-content-overlay-loaders).
    "!src/lib/quran-loader.ts",
    "!src/lib/content-overlay-loaders.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html", "clover"],
};
