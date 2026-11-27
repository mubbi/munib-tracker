import {
  LAYLAT_AL_QADR_SECTION_ORDER,
  LAYLAT_AL_QADR_TOPICS,
} from "@munib-tracker/shared/content/laylat-al-qadr";
import {
  createSectionedGuide,
  ensureBundledGuideContent,
  type LearnGuideConfig,
} from "@/lib/sectioned-guide";

/** English corpus ships with the `/laylat-al-qadr` route chunk — sync for reliable first paint. */
const guide = createSectionedGuide({
  topics: LAYLAT_AL_QADR_TOPICS,
  sectionOrder: LAYLAT_AL_QADR_SECTION_ORDER,
  overlayKey: "LAYLAT_AL_QADR_TOPICS",
});

export const ensureLaylatAlQadrContent = ensureBundledGuideContent;
export const getLaylatAlQadrTopics = guide.getTopics;
export const getLaylatAlQadrTopic = guide.getTopic;
export const getLaylatAlQadrSectionOrder = guide.getSectionOrder;
export const getLaylatAlQadrTopicsBySection = guide.getTopicsBySection;

/** Shared Learn hub / topic screens (`components/learn-guide/learn-guide-screens`). */
export const laylatAlQadrGuideConfig: LearnGuideConfig = {
  ns: "laylatAlQadr",
  basePath: "/laylat-al-qadr",
  guide,
};
