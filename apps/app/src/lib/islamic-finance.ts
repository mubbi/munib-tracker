import {
  ISLAMIC_FINANCE_SECTION_ORDER,
  ISLAMIC_FINANCE_TOPICS,
} from "@munib-tracker/shared/content/islamic-finance";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/finance` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: ISLAMIC_FINANCE_TOPICS,
  sectionOrder: ISLAMIC_FINANCE_SECTION_ORDER,
  overlayKey: "ISLAMIC_FINANCE_TOPICS",
});

export const ensureIslamicFinanceContent = ensureBundledGuideContent;
export const getIslamicFinanceTopics = guide.getTopics;
export const getIslamicFinanceTopic = guide.getTopic;
export const getIslamicFinanceSectionOrder = guide.getSectionOrder;
export const getIslamicFinanceTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const islamicFinanceGuideConfig: LearnGuideConfig = {
  ns: "finance",
  basePath: "/finance",
  guide,
};
