import {
  PROPHETS_GENEALOGY_BRANCH_ORDER,
  PROPHETS_GENEALOGY_NODES,
} from "@munib-tracker/shared/content/prophets-genealogy";
import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";
import { createFuzzyIndex, type FuzzyIndex } from "@/lib/search";

type GenealogyBranch = (typeof PROPHETS_GENEALOGY_BRANCH_ORDER)[number];

export function getProphetsGenealogyNodes(): ProphetsGenealogyNode[] {
  return localizeList(PROPHETS_GENEALOGY_NODES, overlayList("PROPHETS_GENEALOGY_NODES"));
}

export function getProphetsGenealogyBranchOrder(): readonly GenealogyBranch[] {
  return PROPHETS_GENEALOGY_BRANCH_ORDER;
}

export function getProphetsGenealogyByBranch(): Record<GenealogyBranch, ProphetsGenealogyNode[]> {
  const grouped = Object.fromEntries(
    PROPHETS_GENEALOGY_BRANCH_ORDER.map((branch) => [branch, [] as ProphetsGenealogyNode[]]),
  ) as Record<GenealogyBranch, ProphetsGenealogyNode[]>;
  for (const node of getProphetsGenealogyNodes()) {
    const bucket = grouped[node.branch as GenealogyBranch];
    if (bucket) bucket.push(node);
  }
  return grouped;
}

/** Children of a node (parentId match). Siblings are not included. */
export function getGenealogyChildren(
  nodes: ProphetsGenealogyNode[],
  parentId: string,
): ProphetsGenealogyNode[] {
  return nodes.filter((n) => n.parentId === parentId);
}

export function getGenealogySiblings(
  nodes: ProphetsGenealogyNode[],
  nodeId: string,
): ProphetsGenealogyNode[] {
  return nodes.filter((n) => n.siblingOf === nodeId);
}

let genealogySearchIndex: FuzzyIndex<ProphetsGenealogyNode> | null = null;
let genealogySearchLocale = "";

export function searchProphetsGenealogy(
  query: string,
  limit = 40,
  nodes: ProphetsGenealogyNode[] = getProphetsGenealogyNodes(),
): ProphetsGenealogyNode[] {
  const q = query.trim();
  if (!q) return nodes;
  // Rebuild when the node list identity changes (locale overlays).
  const localeKey = nodes.map((n) => n.name).join("|");
  if (!genealogySearchIndex || genealogySearchLocale !== localeKey) {
    genealogySearchIndex = createFuzzyIndex(nodes, [
      { key: "name", weight: 5, get: (n) => n.name },
      { key: "relationNote", weight: 2, get: (n) => n.relationNote },
      { key: "sources", weight: 1, get: (n) => n.sources.join(" ") },
    ]);
    genealogySearchLocale = localeKey;
  }
  return genealogySearchIndex.search(q, limit);
}

/** Call when locale overlays change so Fuse rebuilds against localized names. */
export function resetProphetsGenealogySearchIndex(): void {
  genealogySearchIndex = null;
  genealogySearchLocale = "";
}
