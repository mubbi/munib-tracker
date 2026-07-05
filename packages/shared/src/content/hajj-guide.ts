import type { HajjGuideSection } from "../types/hajj-guide";

/**
 * Offline Hajj & Umrah checklist (NF-2.3). Scholar-neutral, procedural teaching
 * content covering the ordered rites of Umrah and the five days of Hajj. It is a
 * practical checklist, not a fiqh manual — a disclaimer directs the pilgrim to a
 * qualified guide for rulings and edge cases. Bump the version when content
 * changes so any cache/test notices.
 */
export const HAJJ_GUIDE_CONTENT_VERSION = 1;

export const HAJJ_GUIDE_SECTIONS: HajjGuideSection[] = [
  {
    id: "umrah",
    kind: "umrah",
    title: "Umrah",
    summary: "The lesser pilgrimage — can be performed at any time of year.",
    steps: [
      {
        id: "umrah-ihram",
        title: "Enter ihram",
        body: "At or before the miqat, make ghusl, wear the ihram garments, form the intention for Umrah, and begin the talbiyah.",
        location: "Miqat",
      },
      {
        id: "umrah-talbiyah",
        title: "Recite the talbiyah",
        body: "Repeat 'Labbayk Allahumma labbayk…' often as you travel toward Makkah until you begin tawaf.",
      },
      {
        id: "umrah-tawaf",
        title: "Tawaf of the Ka'bah",
        body: "Circle the Ka'bah seven times anticlockwise, starting and ending at the Black Stone corner.",
        location: "Masjid al-Haram",
      },
      {
        id: "umrah-maqam",
        title: "Pray two rakats",
        body: "After tawaf, pray two rakats behind Maqam Ibrahim if possible, then drink Zamzam water.",
        location: "Masjid al-Haram",
      },
      {
        id: "umrah-sai",
        title: "Sa'i between Safa & Marwah",
        body: "Walk seven times between the hills of Safa and Marwah, beginning at Safa.",
        location: "Masjid al-Haram",
      },
      {
        id: "umrah-halq",
        title: "Halq or taqsir",
        body: "Men shave (halq) or trim (taqsir) the hair; women trim a fingertip's length. Ihram is now complete.",
      },
    ],
  },
  {
    id: "hajj-tarwiyah",
    kind: "hajj",
    day: "8 Dhul-Hijjah",
    title: "Day of Tarwiyah — Mina",
    summary: "The pilgrimage begins; the day is spent in Mina.",
    steps: [
      {
        id: "hajj-ihram",
        title: "Enter ihram for Hajj",
        body: "Make the intention for Hajj and re-enter ihram (from your residence in Makkah for tamattu').",
      },
      {
        id: "hajj-mina-day",
        title: "Travel to Mina",
        body: "Go to Mina and pray Dhuhr, Asr, Maghrib, Isha, and the next Fajr, each shortened at its own time.",
        location: "Mina",
      },
    ],
  },
  {
    id: "hajj-arafah",
    kind: "hajj",
    day: "9 Dhul-Hijjah",
    title: "Day of Arafah",
    summary: "The greatest day of Hajj — standing at Arafah.",
    steps: [
      {
        id: "hajj-arafah-stand",
        title: "Stand at Arafah",
        body: "Remain within Arafah from after midday until sunset in du'a, dhikr, and repentance. This standing is the essence of Hajj.",
        location: "Arafah",
      },
      {
        id: "hajj-arafah-prayers",
        title: "Combine Dhuhr & Asr",
        body: "Pray Dhuhr and Asr together, shortened, at the time of Dhuhr.",
        location: "Arafah",
      },
      {
        id: "hajj-muzdalifah",
        title: "Move to Muzdalifah",
        body: "After sunset travel to Muzdalifah, combine Maghrib and Isha, rest the night, and gather pebbles for the stoning.",
        location: "Muzdalifah",
      },
    ],
  },
  {
    id: "hajj-nahr",
    kind: "hajj",
    day: "10 Dhul-Hijjah",
    title: "Day of Nahr — Eid al-Adha",
    summary: "Stoning, sacrifice, and the main tawaf.",
    steps: [
      {
        id: "hajj-rami-aqaba",
        title: "Stone Jamrat al-Aqaba",
        body: "Return toward Mina and throw seven pebbles at the large pillar (Jamrat al-Aqaba), saying takbir with each.",
        location: "Mina",
      },
      {
        id: "hajj-sacrifice",
        title: "Offer the sacrifice",
        body: "Slaughter the sacrificial animal (or arrange it), as required for tamattu' and qiran pilgrims.",
      },
      {
        id: "hajj-halq",
        title: "Halq or taqsir",
        body: "Shave or trim the hair. After stoning and shaving, the first release from ihram restrictions applies.",
      },
      {
        id: "hajj-ifadah",
        title: "Tawaf al-Ifadah",
        body: "Go to Makkah for Tawaf al-Ifadah and the sa'i (for tamattu'). This completes the release from ihram.",
        location: "Masjid al-Haram",
      },
    ],
  },
  {
    id: "hajj-tashreeq",
    kind: "hajj",
    day: "11–13 Dhul-Hijjah",
    title: "Days of Tashreeq — Mina",
    summary: "Nights in Mina and the daily stoning of the three pillars.",
    steps: [
      {
        id: "hajj-mina-nights",
        title: "Stay overnight in Mina",
        body: "Spend the nights of the 11th, 12th (and 13th if not leaving early) in Mina.",
        location: "Mina",
      },
      {
        id: "hajj-rami-three",
        title: "Stone the three Jamarat",
        body: "Each afternoon throw seven pebbles at each of the three pillars in order — small, middle, then large.",
        location: "Mina",
      },
      {
        id: "hajj-wada",
        title: "Farewell Tawaf",
        body: "Before leaving Makkah, perform Tawaf al-Wada as the final rite of the pilgrimage.",
        location: "Masjid al-Haram",
      },
    ],
  },
];
