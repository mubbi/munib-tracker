import { createLearnGuideAccessors } from "@/lib/learn-guide";

type LaylatAlQadrSection =
  typeof import("@munib-tracker/shared/content/laylat-al-qadr")["LAYLAT_AL_QADR_SECTION_ORDER"][number];

const accessors = createLearnGuideAccessors<LaylatAlQadrSection>(
  "LAYLAT_AL_QADR_TOPICS",
  async () => {
    const { LAYLAT_AL_QADR_TOPICS, LAYLAT_AL_QADR_SECTION_ORDER } = await import(
      "@munib-tracker/shared/content/laylat-al-qadr"
    );
    return { topics: LAYLAT_AL_QADR_TOPICS, sectionOrder: LAYLAT_AL_QADR_SECTION_ORDER };
  },
);

export const ensureLaylatAlQadrContent = accessors.ensureContent;
export const getLaylatAlQadrTopics = accessors.getTopics;
export const getLaylatAlQadrTopic = accessors.getTopic;
export const getLaylatAlQadrTopicsBySection = accessors.getTopicsBySection;
export const getLaylatAlQadrSectionOrder = accessors.getSectionOrder;
