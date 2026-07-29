import * as aqeedah from "@munib-tracker/shared/content/aqeedah";
import * as aqeedahGlossary from "@munib-tracker/shared/content/aqeedah-glossary";
import type {
  AqeedahGlossaryTerm,
  AqeedahSection,
  AqeedahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/aqeedah` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = { ...aqeedah, ...aqeedahGlossary };

export function isAqeedahContentReady(): boolean {
  return true;
}

export async function ensureAqeedahContent(): Promise<typeof corpus> {
  return corpus;
}

export function getAqeedahTopics(): AqeedahTopic[] {
  return localizeList(corpus.AQEDAH_TOPICS, overlayList("AQEDAH_TOPICS"));
}

export function getAqeedahTopic(id: string | undefined): AqeedahTopic | undefined {
  if (!id) return undefined;
  return getAqeedahTopics().find((topic) => topic.id === id);
}

export function getAqeedahTopicsBySection(): Record<AqeedahSection, AqeedahTopic[]> {
  const grouped = Object.fromEntries(
    corpus.AQEDAH_SECTION_ORDER.map((section) => [section, [] as AqeedahTopic[]]),
  ) as Record<AqeedahSection, AqeedahTopic[]>;

  for (const topic of getAqeedahTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getAqeedahGlossary(): AqeedahGlossaryTerm[] {
  return localizeList(corpus.AQEDAH_GLOSSARY, overlayList("AQEDAH_GLOSSARY"));
}

export function getAqeedahLessonCount(): number {
  return corpus.AQEDAH_TOPICS.length;
}
