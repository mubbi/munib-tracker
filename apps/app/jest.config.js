const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
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
