import { sendNotification, setVapidDetails } from "web-push";

import {
  EXPO_PUSH_URL,
  type ExpoPushTicket,
  expoHttpFailure,
  expoNetworkFailure,
  expoTicketResult,
  isValidExpoPushToken,
} from "./expo.js";
import type { SurfaceChannel, SurfaceSendResult } from "./types.js";
import { parseWebPushTarget, type WebPushSenderConfig, webPushFailure } from "./web-push.js";

/**
 * A user-visible notification (title + body on the lock screen). The silent
 * `SurfaceSender` path carries Salah-phase data payloads only; product events
 * (circle khatm progress, dua received) go through this typed path instead.
 */
export type VisibleNotification = {
  title: string;
  body: string;
  /**
   * Replace key: a newer notification with the same tag replaces the older one
   * (Web Push `tag`). Expo Push has no collapse key, so callers rate-limit too.
   */
  tag: string;
  /** Tap routing data — ids and same-origin routes only, never user content. */
  data: Readonly<Record<string, string>>;
  /** Provider TTL: undelivered past this, the notification is dropped. */
  ttlSeconds: number;
  /** Android notification channel (Expo). Defaults to the app's `default` channel. */
  channelId?: string;
};

export type VisiblePushItem = { target: string; notification: VisibleNotification };

export type VisiblePushSender = {
  channel: SurfaceChannel;
  /** Results are returned in input order. */
  sendMany(items: readonly VisiblePushItem[]): Promise<SurfaceSendResult[]>;
};

/** Expo Push accepts up to 100 messages per request. */
export const EXPO_PUSH_BATCH_SIZE = 100;
/** Parallel Web Push requests per fan-out. */
export const VISIBLE_WEB_PUSH_CONCURRENCY = 8;
const DEFAULT_CHANNEL_ID = "default";

const INVALID_EXPO_TOKEN: SurfaceSendResult = {
  ok: false,
  reason: "Invalid Expo push token",
  retryable: false,
  invalidateToken: true,
};

export function buildExpoVisibleMessage(
  token: string,
  notification: VisibleNotification,
): Record<string, unknown> {
  return {
    to: token,
    title: notification.title,
    body: notification.body,
    data: { ...notification.data },
    sound: "default",
    priority: "default",
    channelId: notification.channelId ?? DEFAULT_CHANNEL_ID,
    ttl: notification.ttlSeconds,
  };
}

/** JSON the PWA service worker's `push` handler reads (`title`, `body`, `data.url`, `tag`). */
export function buildWebVisiblePayload(
  notification: VisibleNotification,
  now = Date.now(),
): string {
  return JSON.stringify({
    title: notification.title,
    body: notification.body,
    data: { ...notification.data },
    tag: notification.tag,
    timestamp: now,
  });
}

export function createExpoVisiblePushSender(
  fetchImpl: typeof fetch = (input, init) => fetch(input, init),
): VisiblePushSender {
  return {
    channel: "expo",
    async sendMany(items) {
      const results: SurfaceSendResult[] = new Array(items.length);
      const valid: number[] = [];
      items.forEach((item, index) => {
        if (isValidExpoPushToken(item.target)) valid.push(index);
        else results[index] = INVALID_EXPO_TOKEN;
      });

      for (let start = 0; start < valid.length; start += EXPO_PUSH_BATCH_SIZE) {
        const chunk = valid.slice(start, start + EXPO_PUSH_BATCH_SIZE);
        const messages = chunk.map((index) => {
          const item = items[index] as VisiblePushItem;
          return buildExpoVisibleMessage(item.target.trim(), item.notification);
        });
        let chunkResults: SurfaceSendResult[];
        try {
          const response = await fetchImpl(EXPO_PUSH_URL, {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(messages),
          });
          const httpFailure = expoHttpFailure(response);
          if (httpFailure) {
            chunkResults = chunk.map(() => httpFailure);
          } else {
            const parsed = (await response.json()) as { data?: ExpoPushTicket[] };
            const tickets = Array.isArray(parsed.data) ? parsed.data : [];
            // Tickets come back in request order; a missing ticket is a failure.
            chunkResults = chunk.map((_, i) =>
              i < tickets.length
                ? expoTicketResult(tickets[i])
                : {
                    ok: false,
                    reason: "Missing Expo Push ticket",
                    retryable: true,
                    invalidateToken: false,
                  },
            );
          }
        } catch (error) {
          const failure = expoNetworkFailure(error);
          chunkResults = chunk.map(() => failure);
        }
        chunk.forEach((index, i) => {
          results[index] = chunkResults[i] as SurfaceSendResult;
        });
      }
      return results;
    },
  };
}

export function createWebVisiblePushSender(config: WebPushSenderConfig): VisiblePushSender {
  setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return {
    channel: "web_push",
    async sendMany(items) {
      const results: SurfaceSendResult[] = new Array(items.length);
      let next = 0;
      const worker = async () => {
        while (next < items.length) {
          const index = next++;
          const item = items[index] as VisiblePushItem;
          results[index] = await sendOneWeb(item, config);
        }
      };
      await Promise.all(
        Array.from({ length: Math.min(VISIBLE_WEB_PUSH_CONCURRENCY, items.length) }, worker),
      );
      return results;
    },
  };
}

async function sendOneWeb(
  item: VisiblePushItem,
  config: WebPushSenderConfig,
): Promise<SurfaceSendResult> {
  const parsed = parseWebPushTarget(item.target);
  if (!parsed.ok) return parsed;
  const ttl = Math.min(config.ttlSeconds ?? 86_400, item.notification.ttlSeconds);
  try {
    await sendNotification(
      { endpoint: parsed.subscription.endpoint, keys: parsed.subscription.keys },
      buildWebVisiblePayload(item.notification),
      { TTL: ttl, urgency: "normal" },
    );
    return { ok: true };
  } catch (error) {
    return webPushFailure(error);
  }
}
