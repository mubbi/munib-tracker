import type { Passage } from "@/lib/quran-companion/types";

import { passageKey, passagesFromRefs, wholeSurah } from "./passages";

/**
 * Which guide topics get a recite-along card (D68). Only topics whose ayahs are
 * meant to be recited — evidence ayahs elsewhere in a guide (e.g. 62:9 on the
 * obligation of Jumu'ah) are left alone. Passages come from the topic's own
 * `quran` refs, so nothing new is claimed here.
 */

type GuideTopicLike = {
  section: string;
  quran?: readonly { surah: number; ayahFrom: number; ayahTo?: number }[];
};

export const KAHF_SURAH = 18;

function dedupe(list: Passage[]): Passage[] {
  const seen = new Set<string>();
  return list.filter((p) => {
    const key = passageKey(p);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Friday guide: the al-Kahf topic → its cited ayahs, then the whole surah. */
export function fridayTopicPassages(topic: GuideTopicLike): Passage[] {
  if (topic.section !== "kahf") return [];
  const whole = wholeSurah(KAHF_SURAH);
  return dedupe([...passagesFromRefs(topic.quran), ...(whole ? [whole] : [])]);
}

/** Friday hub: the whole of al-Kahf (long → follow it, or a 10-ayah section). */
export function fridayHubPassages(): Passage[] {
  const whole = wholeSurah(KAHF_SURAH);
  return whole ? [whole] : [];
}

/** Ruqyah: the "verses" section topics (al-Fatihah, Ayat al-Kursi, the three Quls). */
export const RUQYAH_RECITE_SECTION = "verses";

export function ruqyahTopicPassages(topic: GuideTopicLike): Passage[] {
  if (topic.section !== RUQYAH_RECITE_SECTION) return [];
  return passagesFromRefs(topic.quran, 6);
}

/** Ruqyah hub: every recitable passage of the "verses" topics, in guide order. */
export function ruqyahHubPassages(topics: readonly GuideTopicLike[]): Passage[] {
  return dedupe(topics.flatMap((topic) => ruqyahTopicPassages(topic))).slice(0, 8);
}

/**
 * Learn Qur'an topics: the ayahs a topic quotes, to recite after reading about
 * them (first four). The "evidence" journey (proofs about the Qur'an) is skipped.
 */
export function learnQuranTopicPassages(topic: {
  journey: string;
  comingSoon?: boolean;
  quran?: GuideTopicLike["quran"];
}): Passage[] {
  if (topic.journey === "evidence" || topic.comingSoon) return [];
  return passagesFromRefs(topic.quran, 4);
}

/** Ayat al-Kursi (2:255). */
export const AYAT_AL_KURSI: Passage = { surah: 2, ayahStart: 255, ayahEnd: 255 };

/**
 * Salah guide "After salah": Ayat al-Kursi and the three Quls — the topic's own
 * text says to recite them after each obligatory Salah (an-Nasa'i al-Kubra 9928).
 */
export const AFTER_SALAH_TOPIC_ID = "after-salah";

export function afterSalahPassages(): Passage[] {
  return [AYAT_AL_KURSI, ...[112, 113, 114].flatMap((n) => wholeSurah(n) ?? [])];
}

/** Janazah guide topics that teach the Salah al-Janazah, recited with al-Fatihah. */
export const JANAZAH_FATIHAH_TOPICS: readonly string[] = ["how-to-pray-janazah", "takbir-steps"];

export function janazahHasFatihahCheck(topic: { id: string }): boolean {
  return JANAZAH_FATIHAH_TOPICS.includes(topic.id);
}

/** New Muslim topics that teach the Salah and its words → the al-Fatihah check. */
export const NEW_MUSLIM_FATIHAH_TOPICS: readonly string[] = [
  "how-to-pray-overview",
  "learning-the-prayer-words",
];

export function newMuslimHasFatihahCheck(topic: { id: string }): boolean {
  return NEW_MUSLIM_FATIHAH_TOPICS.includes(topic.id);
}

/** New Muslim "Who is Allah?" → Surah al-Ikhlas (112), which the topic quotes. */
export const NEW_MUSLIM_IKHLAS_TOPIC = "who-is-allah";

export function newMuslimTopicPassages(topic: { id: string }): Passage[] {
  if (topic.id !== NEW_MUSLIM_IKHLAS_TOPIC) return [];
  const ikhlas = wholeSurah(112);
  return ikhlas ? [ikhlas] : [];
}
