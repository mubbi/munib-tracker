import { EID_GUIDE_SECTION_ORDER, EID_GUIDE_TOPICS } from "@munib-tracker/shared/content/eid-guide";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/eid` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: EID_GUIDE_TOPICS,
  sectionOrder: EID_GUIDE_SECTION_ORDER,
  overlayKey: "EID_GUIDE_TOPICS",
});

export const ensureEidGuideContent = ensureBundledGuideContent;
export const getEidGuideTopics = guide.getTopics;
export const getEidGuideTopic = guide.getTopic;
export const getEidGuideSectionOrder = guide.getSectionOrder;
export const getEidGuideTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const eidGuideConfig: LearnGuideConfig = { ns: "eid", basePath: "/eid", guide };
