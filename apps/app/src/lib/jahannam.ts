import * as jahannam from "@munib-tracker/shared/content/jahannam";
import * as jahannamCollections from "@munib-tracker/shared/content/jahannam-collections";
import * as jahannamMajorSins from "@munib-tracker/shared/content/jahannam-major-sins";
import type { JahannamSection, JahannamTopic } from "@munib-tracker/shared/types";
import { localizeList, localizeObject } from "@/lib/content-i18n";
import { overlayList, overlayObject } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/jahannam` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = { ...jahannam, ...jahannamCollections, ...jahannamMajorSins };

export function isJahannamContentReady(): boolean {
  return true;
}

export async function ensureJahannamContent(): Promise<typeof corpus> {
  return corpus;
}

function getJahannamCoreTopics(): JahannamTopic[] {
  return localizeList(corpus.JAHANNAM_CORE_TOPICS, overlayList("JAHANNAM_CORE_TOPICS"));
}

export function getJahannamMajorSinTopics(): JahannamTopic[] {
  return localizeList(corpus.JAHANNAM_MAJOR_SIN_TOPICS, overlayList("JAHANNAM_MAJOR_SIN_TOPICS"));
}

export function getJahannamTopics(): JahannamTopic[] {
  // Compose from the LOCALIZED base arrays so composed topics are translated too.
  return [...getJahannamCoreTopics(), ...getJahannamMajorSinTopics()];
}

export function getJahannamTopic(id: string | undefined): JahannamTopic | undefined {
  return getJahannamTopics().find((topic) => topic.id === id);
}

export function getJahannamTopicsBySection(): Record<JahannamSection, JahannamTopic[]> {
  const map = Object.fromEntries(
    corpus.JAHANNAM_SECTION_ORDER.map((section) => [section, [] as JahannamTopic[]]),
  ) as Record<JahannamSection, JahannamTopic[]>;
  for (const topic of getJahannamTopics()) {
    const bucket = map[topic.section];
    if (bucket) bucket.push(topic);
  }
  return map;
}

export function getJahannamLessonCount(): number {
  return corpus.JAHANNAM_TOPICS.length;
}

export function getJahannamNames() {
  return localizeList(corpus.JAHANNAM_NAMES, overlayList("JAHANNAM_NAMES"));
}

export function getJahannamGates() {
  return localizeList(corpus.JAHANNAM_GATES, overlayList("JAHANNAM_GATES"));
}

export function getJahannamVerses() {
  return localizeList(corpus.JAHANNAM_VERSES, overlayList("JAHANNAM_VERSES"));
}

export function getJahannamHadith() {
  return localizeList(corpus.JAHANNAM_HADITH, overlayList("JAHANNAM_HADITH"));
}

export function getJahannamDuas() {
  return localizeList(corpus.JAHANNAM_DUAS, overlayList("JAHANNAM_DUAS"));
}

export function getJahannamReflections() {
  return localizeList(corpus.JAHANNAM_REFLECTIONS, overlayList("JAHANNAM_REFLECTIONS"));
}

export function getJahannamReferences() {
  return localizeList(corpus.JAHANNAM_REFERENCES, overlayList("JAHANNAM_REFERENCES"));
}

export function getJahannamRefugeDua() {
  return localizeObject(corpus.JAHANNAM_REFUGE_DUA, overlayObject("JAHANNAM_REFUGE_DUA"));
}
