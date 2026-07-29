import type {
  AdminBroadcastInternalScreen,
  AdminBroadcastLinkType,
  AdminBroadcastScheduleMode,
  ScheduledWallClock,
} from "@munib-tracker/shared/admin-broadcasts";
import {
  isAllowedNotificationExternalUrl,
  NOTIFICATION_OPEN_EXTERNAL_ACTION,
} from "@munib-tracker/shared/admin-broadcasts";

export function buildBroadcastRouteData(input: {
  broadcastId: number;
  linkType: AdminBroadcastLinkType;
  internalScreen?: AdminBroadcastInternalScreen;
  externalUrl?: string;
}): Record<string, unknown> | null {
  const base: Record<string, unknown> = { broadcastId: input.broadcastId };

  if (input.linkType === "external" && input.externalUrl) {
    return {
      ...base,
      action: NOTIFICATION_OPEN_EXTERNAL_ACTION,
      externalUrl: input.externalUrl.trim(),
    };
  }

  if (input.linkType === "internal" && input.internalScreen) {
    if (input.internalScreen === "/") {
      return base;
    }
    return { ...base, href: input.internalScreen };
  }

  return base;
}

export function parseScheduledWallClock(
  scheduleMode: AdminBroadcastScheduleMode,
  dateValue: string,
  timeValue: string,
): { scheduledAt: Date | null; scheduledWallClock: ScheduledWallClock | null } {
  if (scheduleMode === "immediate") {
    return { scheduledAt: null, scheduledWallClock: null };
  }
  const combined = `${dateValue.trim()}T${timeValue.trim()}:00`;
  const parsed = new Date(combined);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid schedule date or time");
  }
  if (scheduleMode === "fixed_utc") {
    return { scheduledAt: parsed, scheduledWallClock: null };
  }
  const scheduledWallClock: ScheduledWallClock = {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
    hour: parsed.getHours(),
    minute: parsed.getMinutes(),
  };
  return { scheduledAt: parsed, scheduledWallClock };
}

export function validateBroadcastLink(
  linkType: AdminBroadcastLinkType,
  internalScreen?: string,
  externalUrl?: string,
): void {
  if (linkType === "none") return;
  if (linkType === "internal") {
    if (!internalScreen?.trim()) {
      throw new Error("Select an in-app screen for internal links");
    }
    return;
  }
  if (!externalUrl?.trim()) {
    throw new Error("External URL is required");
  }
  if (!isAllowedNotificationExternalUrl(externalUrl)) {
    throw new Error("External URL must be HTTPS and on an allowlisted domain");
  }
}
