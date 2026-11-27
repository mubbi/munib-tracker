import {
  WHITE_DAYS_GUIDE_SECTION_ORDER,
  WHITE_DAYS_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/white-days-guide";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/white-days` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: WHITE_DAYS_GUIDE_TOPICS,
  sectionOrder: WHITE_DAYS_GUIDE_SECTION_ORDER,
  overlayKey: "WHITE_DAYS_GUIDE_TOPICS",
});

export const ensureWhiteDaysGuideContent = ensureBundledGuideContent;
export const getWhiteDaysGuideTopics = guide.getTopics;
export const getWhiteDaysGuideTopic = guide.getTopic;
export const getWhiteDaysGuideSectionOrder = guide.getSectionOrder;
export const getWhiteDaysGuideTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const whiteDaysGuideConfig: LearnGuideConfig = {
  ns: "whiteDays",
  basePath: "/white-days",
  guide,
};
