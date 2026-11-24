import {
  JANAZAH_GUIDE_SECTION_ORDER,
  JANAZAH_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/janazah-guide";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/janazah` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: JANAZAH_GUIDE_TOPICS,
  sectionOrder: JANAZAH_GUIDE_SECTION_ORDER,
  overlayKey: "JANAZAH_GUIDE_TOPICS",
});

export const ensureJanazahGuideContent = ensureBundledGuideContent;
export const getJanazahGuideTopics = guide.getTopics;
export const getJanazahGuideTopic = guide.getTopic;
export const getJanazahGuideSectionOrder = guide.getSectionOrder;
export const getJanazahGuideTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const janazahGuideConfig: LearnGuideConfig = { ns: "janazah", basePath: "/janazah", guide };
