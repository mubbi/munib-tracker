import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";

function getAllowedRedirectUris(
  config: ConfigService<EnvironmentVariables, true>,
): string[] {
  const raw = config.get("OAUTH_REDIRECT_URI_ALLOWLIST", { infer: true })?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isProduction(config: ConfigService<EnvironmentVariables, true>): boolean {
  return config.get("NODE_ENV", { infer: true }) === NodeEnvironment.Production;
}

/** Reject OAuth redirect URIs not on the server allowlist (required in production). */
export function assertRedirectUriAllowed(
  config: ConfigService<EnvironmentVariables, true>,
  redirectUri: string,
): void {
  const trimmed = redirectUri.trim();
  if (!trimmed) {
    throw new BadRequestException("redirectUri is required");
  }

  const allowed = getAllowedRedirectUris(config);
  if (isProduction(config) && allowed.length === 0) {
    throw new BadRequestException(
      "OAUTH_REDIRECT_URI_ALLOWLIST is required in production (comma-separated redirect URIs).",
    );
  }
  if (allowed.length > 0 && !allowed.includes(trimmed)) {
    throw new BadRequestException("Invalid redirect URI");
  }
}

/** Dashboard URL to return after Apple form_post callback (must match an allowed https origin). */
export function assertOAuthReturnUrlAllowed(
  config: ConfigService<EnvironmentVariables, true>,
  returnUrl: string,
): void {
  const trimmed = returnUrl.trim();
  if (!trimmed) {
    throw new BadRequestException("returnUrl is required");
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new BadRequestException("Invalid return URL");
  }

  if (isProduction(config) && parsed.protocol !== "https:") {
    throw new BadRequestException("Invalid return URL");
  }

  const allowed = getAllowedRedirectUris(config).filter((u) => u.startsWith("https://"));
  if (allowed.length === 0) return;

  const ok = allowed.some((entry) => {
    try {
      return new URL(entry).origin === parsed.origin;
    } catch {
      return false;
    }
  });
  if (!ok) {
    throw new BadRequestException("Invalid return URL");
  }
}
