import {
  ensureFidyahGuideContent,
  getFidyahGuideSectionOrder,
  getFidyahGuideTopic,
  getFidyahGuideTopics,
  getFidyahGuideTopicsBySection,
} from "@/lib/fidyah-guide";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Fidyah", {
  getTopics: getFidyahGuideTopics,
  getTopic: getFidyahGuideTopic,
  getTopicsBySection: getFidyahGuideTopicsBySection,
  sectionOrder: getFidyahGuideSectionOrder(),
});

it("resolves content eagerly (bundled with the route)", async () => {
  await expect(ensureFidyahGuideContent()).resolves.toBeUndefined();
});
