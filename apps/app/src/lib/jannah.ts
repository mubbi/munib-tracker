import {
  JANNAH_DUAS,
  JANNAH_FIRDAWS_DUA,
  JANNAH_GATES,
  JANNAH_PATH_TOPIC_IDS,
  JANNAH_PROMISED,
  JANNAH_TOPICS,
  JANNAH_VERSES,
} from "@munib-tracker/shared/content";
import {
  JANNAH_DUAS_AR,
  JANNAH_DUAS_UR,
  JANNAH_FIRDAWS_DUA_AR,
  JANNAH_FIRDAWS_DUA_UR,
  JANNAH_GATES_AR,
  JANNAH_GATES_UR,
  JANNAH_PROMISED_AR,
  JANNAH_PROMISED_UR,
  JANNAH_TOPICS_AR,
  JANNAH_TOPICS_UR,
  JANNAH_VERSES_AR,
  JANNAH_VERSES_UR,
} from "@munib-tracker/shared/content-i18n";
import type {
  JannahDuaEntry,
  JannahGate,
  JannahHub,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "@munib-tracker/shared/types";
import { localizeList, localizeObject } from "@/lib/content-i18n";

/** All Journey to Jannah topics, localized to the active app locale. */
export function getJannahTopics(): JannahTopic[] {
  return localizeList(JANNAH_TOPICS, { ur: JANNAH_TOPICS_UR, ar: JANNAH_TOPICS_AR });
}

/** One topic by id. */
export function getJannahTopic(id: string | undefined): JannahTopic | undefined {
  if (!id) return undefined;
  return getJannahTopics().find((topic) => topic.id === id);
}

/** Path deed topics only. */
export function getJannahPathTopics(): JannahTopic[] {
  const topics = getJannahTopics();
  return JANNAH_PATH_TOPIC_IDS.map((id) => topics.find((t) => t.id === id)).filter(
    (t): t is JannahTopic => t != null,
  );
}

/** Hub topics (excluding path deeds). */
export function getJannahHubTopics(): JannahTopic[] {
  const pathSet = new Set<string>(JANNAH_PATH_TOPIC_IDS);
  return getJannahTopics().filter((t) => !pathSet.has(t.id));
}

/** Topics for a hub section. */
export function getJannahTopicsByHub(hub: JannahHub): JannahTopic[] {
  return getJannahTopics().filter((t) => t.hub === hub);
}

export function getJannahGates(): JannahGate[] {
  return localizeList(JANNAH_GATES, { ur: JANNAH_GATES_UR, ar: JANNAH_GATES_AR });
}

export function getJannahVerses(): JannahVerseEntry[] {
  return localizeList(JANNAH_VERSES, { ur: JANNAH_VERSES_UR, ar: JANNAH_VERSES_AR });
}

export function getJannahDuas(): JannahDuaEntry[] {
  return localizeList(JANNAH_DUAS, { ur: JANNAH_DUAS_UR, ar: JANNAH_DUAS_AR });
}

export function getJannahPromised(): JannahPromisedEntry[] {
  return localizeList(JANNAH_PROMISED, { ur: JANNAH_PROMISED_UR, ar: JANNAH_PROMISED_AR });
}

/** The Al-Firdaws du'a text, localized to the active app locale. */
export function getJannahFirdawsDua(): typeof JANNAH_FIRDAWS_DUA {
  return localizeObject(JANNAH_FIRDAWS_DUA, {
    ur: JANNAH_FIRDAWS_DUA_UR,
    ar: JANNAH_FIRDAWS_DUA_AR,
  });
}

/** Importance label key suffix under `jannah.importance.*`. */
export function jannahImportanceKey(importance: NonNullable<JannahTopic["importance"]>): string {
  return importance;
}
