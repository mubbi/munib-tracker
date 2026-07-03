const expoPreset = require("jest-expo/jest-preset");

const setupFiles = (expoPreset.setupFiles ?? []).filter(
  (file) => !file.includes("@react-native/jest-preset"),
);

module.exports = {
  ...expoPreset,
  setupFiles,
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
};
