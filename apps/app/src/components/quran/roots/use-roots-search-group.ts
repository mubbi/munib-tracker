import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  lemmaCount,
  parseRootQuery,
  rootCount,
  rootToArabic,
  searchRoots,
} from "@/lib/quran-roots";
import type { SearchGroup } from "@/lib/search-types";
import { useEnsureRootIndex, useRootIndex } from "@/stores/quran-roots-store";

/** Arabic input of 2–4 letters (spaced or not) — the only input that adds the group. */
export function isArabicRootLikeQuery(query: string): boolean {
  const parsed = parseRootQuery(query);
  return parsed.kind === "root" && parsed.script === "arabic";
}

/**
 * Universal search "Root" group (NF-3.22): shown at the top when Arabic input of
 * 2–4 letters is a root in the on-device index. Uses the index only when it is
 * already on this device — universal search never starts the download.
 */
export function useQuranRootsSearchGroup(query: string): SearchGroup | null {
  const { t } = useTranslation();
  const rootLike = isArabicRootLikeQuery(query);
  useEnsureRootIndex(rootLike);
  const index = useRootIndex();
  return useMemo(() => {
    if (!rootLike || !index) return null;
    const lookup = searchRoots(index, query);
    if (lookup.kind !== "roots" || lookup.via !== "root") return null;
    return {
      category: "roots",
      total: lookup.roots.length,
      results: lookup.roots.map((root) => ({
        key: `roots:${root}`,
        category: "roots",
        title: rootToArabic(root),
        arabic: rootToArabic(root),
        subtitle: t("quranRoots.lemmaCount", { count: lemmaCount(index, root) }),
        badge: t("quranRoots.occurrences", { count: rootCount(index, root) }),
        href: "/quran/roots/[root]",
        params: { root },
      })),
    };
  }, [index, query, rootLike, t]);
}
