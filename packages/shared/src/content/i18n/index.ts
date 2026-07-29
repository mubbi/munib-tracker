/**
 * Learn-content i18n helpers.
 *
 * Locale overlay *data* lives in per-corpus files (`aqeedah.ar.ts`, …) and is
 * loaded on demand by the app (`content-overlay-registry`). Do not re-export
 * those modules from this barrel — that pulls ~21 MB into every consumer.
 *
 * For tests that need every overlay, import `./all-overlays` instead.
 */
export * from "./build-overlays";
export * from "./localize";
export * from "./overlay-locale";
