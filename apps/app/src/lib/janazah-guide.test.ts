import {
  ensureJanazahGuideContent,
  getJanazahGuideSectionOrder,
  getJanazahGuideTopic,
  getJanazahGuideTopics,
  getJanazahGuideTopicsBySection,
} from "@/lib/janazah-guide";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Janazah", {
  getTopics: getJanazahGuideTopics,
  getTopic: getJanazahGuideTopic,
  getTopicsBySection: getJanazahGuideTopicsBySection,
  sectionOrder: getJanazahGuideSectionOrder(),
});

it("resolves content eagerly (bundled with the route)", async () => {
  await expect(ensureJanazahGuideContent()).resolves.toBeUndefined();
});
