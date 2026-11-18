import type { InAppNotification } from "@/lib/in-app-notifications/storage";

/** An unread local in-app notification with no server id. */
export function buildInAppNotification(
  overrides: Partial<InAppNotification> = {},
): InAppNotification {
  return {
    id: "n1",
    kind: "reminder",
    title: "Reminder",
    body: "Time for Salah",
    createdAt: "2026-01-01T00:00:00.000Z",
    readAt: null,
    ...overrides,
  };
}
