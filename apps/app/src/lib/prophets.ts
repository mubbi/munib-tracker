import {
  PROPHETS_SECTION_ORDER,
  PROPHETS_TIMELINE,
  PROPHETS_TOPICS,
} from "@munib-tracker/shared/content";
import {
  PROPHETS_BIO_TOPICS_AR,
  PROPHETS_BIO_TOPICS_UR,
  PROPHETS_TIMELINE_AR,
  PROPHETS_TIMELINE_UR,
  PROPHETS_TOPICS_AR,
  PROPHETS_TOPICS_UR,
} from "@munib-tracker/shared/content-i18n";
import type {
  ProphetsSection,
  ProphetsTimelineEvent,
  ProphetsTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";

// The English PROPHETS_TOPICS is composed as
// [...contextTopics(3), ...PROPHETS_BIO_TOPICS(25), ...themeTopics(2), ...evidenceTopics(2)].
// The overlay for the non-bio topics (PROPHETS_TOPICS_*) is authored in the order
// context(3) + themes(2) + evidence(2); recompose it here so each overlay array is
// index-aligned to the full composed English array before localizing.
function composeProphetsOverlay<T>(nonBio: readonly T[], bio: readonly T[]): T[] {
  const context = nonBio.slice(0, 3);
  const themes = nonBio.slice(3, 5);
  const evidence = nonBio.slice(5, 7);
  return [...context, ...bio, ...themes, ...evidence];
}

const PROPHETS_TOPICS_OVERLAY_UR = composeProphetsOverlay(
  PROPHETS_TOPICS_UR,
  PROPHETS_BIO_TOPICS_UR,
);
const PROPHETS_TOPICS_OVERLAY_AR = composeProphetsOverlay(
  PROPHETS_TOPICS_AR,
  PROPHETS_BIO_TOPICS_AR,
);

export function getProphetsTopics(): ProphetsTopic[] {
  return localizeList(PROPHETS_TOPICS, {
    ur: PROPHETS_TOPICS_OVERLAY_UR,
    ar: PROPHETS_TOPICS_OVERLAY_AR,
  });
}

export function getProphetsTopic(id: string | undefined): ProphetsTopic | undefined {
  if (!id) return undefined;
  return getProphetsTopics().find((topic) => topic.id === id);
}

export function getProphetsTopicsBySection(): Record<ProphetsSection, ProphetsTopic[]> {
  const grouped = Object.fromEntries(
    PROPHETS_SECTION_ORDER.map((section) => [section, [] as ProphetsTopic[]]),
  ) as Record<ProphetsSection, ProphetsTopic[]>;

  for (const topic of getProphetsTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getProphetsTimeline(): ProphetsTimelineEvent[] {
  return localizeList(PROPHETS_TIMELINE, {
    ur: PROPHETS_TIMELINE_UR,
    ar: PROPHETS_TIMELINE_AR,
  });
}

export function getProphetsLessonCount(): number {
  return PROPHETS_TOPICS.length;
}
