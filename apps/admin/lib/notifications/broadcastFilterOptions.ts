import type { AdminBroadcastPlatform } from "@munib-tracker/shared/admin-broadcasts";
import {
  ADMIN_BROADCAST_ACTIVITY_DAY_PRESETS,
  ADMIN_BROADCAST_PLATFORMS,
} from "@munib-tracker/shared/admin-broadcasts";
import { APP_LOCALE_CODES } from "@munib-tracker/shared/i18n";

export type BroadcastFilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type BroadcastFilterOptions = {
  locales: BroadcastFilterOption[];
  platforms: BroadcastFilterOption[];
  activityPresets: BroadcastFilterOption[];
};

type DistRow = { label: string; count: number };
type PlatformRow = { platform: string; count: number };

function localeDisplayName(code: string): string {
  try {
    const name = new Intl.DisplayNames(["en"], { type: "language" }).of(code.split("-")[0] ?? code);
    return name ? `${name} (${code})` : code;
  } catch {
    return code;
  }
}

function platformLabel(platform: AdminBroadcastPlatform): string {
  if (platform === "ios") return "iOS";
  if (platform === "android") return "Android";
  return "Web";
}

function platformUserCount(
  rows: PlatformRow[],
  platform: AdminBroadcastPlatform,
): number | undefined {
  const aliases =
    platform === "ios" ? ["ios", "iphone", "ipad"] : platform === "android" ? ["android"] : ["web"];
  let total = 0;
  let found = false;
  for (const row of rows) {
    const key = row.platform.trim().toLowerCase();
    if (aliases.includes(key)) {
      total += Number(row.count ?? 0);
      found = true;
    }
  }
  return found ? total : undefined;
}

export function buildBroadcastFilterOptions(input: {
  localeDist: DistRow[];
  platformSessions: PlatformRow[];
}): BroadcastFilterOptions {
  const localeCounts = new Map<string, number>();
  for (const row of input.localeDist) {
    localeCounts.set(row.label, (localeCounts.get(row.label) ?? 0) + Number(row.count ?? 0));
  }

  const locales: BroadcastFilterOption[] = APP_LOCALE_CODES.map((code) => ({
    value: code,
    label: localeDisplayName(code),
    count: localeCounts.get(code),
  })).sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || a.label.localeCompare(b.label));

  const platforms: BroadcastFilterOption[] = ADMIN_BROADCAST_PLATFORMS.map((platform) => ({
    value: platform,
    label: platformLabel(platform),
    count: platformUserCount(input.platformSessions, platform),
  }));

  const activityPresets: BroadcastFilterOption[] = ADMIN_BROADCAST_ACTIVITY_DAY_PRESETS.map(
    (days) => ({
      value: String(days),
      label: days === 1 ? "Last 24 hours" : `Last ${days} days`,
    }),
  );

  return { locales, platforms, activityPresets };
}
