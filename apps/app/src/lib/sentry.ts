import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const DEFAULT_SENTRY_DSN =
  "https://44c8e1f4e369865f4f92b56af570369f@o4511706220265472.ingest.us.sentry.io/4511706225180672";

const sentryDsn = (process.env.EXPO_PUBLIC_SENTRY_DSN ?? DEFAULT_SENTRY_DSN).trim();

/** True when running inside the Expo Go client (not a dev client or store build). */
function isExpoGoClient(): boolean {
  return Constants.appOwnership === "expo";
}

let initialized = false;

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
