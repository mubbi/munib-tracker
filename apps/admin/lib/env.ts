import "server-only";
import { OFFICIAL_ADMIN_ORIGIN } from "@munib-tracker/shared/constants";
import { z } from "zod";

/** Treat blank .env entries as unset so Zod optional fields do not fail on "". */
function emptyToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const envSchema = z.object({
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  ADMIN_SESSION_SECRET: z.preprocess(emptyToUndefined, z.string().min(32).optional()),
  GOOGLE_CLIENT_ID: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  GOOGLE_CLIENT_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  ADMIN_URL: z.url().default(OFFICIAL_ADMIN_ORIGIN),
  API_URL: z.url().default("http://localhost:3001"),
  VAPID_PUBLIC_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  VAPID_PRIVATE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  /** Web Push contact (`mailto:` or `https:`); defaults to the official support email. */
  VAPID_SUBJECT: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(/^(mailto:|https:\/\/)/, "VAPID_SUBJECT must start with mailto: or https://")
      .optional(),
  ),
  ADMIN_CRON_SECRET: z.preprocess(emptyToUndefined, z.string().min(16).optional()),
  /** Same Redis as apps/api — optional cron leader locks for broadcast processing. */
  REDIS_URL: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  REDIS_TLS: z.preprocess(
    emptyToUndefined,
    z.enum(["true", "false", "1", "0", "yes", "no"]).optional(),
  ),
  REDIS_KEY_PREFIX: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  /** Local `next dev` only — never set on Vercel. See `isLocalAuthBypassEnabled`. */
  ADMIN_DEV_BYPASS_AUTH: z.preprocess(emptyToUndefined, z.string().optional()),
  CRON_DISABLED: z
    .string()
    .optional()
    .transform((v) => v === "1" || v === "true"),
});

export type AdminEnv = z.infer<typeof envSchema>;

let cached: AdminEnv | null = null;

export function getAdminEnv(): AdminEnv {
  // Re-read .env on every request in dev — Next hot-reloads process.env but keeps module scope.
  if (process.env.NODE_ENV === "development") {
    cached = null;
  }
  if (!cached) {
    cached = envSchema.parse(process.env);
  }
  // Always prefer the live process.env DATABASE_URL on serverless (Vercel injects at runtime).
  if (cached.DATABASE_URL !== process.env.DATABASE_URL?.trim()) {
    cached = { ...cached, DATABASE_URL: process.env.DATABASE_URL?.trim() || undefined };
  }
  return cached;
}

/**
 * Placeholder / low-entropy session secrets (e.g. the `.env.example` value) let anyone
 * mint OAuth state + session JWTs. Refused in production builds; tolerated in local dev.
 */
export function isWeakSessionSecret(secret: string | undefined): boolean {
  if (!secret) return true;
  const value = secret.trim();
  if (value.length < 32) return true;
  if (/change[-_ ]?me|example|placeholder|secret[-_ ]?here/i.test(value)) return true;
  // A single repeated character ("aaaa…") or fewer than 8 distinct characters.
  return new Set(value).size < 8;
}

function assertStrongSessionSecret(secret: string): void {
  if (process.env.NODE_ENV === "production" && isWeakSessionSecret(secret)) {
    throw new Error(
      "ADMIN_SESSION_SECRET is a placeholder or too weak — set a random value (openssl rand -hex 32)",
    );
  }
}

export function requireAdminEnv(): Required<
  Pick<
    AdminEnv,
    "DATABASE_URL" | "ADMIN_SESSION_SECRET" | "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET"
  >
> &
  AdminEnv {
  const env = getAdminEnv();
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for the admin app");
  }
  if (!env.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET is required (min 32 chars)");
  }
  assertStrongSessionSecret(env.ADMIN_SESSION_SECRET);
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required");
  }
  return {
    ...env,
    DATABASE_URL: env.DATABASE_URL,
    ADMIN_SESSION_SECRET: env.ADMIN_SESSION_SECRET,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  };
}

export function isAuthConfigured(): boolean {
  const env = getAdminEnv();
  if (
    process.env.NODE_ENV === "production" &&
    env.ADMIN_SESSION_SECRET &&
    isWeakSessionSecret(env.ADMIN_SESSION_SECRET)
  ) {
    return false;
  }
  return Boolean(
    env.DATABASE_URL &&
      env.ADMIN_SESSION_SECRET &&
      env.GOOGLE_CLIENT_ID &&
      env.GOOGLE_CLIENT_SECRET,
  );
}
