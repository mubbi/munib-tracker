import * as jannah from "@munib-tracker/shared/content/jannah";
import type {
  JannahDuaEntry,
  JannahGate,
  JannahHub,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "@munib-tracker/shared/types";
import { localizeList, localizeObject } from "@/lib/content-i18n";
import { overlayList, overlayObject } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/jannah` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint; sync getters are
 * always warm on first visit.
 */
const corpus = jannah;

export function isJannahContentReady(): boolean {
  return true;
}

/** Warm the Journey to Jannah corpus before reading its synchronous getters. */
export async function ensureJannahContent(): Promise<typeof corpus> {
  return corpus;
}

/** All Journey to Jannah topics, localized to the active app locale. */
export function getJannahTopics(): JannahTopic[] {
  return localizeList(corpus.JANNAH_TOPICS, overlayList("JANNAH_TOPICS"));
}

/** One topic by id. */
export function getJannahTopic(id: string | undefined): JannahTopic | undefined {
  if (!id) return undefined;
  return getJannahTopics().find((topic) => topic.id === id);
}

/** Path deed topics only. */
export function getJannahPathTopics(): JannahTopic[] {
  const topics = getJannahTopics();
  return corpus.JANNAH_PATH_TOPIC_IDS.map((id) => topics.find((t) => t.id === id)).filter(
    (t): t is JannahTopic => t != null,
  );
}

/** Hub topics (excluding path deeds). */
export function getJannahHubTopics(): JannahTopic[] {
  const pathSet = new Set<string>(corpus.JANNAH_PATH_TOPIC_IDS);
  return getJannahTopics().filter((t) => !pathSet.has(t.id));
}

/** Topics for a hub section. */
export function getJannahTopicsByHub(hub: JannahHub): JannahTopic[] {
  return getJannahTopics().filter((t) => t.hub === hub);
}

export function getJannahGates(): JannahGate[] {
  return localizeList(corpus.JANNAH_GATES, overlayList("JANNAH_GATES"));
}

export function getJannahVerses(): JannahVerseEntry[] {
  return localizeList(corpus.JANNAH_VERSES, overlayList("JANNAH_VERSES"));
}

export function getJannahDuas(): JannahDuaEntry[] {
  return localizeList(corpus.JANNAH_DUAS, overlayList("JANNAH_DUAS"));
}

export function getJannahPromised(): JannahPromisedEntry[] {
  return localizeList(corpus.JANNAH_PROMISED, overlayList("JANNAH_PROMISED"));
}

/** The Al-Firdaws du'a text, localized to the active app locale. */
export function getJannahFirdawsDua(): typeof corpus.JANNAH_FIRDAWS_DUA {
  return localizeObject(corpus.JANNAH_FIRDAWS_DUA, overlayObject("JANNAH_FIRDAWS_DUA"));
}

/** Importance label key suffix under `jannah.importance.*`. */
export function jannahImportanceKey(importance: NonNullable<JannahTopic["importance"]>): string {
  return importance;
}
