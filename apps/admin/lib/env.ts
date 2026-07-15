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
  ADMIN_URL: z.string().url().default(OFFICIAL_ADMIN_ORIGIN),
  API_URL: z.string().url().default("http://localhost:3001"),
  VAPID_PUBLIC_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  VAPID_PRIVATE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
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
  return Boolean(
    env.DATABASE_URL &&
      env.ADMIN_SESSION_SECRET &&
      env.GOOGLE_CLIENT_ID &&
      env.GOOGLE_CLIENT_SECRET,
  );
}
