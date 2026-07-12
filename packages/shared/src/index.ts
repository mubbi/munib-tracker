/** Root barrel for `@munib-tracker/shared` — admin + selective constants. */
export * from "./admin-broadcasts";
export { APP_NAME, APP_SLUG, APP_TAGLINE } from "./constants/branding";
export {
  OFFICIAL_ADMIN_ORIGIN,
  OFFICIAL_ANDROID_PACKAGE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_APP_WEB_ORIGIN,
  OFFICIAL_IOS_APP_STORE_URL,
  OFFICIAL_IOS_BUNDLE_IDENTIFIER,
  OFFICIAL_SITE_ORIGIN,
} from "./constants/site";
export { APP_LOCALE_CODES, type AppLocale, isAppLocale } from "./i18n/app-locale";

import { OFFICIAL_SITE_ORIGIN as SITE } from "./constants/site";

/** Marketing / help links used by admin playbooks. */
export const OFFICIAL_GUIDES_URL = `${SITE}/guides` as const;

/** Nest API path prefix including `/api` (no origin). */
export const API_V1_PREFIX = "/api/v1" as const;

/** Support contact used for VAPID mailto. */
export const OFFICIAL_SUPPORT_EMAIL = "support@munibtracker.app" as const;
