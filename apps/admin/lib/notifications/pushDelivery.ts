/**
 * Push delivery for admin broadcasts — Expo (mobile) and Web Push (PWA).
 */

import {
  chunkArray,
  EXPO_PUSH_CHUNK_SIZE,
  IN_APP_PUSH_DATA_KEYS,
  isValidExpoPushToken,
  isValidWebPushSubscription,
  mapWithConcurrency,
  OFFICIAL_SUPPORT_EMAIL,
  PUSH_NOTIFICATION_CHANNEL_IDS,
  WEB_PUSH_CONCURRENCY,
  type WebPushSubscription,
} from "@munib-tracker/shared";
import { sendNotification, setVapidDetails } from "web-push";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export type PushTargetRow = {
  userId: string;
  token: string;
  platform: string;
};

export type ExpoPushTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
};

export type PushDeliveryStats = {
  expoSent: number;
  webSent: number;
  failed: number;
  /** Tokens the provider reported as permanently gone — callers should delete them. */
  invalidTokens: string[];
};

type WebPushOutcome = "sent" | "gone" | "failed";

export type { WebPushSubscription };

function getVapidPublicKey(): string | null {
  const key = process.env.VAPID_PUBLIC_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : null;
}

function getVapidPrivateKey(): string | null {
  const key = process.env.VAPID_PRIVATE_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : null;
}

/** `VAPID_SUBJECT` (`mailto:` / `https:`) when set, else `mailto:` the official support email — same as apps/api. */
export function resolveVapidSubject(raw: string | undefined = process.env.VAPID_SUBJECT): string {
  const subject = raw?.trim();
  return subject ? subject : `mailto:${OFFICIAL_SUPPORT_EMAIL}`;
}

function isWebPushConfigured(): boolean {
  return !!getVapidPublicKey() && !!getVapidPrivateKey();
}

async function sendExpoChunk(messages: Record<string, unknown>[]): Promise<ExpoPushTicket[]> {
  if (messages.length === 0) return [];
  const res = await fetch(EXPO_PUSH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messages),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Expo push failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { data?: ExpoPushTicket[] };
  return data.data ?? [];
}

export type BroadcastPushPayload = {
  title: string;
  body: string;
  subtitle?: string;
  routeData?: Record<string, unknown>;
  collapseId: string;
  inAppIdsByUserId?: ReadonlyMap<string, number>;
};

function buildExpoMessage(
  to: string,
  payload: BroadcastPushPayload,
  inAppId?: number,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    ...(payload.routeData ?? {}),
    ...(inAppId != null
      ? {
          [IN_APP_PUSH_DATA_KEYS.serverId]: inAppId,
          [IN_APP_PUSH_DATA_KEYS.kind]: "admin_announcement",
        }
      : {}),
  };
  const msg: Record<string, unknown> = {
    to,
    title: payload.title,
    body: payload.body,
    data,
    channelId: PUSH_NOTIFICATION_CHANNEL_IDS.DEFAULT,
    priority: "default",
    sound: "default",
    collapseId: payload.collapseId,
    tag: payload.collapseId,
  };
  if (payload.subtitle) msg.subtitle = payload.subtitle;
  return msg;
}

async function sendWebPushOne(
  subscription: WebPushSubscription,
  payload: BroadcastPushPayload,
  inAppId?: number,
): Promise<WebPushOutcome> {
  const publicKey = getVapidPublicKey();
  const privateKey = getVapidPrivateKey();
  if (!publicKey || !privateKey) return "failed";

  setVapidDetails(resolveVapidSubject(), publicKey, privateKey);
  const data: Record<string, unknown> = {
    ...(payload.routeData ?? {}),
    ...(inAppId != null
      ? {
          [IN_APP_PUSH_DATA_KEYS.serverId]: inAppId,
          [IN_APP_PUSH_DATA_KEYS.kind]: "admin_announcement",
        }
      : {}),
  };
  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    subtitle: payload.subtitle,
    data,
    tag: payload.collapseId,
    collapseId: payload.collapseId,
    actions: [{ action: "open", title: "Open app" }],
    timestamp: Date.now(),
  });

  try {
    await sendNotification({ endpoint: subscription.endpoint, keys: subscription.keys }, body, {
      TTL: 86400,
    });
    return "sent";
  } catch (err) {
    const status =
      err && typeof err === "object" && "statusCode" in err
        ? Number((err as { statusCode: unknown }).statusCode)
        : undefined;
    // 404/410: the browser unsubscribed or the endpoint expired — permanent.
    return status === 404 || status === 410 ? "gone" : "failed";
  }
}

export async function sendBroadcastPush(
  tokenRows: readonly PushTargetRow[],
  payload: BroadcastPushPayload,
): Promise<PushDeliveryStats> {
  const stats: PushDeliveryStats = { expoSent: 0, webSent: 0, failed: 0, invalidTokens: [] };
  if (tokenRows.length === 0) return stats;

  const expoMessages: { token: string; message: Record<string, unknown> }[] = [];
  const webJobs: { token: string; sub: WebPushSubscription; inAppId?: number }[] = [];

  for (const row of tokenRows) {
    const inAppId = payload.inAppIdsByUserId?.get(row.userId);

    if (row.platform === "web") {
      try {
        const sub = JSON.parse(row.token) as WebPushSubscription;
        if (isValidWebPushSubscription(sub)) {
          webJobs.push({ token: row.token, sub, inAppId });
        } else {
          stats.failed += 1;
        }
      } catch {
        stats.failed += 1;
      }
      continue;
    }

    if (isValidExpoPushToken(row.token)) {
      expoMessages.push({
        token: row.token,
        message: buildExpoMessage(row.token, payload, inAppId),
      });
    } else {
      stats.failed += 1;
    }
  }

  for (const chunk of chunkArray(expoMessages, EXPO_PUSH_CHUNK_SIZE)) {
    try {
      // Tickets are returned in request order.
      const tickets = await sendExpoChunk(chunk.map((entry) => entry.message));
      tickets.forEach((ticket, index) => {
        if (ticket.status === "ok") {
          stats.expoSent += 1;
          return;
        }
        stats.failed += 1;
        const token = chunk[index]?.token;
        if (token && ticket.details?.error === "DeviceNotRegistered") {
          stats.invalidTokens.push(token);
        }
      });
      if (tickets.length < chunk.length) {
        stats.failed += chunk.length - tickets.length;
      }
    } catch {
      stats.failed += chunk.length;
    }
  }

  if (webJobs.length > 0 && isWebPushConfigured()) {
    const results = await mapWithConcurrency(webJobs, WEB_PUSH_CONCURRENCY, async (job) =>
      sendWebPushOne(job.sub, payload, job.inAppId),
    );
    results.forEach((outcome, index) => {
      if (outcome === "sent") {
        stats.webSent += 1;
        return;
      }
      stats.failed += 1;
      const token = webJobs[index]?.token;
      if (outcome === "gone" && token) stats.invalidTokens.push(token);
    });
  } else if (webJobs.length > 0) {
    stats.failed += webJobs.length;
  }

  return stats;
}

export function webPushAvailable(): boolean {
  return isWebPushConfigured();
}

export { isValidExpoPushToken };
