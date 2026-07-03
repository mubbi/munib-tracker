import type { PrayerLog } from "../types/index";

/**
 * Builds a {@link PrayerLog} for tests with sensible defaults. Pass `overrides`
 * to tweak any field (e.g. `source`, `notes`, `updatedAt`) without restating the
 * whole shape. Keeps prayer-log fixtures consistent across the utils test suites.
 */
export function makePrayerLog(
  date: string,
  prayerId: PrayerLog["prayerId"],
  status: PrayerLog["status"],
  overrides: Partial<PrayerLog> = {},
): PrayerLog {
  return {
    id: `${date}-${prayerId}`,
    prayerId,
    date,
    status,
    updatedAt: `${date}T00:00:00.000Z`,
    source: "manual",
    ...overrides,
  };
}
