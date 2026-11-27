import {
  FIDYAH_GUIDE_SECTION_ORDER,
  FIDYAH_GUIDE_TOPICS,
} from "@munib-tracker/shared/content/fidyah-guide";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/fidyah` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: FIDYAH_GUIDE_TOPICS,
  sectionOrder: FIDYAH_GUIDE_SECTION_ORDER,
  overlayKey: "FIDYAH_GUIDE_TOPICS",
});

export const ensureFidyahGuideContent = ensureBundledGuideContent;
export const getFidyahGuideTopics = guide.getTopics;
export const getFidyahGuideTopic = guide.getTopic;
export const getFidyahGuideSectionOrder = guide.getSectionOrder;
export const getFidyahGuideTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const fidyahGuideConfig: LearnGuideConfig = { ns: "fidyah", basePath: "/fidyah", guide };
