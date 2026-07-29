import type { PilgrimageChecklistItem } from "../types/hajj-guide";

/**
 * Umrah rite checklist (NF-2.3) — ordered lesser-pilgrimage sequence. Educational
 * detail lives in hajj-guide.ts (umrah section). Stable ids match the prior
 * combined guide so existing Umrah progress can migrate.
 */
export const UMRAH_CHECKLIST: PilgrimageChecklistItem[] = [
  {
    id: "umrah-ihram",
    title: "Enter ihram",
    hint: "At or before the miqat: ghusl, ihram garments, intention for Umrah, talbiyah.",
    location: "Miqat",
  },
  {
    id: "umrah-talbiyah",
    title: "Recite the talbiyah",
    hint: "Repeat Labbayk… often until you begin tawaf.",
  },
  {
    id: "umrah-tawaf",
    title: "Tawaf of the Ka'bah",
    hint: "Seven circuits anticlockwise from the Black Stone; men: raml and idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    id: "umrah-maqam",
    title: "Pray two rakahs",
    hint: "Behind Maqam Ibrahim if possible, then drink Zamzam.",
    location: "Masjid al-Haram",
  },
  {
    id: "umrah-sai",
    title: "Sa'i between Safa & Marwah",
    hint: "Seven courses starting at Safa; men jog between the green markers.",
    location: "Masjid al-Haram",
  },
  {
    id: "umrah-halq",
    title: "Halq or taqsir",
    hint: "Men shave or trim; women trim a fingertip's length — Umrah complete.",
  },
];
