import {
  ensureNewMuslimContent,
  getNewMuslimSectionOrder,
  getNewMuslimTopic,
  getNewMuslimTopics,
  getNewMuslimTopicsBySection,
} from "@/lib/new-muslim";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("New Muslim", {
  getTopics: getNewMuslimTopics,
  getTopic: getNewMuslimTopic,
  getTopicsBySection: getNewMuslimTopicsBySection,
  sectionOrder: getNewMuslimSectionOrder(),
});

it("resolves content eagerly (bundled with the route)", async () => {
  await expect(ensureNewMuslimContent()).resolves.toBeUndefined();
});
