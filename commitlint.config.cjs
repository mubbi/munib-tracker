/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Monorepo scopes (optional — omit scope when the change spans many areas)
    "scope-enum": [
      1,
      "always",
      [
        "app",
        "api",
        "admin",
        "marketing",
        "shared",
        "db",
        "theme",
        "ci",
        "deps",
        "docs",
        "i18n",
        "release",
        "tv",
        "screenshots",
      ],
    ],
  },
};
