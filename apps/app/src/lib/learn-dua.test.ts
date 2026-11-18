import {
  ensureLearnDuaContent,
  getLearnDuaLessonCount,
  getLearnDuaOccasions,
  getLearnDuaTopic,
  getLearnDuaTopics,
  getLearnDuaTopicsBySection,
  isLearnDuaContentReady,
} from "@/lib/learn-dua";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Learn Dua", {
  getTopics: getLearnDuaTopics,
  getTopic: getLearnDuaTopic,
  getTopicsBySection: getLearnDuaTopicsBySection,
});

describe("Learn Dua extras", () => {
  it("is always ready and counts every lesson", async () => {
    expect(isLearnDuaContentReady()).toBe(true);
    await ensureLearnDuaContent();
    expect(getLearnDuaLessonCount()).toBe(getLearnDuaTopics().length);
  });

  it("lists dua occasions", () => {
    expect(getLearnDuaOccasions().length).toBeGreaterThan(0);
  });
});
