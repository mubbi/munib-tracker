import type { PrayerRakatSummary, SalahGuideTopic } from "../types/salah-guide";

/**
 * Offline salah guide (NF-1.33). Scholar-neutral, concise teaching content —
 * wudu, the prayer sequence, and a rakats reference. No madhab debates; a
 * disclaimer directs the reader to a qualified teacher. Bump the version when the
 * content changes so caches/tests notice.
 */
export const SALAH_GUIDE_CONTENT_VERSION = 1;

export const SALAH_GUIDE_TOPICS: SalahGuideTopic[] = [
  {
    id: "overview",
    title: "Before you pray",
    summary: "The essentials to have in place before beginning salah.",
    steps: [
      {
        title: "Purity (taharah)",
        body: "Have a valid wudu, wear clean clothing, and pray on a clean spot.",
      },
      {
        title: "Cover the awrah",
        body: "Men cover from the navel to the knees; women cover the whole body except the face and hands.",
      },
      {
        title: "Face the qibla",
        body: "Turn toward the Ka'bah in Makkah. Use the app's qibla compass if you're unsure.",
      },
      {
        title: "Intention (niyyah)",
        body: "Intend in your heart which prayer you are about to offer. It need not be spoken aloud.",
      },
    ],
  },
  {
    id: "wudu",
    title: "Wudu — ablution",
    summary: "The ordered steps of ablution before prayer.",
    steps: [
      { title: "Intention & Bismillah", body: "Intend to make wudu and say 'Bismillah'." },
      { title: "Wash the hands", body: "Wash both hands up to the wrists three times." },
      { title: "Rinse the mouth", body: "Take water into the mouth and rinse three times." },
      {
        title: "Rinse the nose",
        body: "Draw a little water into the nostrils and blow it out, three times.",
      },
      {
        title: "Wash the face",
        body: "Wash the whole face from forehead to chin and ear to ear, three times.",
      },
      {
        title: "Wash the arms",
        body: "Wash each arm from the fingertips to and including the elbow, three times.",
      },
      {
        title: "Wipe the head",
        body: "Wipe over the head once with wet hands, and wipe the ears.",
      },
      { title: "Wash the feet", body: "Wash each foot to and including the ankles, three times." },
    ],
  },
  {
    id: "how-to-pray",
    title: "How to pray",
    summary: "The sequence of one rakah, from takbir to salam.",
    steps: [
      {
        title: "Takbir",
        body: "Raise your hands and say 'Allahu Akbar', then place them on your chest.",
      },
      {
        title: "Recitation (qiyam)",
        body: "Recite Surah Al-Fatihah, then a short surah or verses, while standing.",
      },
      {
        title: "Ruku",
        body: "Bow with a straight back, hands on the knees, saying 'Subhana Rabbiyal-'Adheem'.",
      },
      {
        title: "Rise from ruku",
        body: "Stand upright saying 'Sami'Allahu liman hamidah, Rabbana wa lakal-hamd'.",
      },
      {
        title: "Sujud",
        body: "Prostrate with forehead, nose, palms, knees, and toes on the ground, saying 'Subhana Rabbiyal-A'la' — twice, sitting briefly between.",
      },
      {
        title: "Tashahhud",
        body: "After the required rakahs, sit and recite the tashahhud (At-tahiyyatu…) and salawat on the Prophet ﷺ.",
      },
      {
        title: "Salam",
        body: "End by turning the face right then left, saying 'As-salamu 'alaykum wa rahmatullah' each time.",
      },
    ],
  },
];

/** Fard + common sunnah rakats per prayer, aligned with the app's tracked prayers. */
export const PRAYER_RAKATS: PrayerRakatSummary[] = [
  { prayerId: "fajr", fard: 2, sunnahBefore: 2, sunnahAfter: 0 },
  { prayerId: "dhuhr", fard: 4, sunnahBefore: 4, sunnahAfter: 2 },
  { prayerId: "asr", fard: 4, sunnahBefore: 0, sunnahAfter: 0 },
  { prayerId: "maghrib", fard: 3, sunnahBefore: 0, sunnahAfter: 2 },
  { prayerId: "isha", fard: 4, sunnahBefore: 0, sunnahAfter: 2 },
  {
    prayerId: "witr",
    fard: 0,
    sunnahBefore: 0,
    sunnahAfter: 0,
    note: "Prayed after Isha — sunnah mu'akkadah (wajib in the Hanafi school).",
  },
];
