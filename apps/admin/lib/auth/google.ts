import { getAdminEnv, requireAdminEnv } from "../env";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export function getGoogleRedirectUri(): string {
  const { ADMIN_URL } = getAdminEnv();
  return `${ADMIN_URL.replace(/\/$/, "")}/api/auth/callback/google`;
}

export function buildGoogleSignInUrl(state: string): string {
  const { GOOGLE_CLIENT_ID } = requireAdminEnv();
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

type GoogleTokenError = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

function formatGoogleTokenError(data: GoogleTokenError, status: number): string {
  const detail = data.error_description ?? data.error ?? `HTTP ${status}`;
  return `Google token exchange failed: ${detail}`;
}

export async function exchangeGoogleCode(code: string): Promise<{ accessToken: string }> {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = requireAdminEnv();
  const redirectUri = getGoogleRedirectUri();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID.trim(),
      client_secret: GOOGLE_CLIENT_SECRET.trim(),
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = (await response.json()) as GoogleTokenError;
  if (!response.ok || data.error) {
    throw new Error(formatGoogleTokenError(data, response.status));
  }
  if (!data.access_token) {
    throw new Error("Google token response missing access_token");
  }
  return { accessToken: data.access_token };
}

export async function fetchGoogleProfile(accessToken: string): Promise<{
  email: string;
  name?: string;
  picture?: string;
}> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Google profile");
  }
  const data = (await response.json()) as { email?: string; name?: string; picture?: string };
  if (!data.email) {
    throw new Error("Google profile missing email");
  }
  return { email: data.email, name: data.name, picture: data.picture };
}
