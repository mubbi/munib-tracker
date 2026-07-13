import {
  ISLAMIC_FINANCE_SECTION_ORDER,
  ISLAMIC_FINANCE_TOPICS,
} from "@munib-tracker/shared/content/islamic-finance";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type IslamicFinanceSection = (typeof ISLAMIC_FINANCE_SECTION_ORDER)[number];

/** English corpus ships with the `/finance` route chunk — sync for reliable first paint. */
export async function ensureIslamicFinanceContent(): Promise<void> {}

export function getIslamicFinanceTopics(): LearnGuideTopic[] {
  return localizeList(ISLAMIC_FINANCE_TOPICS, overlayList("ISLAMIC_FINANCE_TOPICS"));
}

export function getIslamicFinanceTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getIslamicFinanceTopics().find((topic) => topic.id === id);
}

export function getIslamicFinanceSectionOrder(): readonly IslamicFinanceSection[] {
  return ISLAMIC_FINANCE_SECTION_ORDER;
}

export function getIslamicFinanceTopicsBySection(): Record<
  IslamicFinanceSection,
  LearnGuideTopic[]
> {
  const grouped = Object.fromEntries(
    ISLAMIC_FINANCE_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<IslamicFinanceSection, LearnGuideTopic[]>;
  for (const topic of getIslamicFinanceTopics()) {
    const bucket = grouped[topic.section as IslamicFinanceSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
