export { type AppPlatform, normalizeAppPlatform } from "./app-version-platform";
export { APP_VERSION_RESPONSE_HEADERS } from "./app-version-response-headers";
export {
  APP_VERSION_BACKGROUND_POLL_MS,
  type AppVersionMeta,
  fetchAppVersionMeta,
  getAppVersionHeaders,
  getAppVersionInfo,
  mergeAppVersionMeta,
  notifyVersionMetaFromResponse,
  parseVersionMetaFromResponse,
  setAppVersionInfo,
  setVersionMetaCallback,
  type UpdateRequired,
} from "./app-version-store";
export {
  ApiBlockedError,
  beginApiRequest,
  endApiRequest,
  getApiInFlightCount,
  isAppReloadInProgress,
  setAppReloadInProgress,
} from "./cloud-api-gate";
export { formatApiDateTime, fromApiDateTime, toApiDateTime } from "./datetime";
export * from "./generated/endpoints/app-feedback/app-feedback";
export * from "./generated/endpoints/auth/auth";
// NF-3.16–3.18 circles (wrapped by apps/app `lib/circles/api.ts`).
export * from "./generated/endpoints/circles/circles";
export * from "./generated/endpoints/health/health";
export * from "./generated/endpoints/oss-content-failures/oss-content-failures";
export * from "./generated/endpoints/sync/sync";
// Types only: the 230 Orval model files are almost all interfaces, but a value
// `export *` makes every bundler / Jest load each of them at runtime from any
// import of this barrel. The few const enums (`SyncRecordDtoEntity`, …) are
// values — import those from `@munib-tracker/api-client/models` (tsc flags a
// value use through this type-only re-export).
export type * from "./generated/models";
export {
  ApiError,
  type ApiFetchOptions,
  apiFetch,
  getApiBaseUrl,
  getRegisteredTokenRefresher,
  isApiOriginUrl,
  resolveApiUrl,
  setTokenRefresher,
} from "./mutator";
export { ApiQueryProvider, appQueryClient } from "./provider";
export {
  isWebCookieSessionToken,
  WEB_COOKIE_SESSION_TOKEN,
} from "./web-cookie-session";
