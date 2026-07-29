import { apiFetch } from "@munib-tracker/api-client";
import {
  isAllowedNotificationExternalUrl,
  NOTIFICATION_OPEN_EXTERNAL_ACTION,
} from "@munib-tracker/shared/admin-broadcasts";

import { apiAuthOptions } from "@/api/auth-options";
import type { InAppNotification, InAppNotificationKind } from "@/lib/in-app-notifications/storage";

export type ServerInAppNotification = {
  id: number;
  kind: string;
  title: string;
  body: string;
  subtitle?: string | null;
  routeData?: Record<string, unknown> | null;
  dedupeKey?: string | null;
  broadcastId?: number | null;
  readAt?: string | null;
  clickedAt?: string | null;
  createdAt: string;
};

function isInAppKind(kind: string): kind is InAppNotificationKind {
  return (
    kind === "reminder" ||
    kind === "achievement" ||
    kind === "system" ||
    kind === "admin_announcement"
  );
}

function routeFromRouteData(
  routeData: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!routeData) return undefined;
  const href = routeData.href;
  if (typeof href === "string" && href.trim()) return href.trim();
  return undefined;
}

export function mapServerInAppNotification(row: ServerInAppNotification): InAppNotification {
  const kind = isInAppKind(row.kind) ? row.kind : "system";
  return {
    id: `server-${row.id}`,
    serverId: row.id,
    kind,
    title: row.title,
    body: row.body,
    subtitle: row.subtitle ?? null,
    route: routeFromRouteData(row.routeData),
    routeData: row.routeData ?? null,
    broadcastId: row.broadcastId ?? null,
    createdAt: row.createdAt,
    readAt: row.readAt ?? null,
  };
}

export async function fetchInAppNotifications(accessToken: string): Promise<InAppNotification[]> {
  const result = await apiFetch<{ items: ServerInAppNotification[] }>(
    { url: "/notifications/in-app", method: "GET" },
    apiAuthOptions(accessToken),
  );
  return (result.items ?? []).map(mapServerInAppNotification);
}

export async function markServerInAppRead(accessToken: string, serverId: number): Promise<void> {
  await apiFetch(
    { url: `/notifications/in-app/${serverId}/read`, method: "PATCH" },
    apiAuthOptions(accessToken),
  );
}

export async function markAllServerInAppRead(accessToken: string): Promise<void> {
  await apiFetch(
    { url: "/notifications/in-app/mark-all-read", method: "POST" },
    apiAuthOptions(accessToken),
  );
}

export async function engageServerInApp(
  accessToken: string,
  serverId: number,
  action: "open" | "click",
): Promise<void> {
  await apiFetch(
    {
      url: `/notifications/in-app/${serverId}/engage`,
      method: "POST",
      body: JSON.stringify({ action }),
    },
    apiAuthOptions(accessToken),
  );
}

export async function upsertPushToken(
  accessToken: string,
  input: {
    token: string;
    deviceId?: string;
    platform: "expo" | "web";
    locale?: string;
    clientPlatform?: string;
  },
): Promise<void> {
  await apiFetch(
    {
      url: "/notifications/push-token",
      method: "PUT",
      body: JSON.stringify(input),
    },
    apiAuthOptions(accessToken),
  );
}

export function resolveInAppOpenTarget(item: InAppNotification): {
  type: "route" | "external" | "none";
  value?: string;
} {
  const data = item.routeData;
  if (data && data.action === NOTIFICATION_OPEN_EXTERNAL_ACTION) {
    const url = typeof data.externalUrl === "string" ? data.externalUrl.trim() : "";
    if (url && isAllowedNotificationExternalUrl(url)) {
      return { type: "external", value: url };
    }
    return { type: "none" };
  }
  if (item.route) return { type: "route", value: item.route };
  const href = data && typeof data.href === "string" ? data.href.trim() : "";
  if (href) return { type: "route", value: href };
  return { type: "none" };
}
