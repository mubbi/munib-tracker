/**
 * Admin broadcast targeting, scheduling, and link types — shared by admin + app.
 */

import {
  OFFICIAL_ADMIN_ORIGIN,
  OFFICIAL_APP_WEB_ORIGIN,
  OFFICIAL_SITE_ORIGIN,
} from "./constants/site";

/** Linked (non-guest) users by default; guests are never broadcast targets. */
export const ADMIN_BROADCAST_AUDIENCES = ["all_linked"] as const;
export type AdminBroadcastAudience = (typeof ADMIN_BROADCAST_AUDIENCES)[number];

export const ADMIN_BROADCAST_CATEGORIES = [
  "general",
  "product_news",
  "content",
  "reminder",
] as const;
export type AdminBroadcastCategory = (typeof ADMIN_BROADCAST_CATEGORIES)[number];

export const ADMIN_BROADCAST_TITLE_MAX = 50;
export const ADMIN_BROADCAST_SUBTITLE_MAX = 50;
export const ADMIN_BROADCAST_BODY_MAX = 178;

export const ADMIN_BROADCAST_PLATFORMS = ["ios", "android", "web"] as const;
export type AdminBroadcastPlatform = (typeof ADMIN_BROADCAST_PLATFORMS)[number];

export const ADMIN_BROADCAST_ACTIVITY_DAY_PRESETS = [1, 7, 14, 30, 60, 90, 180, 365] as const;

export const ADMIN_BROADCAST_STATUSES = [
  "pending",
  "scheduled",
  "processing",
  "completed",
  "failed",
  "cancelled",
] as const;
export type AdminBroadcastStatus = (typeof ADMIN_BROADCAST_STATUSES)[number];

export const ADMIN_BROADCAST_SCHEDULE_MODES = ["immediate", "fixed_utc", "user_local"] as const;
export type AdminBroadcastScheduleMode = (typeof ADMIN_BROADCAST_SCHEDULE_MODES)[number];

export const ADMIN_BROADCAST_LINK_TYPES = ["none", "internal", "external"] as const;
export type AdminBroadcastLinkType = (typeof ADMIN_BROADCAST_LINK_TYPES)[number];

/** Munib Expo Router paths (leading slash) for internal deep links. */
export const ADMIN_BROADCAST_INTERNAL_SCREENS = [
  "/",
  "/notifications",
  "/settings",
  "/settings/my-reports",
  "/quran",
  "/hadith",
  "/dua",
  "/zikr",
  "/adhkar-builder",
  "/search",
] as const;
export type AdminBroadcastInternalScreen = (typeof ADMIN_BROADCAST_INTERNAL_SCREENS)[number];

export type AdminBroadcastFilters = {
  /** App locale codes from push_tokens.locale (e.g. en, ar, ur). */
  locales?: string[];
  /** Signed-in activity within N days (`auth_sessions.createdAt` proxy). */
  activeWithinDays?: number;
  /** Inactive for at least N days. */
  inactiveForDays?: number;
  /** Users with push tokens on selected client platforms. Empty = all. */
  platforms?: AdminBroadcastPlatform[];
};

export function canonicalBroadcastFilters(raw: AdminBroadcastFilters): AdminBroadcastFilters {
  const out: AdminBroadcastFilters = {};
  if (raw.locales?.length) out.locales = [...raw.locales].sort();
  if (raw.activeWithinDays != null && raw.activeWithinDays > 0) {
    out.activeWithinDays = Math.floor(raw.activeWithinDays);
  }
  if (raw.inactiveForDays != null && raw.inactiveForDays > 0) {
    out.inactiveForDays = Math.floor(raw.inactiveForDays);
  }
  if (raw.platforms?.length) {
    out.platforms = raw.platforms
      .filter((p): p is AdminBroadcastPlatform => p === "ios" || p === "android" || p === "web")
      .sort();
  }
  return out;
}

export function broadcastFiltersEqual(a: AdminBroadcastFilters, b: AdminBroadcastFilters): boolean {
  return (
    JSON.stringify(canonicalBroadcastFilters(a)) === JSON.stringify(canonicalBroadcastFilters(b))
  );
}

export type ScheduledWallClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export const ADMIN_BROADCAST_SCHEDULE_WINDOW_MINUTES = 20;

export const NOTIFICATION_OPEN_EXTERNAL_ACTION = "open_external_url" as const;

export const IN_APP_NOTIFICATION_MAX_ITEMS = 100;

/** Users processed per cron/process invocation. */
export const BROADCAST_USER_BATCH_SIZE = 200;
/** Max process invocations per cron tick (safety). */
export const BROADCAST_BATCH_GUARD = 25;
/** Max broadcasts claimed per cron run. */
export const BROADCAST_CRON_LIMIT = 5;
export const EXPO_PUSH_CHUNK_SIZE = 100;
export const WEB_PUSH_CONCURRENCY = 8;

export function chunkArray<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, items.length || 1)) },
    async () => {
      while (next < items.length) {
        const index = next;
        next += 1;
        const item = items[index];
        if (item === undefined) continue;
        results[index] = await fn(item);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

export function adminBroadcastCategoryLabel(category: AdminBroadcastCategory | string): string {
  switch (category) {
    case "product_news":
      return "Product news";
    case "content":
      return "Content";
    case "reminder":
      return "Reminder";
    case "general":
      return "General";
    default:
      return String(category).replace(/_/g, " ");
  }
}

export function adminBroadcastStatusLabel(status: AdminBroadcastStatus | string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "scheduled":
      return "Scheduled";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    default:
      return String(status);
  }
}

const ALLOWED_EXTERNAL_HOSTS = new Set([
  new URL(OFFICIAL_SITE_ORIGIN).host,
  new URL(OFFICIAL_APP_WEB_ORIGIN).host,
  new URL(OFFICIAL_ADMIN_ORIGIN).host,
]);

export function isAllowedNotificationExternalUrl(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return false;
    return ALLOWED_EXTERNAL_HOSTS.has(url.host);
  } catch {
    return false;
  }
}

/** True when the user's local wall clock is within ±windowMinutes of the scheduled time. */
export function isUserLocalWallClockDue(
  wall: ScheduledWallClock,
  timeZone: string,
  now: Date,
  windowMinutes: number,
): boolean {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);
  } catch {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);
  }
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? NaN);
  const localMinutes = get("hour") * 60 + get("minute");
  const targetMinutes = wall.hour * 60 + wall.minute;
  const sameDay =
    get("year") === wall.year && get("month") === wall.month && get("day") === wall.day;
  if (!sameDay) return false;
  return Math.abs(localMinutes - targetMinutes) <= windowMinutes;
}

export function isBroadcastScheduleReady(
  broadcast: {
    scheduleMode: AdminBroadcastScheduleMode | string;
    scheduledAt?: Date | string | null;
    status: string;
  },
  now: Date,
): boolean {
  if (broadcast.scheduleMode === "immediate") return true;
  if (broadcast.scheduleMode === "user_local") return true;
  if (!broadcast.scheduledAt) return true;
  const at =
    broadcast.scheduledAt instanceof Date ? broadcast.scheduledAt : new Date(broadcast.scheduledAt);
  return !Number.isNaN(at.getTime()) && at.getTime() <= now.getTime();
}

export type AdminBroadcastFilterPresetGroup = "activity" | "platform" | "general";

export const ADMIN_BROADCAST_FILTER_PRESET_GROUPS = ["activity", "platform", "general"] as const;

export const ADMIN_BROADCAST_FILTER_PRESET_GROUP_LABELS: Record<
  AdminBroadcastFilterPresetGroup,
  string
> = {
  activity: "Activity",
  platform: "Platform",
  general: "General",
};

export type AdminBroadcastFilterPreset = {
  id: string;
  group: AdminBroadcastFilterPresetGroup;
  label: string;
  name: string;
  description?: string;
  filters: AdminBroadcastFilters;
};

export const ADMIN_BROADCAST_FILTER_PRESETS: AdminBroadcastFilterPreset[] = [
  {
    id: "active_7d",
    group: "activity",
    label: "Active in last 7 days",
    name: "Active in last 7 days",
    description: "Users with a recent auth session",
    filters: { activeWithinDays: 7 },
  },
  {
    id: "inactive_30d",
    group: "activity",
    label: "Inactive 30+ days",
    name: "Inactive 30+ days",
    description: "No auth session in the last 30 days",
    filters: { inactiveForDays: 30 },
  },
  {
    id: "ios",
    group: "platform",
    label: "iOS push",
    name: "iOS push",
    filters: { platforms: ["ios"] },
  },
  {
    id: "android",
    group: "platform",
    label: "Android push",
    name: "Android push",
    filters: { platforms: ["android"] },
  },
  {
    id: "web",
    group: "platform",
    label: "Web push",
    name: "Web push",
    filters: { platforms: ["web"] },
  },
];

export type AdminBroadcastTemplateGroup = "product" | "content" | "general";

export const ADMIN_BROADCAST_TEMPLATE_GROUPS = ["product", "content", "general"] as const;

export const ADMIN_BROADCAST_TEMPLATE_GROUP_LABELS: Record<AdminBroadcastTemplateGroup, string> = {
  product: "Product",
  content: "Content",
  general: "General",
};

export type AdminBroadcastTemplate = {
  id: string;
  group: AdminBroadcastTemplateGroup;
  label: string;
  /** Alias for UI that still reads `.name` */
  name: string;
  category: AdminBroadcastCategory;
  title: string;
  subtitle?: string;
  body: string;
  internalScreen?: AdminBroadcastInternalScreen;
};

export const ADMIN_BROADCAST_TEMPLATES: AdminBroadcastTemplate[] = [
  {
    id: "whats_new",
    group: "product",
    label: "What's new",
    name: "What's new",
    category: "product_news",
    title: "What's new in Munib Tracker",
    body: "Open the app to see the latest improvements.",
    internalScreen: "/",
  },
  {
    id: "content_update",
    group: "content",
    label: "Content update",
    name: "Content update",
    category: "content",
    title: "New content available",
    body: "Fresh duas, adhkar, and guides are ready to explore.",
    internalScreen: "/dua",
  },
  {
    id: "gentle_reminder",
    group: "general",
    label: "Gentle reminder",
    name: "Gentle reminder",
    category: "reminder",
    title: "A gentle reminder",
    body: "Take a moment for dhikr today.",
    internalScreen: "/zikr",
  },
];

export function adminBroadcastTemplatesByGroup(
  group: AdminBroadcastTemplateGroup | "all",
): AdminBroadcastTemplate[] {
  if (group === "all") return ADMIN_BROADCAST_TEMPLATES;
  return ADMIN_BROADCAST_TEMPLATES.filter((t) => t.group === group);
}

export type BroadcastPreviewSurface = "ios_push" | "android_push" | "web_push" | "in_app";

export const BROADCAST_PREVIEW_SURFACES = [
  "ios_push",
  "android_push",
  "web_push",
  "in_app",
] as const;

export type BroadcastPreviewSurfaceSpec = {
  id: BroadcastPreviewSurface;
  label: string;
  note: string;
  title: number;
  subtitle?: number;
  body: number;
};

export const BROADCAST_PREVIEW_SURFACE_SPECS: Record<
  BroadcastPreviewSurface,
  BroadcastPreviewSurfaceSpec
> = {
  ios_push: {
    id: "ios_push",
    label: "iOS",
    note: "Lock screen / banner truncation",
    title: ADMIN_BROADCAST_TITLE_MAX,
    subtitle: ADMIN_BROADCAST_SUBTITLE_MAX,
    body: ADMIN_BROADCAST_BODY_MAX,
  },
  android_push: {
    id: "android_push",
    label: "Android",
    note: "Status bar / shade truncation",
    title: ADMIN_BROADCAST_TITLE_MAX,
    body: 90,
  },
  web_push: {
    id: "web_push",
    label: "Web",
    note: "Browser notification truncation",
    title: ADMIN_BROADCAST_TITLE_MAX,
    body: 120,
  },
  in_app: {
    id: "in_app",
    label: "In-app",
    note: "Inbox card shows full fields",
    title: ADMIN_BROADCAST_TITLE_MAX,
    subtitle: ADMIN_BROADCAST_SUBTITLE_MAX,
    body: ADMIN_BROADCAST_BODY_MAX,
  },
};

export function splitAtDisplayLimit(
  text: string,
  limit: number,
): { visible: string; truncated: string; overLimit: boolean } {
  if (text.length <= limit) return { visible: text, truncated: "", overLimit: false };
  return { visible: text.slice(0, limit), truncated: text.slice(limit), overLimit: true };
}

export function broadcastFieldUsage(
  surface: BroadcastPreviewSurface,
  fields: { title: string; subtitle?: string; body: string },
): {
  field: string;
  label: string;
  length: number;
  visibleLimit: number;
  overLimit: boolean;
  hiddenCount: number;
}[] {
  const spec = BROADCAST_PREVIEW_SURFACE_SPECS[surface];
  const rows = [
    { field: "title", label: "Title", length: fields.title.length, visibleLimit: spec.title },
    ...(spec.subtitle != null
      ? [
          {
            field: "subtitle",
            label: "Subtitle",
            length: (fields.subtitle ?? "").length,
            visibleLimit: spec.subtitle,
          },
        ]
      : []),
    { field: "body", label: "Body", length: fields.body.length, visibleLimit: spec.body },
  ];
  return rows.map((row) => ({
    ...row,
    overLimit: row.length > row.visibleLimit,
    hiddenCount: Math.max(0, row.length - row.visibleLimit),
  }));
}

export const IN_APP_PUSH_DATA_KEYS = {
  serverId: "serverNotificationId",
  kind: "notificationKind",
} as const;

export const PUSH_NOTIFICATION_CHANNEL_IDS = {
  DEFAULT: "default",
} as const;

export type WebPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export function isValidExpoPushToken(token: string): boolean {
  return /^ExponentPushToken\[.+]$/.test(token.trim()) || /^ExpoPushToken\[.+]$/.test(token.trim());
}

export function isValidWebPushSubscription(value: unknown): value is WebPushSubscription {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.endpoint !== "string" || !v.endpoint.startsWith("https://")) return false;
  const keys = v.keys;
  if (!keys || typeof keys !== "object") return false;
  const k = keys as Record<string, unknown>;
  return typeof k.p256dh === "string" && typeof k.auth === "string";
}
