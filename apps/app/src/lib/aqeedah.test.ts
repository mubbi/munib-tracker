import {
  ensureAqeedahContent,
  getAqeedahGlossary,
  getAqeedahLessonCount,
  getAqeedahTopic,
  getAqeedahTopics,
  getAqeedahTopicsBySection,
  isAqeedahContentReady,
} from "@/lib/aqeedah";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Aqeedah", {
  getTopics: getAqeedahTopics,
  getTopic: getAqeedahTopic,
  getTopicsBySection: getAqeedahTopicsBySection,
});

describe("Aqeedah extras", () => {
  it("is always ready and counts every lesson", async () => {
    expect(isAqeedahContentReady()).toBe(true);
    await ensureAqeedahContent();
    expect(getAqeedahLessonCount()).toBe(getAqeedahTopics().length);
  });

  it("lists glossary terms", () => {
    expect(getAqeedahGlossary().length).toBeGreaterThan(0);
  });
});
