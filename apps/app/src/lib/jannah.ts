import {
  JANNAH_DUAS,
  JANNAH_GATES,
  JANNAH_PATH_TOPIC_IDS,
  JANNAH_PROMISED,
  JANNAH_TOPICS,
  JANNAH_VERSES,
} from "@munib-tracker/shared/content";
import type { JannahHub, JannahTopic } from "@munib-tracker/shared/types";

/** All Journey to Jannah topics. */
export function getJannahTopics(): JannahTopic[] {
  return JANNAH_TOPICS;
}

/** One topic by id. */
export function getJannahTopic(id: string | undefined): JannahTopic | undefined {
  return JANNAH_TOPICS.find((topic) => topic.id === id);
}

/** Path deed topics only. */
export function getJannahPathTopics(): JannahTopic[] {
  return JANNAH_PATH_TOPIC_IDS.map((id) => JANNAH_TOPICS.find((t) => t.id === id)).filter(
    (t): t is JannahTopic => t != null,
  );
}

/** Hub topics (excluding path deeds). */
export function getJannahHubTopics(): JannahTopic[] {
  const pathSet = new Set<string>(JANNAH_PATH_TOPIC_IDS);
  return JANNAH_TOPICS.filter((t) => !pathSet.has(t.id));
}

/** Topics for a hub section. */
export function getJannahTopicsByHub(hub: JannahHub): JannahTopic[] {
  return JANNAH_TOPICS.filter((t) => t.hub === hub);
}

export function getJannahGates() {
  return JANNAH_GATES;
}

export function getJannahVerses() {
  return JANNAH_VERSES;
}

export function getJannahDuas() {
  return JANNAH_DUAS;
}

export function getJannahPromised() {
  return JANNAH_PROMISED;
}

/** Importance label key suffix under `jannah.importance.*`. */
export function jannahImportanceKey(importance: NonNullable<JannahTopic["importance"]>): string {
  return importance;
}
