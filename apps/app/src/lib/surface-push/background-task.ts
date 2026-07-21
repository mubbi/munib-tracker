import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import { handleSurfacePhaseDataMessage } from "./register";

const SURFACE_PUSH_BACKGROUND_TASK = "munib-surface-push-background";

type NotificationTaskData = {
  notification?: {
    request?: {
      content?: { data?: Record<string, unknown> };
    };
  };
  request?: {
    content?: { data?: Record<string, unknown> };
  };
  data?: Record<string, unknown>;
};

function extractPushData(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const event = value as NotificationTaskData;
  return (
    event.notification?.request?.content?.data ??
    event.request?.content?.data ??
    event.data ??
    (value as Record<string, unknown>)
  );
}

export function registerSurfacePushBackgroundTask(): void {
  if (Platform.OS !== "android") return;

  if (!TaskManager.isTaskDefined(SURFACE_PUSH_BACKGROUND_TASK)) {
    TaskManager.defineTask(SURFACE_PUSH_BACKGROUND_TASK, async ({ data, error }) => {
      if (error) return;
      await handleSurfacePhaseDataMessage(extractPushData(data));
    });
  }

  void Notifications.registerTaskAsync(SURFACE_PUSH_BACKGROUND_TASK).catch(() => {
    // Local AlarmManager phase boundaries remain authoritative if background
    // notification task registration is unavailable.
  });
}
