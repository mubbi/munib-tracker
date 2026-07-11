import { getApiBaseUrl } from "@munib-tracker/api-client";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

/** Custom URL scheme registered in app.json (`expo.scheme`). */
export const APP_SCHEME = "munib-tracker";

/** Path segment used in Google native OAuth redirect URIs. */
export const GOOGLE_OAUTH_REDIRECT_PATH = "oauthredirect";

/** HTTPS App Link path for Apple OAuth return (Android + iOS OAuth fallback). */
export const APPLE_OAUTH_NATIVE_PATH = "oauth/apple";

function env(key: string): string {
  return (process.env[key] ?? "").trim();
}

/**
 * Google OAuth client id for the current platform, falling back to the shared
 * `EXPO_PUBLIC_GOOGLE_CLIENT_ID`. The web client id is exchanged server-side
 * (the API holds the matching secret); native ids validate access tokens.
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

/** iOS bundle id used as Apple JWT `aud` for native Sign in with Apple. */
export function getAppIdentifier(): string {
  return env("EXPO_PUBLIC_APP_IDENTIFIER") || "app.munibtracker";
}

/**
 * Product web origin for OAuth redirects / App Links.
 * Prefers `EXPO_PUBLIC_WEB_APP_ORIGIN`, falls back to `EXPO_PUBLIC_APP_URL`.
 */
export function getWebAppOrigin(): string {
  return (
    env("EXPO_PUBLIC_WEB_APP_ORIGIN") ||
    env("EXPO_PUBLIC_APP_URL") ||
    "https://my.munibtracker.app"
  ).replace(/\/$/, "");
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

export function buildGoogleNativeRedirectUri(scheme: string): string {
  return `${scheme.trim()}:/${GOOGLE_OAUTH_REDIRECT_PATH}`;
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
  return buildGoogleNativeRedirectUri(scheme);
}

/**
 * Redirect URI for Apple OAuth.
 * Web uses the API form_post callback (required for email/name scopes).
 * Native (Android + iOS OAuth fallback) uses an HTTPS App Link — Apple rejects custom URI schemes.
 */
export function getAppleRedirectUri(): string {
  if (Platform.OS === "web") {
    const api = getApiBaseUrl().replace(/\/$/, "");
    return `${api}/auth/apple/oauth/callback`;
  }
  return `${getWebAppOrigin()}/${APPLE_OAUTH_NATIVE_PATH}`;
}

/** Page to return to after web Apple form_post (same tab — not a popup). */
export function getAppleOAuthReturnUrl(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    const path = window.location.pathname || "/";
    return `${window.location.origin}${path}${window.location.search}${window.location.hash}`;
  }
  return getWebAppOrigin();
}

/** Facebook App ID (same value as `FACEBOOK_APP_ID` on the API). */
export function getFacebookAppId(): string {
  return env("EXPO_PUBLIC_FACEBOOK_APP_ID");
}

export function isFacebookConfigured(): boolean {
  return !!getFacebookAppId();
}

/** Redirect URI for Facebook OAuth (must match the Facebook app Valid OAuth Redirect URIs). */
export function getFacebookRedirectUri(): string {
  if (Platform.OS === "web") {
    return AuthSession.makeRedirectUri({ scheme: APP_SCHEME });
  }
  return `${APP_SCHEME}:/${GOOGLE_OAUTH_REDIRECT_PATH}`;
}
