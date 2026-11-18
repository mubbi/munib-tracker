import {
  ensureLaylatAlQadrContent,
  getLaylatAlQadrSectionOrder,
  getLaylatAlQadrTopic,
  getLaylatAlQadrTopics,
  getLaylatAlQadrTopicsBySection,
} from "@/lib/laylat-al-qadr";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Laylat al-Qadr", {
  getTopics: getLaylatAlQadrTopics,
  getTopic: getLaylatAlQadrTopic,
  getTopicsBySection: getLaylatAlQadrTopicsBySection,
  sectionOrder: getLaylatAlQadrSectionOrder(),
});

it("resolves content eagerly (bundled with the route)", async () => {
  await expect(ensureLaylatAlQadrContent()).resolves.toBeUndefined();
});
