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
import webpush from "web-push";

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
};

export type PushDeliveryStats = {
  expoSent: number;
  webSent: number;
  failed: number;
};

export type { WebPushSubscription };

function getVapidPublicKey(): string | null {
  const key = process.env.VAPID_PUBLIC_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : null;
}

function getVapidPrivateKey(): string | null {
  const key = process.env.VAPID_PRIVATE_KEY;
  return typeof key === "string" && key.trim() !== "" ? key.trim() : null;
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
): Promise<boolean> {
  const publicKey = getVapidPublicKey();
  const privateKey = getVapidPrivateKey();
  if (!publicKey || !privateKey) return false;

  webpush.setVapidDetails(`mailto:${OFFICIAL_SUPPORT_EMAIL}`, publicKey, privateKey);
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
    await webpush.sendNotification(
      { endpoint: subscription.endpoint, keys: subscription.keys },
      body,
      { TTL: 86400 },
    );
    return true;
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "statusCode" in err &&
      (err as { statusCode: number }).statusCode === 410
    ) {
      return false;
    }
    return false;
  }
}

export async function sendBroadcastPush(
  tokenRows: readonly PushTargetRow[],
  payload: BroadcastPushPayload,
): Promise<PushDeliveryStats> {
  const stats: PushDeliveryStats = { expoSent: 0, webSent: 0, failed: 0 };
  if (tokenRows.length === 0) return stats;

  const expoMessages: Record<string, unknown>[] = [];
  const webJobs: { sub: WebPushSubscription; inAppId?: number }[] = [];

  for (const row of tokenRows) {
    const inAppId = payload.inAppIdsByUserId?.get(row.userId);

    if (row.platform === "web") {
      try {
        const sub = JSON.parse(row.token) as WebPushSubscription;
        if (isValidWebPushSubscription(sub)) {
          webJobs.push({ sub, inAppId });
        } else {
          stats.failed += 1;
        }
      } catch {
        stats.failed += 1;
      }
      continue;
    }

    if (isValidExpoPushToken(row.token)) {
      expoMessages.push(buildExpoMessage(row.token, payload, inAppId));
    } else {
      stats.failed += 1;
    }
  }

  for (const chunk of chunkArray(expoMessages, EXPO_PUSH_CHUNK_SIZE)) {
    try {
      const tickets = await sendExpoChunk(chunk);
      for (const ticket of tickets) {
        if (ticket.status === "ok") stats.expoSent += 1;
        else stats.failed += 1;
      }
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
    for (const ok of results) {
      if (ok) stats.webSent += 1;
      else stats.failed += 1;
    }
  } else if (webJobs.length > 0) {
    stats.failed += webJobs.length;
  }

  return stats;
}

export function webPushAvailable(): boolean {
  return isWebPushConfigured();
}

export { isValidExpoPushToken };
