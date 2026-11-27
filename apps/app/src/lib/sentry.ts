import * as Sentry from "@sentry/react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

const DEFAULT_SENTRY_DSN =
  "https://44c8e1f4e369865f4f92b56af570369f@o4511706220265472.ingest.us.sentry.io/4511706225180672";

const sentryDsn = (process.env.EXPO_PUBLIC_SENTRY_DSN ?? DEFAULT_SENTRY_DSN).trim();

/** True when running inside the Expo Go client (not a dev client or store build). */
function isExpoGoClient(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

let initialized = false;

/**
 * Query / route params that carry one-time credentials: OAuth `code` + `state`
 * (`/oauth2redirect`, `/oauth/apple`), the kids link `token`, TV pairing `code`.
 * Navigation and fetch breadcrumbs record full URLs, so values are filtered.
 */
const SENSITIVE_PARAM_RE =
  /([?&#](?:code|state|token|access_token|id_token|refresh_token|code_verifier)=)[^&#\s]*/gi;
const SENSITIVE_PATH_RE = /(\/tv\/pairing\/)[^/?#\s]+/gi;
const SENSITIVE_KEY_RE =
  /^(?:code|state|token|access_?token|id_?token|refresh_?token|authorization)$/i;
const FILTERED = "[Filtered]";

/** Strip one-time credentials from a URL (or any string that embeds one). */
export function scrubSensitiveUrl(value: string): string {
  return value
    .replace(SENSITIVE_PARAM_RE, `$1${FILTERED}`)
    .replace(SENSITIVE_PATH_RE, `$1${FILTERED}`);
}

function scrubData(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEY_RE.test(key)) out[key] = FILTERED;
    else if (typeof value === "string") out[key] = scrubSensitiveUrl(value);
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = scrubData(value as Record<string, unknown>);
    } else out[key] = value;
  }
  return out;
}

export function scrubBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb {
  return {
    ...breadcrumb,
    ...(breadcrumb.message ? { message: scrubSensitiveUrl(breadcrumb.message) } : {}),
    ...(breadcrumb.data ? { data: scrubData(breadcrumb.data) } : {}),
  };
}

export function scrubEvent<E extends Sentry.ErrorEvent>(event: E): E {
  if (!event.request?.url && !event.request?.query_string) return event;
  const request = { ...event.request };
  if (request.url) request.url = scrubSensitiveUrl(request.url);
  if (typeof request.query_string === "string") {
    request.query_string = scrubSensitiveUrl(`?${request.query_string}`).slice(1);
  }
  return { ...event, request };
}

/**
 * NF-3.16 (D7): while a child session is active, Sentry keeps crash reports
 * only — no user id, no breadcrumbs, no performance transactions.
 */
let childSessionPrivacy = false;

export function setChildSessionPrivacy(active: boolean): void {
  childSessionPrivacy = active;
  if (active && initialized) Sentry.setUser(null);
}

export function isChildSessionPrivacyActive(): boolean {
  return childSessionPrivacy;
}

/**
 * Initialize Sentry as early as possible (before Expo Router loads).
 * Hooks global JS handlers, native crashes, and unhandled promise rejections.
 */
export function initSentry(): void {
  if (initialized || !sentryDsn) {
    return;
  }

  initialized = true;

  const runningInExpoGo = isExpoGoClient();
  const enabledInDev = process.env.EXPO_PUBLIC_SENTRY_ENABLED_IN_DEV === "true";
  const enabled = !__DEV__ || enabledInDev;

  Sentry.init({
    dsn: sentryDsn,
    // debug + enabled:false logs "Transport disabled" as ERROR in Expo LogBox.
    debug: enabled && __DEV__,
    enabled,
    environment: __DEV__ ? "development" : "production",
    release: `${Constants.expoConfig?.slug ?? "munib-tracker"}@${Constants.expoConfig?.version ?? "0.0.0"}`,
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    attachStacktrace: true,
    integrations: [
      Sentry.expoRouterIntegration({
        enableTimeToInitialDisplay: !runningInExpoGo,
      }),
    ],
    enableNativeFramesTracking: !runningInExpoGo,
    beforeSend: (event) => {
      if (!childSessionPrivacy) return scrubEvent(event);
      // Crash data only in child sessions: drop user, request and breadcrumbs.
      const { user: _user, request: _request, breadcrumbs: _crumbs, ...rest } = event;
      return rest;
    },
    beforeBreadcrumb: (breadcrumb) => (childSessionPrivacy ? null : scrubBreadcrumb(breadcrumb)),
    beforeSendTransaction: (event) => (childSessionPrivacy ? null : event),
  });
}

export function captureAppException(
  error: unknown,
  context?: Parameters<typeof Sentry.captureException>[1],
): void {
  if (!initialized) {
    return;
  }
  Sentry.captureException(error, context);
}

export { Sentry };
