import type { TrackerCategory } from "../types/index.ts";

export function isTrackerCategory(value: string): value is TrackerCategory {
  return value === "salah" || value === "dhikr" || value === "qadha";
}
