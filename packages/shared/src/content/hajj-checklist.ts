import type { PilgrimageChecklistItem } from "../types/hajj-guide";

/**
 * Hajj rite checklist (NF-2.3) — Tamattu'-oriented practical order for the days
 * of Hajj. Educational content lives in hajj-guide.ts; prep tips are not listed
 * here. Stable ids are preserved for migrating prior checklist progress.
 */
export const HAJJ_CHECKLIST: PilgrimageChecklistItem[] = [
  {
    id: "hajj-ihram",
    title: "Enter ihram for Hajj",
    hint: "Intend Hajj and enter ihram (from Makkah for tamattu'); renew the talbiyah.",
    day: "8 Dhul-Hijjah",
  },
  {
    id: "hajj-mina-day",
    title: "Travel to Mina",
    hint: "Pray Dhuhr through Fajr in Mina, each shortened at its time.",
    location: "Mina",
    day: "8 Dhul-Hijjah",
  },
  {
    id: "hajj-arafah-stand",
    title: "Stand at Arafah",
    hint: "Remain within Arafah from after midday until sunset in dua and zikr.",
    location: "Arafah",
    day: "9 Dhul-Hijjah",
  },
  {
    id: "hajj-arafah-prayers",
    title: "Combine Dhuhr & Asr",
    hint: "Pray Dhuhr and Asr together and shortened at Dhuhr time, then focus on dua.",
    location: "Arafah",
    day: "9 Dhul-Hijjah",
  },
  {
    id: "hajj-muzdalifah",
    title: "Move to Muzdalifah",
    hint: "After sunset, combine Maghrib and Isha, rest, and gather pebbles.",
    location: "Muzdalifah",
    day: "9 Dhul-Hijjah",
  },
  {
    id: "hajj-rami-aqaba",
    title: "Stone Jamrat al-Aqaba",
    hint: "Throw seven pebbles at the large pillar with takbir on each throw.",
    location: "Mina",
    day: "10 Dhul-Hijjah",
  },
  {
    id: "hajj-sacrifice",
    title: "Offer the sacrifice",
    hint: "Required for tamattu' and qiran — slaughter or arrange via a trusted agency.",
    day: "10 Dhul-Hijjah",
  },
  {
    id: "hajj-halq",
    title: "Halq or taqsir",
    hint: "Men shave or trim; women trim a fingertip's length (first release).",
    day: "10 Dhul-Hijjah",
  },
  {
    id: "hajj-ifadah",
    title: "Tawaf al-Ifadah",
    hint: "Perform Tawaf al-Ifadah and sa'i for tamattu' — a pillar of Hajj.",
    location: "Masjid al-Haram",
    day: "10 Dhul-Hijjah",
  },
  {
    id: "hajj-mina-nights",
    title: "Stay overnight in Mina",
    hint: "Spend the nights of the 11th, 12th (and 13th if not leaving early) in Mina.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    id: "hajj-rami-three",
    title: "Stone the three Jamarat",
    hint: "After Dhuhr each day, stone small, middle, then large — seven each.",
    location: "Mina",
    day: "11–13 Dhul-Hijjah",
  },
  {
    id: "hajj-wada",
    title: "Farewell Tawaf",
    hint: "Perform Tawaf al-Wada before leaving Makkah (menstruating women excused).",
    location: "Masjid al-Haram",
    day: "Departure",
  },
];
