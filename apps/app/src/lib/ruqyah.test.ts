import {
  ensureRuqyahContent,
  getRuqyahSectionOrder,
  getRuqyahTopic,
  getRuqyahTopics,
  getRuqyahTopicsBySection,
} from "@/lib/ruqyah";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Ruqyah", {
  getTopics: getRuqyahTopics,
  getTopic: getRuqyahTopic,
  getTopicsBySection: getRuqyahTopicsBySection,
  sectionOrder: getRuqyahSectionOrder(),
});

it("resolves content eagerly (bundled with the route)", async () => {
  await expect(ensureRuqyahContent()).resolves.toBeUndefined();
});
