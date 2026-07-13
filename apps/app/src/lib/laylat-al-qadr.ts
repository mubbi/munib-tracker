import {
  LAYLAT_AL_QADR_SECTION_ORDER,
  LAYLAT_AL_QADR_TOPICS,
} from "@munib-tracker/shared/content/laylat-al-qadr";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type LaylatAlQadrSection = (typeof LAYLAT_AL_QADR_SECTION_ORDER)[number];

/** English corpus ships with the `/laylat-al-qadr` route chunk — sync for reliable first paint. */
export async function ensureLaylatAlQadrContent(): Promise<void> {}

export function getLaylatAlQadrTopics(): LearnGuideTopic[] {
  return localizeList(LAYLAT_AL_QADR_TOPICS, overlayList("LAYLAT_AL_QADR_TOPICS"));
}

export function getLaylatAlQadrTopic(id: string | undefined): LearnGuideTopic | undefined {
  if (!id) return undefined;
  return getLaylatAlQadrTopics().find((topic) => topic.id === id);
}

export function getLaylatAlQadrSectionOrder(): readonly LaylatAlQadrSection[] {
  return LAYLAT_AL_QADR_SECTION_ORDER;
}

export function getLaylatAlQadrTopicsBySection(): Record<LaylatAlQadrSection, LearnGuideTopic[]> {
  const grouped = Object.fromEntries(
    LAYLAT_AL_QADR_SECTION_ORDER.map((section) => [section, [] as LearnGuideTopic[]]),
  ) as Record<LaylatAlQadrSection, LearnGuideTopic[]>;
  for (const topic of getLaylatAlQadrTopics()) {
    const bucket = grouped[topic.section as LaylatAlQadrSection];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}
