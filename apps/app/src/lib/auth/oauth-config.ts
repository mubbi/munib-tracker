import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

/** Custom URL scheme registered in app.json (`expo.scheme`). */
export const APP_SCHEME = "munib-tracker";

/** Path segment used in native OAuth redirect URIs. */
const OAUTH_REDIRECT_PATH = "oauthredirect";

function env(key: string): string {
  return (process.env[key] ?? "").trim();
}

/**
 * Google OAuth client id for the current platform, falling back to the shared
 * `EXPO_PUBLIC_GOOGLE_CLIENT_ID`. The web client id is exchanged server-side
 * (the API holds the matching secret); native ids validate id_tokens.
 */
export function resolveGoogleClientId(): string {
  const fallback = env("EXPO_PUBLIC_GOOGLE_CLIENT_ID");
  if (Platform.OS === "web") {
    return env("EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB") || fallback;
  }
  if (Platform.OS === "ios") {
    return env("EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS") || fallback;
  }
  return env("EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID") || fallback;
}

export function isGoogleConfigured(): boolean {
  return !!resolveGoogleClientId();
}

/** Apple Services ID used for the web/Android Sign in with Apple OAuth flow. */
export function getAppleServicesId(): string {
  return env("EXPO_PUBLIC_APPLE_SERVICES_ID");
}

/**
 * Converts a Google OAuth client id to its reversed-client-id URL scheme, e.g.
 * `123-abc.apps.googleusercontent.com` → `com.googleusercontent.apps.123-abc`.
 * Google requires this scheme for the installed-app (native) redirect.
 */
export function googleClientIdToReversedScheme(clientId: string): string | null {
  const match = clientId.trim().match(/^([\w-]+)\.apps\.googleusercontent\.com$/i);
  return match ? `com.googleusercontent.apps.${match[1]}` : null;
}

/**
 * Redirect URI for the Google OAuth request. It must match exactly on the
 * client, the API code exchange, and the Google Cloud client configuration.
 *
 * - Web: the app origin (via `makeRedirectUri`), registered as an authorized
 *   redirect URI on the Google "Web application" client.
 * - Native: the reversed-client-id scheme (single colon, not `://`, which Google
 *   rejects), falling back to the app scheme.
 */
export function getGoogleRedirectUri(): string {
  if (Platform.OS === "web") {
    return AuthSession.makeRedirectUri({ scheme: APP_SCHEME });
  }
  const reversed = googleClientIdToReversedScheme(resolveGoogleClientId());
  const scheme = reversed ?? APP_SCHEME;
  return `${scheme}:/${OAUTH_REDIRECT_PATH}`;
}

/** Redirect URI for the web/Android Apple OAuth request. */
export function getAppleRedirectUri(): string {
  if (Platform.OS === "web") {
    return AuthSession.makeRedirectUri({ scheme: APP_SCHEME });
  }
  return `${APP_SCHEME}:/${OAUTH_REDIRECT_PATH}`;
}
