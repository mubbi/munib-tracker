import type { AdminBroadcastFilters } from "@munib-tracker/shared/admin-broadcasts";

export function countActiveBroadcastFilters(filters: AdminBroadcastFilters): number {
  let count = 0;
  if (filters.platforms?.length) count += 1;
  if (filters.locales?.length) count += 1;
  if (filters.activeWithinDays != null) count += 1;
  if (filters.inactiveForDays != null) count += 1;
  return count;
}

export function formatBroadcastFilterSummary(filters: AdminBroadcastFilters): string[] {
  const lines: string[] = [];
  if (filters.platforms?.length) {
    lines.push(`Platforms: ${filters.platforms.map((p) => p.toUpperCase()).join(", ")}`);
  }
  if (filters.locales?.length) lines.push(`Languages: ${filters.locales.join(", ")}`);
  if (filters.activeWithinDays != null)
    lines.push(`Active within ${filters.activeWithinDays} days`);
  if (filters.inactiveForDays != null) lines.push(`Inactive for ${filters.inactiveForDays}+ days`);
  return lines;
}
