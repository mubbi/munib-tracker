import { RUQYAH_SECTION_ORDER, RUQYAH_TOPICS } from "@munib-tracker/shared/content/ruqyah";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type RuqyahSection = (typeof RUQYAH_SECTION_ORDER)[number];

/** English corpus ships with the `/ruqyah` route chunk — sync for reliable first paint. */
export async function ensureRuqyahContent(): Promise<void> {}

export function getRuqyahTopics(): LearnGuideTopic[] {
  return localizeList(RUQYAH_TOPICS, overlayList("RUQYAH_TOPICS"));
}

export function getRuqyahTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getRuqyahTopics().find((topic) => topic.id === id);
}

export function getRuqyahSectionOrder(): readonly RuqyahSection[] {
  return RUQYAH_SECTION_ORDER;
}

export function getRuqyahTopicsBySection(): Record<RuqyahSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    RUQYAH_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<RuqyahSection, LearnGuideTopic[]>;
  for (const topic of getRuqyahTopics()) {
    const bucket = grouped[topic.section as RuqyahSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
