import * as AuthSession from "expo-auth-session";
import { useCallback, useMemo, useState } from "react";
import type { OAuthProvider } from "@/api/endpoints";
import {
  getAppleRedirectUri,
  getAppleServicesId,
  getGoogleRedirectUri,
  isGoogleConfigured,
  resolveGoogleClientId,
} from "@/lib/auth/oauth-config";
import type { OAuthPayload } from "@/providers/auth-provider";
import { useAuth } from "@/providers/auth-provider";

/** Thrown when the user dismisses the provider sheet — callers should stay silent. */
export const OAUTH_CANCELLED = "cancelled";

const APPLE_DISCOVERY_URL = "https://appleid.apple.com/.well-known/openid-configuration";

/**
 * Runs the Google / Apple OAuth authorization-code + PKCE flow with
 * `expo-auth-session`, then hands the resulting `{ code, codeVerifier,
 * redirectUri }` to the API (which performs the server-side token exchange).
 *
 * Guests link the provider onto their existing account; signed-out users get a
 * fresh account. The API contract is identical either way.
 */
export function useSocialAuth() {
  const { isGuest, linkProvider, signInWithProvider } = useAuth();
  const [busy, setBusy] = useState<OAuthProvider | null>(null);

  const googleClientId = useMemo(() => resolveGoogleClientId(), []);
  const googleRedirectUri = useMemo(() => getGoogleRedirectUri(), []);
  const appleServicesId = useMemo(() => getAppleServicesId(), []);
  const appleRedirectUri = useMemo(() => getAppleRedirectUri(), []);

  const googleDiscovery = AuthSession.useAutoDiscovery("https://accounts.google.com");
  const appleDiscovery = AuthSession.useAutoDiscovery(APPLE_DISCOVERY_URL);

  const [googleRequest, , googlePromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId || "__missing_google_client__",
      redirectUri: googleRedirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    googleDiscovery,
  );

  const [appleRequest, , applePromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: appleServicesId || "__missing_apple_services_id__",
      redirectUri: appleRedirectUri,
      // Requesting name/email forces Apple's form_post response mode, which needs
      // a server callback. Omitting them keeps a query redirect we can capture,
      // and the id_token still carries the stable `sub` (and relay email on first use).
      scopes: [],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    appleDiscovery,
  );

  const googleConfigured = isGoogleConfigured();
  // The web OAuth flow works once a Services ID is set. Native Apple additionally
  // needs the native sheet (expo-apple-authentication) or an HTTPS App Link callback.
  const appleConfigured = !!appleServicesId;

  const completeSignIn = useCallback(
    async (provider: OAuthProvider, payload: OAuthPayload) => {
      if (isGuest) {
        await linkProvider(provider, payload);
      } else {
        await signInWithProvider(provider, payload);
      }
    },
    [isGuest, linkProvider, signInWithProvider],
  );

  const runCodeFlow = useCallback(
    async (
      provider: OAuthProvider,
      request: AuthSession.AuthRequest | null,
      promptAsync: () => Promise<AuthSession.AuthSessionResult>,
      redirectUri: string,
    ) => {
      if (!request) {
        throw new Error("Sign-in is not ready yet; try again.");
      }
      const result = await promptAsync();
      if (result.type === "cancel" || result.type === "dismiss") {
        throw new Error(OAUTH_CANCELLED);
      }
      if (result.type !== "success") {
        throw new Error("Sign-in was not completed.");
      }
      const code = result.params.code?.trim();
      if (!code) {
        const providerError = result.params.error_description || result.params.error;
        throw new Error(providerError || "The provider did not return an authorization code.");
      }
      await completeSignIn(provider, {
        code,
        codeVerifier: request.codeVerifier,
        redirectUri,
      });
    },
    [completeSignIn],
  );

  const signIn = useCallback(
    async (provider: OAuthProvider) => {
      setBusy(provider);
      try {
        switch (provider) {
          case "google":
            if (!googleConfigured) {
              throw new Error("Google sign-in is not configured yet.");
            }
            await runCodeFlow("google", googleRequest, googlePromptAsync, googleRedirectUri);
            break;
          case "apple":
            if (!appleConfigured) {
              throw new Error("Apple sign-in is not configured yet.");
            }
            await runCodeFlow("apple", appleRequest, applePromptAsync, appleRedirectUri);
            break;
          default:
            // Facebook (and any future provider) has no client flow wired yet.
            throw new Error(`${provider} sign-in is not available yet.`);
        }
      } finally {
        setBusy(null);
      }
    },
    [
      appleConfigured,
      appleRedirectUri,
      appleRequest,
      applePromptAsync,
      googleConfigured,
      googleRedirectUri,
      googleRequest,
      googlePromptAsync,
      runCodeFlow,
    ],
  );

  return {
    signIn,
    busy,
    googleConfigured,
    appleConfigured,
  };
}
