import webpush from "web-push";

import type { SurfaceSender, SurfaceSendResult } from "./types.js";

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
  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  const ttl = config.ttlSeconds ?? 86_400;

  return {
    channel: "web_push",
    async send(target: string, payloadJson: string): Promise<SurfaceSendResult> {
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

      try {
        await webpush.sendNotification(
          { endpoint: subscription.endpoint, keys: subscription.keys },
          payloadJson,
          { TTL: ttl },
        );
        return { ok: true };
      } catch (err) {
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
    },
  };
}
