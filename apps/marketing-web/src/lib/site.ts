/**
 * Canonical marketing-site origin. Override per environment with
 * `NEXT_PUBLIC_SITE_URL` (e.g. a preview deployment). No trailing slash.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://munibtracker.app").replace(
  /\/$/,
  "",
);

export const SITE_PATHS = {
  home: "/",
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",
} as const;
