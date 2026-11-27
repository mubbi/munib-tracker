import type { MadhhabRules } from "@munib-tracker/shared/fiqh";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { useMadhhab } from "@/hooks/use-madhhab";
import {
  DHUL_HIJJAH_MONTH,
  type DhulHijjahPhase,
  dayOfTen,
  phaseForHijri,
  type TashriqSlotItem,
  tashriqSlots,
  tashriqSlotsAllViews,
} from "@/lib/dhul-hijjah";
import { gregorianToHijri, type HijriDate } from "@/lib/hijri";
import { useLocation } from "@/stores/location-store";
import { useTrackerDate } from "@/stores/tracker-store";

export interface DhulHijjahSeason {
  today: string;
  hijri: HijriDate;
  phase: DhulHijjahPhase | null;
  /** Hijri year of the current or coming Dhul-Hijjah. */
  year: number;
  dayOfTen: number | null;
  /** Salah-domain rules for Takbir al-Tashriq; `null` ⇒ all views. */
  salahRules: MadhhabRules | null;
  /** Udhiyah-domain rules; `null` ⇒ all views. */
  udhiyahRules: MadhhabRules | null;
  slots: Array<TashriqSlotItem & { schools?: string[] }>;
}

/**
 * The season as of the tracker's day (NF-3.3): Hijri date via `lib/hijri.ts`
 * (location + user adjustment), phase, Takbir al-Tashriq slots for the user's
 * school (union with school labels when no school is chosen).
 */
export function useDhulHijjahSeason(): DhulHijjahSeason {
  const location = useLocation();
  const trackerDate = useTrackerDate();
  const { rules } = useMadhhab();
  const salahRules = rules("salah");
  const udhiyahRules = rules("udhiyah");
  const today = trackerDate || getLocalDateString();

  return useMemo(() => {
    const [y, m, d] = today.split("-").map(Number);
    const hijri = gregorianToHijri(
      new Date(y as number, (m as number) - 1, d as number, 12),
      location.timeZone,
    );
    const phase = phaseForHijri(hijri);
    // The teaser and the off-season both point at the next Dhul-Hijjah.
    const year =
      hijri.month === DHUL_HIJJAH_MONTH && hijri.day <= 13
        ? hijri.year
        : hijri.month === 12
          ? hijri.year + 1
          : hijri.year;
    const slots = salahRules ? tashriqSlots(salahRules, year) : tashriqSlotsAllViews(year);
    return {
      today,
      hijri,
      phase,
      year,
      dayOfTen: dayOfTen(hijri),
      salahRules,
      udhiyahRules,
      slots,
    };
  }, [today, location.timeZone, salahRules, udhiyahRules]);
}
