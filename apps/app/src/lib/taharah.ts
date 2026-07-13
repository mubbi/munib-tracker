import type {
  TaharahChecklistItem,
  TaharahSection,
  TaharahTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type TaharahContent = typeof import("@munib-tracker/shared/content/taharah") &
  typeof import("@munib-tracker/shared/content/taharah-checklist");
let contentCache: TaharahContent | undefined;
export async function ensureTaharahContent(): Promise<TaharahContent> {
  if (!contentCache) {
    const [topics, checklist] = await Promise.all([
      import("@munib-tracker/shared/content/taharah"),
      import("@munib-tracker/shared/content/taharah-checklist"),
    ]);
    contentCache = { ...topics, ...checklist };
  }
  return contentCache;
}
function content(): Partial<TaharahContent> {
  if (!contentCache) void ensureTaharahContent();
  return contentCache ?? {};
}

export function getTaharahTopics(): TaharahTopic[] {
  return localizeList(content().TAHARAH_TOPICS ?? [], overlayList("TAHARAH_TOPICS"));
}

export function getTaharahTopic(id: string | undefined): TaharahTopic | undefined {
  if (!id) return undefined;
  return getTaharahTopics().find((topic) => topic.id === id);
}

export function getTaharahTopicsBySection(): Record<TaharahSection, TaharahTopic[]> {
  const grouped = Object.fromEntries(
    (content().TAHARAH_SECTION_ORDER ?? []).map((section) => [section, [] as TaharahTopic[]]),
  ) as Record<TaharahSection, TaharahTopic[]>;

  for (const topic of getTaharahTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getTaharahChecklist(): TaharahChecklistItem[] {
  return localizeList(content().TAHARAH_CHECKLIST ?? [], overlayList("TAHARAH_CHECKLIST"));
}

export function getTaharahLessonCount(): number {
  return content().TAHARAH_TOPICS?.length ?? 0;
}
