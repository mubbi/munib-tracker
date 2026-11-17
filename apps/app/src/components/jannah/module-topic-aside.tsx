import type { Href } from "expo-router";
import { useMemo } from "react";

import { LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";

/**
 * Desktop "in this module" aside for topic articles of the Jannah-primitives
 * module family (Jannah, Jahannam, Last Day, Battles, Taharah and the guide
 * modules). Thin adapter over the shared Learn `LearnTopicAside`: builds the
 * per-topic hrefs from the module's base path. Rendered only inside
 * `LearnSplitLayout` (≥1200, non-TV), so phone / TV markup is unaffected.
 */
export function ModuleTopicAside({
  title,
  basePath,
  topics,
  currentId,
  completedIds,
}: {
  /** Module title — the aside heading links back to the hub. */
  title: string;
  /** Hub route, e.g. `/jannah`; topics live at `${basePath}/${id}`. */
  basePath: string;
  topics: readonly { id: string; title: string }[];
  currentId?: string;
  /** Lesson-tracked modules: completed topic ids (adds progress + check marks). */
  completedIds?: readonly string[];
}) {
  const items = useMemo(
    () =>
      topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        href: `${basePath}/${topic.id}` as Href,
      })),
    [topics, basePath],
  );
  return (
    <LearnTopicAside
      title={title}
      hubHref={basePath as Href}
      topics={items}
      currentId={currentId}
      completedIds={completedIds}
    />
  );
}
