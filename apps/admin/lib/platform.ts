import { getAdminEnv } from "./env";

/** Parsed Redis slice of `GET /api/v1/health` (see apps/api redisClient). */
export type ApiRedisHealth = {
  configured?: boolean;
  connected?: boolean;
  connectAttempts?: number;
  lastConnectedAt?: string | null;
  lastErrorAt?: string | null;
  lastConnectAttemptAt?: string | null;
  lastConnectAttemptAgeMs?: number | null;
};

/** Munib API health — `GET /api/v1/health`. */
export type ApiHealth = {
  ok: boolean;
  status?: number;
  body?: string;
  error?: string;
  service?: string;
  timestamp?: string;
  redis?: ApiRedisHealth;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function fetchApiHealth(): Promise<ApiHealth> {
  const { API_URL } = getAdminEnv();
  const url = `${API_URL.replace(/\/$/, "")}/api/v1/health`;
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    const body = await response.text();
    let service: string | undefined;
    let timestamp: string | undefined;
    let redis: ApiRedisHealth | undefined;
    try {
      const parsed: unknown = JSON.parse(body);
      if (isRecord(parsed)) {
        if (typeof parsed.service === "string") service = parsed.service;
        if (typeof parsed.timestamp === "string") timestamp = parsed.timestamp;
        if (isRecord(parsed.redis)) redis = parsed.redis as ApiRedisHealth;
      }
    } catch {
      // Non-JSON body
    }
    return {
      ok: response.ok,
      status: response.status,
      body: body.slice(0, 2000),
      service,
      timestamp,
      redis,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "fetch failed" };
  }
}
