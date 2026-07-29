/**
 * Universal search + Learn guides. Kept separate from {@link ./search} so guide
 * corpora are not a sync dependency of every importer of light search (those
 * share into web `__common`).
 */

import {
  SEARCH_CATEGORY_ORDER,
  type SearchCategory,
  type SearchGroup,
  searchLight,
} from "@/lib/search";
import { fusePattern } from "@/lib/search-fuse";
import { searchGuideGroups } from "@/lib/search-guides";

const DEFAULT_GROUP_LIMIT = 6;

/** Light search plus Learn guide corpora (single `learn` group). */
export function searchLightWithGuides(
  query: string,
  perGroupLimit = DEFAULT_GROUP_LIMIT,
): SearchGroup[] {
  if (fusePattern(query) === "") return [];

  const light = searchLight(query, perGroupLimit);
  const guides = searchGuideGroups(query, perGroupLimit);

  const byCategory: Partial<
    Record<SearchCategory, { results: SearchGroup["results"]; total: number }>
  > = Object.fromEntries(
    light.map((group) => [group.category, { results: group.results, total: group.total }]),
  );

  byCategory.learn = guides.learn;

  return SEARCH_CATEGORY_ORDER.map((category) => {
    const slot = byCategory[category];
    return slot ? { category, ...slot } : null;
  }).filter((group): group is SearchGroup => group != null && group.total > 0);
}
