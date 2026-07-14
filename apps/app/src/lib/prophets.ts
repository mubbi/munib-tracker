import type { ContentOverlays, OverlayLocale } from "@munib-tracker/shared/content-i18n";
import type {
  ProphetsSection,
  ProphetsTimelineEvent,
  ProphetsTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

type ProphetsContent = typeof import("@munib-tracker/shared/content/prophets") &
  typeof import("@munib-tracker/shared/content/prophets-timeline");
let contentCache: ProphetsContent | undefined;
export function isProphetsContentReady(): boolean {
  return contentCache !== undefined;
}
export async function ensureProphetsContent(): Promise<ProphetsContent> {
  if (!contentCache) {
    const [topics, timeline] = await Promise.all([
      import("@munib-tracker/shared/content/prophets"),
      import("@munib-tracker/shared/content/prophets-timeline"),
    ]);
    contentCache = { ...topics, ...timeline };
  }
  return contentCache;
}
function content(): Partial<ProphetsContent> {
  if (!contentCache) void ensureProphetsContent();
  return contentCache ?? {};
}

// The English PROPHETS_TOPICS is composed as
// [...contextTopics(3), ...PROPHETS_BIO_TOPICS(25), ...themeTopics(2), ...evidenceTopics(2)].
// The overlay for the non-bio topics (PROPHETS_TOPICS_*) is authored in the order
// context(3) + themes(2) + evidence(2); recompose it here so each overlay array is
// index-aligned to the full composed English array before localizing.
function composeProphetsOverlay<T>(nonBio: readonly T[], bio: readonly T[]): T[] {
  const context = nonBio.slice(0, 3);
  const themes = nonBio.slice(3, 5);
  const evidence = nonBio.slice(5, 7);
  return [...context, ...bio, ...themes, ...evidence];
}

function prophetsTopicsOverlays(): ContentOverlays<ProphetsTopic> {
  const partial = overlayList<ProphetsTopic>("PROPHETS_TOPICS");
  const bio = overlayList<ProphetsTopic>("PROPHETS_BIO_TOPICS");
  const locales = new Set([...Object.keys(partial), ...Object.keys(bio)] as OverlayLocale[]);
  const result: ContentOverlays<ProphetsTopic> = {};
  for (const locale of locales) {
    const nonBio = partial[locale];
    const bios = bio[locale];
    if (nonBio && bios) {
      result[locale] = composeProphetsOverlay(nonBio, bios);
    }
  }
  return result;
}

export function getProphetsTopics(): ProphetsTopic[] {
  return localizeList(content().PROPHETS_TOPICS ?? [], prophetsTopicsOverlays());
}

export function getProphetsTopic(id: string | undefined): ProphetsTopic | undefined {
  if (!id) return undefined;
  return getProphetsTopics().find((topic) => topic.id === id);
}

export function getProphetsTopicsBySection(): Record<ProphetsSection, ProphetsTopic[]> {
  const grouped = Object.fromEntries(
    (content().PROPHETS_SECTION_ORDER ?? []).map((section) => [section, [] as ProphetsTopic[]]),
  ) as Record<ProphetsSection, ProphetsTopic[]>;

  for (const topic of getProphetsTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getProphetsTimeline(): ProphetsTimelineEvent[] {
  return localizeList(content().PROPHETS_TIMELINE ?? [], overlayList("PROPHETS_TIMELINE"));
}

export function getProphetsLessonCount(): number {
  return content().PROPHETS_TOPICS?.length ?? 0;
}
