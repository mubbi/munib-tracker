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
import {
  QURAN_GUIDE_APPLY_CHALLENGES_AR,
  QURAN_GUIDE_APPLY_CHALLENGES_UR,
  QURAN_GUIDE_DAILY_LESSONS_AR,
  QURAN_GUIDE_DAILY_LESSONS_UR,
  QURAN_GUIDE_LETTERS_AR,
  QURAN_GUIDE_LETTERS_UR,
  QURAN_GUIDE_MEMORIZATION_PLANS_AR,
  QURAN_GUIDE_MEMORIZATION_PLANS_UR,
  QURAN_GUIDE_PRONUNCIATION_AR,
  QURAN_GUIDE_PRONUNCIATION_UR,
  QURAN_GUIDE_QUIZ_AR,
  QURAN_GUIDE_QUIZ_UR,
  QURAN_GUIDE_READING_LEVELS_AR,
  QURAN_GUIDE_READING_LEVELS_UR,
  QURAN_GUIDE_STORIES_AR,
  QURAN_GUIDE_STORIES_UR,
  QURAN_GUIDE_STRUCTURE_LEVELS_AR,
  QURAN_GUIDE_STRUCTURE_LEVELS_UR,
  QURAN_GUIDE_TADABBUR_PROMPTS_AR,
  QURAN_GUIDE_TADABBUR_PROMPTS_UR,
  QURAN_GUIDE_TAJWEED_AR,
  QURAN_GUIDE_TAJWEED_UR,
  QURAN_GUIDE_THEMES_AR,
  QURAN_GUIDE_THEMES_UR,
  QURAN_GUIDE_TIMELINE_AR,
  QURAN_GUIDE_TIMELINE_UR,
  QURAN_GUIDE_TOPICS_AR,
  QURAN_GUIDE_TOPICS_UR,
  QURAN_GUIDE_VOCABULARY_AR,
  QURAN_GUIDE_VOCABULARY_UR,
} from "@munib-tracker/shared/content-i18n";
import type { QuranGuideJourney, QuranGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

export function getQuranGuideTopics(): QuranGuideTopic[] {
  return localizeList(QURAN_GUIDE_TOPICS, {
    ur: QURAN_GUIDE_TOPICS_UR,
    ar: QURAN_GUIDE_TOPICS_AR,
  });
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
  return localizeList(QURAN_GUIDE_TIMELINE, {
    ur: QURAN_GUIDE_TIMELINE_UR,
    ar: QURAN_GUIDE_TIMELINE_AR,
  });
}

export function getQuranGuideStructureLevels() {
  return localizeList(QURAN_GUIDE_STRUCTURE_LEVELS, {
    ur: QURAN_GUIDE_STRUCTURE_LEVELS_UR,
    ar: QURAN_GUIDE_STRUCTURE_LEVELS_AR,
  });
}

export function getQuranGuideThemes() {
  return localizeList(QURAN_GUIDE_THEMES, {
    ur: QURAN_GUIDE_THEMES_UR,
    ar: QURAN_GUIDE_THEMES_AR,
  });
}

export function getQuranGuideTheme(id: string | undefined) {
  return getQuranGuideThemes().find((theme) => theme.id === id);
}

export function getQuranGuideVocabulary() {
  return localizeList(QURAN_GUIDE_VOCABULARY, {
    ur: QURAN_GUIDE_VOCABULARY_UR,
    ar: QURAN_GUIDE_VOCABULARY_AR,
  });
}

export function getQuranGuideStories() {
  return localizeList(QURAN_GUIDE_STORIES, {
    ur: QURAN_GUIDE_STORIES_UR,
    ar: QURAN_GUIDE_STORIES_AR,
  });
}

export function getQuranGuideStory(id: string | undefined) {
  return getQuranGuideStories().find((story) => story.id === id);
}

export function getQuranGuideTajweedLessons() {
  return localizeList(QURAN_GUIDE_TAJWEED, {
    ur: QURAN_GUIDE_TAJWEED_UR,
    ar: QURAN_GUIDE_TAJWEED_AR,
  });
}

export function getQuranGuideTajweedLesson(id: string | undefined) {
  return getQuranGuideTajweedLessons().find((lesson) => lesson.id === id);
}

export function getQuranGuideLetters() {
  return localizeList(QURAN_GUIDE_LETTERS, {
    ur: QURAN_GUIDE_LETTERS_UR,
    ar: QURAN_GUIDE_LETTERS_AR,
  });
}

export function getQuranGuidePronunciationPairs() {
  return localizeList(QURAN_GUIDE_PRONUNCIATION, {
    ur: QURAN_GUIDE_PRONUNCIATION_UR,
    ar: QURAN_GUIDE_PRONUNCIATION_AR,
  });
}

export function getQuranGuideReadingLevels() {
  return localizeList(QURAN_GUIDE_READING_LEVELS, {
    ur: QURAN_GUIDE_READING_LEVELS_UR,
    ar: QURAN_GUIDE_READING_LEVELS_AR,
  });
}

export function getQuranGuideMemorizationPlans() {
  return localizeList(QURAN_GUIDE_MEMORIZATION_PLANS, {
    ur: QURAN_GUIDE_MEMORIZATION_PLANS_UR,
    ar: QURAN_GUIDE_MEMORIZATION_PLANS_AR,
  });
}

export function getQuranGuideDailyLessons() {
  return localizeList(QURAN_GUIDE_DAILY_LESSONS, {
    ur: QURAN_GUIDE_DAILY_LESSONS_UR,
    ar: QURAN_GUIDE_DAILY_LESSONS_AR,
  });
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
  return localizeList(QURAN_GUIDE_APPLY_CHALLENGES, {
    ur: QURAN_GUIDE_APPLY_CHALLENGES_UR,
    ar: QURAN_GUIDE_APPLY_CHALLENGES_AR,
  });
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
  return localizeList(QURAN_GUIDE_TADABBUR_PROMPTS, {
    ur: QURAN_GUIDE_TADABBUR_PROMPTS_UR,
    ar: QURAN_GUIDE_TADABBUR_PROMPTS_AR,
  });
}

export function getQuranGuideQuiz() {
  return localizeList(QURAN_GUIDE_QUIZ, {
    ur: QURAN_GUIDE_QUIZ_UR,
    ar: QURAN_GUIDE_QUIZ_AR,
  });
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
