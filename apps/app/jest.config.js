const expoPreset = require("jest-expo/jest-preset");

module.exports = {
  ...expoPreset,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
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
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html", "clover"],
};
