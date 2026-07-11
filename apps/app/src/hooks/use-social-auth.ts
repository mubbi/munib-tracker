import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import {
  authAppleOauthSession,
  type OAuthProvider,
  WEB_COOKIE_SESSION_TOKEN,
} from "@/api/endpoints";
import { isAppleAuthAvailable, signInWithAppleNative } from "@/lib/auth/appleAuth";
import {
  getAppleOAuthReturnUrl,
  getAppleRedirectUri,
  getAppleServicesId,
  getFacebookAppId,
  getFacebookRedirectUri,
  getGoogleRedirectUri,
  isFacebookConfigured,
  isGoogleConfigured,
  resolveGoogleClientId,
} from "@/lib/auth/oauth-config";
import { exchangeGoogleCodeAndClearPending } from "@/lib/oauth/complete-google-oauth";
import {
  clearAppleOAuthPendingSession,
  clearGoogleOAuthPendingSession,
  loadAppleOAuthPendingSession,
  loadGoogleOAuthPendingSession,
  saveAppleOAuthPendingSession,
  saveGoogleOAuthPendingSession,
} from "@/lib/oauth/oauth-pending";
import { parseAppleOAuthReturnUrl, parseOAuthReturnUrl } from "@/lib/oauth/parse-oauth-return-url";
import { useAuth } from "@/providers/auth-provider";

/** Thrown when the user dismisses the provider sheet — callers should stay silent. */
export const OAUTH_CANCELLED = "cancelled";

const APPLE_DISCOVERY_URL = "https://appleid.apple.com/.well-known/openid-configuration";

const FACEBOOK_DISCOVERY: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: "https://www.facebook.com/v18.0/dialog/oauth",
  tokenEndpoint: "https://graph.facebook.com/v18.0/oauth/access_token",
};

function appleDisplayName(
  fullName?: { givenName?: string | null; familyName?: string | null } | null,
): string | undefined {
  const parts = [fullName?.givenName, fullName?.familyName]
    .map((p) => p?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : undefined;
}

/**
 * Runs Google / Apple / Facebook OAuth with platform-specific flows matching
 * the Expense Trail sample: native Google on-device exchange, native Apple
 * identity token, web Google code→API, Apple form_post on web, HTTPS App Links
 * for Android Apple.
 */
export function useSocialAuth() {
  const { isGuest, linkProvider, signInWithProvider, completeSocialSession, applySessionDto } =
    useAuth();
  const [busy, setBusy] = useState<OAuthProvider | null>(null);
  const [appleNativeAvailable, setAppleNativeAvailable] = useState(false);

  const googleClientId = useMemo(() => resolveGoogleClientId(), []);
  const googleRedirectUri = useMemo(() => getGoogleRedirectUri(), []);
  const appleServicesId = useMemo(() => getAppleServicesId(), []);
  const appleRedirectUri = useMemo(() => getAppleRedirectUri(), []);
  const facebookAppId = useMemo(() => getFacebookAppId(), []);
  const facebookRedirectUri = useMemo(() => getFacebookRedirectUri(), []);

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

  const appleAuthRequestConfig = useMemo(
    () =>
      Platform.OS === "web"
        ? {
            clientId: appleServicesId || "__missing_apple_services_id__",
            redirectUri: appleRedirectUri,
            scopes: ["email", "name"] as string[],
            extraParams: { response_mode: "form_post" },
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
          }
        : {
            clientId: appleServicesId || "__missing_apple_services_id__",
            redirectUri: appleRedirectUri,
            scopes: [] as string[],
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
          },
    [appleRedirectUri, appleServicesId],
  );

  const [appleRequest, , applePromptAsync] = AuthSession.useAuthRequest(
    appleAuthRequestConfig,
    appleDiscovery,
  );

  const [facebookRequest, , facebookPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: facebookAppId || "__missing_facebook_app__",
      redirectUri: facebookRedirectUri,
      scopes: ["public_profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: { display: "popup" },
    },
    FACEBOOK_DISCOVERY,
  );

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    void isAppleAuthAvailable().then(setAppleNativeAvailable);
  }, []);

  const googleConfigured = isGoogleConfigured();
  const appleConfigured = appleNativeAvailable || !!appleServicesId;
  const facebookConfigured = isFacebookConfigured();

  const resumeGoogleFromUrl = useCallback(
    async (returnUrl: string): Promise<"success" | "skipped" | "failed"> => {
      const parsed = parseOAuthReturnUrl(returnUrl);
      if (!parsed) return "skipped";
      const pending = await loadGoogleOAuthPendingSession();
      if (!pending) return "skipped";
      if (parsed.state && parsed.state !== pending.state) {
        await clearGoogleOAuthPendingSession();
        return "failed";
      }
      try {
        const accessToken = await exchangeGoogleCodeAndClearPending(pending, parsed.code);
        await completeSocialSession("google", "accessToken", { accessToken });
        return "success";
      } catch {
        await clearGoogleOAuthPendingSession();
        return "failed";
      }
    },
    [completeSocialSession],
  );

  const resumeAppleFromUrl = useCallback(
    async (returnUrl: string): Promise<"success" | "skipped" | "failed"> => {
      const parsed = parseAppleOAuthReturnUrl(returnUrl);
      if (!parsed) return "skipped";
      const pending = await loadAppleOAuthPendingSession();
      if (!pending) return "skipped";
      if (parsed.state && parsed.state !== pending.state) {
        await clearAppleOAuthPendingSession();
        return "failed";
      }
      try {
        await completeSocialSession("apple", "appleOauth", {
          code: parsed.code,
          redirectUri: pending.redirectUri,
          codeVerifier: pending.codeVerifier,
        });
        await clearAppleOAuthPendingSession();
        return "success";
      } catch {
        await clearAppleOAuthPendingSession();
        return "failed";
      }
    },
    [completeSocialSession],
  );

  useEffect(() => {
    if (Platform.OS === "web") return;
    const onUrl = ({ url }: { url: string }) => {
      void resumeGoogleFromUrl(url);
      void resumeAppleFromUrl(url);
    };
    const sub = Linking.addEventListener("url", onUrl);
    void Linking.getInitialURL().then((url) => {
      if (url) onUrl({ url });
    });
    return () => sub.remove();
  }, [resumeAppleFromUrl, resumeGoogleFromUrl]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("apple_oauth") !== "success") return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    let cancelled = false;
    (async () => {
      try {
        const { refreshSession } = await import("@/api/endpoints");
        const dto = await refreshSession(WEB_COOKIE_SESSION_TOKEN);
        if (!cancelled) await applySessionDto(dto);
      } catch {
        // leave signed out; user can retry
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applySessionDto]);

  const signInGoogle = useCallback(async () => {
    if (!googleConfigured || !googleRequest) {
      throw new Error("Google sign-in is not configured yet.");
    }
    const codeVerifier = googleRequest.codeVerifier?.trim() ?? "";
    const state = googleRequest.state?.trim() ?? "";
    if (!codeVerifier || !state) {
      throw new Error("Sign-in is not ready yet; try again.");
    }

    await saveGoogleOAuthPendingSession({
      codeVerifier,
      redirectUri: googleRedirectUri,
      clientId: googleClientId.trim(),
      state,
    });

    const result = await googlePromptAsync(
      Platform.OS === "android" ? { showInRecents: true } : undefined,
    );
    if (result.type === "cancel" || result.type === "dismiss") {
      await clearGoogleOAuthPendingSession();
      throw new Error(OAUTH_CANCELLED);
    }
    if (result.type !== "success") {
      await clearGoogleOAuthPendingSession();
      throw new Error("Sign-in was not completed.");
    }

    const code = result.params.code?.trim();
    if (!code) {
      await clearGoogleOAuthPendingSession();
      const providerError = result.params.error_description || result.params.error;
      throw new Error(providerError || "The provider did not return an authorization code.");
    }

    if (Platform.OS === "web") {
      await clearGoogleOAuthPendingSession();
      await completeSocialSession("google", "googleOauth", {
        code,
        redirectUri: googleRedirectUri,
        codeVerifier,
      });
      return;
    }

    const accessToken = await exchangeGoogleCodeAndClearPending(
      {
        codeVerifier,
        redirectUri: googleRedirectUri,
        clientId: googleClientId.trim(),
        state,
      },
      code,
    );
    await completeSocialSession("google", "accessToken", { accessToken });
  }, [
    completeSocialSession,
    googleClientId,
    googleConfigured,
    googlePromptAsync,
    googleRedirectUri,
    googleRequest,
  ]);

  const signInApple = useCallback(async () => {
    if (!appleConfigured) {
      throw new Error("Apple sign-in is not configured yet.");
    }

    if (Platform.OS === "ios" && appleNativeAvailable) {
      try {
        const credential = await signInWithAppleNative();
        const identityToken = credential.identityToken?.trim();
        if (!identityToken) {
          throw new Error("Apple did not return an identity token.");
        }
        await completeSocialSession("apple", "identityToken", {
          identityToken,
          displayName: appleDisplayName(credential.fullName),
        });
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/cancel/i.test(message)) throw new Error(OAUTH_CANCELLED);
        throw error;
      }
    }

    if (!appleServicesId || !appleRequest) {
      throw new Error("Apple sign-in is not configured yet.");
    }

    const codeVerifier = appleRequest.codeVerifier?.trim() ?? "";
    const state = appleRequest.state?.trim() ?? "";
    if (!codeVerifier) {
      throw new Error("Sign-in is not ready yet; try again.");
    }

    if (Platform.OS === "web") {
      await authAppleOauthSession({
        codeVerifier,
        redirectUri: appleRedirectUri,
        returnUrl: getAppleOAuthReturnUrl(),
      });
      const authUrl = await appleRequest.makeAuthUrlAsync(appleDiscovery ?? {});
      if (typeof window !== "undefined") {
        window.location.assign(authUrl);
      }
      return;
    }

    await saveAppleOAuthPendingSession({
      codeVerifier,
      redirectUri: appleRedirectUri,
      state: state || "",
    });

    const result = await applePromptAsync();
    if (result.type === "cancel" || result.type === "dismiss") {
      await clearAppleOAuthPendingSession();
      throw new Error(OAUTH_CANCELLED);
    }
    if (result.type !== "success") {
      await clearAppleOAuthPendingSession();
      throw new Error("Sign-in was not completed.");
    }
    const code = result.params.code?.trim();
    if (!code) {
      await clearAppleOAuthPendingSession();
      throw new Error("The provider did not return an authorization code.");
    }
    await completeSocialSession("apple", "appleOauth", {
      code,
      redirectUri: appleRedirectUri,
      codeVerifier,
    });
    await clearAppleOAuthPendingSession();
  }, [
    appleConfigured,
    appleDiscovery,
    appleNativeAvailable,
    applePromptAsync,
    appleRedirectUri,
    appleRequest,
    appleServicesId,
    completeSocialSession,
  ]);

  const signInFacebook = useCallback(async () => {
    if (!facebookConfigured || !facebookRequest) {
      throw new Error("Facebook sign-in is not configured yet.");
    }
    const result = await facebookPromptAsync();
    if (result.type === "cancel" || result.type === "dismiss") {
      throw new Error(OAUTH_CANCELLED);
    }
    if (result.type !== "success") {
      throw new Error("Sign-in was not completed.");
    }
    const code = result.params.code?.trim();
    if (!code) {
      throw new Error("The provider did not return an authorization code.");
    }
    await (isGuest
      ? linkProvider("facebook", {
          code,
          codeVerifier: facebookRequest.codeVerifier,
          redirectUri: facebookRedirectUri,
        })
      : signInWithProvider("facebook", {
          code,
          codeVerifier: facebookRequest.codeVerifier,
          redirectUri: facebookRedirectUri,
        }));
  }, [
    facebookConfigured,
    facebookPromptAsync,
    facebookRedirectUri,
    facebookRequest,
    isGuest,
    linkProvider,
    signInWithProvider,
  ]);

  const signIn = useCallback(
    async (provider: OAuthProvider) => {
      setBusy(provider);
      try {
        switch (provider) {
          case "google":
            await signInGoogle();
            break;
          case "apple":
            await signInApple();
            break;
          case "facebook":
            await signInFacebook();
            break;
          default:
            throw new Error(`${provider} sign-in is not available yet.`);
        }
      } finally {
        setBusy(null);
      }
    },
    [signInApple, signInFacebook, signInGoogle],
  );

  return {
    signIn,
    busy,
    googleConfigured,
    appleConfigured,
    facebookConfigured,
    resumeGoogleFromUrl,
    resumeAppleFromUrl,
  };
}
