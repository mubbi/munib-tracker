/** Supported platforms for the `app_versions` table (Versions module). */
export const APP_VERSION_PLATFORMS = ["ios", "android", "web"] as const;

export type AppVersionPlatform = (typeof APP_VERSION_PLATFORMS)[number];

export function isAppVersionPlatform(value: string): value is AppVersionPlatform {
  return (APP_VERSION_PLATFORMS as readonly string[]).includes(value);
}

/** Matches the API's version gate (`appVersionService.APP_VERSION_SEMVER_RE`). */
export const APP_VERSION_SEMVER_RE = /^\d{1,5}\.\d{1,5}\.\d{1,5}$/;

export function isValidAppVersion(value: string): boolean {
  return APP_VERSION_SEMVER_RE.test(value.trim());
}
