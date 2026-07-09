import {
  QURAN_GUIDE_APPLY_CHALLENGES,
  QURAN_GUIDE_DAILY_LESSONS,
  QURAN_GUIDE_JOURNEY_ORDER,
  QURAN_GUIDE_LETTERS,
  QURAN_GUIDE_MEMORIZATION_PLANS,
  QURAN_GUIDE_PRONUNCIATION,
  QURAN_GUIDE_QUIZ,
  QURAN_GUIDE_READING_LEVELS,
  QURAN_GUIDE_STORIES,
  QURAN_GUIDE_STRUCTURE_LEVELS,
  QURAN_GUIDE_TADABBUR_PROMPTS,
  QURAN_GUIDE_TAJWEED,
  QURAN_GUIDE_THEMES,
  QURAN_GUIDE_TIMELINE,
  QURAN_GUIDE_TOPICS,
  QURAN_GUIDE_VOCABULARY,
} from "@munib-tracker/shared/content";
import type { QuranGuideJourney, QuranGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

export function getQuranGuideTopics(): QuranGuideTopic[] {
  return localizeList(QURAN_GUIDE_TOPICS, overlayList("QURAN_GUIDE_TOPICS"));
}

export function getQuranGuideTopic(id: string | undefined): QuranGuideTopic | undefined {
  return getQuranGuideTopics().find((topic) => topic.id === id);
}

export function getQuranGuideTopicsByJourney(): Record<QuranGuideJourney, QuranGuideTopic[]> {
  const grouped = Object.fromEntries(
    QURAN_GUIDE_JOURNEY_ORDER.map((phase) => [phase, [] as QuranGuideTopic[]]),
  ) as Record<QuranGuideJourney, QuranGuideTopic[]>;

  for (const topic of getQuranGuideTopics()) {
    grouped[topic.journey].push(topic);
  }
  return grouped;
}

export function getQuranGuideLessonCount(): number {
  return QURAN_GUIDE_TOPICS.filter((t) => !t.comingSoon).length;
}

export function getQuranGuideTimeline() {
  return localizeList(QURAN_GUIDE_TIMELINE, overlayList("QURAN_GUIDE_TIMELINE"));
}

export function getQuranGuideStructureLevels() {
  return localizeList(QURAN_GUIDE_STRUCTURE_LEVELS, overlayList("QURAN_GUIDE_STRUCTURE_LEVELS"));
}

export function getQuranGuideThemes() {
  return localizeList(QURAN_GUIDE_THEMES, overlayList("QURAN_GUIDE_THEMES"));
}

export function getQuranGuideTheme(id: string | undefined) {
  return getQuranGuideThemes().find((theme) => theme.id === id);
}

export function getQuranGuideVocabulary() {
  return localizeList(QURAN_GUIDE_VOCABULARY, overlayList("QURAN_GUIDE_VOCABULARY"));
}

export function getQuranGuideStories() {
  return localizeList(QURAN_GUIDE_STORIES, overlayList("QURAN_GUIDE_STORIES"));
}

export function getQuranGuideStory(id: string | undefined) {
  return getQuranGuideStories().find((story) => story.id === id);
}

export function getQuranGuideTajweedLessons() {
  return localizeList(QURAN_GUIDE_TAJWEED, overlayList("QURAN_GUIDE_TAJWEED"));
}

export function getQuranGuideTajweedLesson(id: string | undefined) {
  return getQuranGuideTajweedLessons().find((lesson) => lesson.id === id);
}

export function getQuranGuideLetters() {
  return localizeList(QURAN_GUIDE_LETTERS, overlayList("QURAN_GUIDE_LETTERS"));
}

export function getQuranGuidePronunciationPairs() {
  return localizeList(QURAN_GUIDE_PRONUNCIATION, overlayList("QURAN_GUIDE_PRONUNCIATION"));
}

export function getQuranGuideReadingLevels() {
  return localizeList(QURAN_GUIDE_READING_LEVELS, overlayList("QURAN_GUIDE_READING_LEVELS"));
}

export function getQuranGuideMemorizationPlans() {
  return localizeList(
    QURAN_GUIDE_MEMORIZATION_PLANS,
    overlayList("QURAN_GUIDE_MEMORIZATION_PLANS"),
  );
}

export function getQuranGuideDailyLessons() {
  return localizeList(QURAN_GUIDE_DAILY_LESSONS, overlayList("QURAN_GUIDE_DAILY_LESSONS"));
}

/** Deterministic daily lesson from day-of-year. */
export function getQuranGuideDailyLessonForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const lessons = getQuranGuideDailyLessons();
  return lessons[dayOfYear % lessons.length] ?? lessons[0];
}

export function getQuranGuideApplyChallenges() {
  return localizeList(QURAN_GUIDE_APPLY_CHALLENGES, overlayList("QURAN_GUIDE_APPLY_CHALLENGES"));
}

/** Deterministic daily challenge from day-of-year. */
export function getQuranGuideApplyChallengeForDate(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const challenges = getQuranGuideApplyChallenges();
  return challenges[dayOfYear % challenges.length] ?? challenges[0];
}

export function getQuranGuideTadabburPrompts() {
  return localizeList(QURAN_GUIDE_TADABBUR_PROMPTS, overlayList("QURAN_GUIDE_TADABBUR_PROMPTS"));
}

export function getQuranGuideQuiz() {
  return localizeList(QURAN_GUIDE_QUIZ, overlayList("QURAN_GUIDE_QUIZ"));
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
