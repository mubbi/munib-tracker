import {
  ensureIslamicFinanceContent,
  getIslamicFinanceSectionOrder,
  getIslamicFinanceTopic,
  getIslamicFinanceTopics,
  getIslamicFinanceTopicsBySection,
} from "@/lib/islamic-finance";
import { describeSectionedGuide } from "@/test-support/learn-guide";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);

describeSectionedGuide("Islamic finance", {
  getTopics: getIslamicFinanceTopics,
  getTopic: getIslamicFinanceTopic,
  getTopicsBySection: getIslamicFinanceTopicsBySection,
  sectionOrder: getIslamicFinanceSectionOrder(),
});

it("resolves content eagerly (bundled with the route)", async () => {
  await expect(ensureIslamicFinanceContent()).resolves.toBeUndefined();
});
