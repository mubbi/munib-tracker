import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

import type { KhatmPlan } from "@/lib/khatm";

/** A 30-day ayah plan on its `day`-th day (day 1 = started today). */
export function buildKhatmPlan(overrides: Partial<KhatmPlan> & { day?: number } = {}): KhatmPlan {
  const { day = 1, ...rest } = overrides;
  return {
    days: 30,
    startDate: addDays(getLocalDateString(), -(day - 1)),
    unit: "ayah",
    ...rest,
  };
}
