import {
  ensureTaharahContent,
  getTaharahChecklist,
  getTaharahLessonCount,
  getTaharahTopic,
  getTaharahTopics,
  getTaharahTopicsBySection,
  isTaharahContentReady,
} from "@/lib/taharah";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Taharah", {
  getTopics: getTaharahTopics,
  getTopic: getTaharahTopic,
  getTopicsBySection: getTaharahTopicsBySection,
});

describe("Taharah extras", () => {
  it("is always ready with the bundled corpus", async () => {
    expect(isTaharahContentReady()).toBe(true);
    expect((await ensureTaharahContent()).TAHARAH_TOPICS.length).toBe(getTaharahLessonCount());
  });

  it("lists the purification checklist", () => {
    expect(getTaharahChecklist().length).toBeGreaterThan(0);
  });
});
