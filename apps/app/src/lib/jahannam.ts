import type { JahannamSection, JahannamTopic } from "@munib-tracker/shared/types";
import { localizeList, localizeObject } from "@/lib/content-i18n";
import { overlayList, overlayObject } from "@/lib/content-overlay-registry";

type JahannamContent = typeof import("@munib-tracker/shared/content/jahannam") &
  typeof import("@munib-tracker/shared/content/jahannam-collections") &
  typeof import("@munib-tracker/shared/content/jahannam-major-sins");
let contentCache: JahannamContent | undefined;
export async function ensureJahannamContent(): Promise<JahannamContent> {
  if (!contentCache) {
    const modules = await Promise.all([
      import("@munib-tracker/shared/content/jahannam"),
      import("@munib-tracker/shared/content/jahannam-collections"),
      import("@munib-tracker/shared/content/jahannam-major-sins"),
    ]);
    contentCache = Object.assign({}, ...modules) as JahannamContent;
  }
  return contentCache;
}
function content(): Partial<JahannamContent> {
  if (!contentCache) void ensureJahannamContent();
  return contentCache ?? {};
}

function getJahannamCoreTopics(): JahannamTopic[] {
  return localizeList(content().JAHANNAM_CORE_TOPICS ?? [], overlayList("JAHANNAM_CORE_TOPICS"));
}

export function getJahannamMajorSinTopics(): JahannamTopic[] {
  return localizeList(
    content().JAHANNAM_MAJOR_SIN_TOPICS ?? [],
    overlayList("JAHANNAM_MAJOR_SIN_TOPICS"),
  );
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
    (content().JAHANNAM_SECTION_ORDER ?? []).map((section) => [section, [] as JahannamTopic[]]),
  ) as Record<JahannamSection, JahannamTopic[]>;
  for (const topic of getJahannamTopics()) {
    map[topic.section].push(topic);
  }
  return map;
}

export function getJahannamLessonCount(): number {
  return content().JAHANNAM_TOPICS?.length ?? 0;
}

export function getJahannamNames() {
  return localizeList(content().JAHANNAM_NAMES ?? [], overlayList("JAHANNAM_NAMES"));
}

export function getJahannamGates() {
  return localizeList(content().JAHANNAM_GATES ?? [], overlayList("JAHANNAM_GATES"));
}

export function getJahannamVerses() {
  return localizeList(content().JAHANNAM_VERSES ?? [], overlayList("JAHANNAM_VERSES"));
}

export function getJahannamHadith() {
  return localizeList(content().JAHANNAM_HADITH ?? [], overlayList("JAHANNAM_HADITH"));
}

export function getJahannamDuas() {
  return localizeList(content().JAHANNAM_DUAS ?? [], overlayList("JAHANNAM_DUAS"));
}

export function getJahannamReflections() {
  return localizeList(content().JAHANNAM_REFLECTIONS ?? [], overlayList("JAHANNAM_REFLECTIONS"));
}

export function getJahannamReferences() {
  return localizeList(content().JAHANNAM_REFERENCES ?? [], overlayList("JAHANNAM_REFERENCES"));
}

export function getJahannamRefugeDua() {
  const dua = content().JAHANNAM_REFUGE_DUA;
  return dua ? localizeObject(dua, overlayObject("JAHANNAM_REFUGE_DUA")) : undefined;
}
