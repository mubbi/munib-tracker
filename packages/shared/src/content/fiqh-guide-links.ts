import { type FiqhDifferenceId, getFiqhDifference } from "../fiqh/differences";
import { EID_GUIDE_TOPICS } from "./eid-guide";
import { FIDYAH_GUIDE_TOPICS } from "./fidyah-guide";
import { FRIDAY_GUIDE_TOPICS } from "./friday-guide";
import { HAJJ_GUIDE_TOPICS } from "./hajj-guide";
import { JANAZAH_GUIDE_TOPICS } from "./janazah-guide";
import { SALAH_GUIDE_TOPICS } from "./salah-guide";
import { TAHARAH_TOPICS } from "./taharah";

/**
 * NF-3.0a guide ↔ difference links (plan §4.1.2, §4.1.4). Guide topics carry a
 * typed `differenceIds` list instead of screens hard-coding notes; this module
 * turns those links into `usedIn`-style anchors so the coverage test, the
 * difference detail screen ("Read more in the guide") and search agree.
 *
 * Anchor forms (same as `FiqhDifference.usedIn`):
 * - `/<guide>/<topicId>` — one topic (the salah guide uses this form);
 * - `/<guide>#<section>` — any topic in that hub section.
 */

/** Minimal topic shape shared by the Learn guides that carry fiqh links. */
export interface FiqhLinkedTopic {
  id: string;
  title: string;
  section?: string;
  summary?: string;
  body: readonly string[];
  steps?: readonly { title: string; body: string; tip?: string }[];
  actions?: readonly string[];
  disclaimer?: string;
  madhhabNote?: string;
  differenceIds?: readonly FiqhDifferenceId[];
}

export interface FiqhGuideSource {
  /** Hub route (`/salah-guide`) — topic routes are `${basePath}/${id}`. */
  basePath: string;
  topics: readonly FiqhLinkedTopic[];
}

/** Every Learn guide whose topics may carry `differenceIds`. */
export const FIQH_GUIDE_SOURCES: readonly FiqhGuideSource[] = [
  { basePath: "/salah-guide", topics: SALAH_GUIDE_TOPICS },
  { basePath: "/taharah", topics: TAHARAH_TOPICS },
  { basePath: "/friday", topics: FRIDAY_GUIDE_TOPICS },
  { basePath: "/eid", topics: EID_GUIDE_TOPICS },
  { basePath: "/janazah", topics: JANAZAH_GUIDE_TOPICS },
  { basePath: "/hajj", topics: HAJJ_GUIDE_TOPICS },
  { basePath: "/fidyah", topics: FIDYAH_GUIDE_TOPICS },
];

/** The anchors one topic answers to (`/guide/id`, plus `/guide#section` when it has one). */
export function topicAnchors(basePath: string, topic: FiqhLinkedTopic): string[] {
  const anchors = [`${basePath}/${topic.id}`];
  if (topic.section) anchors.push(`${basePath}#${topic.section}`);
  return anchors;
}

export interface ResolvedGuideAnchor {
  basePath: string;
  /** Topics the anchor points at (one for `/guide/id`, the whole section for `#section`). */
  topics: FiqhLinkedTopic[];
}

/**
 * Resolves a `usedIn` anchor to guide topics, or `null` when it isn't a guide
 * topic/section anchor (a screen, a calculator, or an unknown topic).
 */
export function resolveGuideAnchor(
  anchor: string,
  sources: readonly FiqhGuideSource[] = FIQH_GUIDE_SOURCES,
): ResolvedGuideAnchor | null {
  for (const source of sources) {
    const { basePath } = source;
    if (anchor.startsWith(`${basePath}#`)) {
      const section = anchor.slice(basePath.length + 1);
      const topics = source.topics.filter((topic) => topic.section === section);
      return topics.length ? { basePath, topics } : null;
    }
    if (anchor.startsWith(`${basePath}/`)) {
      const id = anchor.slice(basePath.length + 1);
      const topic = source.topics.find((t) => t.id === id);
      return topic ? { basePath, topics: [topic] } : null;
    }
  }
  return null;
}

/** True when `anchor` names a guide hub (`/eid`, `/eid#prayer`, `/eid/x`) rather than a screen. */
export function isGuideAnchor(
  anchor: string,
  sources: readonly FiqhGuideSource[] = FIQH_GUIDE_SOURCES,
): boolean {
  return sources.some(
    ({ basePath }) => anchor.startsWith(`${basePath}#`) || anchor.startsWith(`${basePath}/`),
  );
}

export interface GuideTopicLink {
  basePath: string;
  topicId: string;
  title: string;
  /** Router path of the topic screen. */
  href: string;
}

/** Guide topics that render a note for `id`, in guide order — for "Read more in the guide". */
export function guideTopicsForDifference(
  id: FiqhDifferenceId,
  sources: readonly FiqhGuideSource[] = FIQH_GUIDE_SOURCES,
): GuideTopicLink[] {
  const links: GuideTopicLink[] = [];
  for (const { basePath, topics } of sources) {
    for (const topic of topics) {
      if (!topic.differenceIds?.includes(id)) continue;
      links.push({
        basePath,
        topicId: topic.id,
        title: topic.title,
        href: `${basePath}/${topic.id}`,
      });
    }
  }
  return links;
}

/**
 * The four school names as they appear in guide prose (Shafi'i with any
 * apostrophe, plural "Hanafis"). "Maliki yawmid-din" (Al-Fatihah
 * transliteration) is not a school mention.
 */
export const SCHOOL_NAME_PATTERN =
  /\b(?:Hanafi|Shafi['’ʿ]?i|Maliki(?!\s+yawm)|Hanbali)(?:s|yya|yyah)?\b/;

/** Every prose string of a topic: body paragraphs, step bodies/tips, actions, notes, disclaimer. */
export function topicProse(topic: FiqhLinkedTopic): string[] {
  return [
    ...(topic.summary ? [topic.summary] : []),
    ...topic.body,
    ...(topic.steps ?? []).flatMap((step) => [step.body, ...(step.tip ? [step.tip] : [])]),
    ...(topic.actions ?? []),
    ...(topic.madhhabNote ? [topic.madhhabNote] : []),
    ...(topic.disclaimer ? [topic.disclaimer] : []),
  ];
}

/** Prose strings in `topic` that name one of the four schools. */
export function schoolMentions(topic: FiqhLinkedTopic): string[] {
  return topicProse(topic).filter((text) => SCHOOL_NAME_PATTERN.test(text));
}

/** Anchors of `topic` that are missing from the `usedIn` of a difference it links. */
export function unlistedTopicLinks(
  basePath: string,
  topic: FiqhLinkedTopic,
): Array<{ id: FiqhDifferenceId; anchors: string[] }> {
  const anchors = topicAnchors(basePath, topic);
  return (topic.differenceIds ?? [])
    .filter((id) => !getFiqhDifference(id).usedIn.some((where) => anchors.includes(where)))
    .map((id) => ({ id, anchors }));
}
