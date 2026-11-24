import { sendNotification, setVapidDetails } from "web-push";

import type { SurfaceSender, SurfaceSendOptions, SurfaceSendResult } from "./types.js";

export type WebPushSubscription = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
};

export type WebPushSenderConfig = {
  publicKey: string;
  privateKey: string;
  subject: string;
  ttlSeconds?: number;
};

export function isValidWebPushSubscription(value: unknown): value is WebPushSubscription {
  if (!value || typeof value !== "object") return false;
  const sub = value as WebPushSubscription;
  return (
    typeof sub.endpoint === "string" &&
    sub.endpoint.startsWith("https://") &&
    typeof sub.keys?.p256dh === "string" &&
    sub.keys.p256dh.length > 0 &&
    typeof sub.keys?.auth === "string" &&
    sub.keys.auth.length > 0
  );
}

export function createWebPushSender(config: WebPushSenderConfig): SurfaceSender {
  setVapidDetails(config.subject, config.publicKey, config.privateKey);
  const ttl = config.ttlSeconds ?? 86_400;

  return {
    channel: "web_push",
    async send(
      target: string,
      payloadJson: string,
      options?: SurfaceSendOptions,
    ): Promise<SurfaceSendResult> {
      const parsed = parseWebPushTarget(target);
      if (!parsed.ok) return parsed;
      const { subscription } = parsed;

      try {
        await sendNotification(
          { endpoint: subscription.endpoint, keys: subscription.keys },
          payloadJson,
          {
            TTL: options?.ttlSeconds != null ? Math.min(ttl, options.ttlSeconds) : ttl,
            // Phase boundaries are time-critical; "normal" lets mobile push
            // services defer delivery under battery saver.
            urgency: "high",
          },
        );
        return { ok: true };
      } catch (err) {
        return webPushFailure(err);
      }
    },
  };
}

/** Parse + validate a stored subscription target, or the failure to report. */
export function parseWebPushTarget(
  target: string,
): { ok: true; subscription: WebPushSubscription } | Extract<SurfaceSendResult, { ok: false }> {
  let subscription: WebPushSubscription;
  try {
    subscription = JSON.parse(target) as WebPushSubscription;
  } catch {
    return {
      ok: false,
      reason: "Malformed Web Push subscription",
      retryable: false,
      invalidateToken: true,
    };
  }
  if (!isValidWebPushSubscription(subscription)) {
    return {
      ok: false,
      reason: "Invalid Web Push subscription",
      retryable: false,
      invalidateToken: true,
    };
  }
  return { ok: true, subscription };
}

/** `web-push` error → result: 404/410 invalidate, 429/5xx retryable. */
export function webPushFailure(err: unknown): SurfaceSendResult {
  const status =
    err && typeof err === "object" && "statusCode" in err
      ? Number((err as { statusCode: number }).statusCode)
      : undefined;
  if (status === 404 || status === 410) {
    return {
      ok: false,
      status,
      reason: `Subscription gone (${status})`,
      retryable: false,
      invalidateToken: true,
    };
  }
  if (status === 429 || (status != null && status >= 500)) {
    return {
      ok: false,
      status,
      reason: `Transient Web Push failure (${status})`,
      retryable: true,
      invalidateToken: false,
    };
  }
  return {
    ok: false,
    status,
    reason: err instanceof Error ? err.message : "Web Push send failed",
    retryable: false,
    invalidateToken: false,
  };
}
