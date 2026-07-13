import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/** English content module shape a `LearnGuideTopic[]` corpus resolves to. */
export type LearnGuideContentSource<Section extends string> = {
  topics: LearnGuideTopic[];
  sectionOrder: readonly Section[];
};

export type LearnGuideAccessors<Section extends string> = {
  ensureContent: () => Promise<void>;
  getTopics: () => LearnGuideTopic[];
  getTopic: (id: string | undefined) => LearnGuideTopic | undefined;
  getTopicsBySection: () => Record<Section, LearnGuideTopic[]>;
  getSectionOrder: () => readonly Section[];
};

/**
 * Builds cached accessors for a `LearnGuideTopic[]` content module (eid, ruqyah,
 * Laylat al-Qadr, new Muslim, Islamic finance, …). Mirrors `lib/aqeedah.ts`:
 * English content loads lazily via dynamic `import()` so it stays out of the
 * main bundle, and locale overlays resolve through `localizeList`/`overlayList`
 * once a translation overlay corpus is registered for `overlayBaseKey`.
 */
export function createLearnGuideAccessors<Section extends string>(
  overlayBaseKey: string,
  load: () => Promise<LearnGuideContentSource<Section>>,
): LearnGuideAccessors<Section> {
  let cache: LearnGuideContentSource<Section> | undefined;
  let inflight: Promise<void> | undefined;

  function ensureContent(): Promise<void> {
    if (cache) return Promise.resolve();
    if (!inflight) {
      inflight = load().then((loaded) => {
        cache = loaded;
      });
    }
    return inflight;
  }

  function getTopics(): LearnGuideTopic[] {
    if (!cache) void ensureContent();
    return localizeList(cache?.topics ?? [], overlayList(overlayBaseKey));
  }

  function getSectionOrder(): readonly Section[] {
    if (!cache) void ensureContent();
    return cache?.sectionOrder ?? [];
  }

  function getTopic(id: string | undefined): LearnGuideTopic | undefined {
    if (!id) return undefined;
    return getTopics().find((topic) => topic.id === id);
  }

  function getTopicsBySection(): Record<Section, LearnGuideTopic[]> {
    const grouped = Object.fromEntries(
      getSectionOrder().map((section) => [section, [] as LearnGuideTopic[]]),
    ) as Record<Section, LearnGuideTopic[]>;
    for (const topic of getTopics()) {
      const bucket = grouped[topic.section as Section];
      if (bucket) bucket.push(topic);
    }
    return grouped;
  }

  return { ensureContent, getTopics, getTopic, getTopicsBySection, getSectionOrder };
}
