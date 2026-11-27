import { RUQYAH_SECTION_ORDER, RUQYAH_TOPICS } from "@munib-tracker/shared/content/ruqyah";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/ruqyah` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: RUQYAH_TOPICS,
  sectionOrder: RUQYAH_SECTION_ORDER,
  overlayKey: "RUQYAH_TOPICS",
});

export const ensureRuqyahContent = ensureBundledGuideContent;
export const getRuqyahTopics = guide.getTopics;
export const getRuqyahTopic = guide.getTopic;
export const getRuqyahSectionOrder = guide.getSectionOrder;
export const getRuqyahTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const ruqyahGuideConfig: LearnGuideConfig = { ns: "ruqyah", basePath: "/ruqyah", guide };
