import {
  PROPHETS_SECTION_ORDER,
  PROPHETS_TIMELINE,
  PROPHETS_TOPICS,
} from "@munib-tracker/shared/content";
import type {
  ProphetsSection,
  ProphetsTimelineEvent,
  ProphetsTopic,
} from "@munib-tracker/shared/types";

export function getProphetsTopics(): ProphetsTopic[] {
  return PROPHETS_TOPICS;
}

export function getProphetsTopic(id: string | undefined): ProphetsTopic | undefined {
  return PROPHETS_TOPICS.find((topic) => topic.id === id);
}

export function getProphetsTopicsBySection(): Record<ProphetsSection, ProphetsTopic[]> {
  const grouped = Object.fromEntries(
    PROPHETS_SECTION_ORDER.map((section) => [section, [] as ProphetsTopic[]]),
  ) as Record<ProphetsSection, ProphetsTopic[]>;

  for (const topic of PROPHETS_TOPICS) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getProphetsTimeline(): ProphetsTimelineEvent[] {
  return PROPHETS_TIMELINE;
}

export function getProphetsLessonCount(): number {
  return PROPHETS_TOPICS.length;
}
