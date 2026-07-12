export const CLIENT_PLATFORMS = ["ios", "android", "web"] as const;
export type ClientPlatform = (typeof CLIENT_PLATFORMS)[number];

export function clientPlatformLabel(platform: ClientPlatform): string {
  if (platform === "ios") return "iOS";
  if (platform === "android") return "Android";
  return "Web";
}

export const ACCOUNT_TYPES = ["guest", "user"] as const;
export type AccountTypeFilter = (typeof ACCOUNT_TYPES)[number];

export const DATE_PRESETS = ["7d", "30d", "90d", "365d", "custom"] as const;
export type DatePreset = (typeof DATE_PRESETS)[number];

/** Ratings accepted by the low-star feedback API (1–3) plus display-range completeness. */
export const APP_FEEDBACK_RATINGS = [1, 2, 3] as const;

/** Matches `@munib-tracker/shared/reviews` APP_FEEDBACK_TRIGGER_IDS. */
export const APP_FEEDBACK_TRIGGERS = [
  "perfect_day",
  "achievement_unlock",
  "weekly_report",
  "streak_milestone",
  "qaza_cleared",
  "manual",
] as const;

export {
  OSS_CONTENT_ERROR_CODES,
  OSS_CONTENT_KINDS,
} from "@munib-tracker/shared/types/oss-content-download-failure";
