const expoPreset = require("jest-expo/jest-preset");

const setupFiles = (expoPreset.setupFiles ?? []).filter(
  (file) => !file.includes("@react-native/jest-preset"),
);

module.exports = {
  ...expoPreset,
  setupFiles,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/__tests__/**/*.(test|spec|feature.test).[jt]s?(x)",
    "**/*.(test|spec|feature.test).[jt]s?(x)",
  ],
};
