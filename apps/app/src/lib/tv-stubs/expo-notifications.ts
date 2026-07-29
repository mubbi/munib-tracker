/**
 * Metro resolves `expo-notifications` here when `EXPO_TV=1`.
 * Local scheduling / Expo push token APIs are phone-only; Apple TV has no
 * ExpoPushTokenManager. Keep call sites working with no-ops.
 */

export enum AndroidImportance {
  UNKNOWN = 0,
  UNSPECIFIED = 1,
  NONE = 2,
  MIN = 3,
  LOW = 4,
  DEFAULT = 5,
  HIGH = 6,
  MAX = 7,
}

export enum SchedulableTriggerInputTypes {
  CALENDAR = "calendar",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  DATE = "date",
  TIME_INTERVAL = "timeInterval",
}

type EventSubscription = { remove: () => void };

export type Notification = {
  date: number;
  request: {
    identifier: string;
    content: {
      title: string | null;
      body: string | null;
      data: Record<string, unknown>;
    };
    trigger: unknown;
  };
};

export type NotificationResponse = {
  notification: Notification;
  actionIdentifier: string;
};

export function setNotificationHandler(_handler: unknown): void {}

export async function getPermissionsAsync(): Promise<{
  status: string;
  granted: boolean;
  canAskAgain: boolean;
}> {
  return { status: "denied", granted: false, canAskAgain: false };
}

export async function requestPermissionsAsync(): Promise<{
  status: string;
  granted: boolean;
  canAskAgain: boolean;
}> {
  return { status: "denied", granted: false, canAskAgain: false };
}

export async function getExpoPushTokenAsync(_options?: {
  projectId?: string;
}): Promise<{ data: string }> {
  throw new Error("Push tokens unavailable on TV");
}

export async function setNotificationChannelAsync(
  _channelId: string,
  _channel: unknown,
): Promise<null> {
  return null;
}

export async function scheduleNotificationAsync(_request: unknown): Promise<string> {
  return "tv-noop";
}

export async function cancelScheduledNotificationAsync(_identifier: string): Promise<void> {}

export async function cancelAllScheduledNotificationsAsync(): Promise<void> {}

export async function getAllScheduledNotificationsAsync(): Promise<Notification[]> {
  return [];
}

export async function getLastNotificationResponseAsync(): Promise<NotificationResponse | null> {
  return null;
}

export function addNotificationReceivedListener(
  _listener: (notification: Notification) => void,
): EventSubscription {
  return { remove: () => {} };
}

export function addNotificationResponseReceivedListener(
  _listener: (response: NotificationResponse) => void,
): EventSubscription {
  return { remove: () => {} };
}

export default {
  AndroidImportance,
  SchedulableTriggerInputTypes,
  setNotificationHandler,
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
  setNotificationChannelAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  getAllScheduledNotificationsAsync,
  getLastNotificationResponseAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
};
