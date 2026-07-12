import type {
  AqeedahGlossaryTerm,
  AqeedahSection,
  AqeedahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type AqeedahContent = typeof import("@munib-tracker/shared/content/aqeedah") &
  typeof import("@munib-tracker/shared/content/aqeedah-glossary");
let contentCache: AqeedahContent | undefined;

export async function ensureAqeedahContent(): Promise<AqeedahContent> {
  if (!contentCache) {
    const [aqeedah, glossary] = await Promise.all([
      import("@munib-tracker/shared/content/aqeedah"),
      import("@munib-tracker/shared/content/aqeedah-glossary"),
    ]);
    contentCache = { ...aqeedah, ...glossary };
  }
  return contentCache;
}

function content(): Partial<AqeedahContent> {
  if (!contentCache) void ensureAqeedahContent();
  return contentCache ?? {};
}

export function getAqeedahTopics(): AqeedahTopic[] {
  return localizeList(content().AQEDAH_TOPICS ?? [], overlayList("AQEDAH_TOPICS"));
}

export function getAqeedahTopic(id: string | undefined): AqeedahTopic | undefined {
  if (!id) return undefined;
  return getAqeedahTopics().find((topic) => topic.id === id);
}

export function getAqeedahTopicsBySection(): Record<AqeedahSection, AqeedahTopic[]> {
  const grouped = Object.fromEntries(
    (content().AQEDAH_SECTION_ORDER ?? []).map((section) => [section, [] as AqeedahTopic[]]),
  ) as Record<AqeedahSection, AqeedahTopic[]>;

  for (const topic of getAqeedahTopics()) {
    grouped[topic.section].push(topic);
  }
  return grouped;
}

export function getAqeedahGlossary(): AqeedahGlossaryTerm[] {
  return localizeList(content().AQEDAH_GLOSSARY ?? [], overlayList("AQEDAH_GLOSSARY"));
}

export function getAqeedahLessonCount(): number {
  return content().AQEDAH_TOPICS?.length ?? 0;
}
