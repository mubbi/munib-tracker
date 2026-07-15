import * as quranGuide from "@munib-tracker/shared/content/quran-guide";
import * as quranGuideApply from "@munib-tracker/shared/content/quran-guide-apply";
import * as quranGuideDaily from "@munib-tracker/shared/content/quran-guide-daily";
import * as quranGuideLearnToRead from "@munib-tracker/shared/content/quran-guide-learn-to-read";
import * as quranGuideLetters from "@munib-tracker/shared/content/quran-guide-letters";
import * as quranGuideMemorization from "@munib-tracker/shared/content/quran-guide-memorization";
import * as quranGuidePronunciation from "@munib-tracker/shared/content/quran-guide-pronunciation";
import * as quranGuideQuiz from "@munib-tracker/shared/content/quran-guide-quiz";
import * as quranGuideStories from "@munib-tracker/shared/content/quran-guide-stories";
import * as quranGuideStructure from "@munib-tracker/shared/content/quran-guide-structure";
import * as quranGuideTadabbur from "@munib-tracker/shared/content/quran-guide-tadabbur";
import * as quranGuideTajweed from "@munib-tracker/shared/content/quran-guide-tajweed";
import * as quranGuideThemes from "@munib-tracker/shared/content/quran-guide-themes";
import * as quranGuideTimeline from "@munib-tracker/shared/content/quran-guide-timeline";
import * as quranGuideVocabulary from "@munib-tracker/shared/content/quran-guide-vocabulary";
import type { QuranGuideJourney, QuranGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/learn-quran` route chunk.
 * Lazy `import()` of 15 modules left hubs empty/partial on first paint when the
 * ensure effect lost the race; sync getters always have topics ready.
 */
const corpus = {
  ...quranGuide,
  ...quranGuideApply,
  ...quranGuideDaily,
  ...quranGuideLetters,
  ...quranGuideMemorization,
  ...quranGuidePronunciation,
  ...quranGuideQuiz,
  ...quranGuideLearnToRead,
  ...quranGuideStories,
  ...quranGuideStructure,
  ...quranGuideTadabbur,
  ...quranGuideTajweed,
  ...quranGuideThemes,
  ...quranGuideTimeline,
  ...quranGuideVocabulary,
};

export function isQuranGuideContentReady(): boolean {
  return true;
}

export async function ensureQuranGuideContent(): Promise<typeof corpus> {
  return corpus;
}

export function getQuranGuideTopics(): QuranGuideTopic[] {
  return localizeList(corpus.QURAN_GUIDE_TOPICS, overlayList("QURAN_GUIDE_TOPICS"));
}

export function getQuranGuideTopic(id: string | undefined): QuranGuideTopic | undefined {
  return getQuranGuideTopics().find((topic) => topic.id === id);
}

export function getQuranGuideJourneyOrder(): readonly QuranGuideJourney[] {
  return corpus.QURAN_GUIDE_JOURNEY_ORDER;
}

export function getQuranGuideTopicsByJourney(): Record<QuranGuideJourney, QuranGuideTopic[]> {
  const grouped = Object.fromEntries(
    getQuranGuideJourneyOrder().map((phase) => [phase, [] as QuranGuideTopic[]]),
  ) as Record<QuranGuideJourney, QuranGuideTopic[]>;

  for (const topic of getQuranGuideTopics()) {
    const bucket = grouped[topic.journey];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getQuranGuideLessonCount(): number {
  return corpus.QURAN_GUIDE_TOPICS.filter((t) => !t.comingSoon).length;
}

export function getQuranGuideTimeline() {
  return localizeList(corpus.QURAN_GUIDE_TIMELINE, overlayList("QURAN_GUIDE_TIMELINE"));
}

export function getQuranGuideStructureLevels() {
  return localizeList(
    corpus.QURAN_GUIDE_STRUCTURE_LEVELS,
    overlayList("QURAN_GUIDE_STRUCTURE_LEVELS"),
  );
}

export function getQuranGuideThemes() {
  return localizeList(corpus.QURAN_GUIDE_THEMES, overlayList("QURAN_GUIDE_THEMES"));
}

export function getQuranGuideTheme(id: string | undefined) {
  return getQuranGuideThemes().find((theme) => theme.id === id);
}

export function getQuranGuideVocabulary() {
  return localizeList(corpus.QURAN_GUIDE_VOCABULARY, overlayList("QURAN_GUIDE_VOCABULARY"));
}

export function getQuranGuideStories() {
  return localizeList(corpus.QURAN_GUIDE_STORIES, overlayList("QURAN_GUIDE_STORIES"));
}

export function getQuranGuideStory(id: string | undefined) {
  return getQuranGuideStories().find((story) => story.id === id);
}

export function getQuranGuideTajweedLessons() {
  return localizeList(corpus.QURAN_GUIDE_TAJWEED, overlayList("QURAN_GUIDE_TAJWEED"));
}

export function getQuranGuideTajweedLesson(id: string | undefined) {
  return getQuranGuideTajweedLessons().find((lesson) => lesson.id === id);
}

export function getQuranGuideLetters() {
  return localizeList(corpus.QURAN_GUIDE_LETTERS, overlayList("QURAN_GUIDE_LETTERS"));
}

export function getQuranGuidePronunciationPairs() {
  return localizeList(corpus.QURAN_GUIDE_PRONUNCIATION, overlayList("QURAN_GUIDE_PRONUNCIATION"));
}

export function getQuranGuideReadingLevels() {
  return localizeList(corpus.QURAN_GUIDE_READING_LEVELS, overlayList("QURAN_GUIDE_READING_LEVELS"));
}

export function getQuranGuideMemorizationPlans() {
  return localizeList(
    corpus.QURAN_GUIDE_MEMORIZATION_PLANS,
    overlayList("QURAN_GUIDE_MEMORIZATION_PLANS"),
  );
}

export function getQuranGuideDailyLessons() {
  return localizeList(corpus.QURAN_GUIDE_DAILY_LESSONS, overlayList("QURAN_GUIDE_DAILY_LESSONS"));
}

/** Deterministic daily lesson from day-of-year. */
export function getQuranGuideDailyLessonForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const lessons = getQuranGuideDailyLessons();
  if (!lessons.length) return undefined;
  return lessons[dayOfYear % lessons.length] ?? lessons[0];
}

export function getQuranGuideApplyChallenges() {
  return localizeList(
    corpus.QURAN_GUIDE_APPLY_CHALLENGES,
    overlayList("QURAN_GUIDE_APPLY_CHALLENGES"),
  );
}

/** Deterministic daily challenge from day-of-year. */
export function getQuranGuideApplyChallengeForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const challenges = getQuranGuideApplyChallenges();
  if (!challenges.length) return undefined;
  return challenges[dayOfYear % challenges.length] ?? challenges[0];
}

export function getQuranGuideTadabburPrompts() {
  return localizeList(
    corpus.QURAN_GUIDE_TADABBUR_PROMPTS,
    overlayList("QURAN_GUIDE_TADABBUR_PROMPTS"),
  );
}

export function getQuranGuideQuiz() {
  return localizeList(corpus.QURAN_GUIDE_QUIZ, overlayList("QURAN_GUIDE_QUIZ"));
}

/** Hub route for a topic id — dedicated screens vs generic article. */
export function getQuranGuideTopicRoute(topicId: string): string {
  const dedicated: Record<string, string> = {
    revelation: "/learn-quran/revelation",
    structure: "/learn-quran/structure",
    "learn-to-read": "/learn-quran/learn-to-read",
    tajweed: "/learn-quran/tajweed",
    "arabic-letters": "/learn-quran/letters",
    pronunciation: "/learn-quran/pronunciation",
    vocabulary: "/learn-quran/vocabulary",
    themes: "/learn-quran/themes",
    stories: "/learn-quran/stories",
    "daily-lessons": "/learn-quran/daily",
    tadabbur: "/learn-quran/tadabbur",
    "apply-the-quran": "/learn-quran/apply",
    memorization: "/learn-quran/memorization",
    quiz: "/learn-quran/quiz",
  };
  return dedicated[topicId] ?? `/learn-quran/${topicId}`;
}
