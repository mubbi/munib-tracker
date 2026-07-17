/** Curated pool entries for the home knowledge flash card. */

import { isFriday } from "@/lib/friday";

export type MotivationTopic = "prayer" | "qaza" | "zikr" | "fasting" | "steadfastness" | "general";

export { isFriday };

export type KnowledgeCardEntry =
  | { kind: "quran"; surah: number; ayah: number }
  | { kind: "hadith"; id: string }
  | { kind: "name"; id: string }
  | { kind: "friday-quran"; surah: number; ayah: number }
  | { kind: "friday-hadith"; id: string }
  | { kind: "motivation"; id: string };

/** Short, self-contained ayahs suitable for a glanceable card. */
export const KNOWLEDGE_QURAN_AYAHS: Array<{ surah: number; ayah: number }> = [
  { surah: 1, ayah: 1 },
  { surah: 1, ayah: 5 },
  { surah: 2, ayah: 152 },
  { surah: 2, ayah: 186 },
  { surah: 2, ayah: 286 },
  { surah: 3, ayah: 139 },
  { surah: 3, ayah: 200 },
  { surah: 13, ayah: 28 },
  { surah: 16, ayah: 97 },
  { surah: 20, ayah: 114 },
  { surah: 29, ayah: 45 },
  { surah: 39, ayah: 53 },
  { surah: 55, ayah: 13 },
  { surah: 55, ayah: 60 },
  { surah: 59, ayah: 22 },
  { surah: 64, ayah: 11 },
  { surah: 65, ayah: 2 },
  { surah: 67, ayah: 2 },
  { surah: 94, ayah: 5 },
  { surah: 94, ayah: 6 },
  { surah: 103, ayah: 1 },
  { surah: 103, ayah: 2 },
  { surah: 103, ayah: 3 },
  { surah: 112, ayah: 1 },
  { surah: 112, ayah: 2 },
  { surah: 113, ayah: 1 },
  { surah: 114, ayah: 1 },
];

/** Bundled hadith ids — English excerpt length is checked at resolve time. */
/** Nawawi only — Riyad loads via async chunk; keep home free of that graph. */
export const KNOWLEDGE_HADITH_IDS = [
  "nawawi40:1",
  "nawawi40:3",
  "nawawi40:7",
  "nawawi40:11",
  "nawawi40:12",
  "nawawi40:13",
  "nawawi40:16",
  "nawawi40:18",
  "nawawi40:21",
  "nawawi40:23",
  "nawawi40:40",
];

export const KNOWLEDGE_NAME_IDS = [
  "ar-rahman",
  "ar-rahim",
  "al-malik",
  "as-salam",
  "al-ghaffar",
  "al-wadud",
  "al-hakim",
  "al-latif",
  "al-khabir",
  "as-sabur",
  "ash-shakur",
  "al-wali",
  "al-hadi",
  "al-alim",
  "at-tawwab",
];

export const FRIDAY_QURAN_AYAHS: Array<{ surah: number; ayah: number }> = [
  { surah: 62, ayah: 9 },
  { surah: 62, ayah: 10 },
  { surah: 62, ayah: 11 },
];

export const FRIDAY_HADITH_IDS = ["nawawi40:29", "nawawi40:23", "nawawi40:18"];

export type MotivationQuote = {
  id: string;
  text: string;
  topic: MotivationTopic;
  source?: string;
};

/** App-relevant reminders — not hadith, plain motivational copy. */
export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: "steady-steps",
    text: "Small, steady steps matter more than perfection. Log what you complete and return tomorrow.",
    topic: "steadfastness",
  },
  {
    id: "prayer-light",
    text: "Treat each salah as a reset — five brief returns to Allah that anchor your day.",
    topic: "prayer",
  },
  {
    id: "qaza-hope",
    text: "Missed prayers can be made up. Set a gentle daily pace for qaza rather than carrying guilt.",
    topic: "qaza",
  },
  {
    id: "qaza-one",
    text: "One qaza cleared today is better than waiting for a perfect streak tomorrow.",
    topic: "qaza",
  },
  {
    id: "zikr-heart",
    text: "Even a few moments of zikr after salah softens the heart and steadies the tongue.",
    topic: "zikr",
  },
  {
    id: "zikr-walking",
    text: "Remember Allah while waiting, walking, or resting — zikr fits into the gaps of a busy day.",
    topic: "zikr",
  },
  {
    id: "fasting-patience",
    text: "Fasting trains patience in the body so sabr becomes easier in everyday life.",
    topic: "fasting",
  },
  {
    id: "ramadan-intention",
    text: "Renew your intention before each fast — the reward follows sincerity, not perfection.",
    topic: "fasting",
  },
  {
    id: "consistency",
    text: "Allah loves consistent deeds, even if they are small. Keep showing up.",
    topic: "steadfastness",
    source: "Hadith — Bukhari & Muslim",
  },
  {
    id: "tracker-honest",
    text: "An honest tracker helps you see patterns, not judge yourself. Progress begins with awareness.",
    topic: "general",
  },
  {
    id: "morning-fajr",
    text: "Win the morning with Fajr on time — the rest of the day follows a calmer rhythm.",
    topic: "prayer",
  },
  {
    id: "witr-closure",
    text: "Close your night with witr when you can — a gentle seal on the day's worship.",
    topic: "prayer",
  },
  {
    id: "gratitude-salah",
    text: "After each prayer, pause for one breath of shukr before rushing back to the world.",
    topic: "general",
  },
  {
    id: "return-tomorrow",
    text: "If today was hard, begin again after maghrib. Mercy is wider than one difficult day.",
    topic: "steadfastness",
  },
  {
    id: "tasbeeh-count",
    text: "A short tasbeeh session counts. Zikr is not only for long sittings — start with ten.",
    topic: "zikr",
  },
];

export function buildKnowledgeCardPool(date: Date): KnowledgeCardEntry[] {
  const pool: KnowledgeCardEntry[] = [
    ...KNOWLEDGE_QURAN_AYAHS.map((ref) => ({ kind: "quran" as const, ...ref })),
    ...KNOWLEDGE_HADITH_IDS.map((id) => ({ kind: "hadith" as const, id })),
    ...KNOWLEDGE_NAME_IDS.map((id) => ({ kind: "name" as const, id })),
    ...MOTIVATION_QUOTES.map((q) => ({ kind: "motivation" as const, id: q.id })),
  ];

  if (isFriday(date)) {
    pool.push(
      ...FRIDAY_QURAN_AYAHS.map((ref) => ({ kind: "friday-quran" as const, ...ref })),
      ...FRIDAY_HADITH_IDS.map((id) => ({ kind: "friday-hadith" as const, id })),
      ...FRIDAY_QURAN_AYAHS.map((ref) => ({ kind: "friday-quran" as const, ...ref })),
      ...FRIDAY_HADITH_IDS.map((id) => ({ kind: "friday-hadith" as const, id })),
    );
  }

  return pool;
}
