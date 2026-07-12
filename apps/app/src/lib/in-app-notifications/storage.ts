import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@munib_tracker_in_app_notifications_v1";
const MAX_ITEMS = 100;

export type InAppNotificationKind = "reminder" | "achievement" | "system" | "admin_announcement";

export interface InAppNotification {
  id: string;
  kind: InAppNotificationKind;
  title: string;
  body: string;
  subtitle?: string | null;
  createdAt: string;
  readAt: string | null;
  route?: string;
  broadcastId?: number | null;
  serverId?: number | null;
  routeData?: Record<string, unknown> | null;
}

function sortNewestFirst(items: InAppNotification[]): InAppNotification[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function loadInAppNotifications(): Promise<InAppNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InAppNotification[];
    return Array.isArray(parsed) ? sortNewestFirst(parsed) : [];
  } catch {
    return [];
  }
}

async function saveInAppNotifications(items: InAppNotification[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export async function appendInAppNotification(
  input: Omit<InAppNotification, "id" | "createdAt" | "readAt"> & {
    id?: string;
    createdAt?: string;
    readAt?: string | null;
  },
): Promise<InAppNotification> {
  const items = await loadInAppNotifications();
  const id = input.id ?? `inapp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const existing = items.find((item) => item.id === id);
  if (existing) return existing;

  const created: InAppNotification = {
    id,
    kind: input.kind,
    title: input.title,
    body: input.body,
    subtitle: input.subtitle,
    route: input.route,
    broadcastId: input.broadcastId,
    serverId: input.serverId,
    routeData: input.routeData,
    createdAt: input.createdAt ?? new Date().toISOString(),
    readAt: input.readAt ?? null,
  };
  await saveInAppNotifications([created, ...items]);
  return created;
}

/** Merge server rows into local storage (server wins on matching serverId). */
export async function mergeServerInAppNotifications(
  serverItems: InAppNotification[],
): Promise<InAppNotification[]> {
  const local = await loadInAppNotifications();
  const byServerId = new Map<number, InAppNotification>();
  for (const item of serverItems) {
    if (item.serverId != null) byServerId.set(item.serverId, item);
  }

  const keptLocal = local.filter((item) => item.serverId == null || !byServerId.has(item.serverId));
  const merged = sortNewestFirst([...serverItems, ...keptLocal]).slice(0, MAX_ITEMS);
  await saveInAppNotifications(merged);
  return merged;
}

export async function markInAppNotificationRead(id: string): Promise<void> {
  const items = await loadInAppNotifications();
  const next = items.map((item) =>
    item.id === id && item.readAt == null ? { ...item, readAt: new Date().toISOString() } : item,
  );
  await saveInAppNotifications(next);
}

export async function markAllInAppNotificationsRead(): Promise<void> {
  const items = await loadInAppNotifications();
  const now = new Date().toISOString();
  await saveInAppNotifications(items.map((item) => ({ ...item, readAt: item.readAt ?? now })));
}

export async function clearAllInAppNotifications(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function countUnreadInAppNotifications(items: InAppNotification[]): number {
  return items.filter((item) => item.readAt == null).length;
}
