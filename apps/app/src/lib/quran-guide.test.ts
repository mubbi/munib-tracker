import {
  ensureQuranGuideContent,
  getQuranGuideApplyChallengeForDate,
  getQuranGuideApplyChallenges,
  getQuranGuideDailyLessonForDate,
  getQuranGuideDailyLessons,
  getQuranGuideJourneyOrder,
  getQuranGuideLessonCount,
  getQuranGuideLetters,
  getQuranGuideMemorizationPlans,
  getQuranGuidePronunciationPairs,
  getQuranGuideQuiz,
  getQuranGuideReadingLevels,
  getQuranGuideStories,
  getQuranGuideStory,
  getQuranGuideStructureLevels,
  getQuranGuideTadabburPrompts,
  getQuranGuideTajweedLesson,
  getQuranGuideTajweedLessons,
  getQuranGuideTheme,
  getQuranGuideThemes,
  getQuranGuideTimeline,
  getQuranGuideTopic,
  getQuranGuideTopicRoute,
  getQuranGuideTopics,
  getQuranGuideTopicsByJourney,
  getQuranGuideVocabulary,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

const localizeList = mockLocalizeList;

afterEach(resetContentI18nMock);

/** Make every localized list come back empty (e.g. a missing overlay). */
const withEmptyLists = () => localizeList.mockImplementation(() => []);

describe("quran guide content", () => {
  it("is always ready and exposes the static corpus", async () => {
    expect(isQuranGuideContentReady()).toBe(true);
    const corpus = await ensureQuranGuideContent();
    expect(corpus.QURAN_GUIDE_TOPICS.length).toBeGreaterThan(0);
  });

  it.each([
    ["timeline", getQuranGuideTimeline],
    ["structure levels", getQuranGuideStructureLevels],
    ["themes", getQuranGuideThemes],
    ["vocabulary", getQuranGuideVocabulary],
    ["stories", getQuranGuideStories],
    ["tajweed lessons", getQuranGuideTajweedLessons],
    ["letters", getQuranGuideLetters],
    ["pronunciation pairs", getQuranGuidePronunciationPairs],
    ["reading levels", getQuranGuideReadingLevels],
    ["memorization plans", getQuranGuideMemorizationPlans],
    ["daily lessons", getQuranGuideDailyLessons],
    ["apply challenges", getQuranGuideApplyChallenges],
    ["tadabbur prompts", getQuranGuideTadabburPrompts],
    ["quiz", getQuranGuideQuiz],
  ])("returns a non-empty %s list", (_label, getter) => {
    expect(getter().length).toBeGreaterThan(0);
  });

  it("counts only lessons that are not coming soon", () => {
    const topics = getQuranGuideTopics();
    expect(getQuranGuideLessonCount()).toBe(topics.filter((t) => !t.comingSoon).length);
  });
});

describe("lookups by id", () => {
  it.each([
    ["topic", getQuranGuideTopics, getQuranGuideTopic],
    ["theme", getQuranGuideThemes, getQuranGuideTheme],
    ["story", getQuranGuideStories, getQuranGuideStory],
    ["tajweed lesson", getQuranGuideTajweedLessons, getQuranGuideTajweedLesson],
  ] as const)("finds a %s by id and misses unknown ids", (_label, list, find) => {
    const first = list()[0];
    expect((find as (id: string | undefined) => unknown)(first.id)).toEqual(first);
    expect((find as (id: string | undefined) => unknown)("missing")).toBeUndefined();
    expect((find as (id: string | undefined) => unknown)(undefined)).toBeUndefined();
  });
});

describe("getQuranGuideTopicsByJourney", () => {
  it("groups every topic under its journey phase", () => {
    const grouped = getQuranGuideTopicsByJourney();
    expect(Object.keys(grouped)).toEqual([...getQuranGuideJourneyOrder()]);
    const total = Object.values(grouped).reduce((n, list) => n + list.length, 0);
    expect(total).toBe(getQuranGuideTopics().length);
  });

  it("drops topics whose journey is not in the order", () => {
    localizeList.mockImplementationOnce(() => [{ id: "x", journey: "unknown-phase" }] as never);
    const grouped = getQuranGuideTopicsByJourney();
    expect(Object.values(grouped).flat()).toEqual([]);
  });
});

describe("date-rotated picks", () => {
  // 2026-01-01 is day-of-year 1; 2026-01-02 is day 2.
  const jan1 = new Date(2026, 0, 1, 12);
  const jan2 = new Date(2026, 0, 2, 12);

  it.each([
    ["daily lesson", getQuranGuideDailyLessonForDate, getQuranGuideDailyLessons],
    ["apply challenge", getQuranGuideApplyChallengeForDate, getQuranGuideApplyChallenges],
  ] as const)("rotates the %s by day of year", (_label, pick, list) => {
    const all = list();
    expect(pick(jan1)).toEqual(all[1 % all.length]);
    expect(pick(jan2)).toEqual(all[2 % all.length]);
  });

  it.each([
    ["daily lesson", getQuranGuideDailyLessonForDate],
    ["apply challenge", getQuranGuideApplyChallengeForDate],
  ] as const)("returns undefined for the %s when the list is empty", (_label, pick) => {
    withEmptyLists();
    expect(pick(jan1)).toBeUndefined();
  });

  it.each([getQuranGuideDailyLessonForDate, getQuranGuideApplyChallengeForDate])(
    "defaults to today (%#)",
    (pick) => {
      expect(pick()).toBeDefined();
    },
  );
});

describe("getQuranGuideTopicRoute", () => {
  it.each([
    ["arabic-letters", "/learn-quran/letters"],
    ["daily-lessons", "/learn-quran/daily"],
    ["apply-the-quran", "/learn-quran/apply"],
    ["quiz", "/learn-quran/quiz"],
    ["why-recite", "/learn-quran/why-recite"],
  ])("%s → %s", (id, route) => {
    expect(getQuranGuideTopicRoute(id)).toBe(route);
  });
});
