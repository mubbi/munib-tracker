import {
  FRIDAY_GUIDE_SECTION_ORDER,
  FRIDAY_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/friday-guide";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/friday` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: FRIDAY_GUIDE_TOPICS,
  sectionOrder: FRIDAY_GUIDE_SECTION_ORDER,
  overlayKey: "FRIDAY_GUIDE_TOPICS",
});

export const ensureFridayGuideContent = ensureBundledGuideContent;
export const getFridayGuideTopics = guide.getTopics;
export const getFridayGuideTopic = guide.getTopic;
export const getFridayGuideSectionOrder = guide.getSectionOrder;
export const getFridayGuideTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const fridayGuideConfig: LearnGuideConfig = { ns: "friday", basePath: "/friday", guide };
