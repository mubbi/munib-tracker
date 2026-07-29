/** Jest-only — keeps `require("@/lib/quran")` out of the production knowledge-card graph. */
export function loadQuranSyncForTests(): typeof import("@/lib/quran") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("@/lib/quran") as typeof import("@/lib/quran");
}
