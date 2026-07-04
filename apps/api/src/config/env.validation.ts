import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import {
  DEV_JWT_SECRET,
  EnvironmentVariables,
  MIN_PROD_JWT_SECRET_LENGTH,
  NodeEnvironment,
} from "./env.schema";

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  assertProductionSecrets(validated);

  return validated;
}

/**
 * Production hardening that class-validator decorators can't express: reject the
 * insecure defaults so the server refuses to boot with them.
 */
function assertProductionSecrets(env: EnvironmentVariables): void {
  if (env.NODE_ENV !== NodeEnvironment.Production) {
    return;
  }

  const secret = env.JWT_SECRET;
  if (!secret || secret === DEV_JWT_SECRET || secret.length < MIN_PROD_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set to a unique value of at least ${MIN_PROD_JWT_SECRET_LENGTH} characters in production (the development default is rejected).`,
    );
  }

  // Credentialed CORS with a reflected/wildcard origin is unsafe. Production must
  // pin an explicit allowlist via CORS_ORIGINS.
  if (parseCorsOrigins(env.CORS_ORIGINS) === false) {
    throw new Error(
      "CORS_ORIGINS must list at least one explicit origin in production (credentialed CORS cannot use a reflected origin).",
    );
  }
}

/**
 * Resolves the allowed CORS origins. Returns an explicit allowlist when
 * configured. When unset it returns `false` (deny) rather than `true`
 * (reflect any origin) so credentialed CORS is never combined with an
 * arbitrary reflected origin.
 */
export function parseCorsOrigins(origins?: string): string[] | false {
  if (!origins || origins.trim() === "") {
    return false;
  }

  const parsed = origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : false;
}
