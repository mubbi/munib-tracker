import type { ComparePage } from "@/content/types";
import { vsAthan } from "./athan";
import { bestSalahTrackerApps } from "./best-salah-tracker-apps";
import { vsIslam360 } from "./islam360";
import { islamicHabitTrackerApps } from "./islamic-habit-tracker-apps";
import { vsMuslimPro } from "./muslim-pro";
import { vsPillars } from "./pillars";
import { vsTarteel } from "./tarteel";

export const COMPARE_PAGES: readonly ComparePage[] = [
  bestSalahTrackerApps,
  vsMuslimPro,
  vsIslam360,
  vsTarteel,
  vsPillars,
  vsAthan,
  islamicHabitTrackerApps,
];

export function getComparison(slug: string): ComparePage | undefined {
  return COMPARE_PAGES.find((c) => c.slug === slug);
}

export function compareHref(slug: string): string {
  return `/compare/${slug}`;
}
