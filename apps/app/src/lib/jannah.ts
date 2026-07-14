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

type JannahContent = typeof import("@munib-tracker/shared/content/jannah");
let contentCache: JannahContent | undefined;
export function isJannahContentReady(): boolean {
  return contentCache !== undefined;
}

/** Warm the Journey to Jannah corpus before reading its synchronous getters. */
export async function ensureJannahContent(): Promise<JannahContent> {
  if (!contentCache) contentCache = await import("@munib-tracker/shared/content/jannah");
  return contentCache;
}

function content(): Partial<JannahContent> {
  if (!contentCache) void ensureJannahContent();
  return contentCache ?? {};
}

/** All Journey to Jannah topics, localized to the active app locale. */
export function getJannahTopics(): JannahTopic[] {
  return localizeList(content().JANNAH_TOPICS ?? [], overlayList("JANNAH_TOPICS"));
}

/** One topic by id. */
export function getJannahTopic(id: string | undefined): JannahTopic | undefined {
  if (!id) return undefined;
  return getJannahTopics().find((topic) => topic.id === id);
}

/** Path deed topics only. */
export function getJannahPathTopics(): JannahTopic[] {
  const topics = getJannahTopics();
  return (content().JANNAH_PATH_TOPIC_IDS ?? [])
    .map((id) => topics.find((t) => t.id === id))
    .filter((t): t is JannahTopic => t != null);
}

/** Hub topics (excluding path deeds). */
export function getJannahHubTopics(): JannahTopic[] {
  const pathSet = new Set<string>(content().JANNAH_PATH_TOPIC_IDS ?? []);
  return getJannahTopics().filter((t) => !pathSet.has(t.id));
}

/** Topics for a hub section. */
export function getJannahTopicsByHub(hub: JannahHub): JannahTopic[] {
  return getJannahTopics().filter((t) => t.hub === hub);
}

export function getJannahGates(): JannahGate[] {
  return localizeList(content().JANNAH_GATES ?? [], overlayList("JANNAH_GATES"));
}

export function getJannahVerses(): JannahVerseEntry[] {
  return localizeList(content().JANNAH_VERSES ?? [], overlayList("JANNAH_VERSES"));
}

export function getJannahDuas(): JannahDuaEntry[] {
  return localizeList(content().JANNAH_DUAS ?? [], overlayList("JANNAH_DUAS"));
}

export function getJannahPromised(): JannahPromisedEntry[] {
  return localizeList(content().JANNAH_PROMISED ?? [], overlayList("JANNAH_PROMISED"));
}

/** The Al-Firdaws du'a text, localized to the active app locale. */
export function getJannahFirdawsDua(): JannahContent["JANNAH_FIRDAWS_DUA"] | undefined {
  const dua = content().JANNAH_FIRDAWS_DUA;
  return dua ? localizeObject(dua, overlayObject("JANNAH_FIRDAWS_DUA")) : undefined;
}

/** Importance label key suffix under `jannah.importance.*`. */
export function jannahImportanceKey(importance: NonNullable<JannahTopic["importance"]>): string {
  return importance;
}
