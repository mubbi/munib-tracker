import { createLearnGuideAccessors } from "@/lib/learn-guide";

type IslamicFinanceSection =
  typeof import("@munib-tracker/shared/content/islamic-finance")["ISLAMIC_FINANCE_SECTION_ORDER"][number];

const accessors = createLearnGuideAccessors<IslamicFinanceSection>(
  "ISLAMIC_FINANCE_TOPICS",
  async () => {
    const { ISLAMIC_FINANCE_TOPICS, ISLAMIC_FINANCE_SECTION_ORDER } = await import(
      "@munib-tracker/shared/content/islamic-finance"
    );
    return { topics: ISLAMIC_FINANCE_TOPICS, sectionOrder: ISLAMIC_FINANCE_SECTION_ORDER };
  },
);

export const ensureIslamicFinanceContent = accessors.ensureContent;
export const getIslamicFinanceTopics = accessors.getTopics;
export const getIslamicFinanceTopic = accessors.getTopic;
export const getIslamicFinanceTopicsBySection = accessors.getTopicsBySection;
export const getIslamicFinanceSectionOrder = accessors.getSectionOrder;
