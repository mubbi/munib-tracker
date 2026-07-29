import type { DiscoveryDocument } from "expo-auth-session";
import * as AuthSession from "expo-auth-session";

import { getOrCreateGoogleOAuthExchange } from "@/lib/oauth/google-oauth-exchange-guard";
import {
  clearGoogleOAuthPendingSession,
  type GoogleOAuthPendingSession,
} from "@/lib/oauth/oauth-pending";

export const GOOGLE_DISCOVERY: DiscoveryDocument = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

/** Exchange a Google auth code on-device (native public client — no secret). */
export async function exchangeGoogleCodeForAccessToken(
  session: GoogleOAuthPendingSession,
  code: string,
): Promise<string> {
  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: session.clientId,
      redirectUri: session.redirectUri,
      code,
      extraParams: { code_verifier: session.codeVerifier },
    },
    GOOGLE_DISCOVERY,
  );

  const accessToken = tokenResponse?.accessToken?.trim();
  if (!accessToken) {
    throw new Error("Google token exchange did not return an access token.");
  }
  return accessToken;
}

/**
 * Exchange once per code (shared across AuthSession + deep-link callers), then clear pending.
 * Returns null when this code was already exchanged.
 */
export async function exchangeGoogleCodeAndClearPending(
  session: GoogleOAuthPendingSession,
  code: string,
): Promise<string | null> {
  try {
    return await getOrCreateGoogleOAuthExchange(code, () =>
      exchangeGoogleCodeForAccessToken(session, code),
    );
  } finally {
    await clearGoogleOAuthPendingSession();
  }
}
