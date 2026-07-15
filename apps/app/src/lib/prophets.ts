import * as prophets from "@munib-tracker/shared/content/prophets";
import * as prophetsTimeline from "@munib-tracker/shared/content/prophets-timeline";
import type { ContentOverlays, OverlayLocale } from "@munib-tracker/shared/content-i18n";
import type {
  ProphetsSection,
  ProphetsTimelineEvent,
  ProphetsTopic,
} from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/prophets` route chunk.
 * Lazy `import()` left hubs empty/partial on first paint.
 */
const corpus = { ...prophets, ...prophetsTimeline };

export function isProphetsContentReady(): boolean {
  return true;
}

export async function ensureProphetsContent(): Promise<typeof corpus> {
  return corpus;
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
  return localizeList(corpus.PROPHETS_TOPICS, prophetsTopicsOverlays());
}

export function getProphetsTopic(id: string | undefined): ProphetsTopic | undefined {
  if (!id) return undefined;
  return getProphetsTopics().find((topic) => topic.id === id);
}

export function getProphetsTopicsBySection(): Record<ProphetsSection, ProphetsTopic[]> {
  const grouped = Object.fromEntries(
    corpus.PROPHETS_SECTION_ORDER.map((section) => [section, [] as ProphetsTopic[]]),
  ) as Record<ProphetsSection, ProphetsTopic[]>;

  for (const topic of getProphetsTopics()) {
    const bucket = grouped[topic.section];
    if (bucket) bucket.push(topic);
  }
  return grouped;
}

export function getProphetsTimeline(): ProphetsTimelineEvent[] {
  return localizeList(corpus.PROPHETS_TIMELINE, overlayList("PROPHETS_TIMELINE"));
}

export function getProphetsLessonCount(): number {
  return corpus.PROPHETS_TOPICS.length;
}
