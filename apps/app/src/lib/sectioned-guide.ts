import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * Buckets `items` by `section`, in `order`. Every section in `order` gets an
 * array (possibly empty); items whose section isn't listed are dropped — the
 * same contract every Learn hub relied on before this helper existed.
 */
export function groupBySection<S extends string, T extends { section: string }>(
  items: readonly T[],
  order: readonly S[],
): Record<S, T[]> {
  const grouped = Object.fromEntries(order.map((section) => [section, [] as T[]])) as Record<
    S,
    T[]
  >;
  for (const item of items) {
    const bucket = grouped[item.section as S];
    if (bucket) bucket.push(item);
  }
  return grouped;
}

/**
 * Moves the item with `id` to sit immediately after `anchorId` (in place).
 * No-op when either is missing or the order is already right — used to keep a
 * companion lesson beside its overview inside a section bucket.
 */
export function moveAfter<T extends { id: string }>(
  list: T[] | undefined,
  id: string,
  anchorId: string,
): T[] | undefined {
  if (!list) return list;
  const from = list.findIndex((item) => item.id === id);
  const anchor = list.findIndex((item) => item.id === anchorId);
  if (from < 0 || anchor < 0 || from === anchor + 1) return list;
  const [moved] = list.splice(from, 1);
  list.splice(list.findIndex((item) => item.id === anchorId) + 1, 0, moved as T);
  return list;
}

/** Read API shared by the small, sync, sectioned Learn guides (Janazah, Eid, Ruqyah, …). */
export type SectionedGuide<S extends string> = {
  /** Localized topics (English corpus + the active locale overlay). */
  getTopics(): LearnGuideTopic[];
  getTopic(id: string | undefined): LearnGuideTopic | undefined;
  getSectionOrder(): readonly S[];
  getTopicsBySection(): Record<S, LearnGuideTopic[]>;
};

/**
 * One implementation for every "topics + section order + overlay key" guide.
 *
 * The English corpus is statically imported with the route chunk (each guide is
 * small): a lazy `import()` left hubs empty on first paint when the ensure
 * effect lost the race. Overlays are read on every call so a locale pack that
 * lands later re-localizes without a reload.
 */
export function createSectionedGuide<S extends string>(config: {
  topics: readonly LearnGuideTopic[];
  sectionOrder: readonly S[];
  /** Overlay registry base key, e.g. `"JANAZAH_GUIDE_TOPICS"`. */
  overlayKey: string;
}): SectionedGuide<S> {
  const { topics, sectionOrder, overlayKey } = config;
  const getTopics = () => localizeList(topics, overlayList<LearnGuideTopic>(overlayKey));
  return {
    getTopics,
    getTopic: (id) => (id ? getTopics().find((topic) => topic.id === id) : undefined),
    getSectionOrder: () => sectionOrder,
    getTopicsBySection: () => groupBySection(getTopics(), sectionOrder),
  };
}

/** What the shared Learn guide hub / topic screens need to render one guide. */
export type LearnGuideConfig<S extends string = string> = {
  /** i18n namespace: `${ns}.title`, `.eyebrow`, `.subtitle`, `.intro`, `.notFound`, `.disclaimer`, `.section.<id>`. */
  ns: string;
  /** Hub route (`/janazah`); topics live at `${basePath}/[topic]`. */
  basePath: string;
  guide: SectionedGuide<S>;
};

/** Sync corpus — kept so flash cards / screens share one `ensure*Content` API. */
export async function ensureBundledGuideContent(): Promise<void> {}
