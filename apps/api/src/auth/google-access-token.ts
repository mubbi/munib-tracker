import { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";

export interface GoogleTokenInfo {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

function isGoogleEmailVerified(value: unknown): boolean {
  return value === true || value === "true";
}

function getAllowedGoogleClientIds(
  config: ConfigService<EnvironmentVariables, true>,
): string[] {
  const list = config.get("GOOGLE_OAUTH_CLIENT_IDS", { infer: true })?.trim();
  if (list) {
    return list
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const ids: string[] = [];
  const web = config.get("GOOGLE_OAUTH_WEB_CLIENT_ID", { infer: true })?.trim();
  if (web) ids.push(web);
  return ids;
}

function optionalNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function verifiedGoogleEmail(
  email: string | undefined,
  emailVerified: unknown,
): string | undefined {
  const trimmed = optionalNonEmptyString(email);
  return trimmed && isGoogleEmailVerified(emailVerified) ? trimmed.toLowerCase() : undefined;
}

type GoogleTokenInfoResponse = GoogleTokenInfo & {
  aud?: string;
  azp?: string;
  email_verified?: boolean | string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfoResponse = {
  sub?: string;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
  error?: string;
  error_description?: string;
};

/** Profile fields (name, picture) come from OpenID userinfo — tokeninfo does not include them. */
async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<Pick<GoogleTokenInfo, "name" | "picture" | "email">> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) return {};

  const data = (await res.json()) as GoogleUserInfoResponse;
  if (data.error) return {};

  return {
    email: verifiedGoogleEmail(data.email, data.email_verified),
    name: optionalNonEmptyString(data.name),
    picture: optionalNonEmptyString(data.picture),
  };
}

/**
 * Verify access token via Google tokeninfo and ensure azp/aud matches configured
 * client IDs in production. Fetches OpenID userinfo for display name when the
 * token includes profile scope.
 */
export async function verifyGoogleAccessToken(
  config: ConfigService<EnvironmentVariables, true>,
  accessToken: string,
): Promise<GoogleTokenInfo | null> {
  const trimmed = accessToken.trim();
  if (!trimmed) return null;

  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(trimmed)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as GoogleTokenInfoResponse;

  if (data.error || !data.sub) return null;

  const allowed = getAllowedGoogleClientIds(config);
  const isProduction =
    config.get("NODE_ENV", { infer: true }) === NodeEnvironment.Production;
  if (isProduction && allowed.length === 0) {
    throw new Error(
      "GOOGLE_OAUTH_CLIENT_IDS or GOOGLE_OAUTH_WEB_CLIENT_ID is required in production for Google sign-in.",
    );
  }

  if (allowed.length > 0) {
    const clientId = (data.azp ?? data.aud)?.trim();
    if (!clientId || !allowed.includes(clientId)) return null;
  }

  const tokenEmail = verifiedGoogleEmail(data.email, data.email_verified);
  const profile = await fetchGoogleUserInfo(trimmed);

  return {
    sub: data.sub,
    email: profile.email ?? tokenEmail,
    name: profile.name ?? data.name,
    picture: profile.picture ?? data.picture,
  };
}
