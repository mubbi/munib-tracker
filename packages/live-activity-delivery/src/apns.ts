import { createPrivateKey, sign } from "node:crypto";
import * as http2 from "node:http2";
import type { ApnsCredentials, ApnsEnvironment, ApnsLiveActivityResult } from "./types.js";
import { LiveActivityDeliveryError } from "./types.js";

const APNS_HOSTS = {
  sandbox: "https://api.sandbox.push.apple.com",
  production: "https://api.push.apple.com",
} as const;

const AUTH_TOKEN_TTL_MS = 50 * 60_000;
const DEFAULT_BUNDLE_ID = "app.munibtracker";

/**
 * Framework-agnostic APNs HTTP/2 client for ActivityKit `liveactivity` updates.
 * Safe to use from Nest on Vercel or a long-running Fly worker.
 */
export class ApnsLiveActivityClient {
  private authTokenCache: { value: string; createdAt: number } | null = null;
  private readonly sessions = new Map<ApnsEnvironment, http2.ClientHttp2Session>();

  constructor(private readonly credentials: ApnsCredentials | null) {}

  static fromEnv(env: {
    APNS_TEAM_ID?: string;
    APNS_KEY_ID?: string;
    APNS_PRIVATE_KEY?: string;
    APNS_BUNDLE_ID?: string;
  }): ApnsLiveActivityClient {
    if (!env.APNS_TEAM_ID || !env.APNS_KEY_ID || !env.APNS_PRIVATE_KEY) {
      return new ApnsLiveActivityClient(null);
    }
    return new ApnsLiveActivityClient({
      teamId: env.APNS_TEAM_ID,
      keyId: env.APNS_KEY_ID,
      privateKey: env.APNS_PRIVATE_KEY,
      bundleId: env.APNS_BUNDLE_ID,
    });
  }

  isConfigured(): boolean {
    return this.credentials != null;
  }

  async sendUpdate(input: {
    token: string;
    environment: ApnsEnvironment;
    contentState: Record<string, unknown>;
    staleAt?: Date | null;
    expiresAt: Date;
  }): Promise<ApnsLiveActivityResult> {
    if (!this.credentials) {
      throw new LiveActivityDeliveryError(
        "ActivityKit APNs delivery is not configured",
        "NOT_CONFIGURED",
      );
    }

    const bundleId = this.credentials.bundleId || DEFAULT_BUNDLE_ID;
    const aps: Record<string, unknown> = {
      timestamp: Math.floor(Date.now() / 1000),
      event: "update",
      "content-state": input.contentState,
    };
    if (input.staleAt) aps["stale-date"] = Math.floor(input.staleAt.getTime() / 1000);

    const response = await this.request(
      input.environment,
      {
        ":method": "POST",
        ":path": `/3/device/${input.token}`,
        authorization: `bearer ${this.authToken()}`,
        "apns-push-type": "liveactivity",
        "apns-topic": `${bundleId}.push-type.liveactivity`,
        "apns-priority": "10",
        "apns-expiration": String(Math.floor(input.expiresAt.getTime() / 1000)),
        "content-type": "application/json",
      },
      JSON.stringify({ aps }),
    );

    if (response.status === 200) return { ok: true, apnsId: response.apnsId };
    const reason = parseApnsReason(response.body);
    const invalidateToken =
      response.status === 410 ||
      reason === "BadDeviceToken" ||
      reason === "DeviceTokenNotForTopic" ||
      reason === "Unregistered";
    return {
      ok: false,
      status: response.status,
      reason,
      retryable: response.status === 429 || response.status >= 500,
      invalidateToken,
    };
  }

  close(): void {
    for (const session of this.sessions.values()) session.close();
    this.sessions.clear();
  }

  private authToken(): string {
    if (!this.credentials) {
      throw new LiveActivityDeliveryError(
        "ActivityKit APNs credentials are incomplete",
        "NOT_CONFIGURED",
      );
    }
    const now = Date.now();
    if (this.authTokenCache && now - this.authTokenCache.createdAt < AUTH_TOKEN_TTL_MS) {
      return this.authTokenCache.value;
    }

    const header = base64Url(JSON.stringify({ alg: "ES256", kid: this.credentials.keyId }));
    const payload = base64Url(
      JSON.stringify({ iss: this.credentials.teamId, iat: Math.floor(now / 1000) }),
    );
    const signingInput = `${header}.${payload}`;
    const signature = sign("sha256", Buffer.from(signingInput), {
      key: createPrivateKey(this.credentials.privateKey.replace(/\\n/g, "\n")),
      dsaEncoding: "ieee-p1363",
    });
    const value = `${signingInput}.${base64Url(signature)}`;
    this.authTokenCache = { value, createdAt: now };
    return value;
  }

  private session(environment: ApnsEnvironment): http2.ClientHttp2Session {
    const existing = this.sessions.get(environment);
    if (existing && !existing.closed && !existing.destroyed) return existing;
    const created = http2.connect(APNS_HOSTS[environment]);
    created.unref();
    created.on("error", () => {
      if (this.sessions.get(environment) === created) this.sessions.delete(environment);
    });
    created.on("close", () => {
      if (this.sessions.get(environment) === created) this.sessions.delete(environment);
    });
    this.sessions.set(environment, created);
    return created;
  }

  private request(
    environment: ApnsEnvironment,
    headers: http2.OutgoingHttpHeaders,
    body: string,
  ): Promise<{ status: number; apnsId?: string; body: string }> {
    return new Promise((resolve, reject) => {
      const request = this.session(environment).request(headers);
      let status = 0;
      let apnsId: string | undefined;
      let responseBody = "";
      request.setEncoding("utf8");
      request.on("response", (responseHeaders) => {
        status = Number(responseHeaders[":status"] ?? 0);
        const rawId = responseHeaders["apns-id"];
        apnsId = Array.isArray(rawId) ? rawId[0] : rawId;
      });
      request.on("data", (chunk: string) => {
        responseBody += chunk;
      });
      request.on("end", () => resolve({ status, apnsId, body: responseBody }));
      request.on("error", reject);
      request.setTimeout(15_000, () => request.destroy(new Error("APNs request timed out")));
      request.end(body);
    });
  }
}

export function parseApnsReason(body: string): string {
  try {
    const parsed = JSON.parse(body) as { reason?: unknown };
    return typeof parsed.reason === "string" ? parsed.reason : "Unknown";
  } catch {
    return "Unknown";
  }
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}
