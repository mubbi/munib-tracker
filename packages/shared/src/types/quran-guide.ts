import type { JannahAppLink, JannahHadithRef, JannahImportance, JannahQuranRef } from "./jannah";

/** Learning journey phase — Read → Understand → Reflect → Memorize → Practice → Live. */
export type QuranGuideJourney =
  | "read"
  | "understand"
  | "reflect"
  | "memorize"
  | "practice"
  | "live"
  | "evidence";

/** A self-contained topic within the Learn Qur'an hub. */
export interface QuranGuideTopic {
  id: string;
  journey: QuranGuideJourney;
  title: string;
  summary: string;
  body: string[];
  importance?: JannahImportance;
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
  /** Scholarly source note — tafsir, seerah, etc. */
  sources?: string[];
  disclaimer?: string;
  /** V2+ feature — shown as coming soon in hub when true. */
  comingSoon?: boolean;
}

/** Revelation timeline milestone. */
export interface QuranGuideTimelineEvent {
  id: string;
  year: number;
  ah?: number;
  title: string;
  body: string;
  location?: string;
  topicId?: string;
}

/** Qur'an structure pyramid level. */
export interface QuranGuideStructureLevel {
  id: string;
  label: string;
  count: string;
  detail: string;
}

/** Thematic grouping of verses and lessons. */
export interface QuranGuideTheme {
  id: string;
  title: string;
  summary: string;
  lessons: string[];
  quran?: JannahQuranRef[];
  hadith?: JannahHadithRef[];
  actions?: string[];
  appLinks?: JannahAppLink[];
}

/** High-frequency Qur'anic vocabulary entry. */
export interface QuranGuideVocabEntry {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  frequency?: string;
  example?: string;
  quranRef?: JannahQuranRef;
}

/** Prophet story summary in the Qur'an. */
export interface QuranGuideStory {
  id: string;
  prophetName: string;
  title: string;
  summary: string;
  body: string[];
  lessons: string[];
  quran?: JannahQuranRef[];
  location?: string;
  appLinks?: JannahAppLink[];
}

/**
 * Recitation clip for Learn Qur'an examples — everyayah ayah stream with optional
 * word-range timing (seconds) from QuranCDN / QUL-style segments.
 */
export interface QuranGuideAyahAudio {
  surah: number;
  ayah: number;
  /** Inclusive 1-based word index (QuranCDN segment order). */
  wordFrom?: number;
  /** Inclusive 1-based word index. */
  wordTo?: number;
  /** Clip start within the everyayah ayah file (seconds). */
  clipStart?: number;
  /** Clip end within the everyayah ayah file (seconds). */
  clipEnd?: number;
}

/** Tajweed rule lesson. */
export interface QuranGuideTajweedLesson {
  id: string;
  title: string;
  summary: string;
  explanation: string[];
  examples: string[];
  practice?: string;
  /** Practice ayah(s) to listen to (e.g. al-Fatiha for noon sakinah drills). */
  practiceAudio?: QuranGuideAyahAudio;
}

/** Arabic letter card. */
export interface QuranGuideLetter {
  id: string;
  letter: string;
  name: string;
  transliteration: string;
  pronunciation: string;
  examples: string[];
}

/** Difficult letter pronunciation comparison. */
export interface QuranGuidePronunciationPair {
  id: string;
  letters: string[];
  title: string;
  tip: string;
  examples: string[];
}

/** Learn-to-read level. */
export interface QuranGuideReadingLevel {
  level: number;
  title: string;
  summary: string;
  topics: string[];
  /** Optional listen target (e.g. al-Fatiha for word / verse levels). */
  practiceAudio?: QuranGuideAyahAudio;
}

/** Memorization plan tier. */
export interface QuranGuideMemorizationPlan {
  id: string;
  title: string;
  summary: string;
  surahs: string[];
  /** Numeric surah ids for listen / open-in-reader actions. */
  surahNumbers?: number[];
  tip: string;
}

/** Daily lesson card (rotates by day index). */
export interface QuranGuideDailyLesson {
  id: string;
  surah: number;
  ayahFrom: number;
  ayahTo?: number;
  label: string;
  excerpt: string;
  translation: string;
  context: string;
  reflection: string;
  action: string;
}

/** Apply-the-Qur'an daily challenge. */
export interface QuranGuideApplyChallenge {
  id: string;
  verseLabel: string;
  verseExcerpt: string;
  challenge: string;
  habit: string;
}

/** Tadabbur reflection prompt set. */
export interface QuranGuideTadabburPrompt {
  id: string;
  question: string;
  hint: string;
}

/** Quiz question — educational review across the hub, not spiritual ranking. */
export interface QuranGuideQuizQuestion {
  id: string;
  /** Topic area the question reviews — shown as a category chip. */
  category: "structure" | "revelation" | "recitation" | "tajweed" | "vocabulary" | "stories";
  type: "multiple-choice" | "true-false" | "reflection";
  prompt: string;
  options?: string[];
  /** Index into options for scored types; omitted for reflection. */
  correctIndex?: number;
  explanation: string;
}
