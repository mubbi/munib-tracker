import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@munib_tracker_in_app_notifications_v1";
const MAX_ITEMS = 100;

export type InAppNotificationKind = "reminder" | "achievement" | "system";

export interface InAppNotification {
  id: string;
  kind: InAppNotificationKind;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  route?: string;
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
  input: Omit<InAppNotification, "id" | "createdAt" | "readAt"> & { id?: string },
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
    route: input.route,
    createdAt: new Date().toISOString(),
    readAt: null,
  };
  await saveInAppNotifications([created, ...items]);
  return created;
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
