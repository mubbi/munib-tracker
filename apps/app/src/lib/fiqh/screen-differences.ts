import type { FiqhDifferenceId } from "@munib-tracker/shared/fiqh";

/**
 * NF-3.0a: non-guide screens that render `<MadhhabNote>`s, keyed by their
 * `FiqhDifference.usedIn` anchor. Screens that render a whole list import their
 * own row (so the list it renders and the list the coverage test checks are the
 * same array); `screen-differences.render.test.tsx` renders each screen's
 * component and asserts every registered id actually shows up. Guide topics
 * declare theirs in `differenceIds` instead.
 */
export const SCREEN_DIFFERENCES = {
  "/umrah/checklist": ["tawaf.wudu"],
  // NF-3.4 Umrah mode: the tawaf step of the live guided flow.
  "/umrah#tawaf": ["tawaf.wudu"],
  // NF-3.4 Umrah mode: how much to shorten (taqsir) on the halq / taqsir step.
  "/umrah#halq_taqsir": ["umrah.taqsir"],
  // NF-3.10 Mirath calculator: "Where the schools differ" card.
  "/mirath": [
    "mirath.grandfatherSiblings",
    "mirath.mushtarakah",
    "mirath.paternalGrandmother",
    "mirath.radd",
    "mirath.malikiyyah",
  ],
  // Tracker: the "combine with" picker in the Salah status sheet.
  "/(tabs)/tracker#combined": ["jam.travel", "jam.rain"],
  // Tracker: blood-period prompts under the excused-day picker (BloodPeriodStatus).
  "/(tabs)/tracker#excused": ["hayd.max", "hayd.beyondMax"],
  // Qaza: Witr status / form / qaza accrual info card.
  "/qaza": ["witr.qaza"],
  // Travel: qasr calculator card + one note list per guide section.
  "/travel#calculator": ["qasr.distance", "qasr.status", "qasr.residency", "jam.travel"],
  "/travel#distance": ["qasr.distance"],
  "/travel#qasr": ["qasr.status"],
  "/travel#when": ["qasr.residency"],
  "/travel#jam": ["jam.travel"],
  "/travel#jamTypes": ["jam.travel", "jam.rain"],
  "/travel#sunnah": ["travel.rawatib"],
  "/travel#witr": ["witr.status"],
  // Hayd guide: "Where the schools differ" card (and the period prompts).
  "/hayd": ["hayd.min", "hayd.max", "hayd.minPurity", "hayd.beyondMax", "nifas.max"],
  // Zakat calculator: nisab basis + combine at the top, jewellery on its input.
  "/zakat": ["zakat.nisabBasis", "zakat.combineGoldSilver", "zakat.jewellery"],
  "/zakat#calculator": ["zakat.nisabBasis", "zakat.combineGoldSilver", "zakat.jewellery"],
  // Ramadan fiqh card.
  "/ramadan": ["fasting.forgetfulEating", "fasting.kaffarah", "fitr.measure", "tarawih.rakahs"],
  // Fidyah calculator fiqh panel.
  "/fidyah": ["fidyah.measure"],
  // Voluntary fasting hub: "Days not to fast" card.
  "/fasting": ["fasting.afterMidShaban", "fasting.forgetfulEating"],
  // Dhul-Hijjah mode: Tashriq takbir section + udhiyah hair/nails note.
  "/dhul-hijjah": ["tashriq.takbir", "udhiyah.hairNails", "udhiyah.status"],
  // Rawatib hub notes + the tahiyyat al-masjid hint.
  "/rawatib": ["rawatib.preset", "rawatib.fajrMakeup", "travel.rawatib"],
  "/rawatib#tahiyyat": ["masjid.tahiyyat"],
  // Habits: Qur'an recitation during hayd note on the Qur'an habit row.
  "/habits": ["hayd.quranRecitation"],
  // Wasiyyah wizard steps.
  "/wasiyyah/edit#debts": ["wasiyyah.debtsToAllah"],
  "/wasiyyah/edit#bequests": ["wasiyyah.noHeirs"],
} as const satisfies Record<string, readonly FiqhDifferenceId[]>;

export type ScreenDifferenceAnchor = keyof typeof SCREEN_DIFFERENCES;

/** The registered notes for an anchor (empty when the anchor renders none). */
export function screenDifferences(anchor: string): readonly FiqhDifferenceId[] {
  return (SCREEN_DIFFERENCES as Record<string, readonly FiqhDifferenceId[]>)[anchor] ?? [];
}
