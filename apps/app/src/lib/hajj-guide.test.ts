import {
  ensureHajjGuideContent,
  getHajjChecklistItems,
  getHajjGuideSectionOrder,
  getHajjGuideTopic,
  getHajjGuideTopics,
  getHajjGuideTopicsBySection,
  getUmrahChecklistItems,
  isHajjGuideContentReady,
} from "@/lib/hajj-guide";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Hajj", {
  getTopics: getHajjGuideTopics,
  getTopic: getHajjGuideTopic,
  getTopicsBySection: getHajjGuideTopicsBySection,
  sectionOrder: getHajjGuideSectionOrder(),
});

describe("Hajj extras", () => {
  it("is always ready", async () => {
    expect(isHajjGuideContentReady()).toBe(true);
    await expect(ensureHajjGuideContent()).resolves.toBeUndefined();
  });

  it.each([
    ["Hajj", getHajjChecklistItems],
    ["Umrah", getUmrahChecklistItems],
  ])("lists the %s checklist", (_label, getItems) => {
    expect(getItems().length).toBeGreaterThan(0);
  });
});
