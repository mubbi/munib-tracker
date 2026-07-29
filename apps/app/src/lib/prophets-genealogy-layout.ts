import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";

export const GENEALOGY_NODE_WIDTH = 228;
export const GENEALOGY_NODE_HEIGHT = 96;
export const GENEALOGY_H_GAP = 48;
export const GENEALOGY_V_GAP = 108;
export const GENEALOGY_COMPONENT_GAP = 88;
export const GENEALOGY_PAD = 56;

export type GenealogyLayoutPosition = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  branch: ProphetsGenealogyNode["branch"];
};

export type GenealogyLayoutEdge = {
  id: string;
  fromId: string;
  toId: string;
  kind: "parent" | "sibling";
  certainty: ProphetsGenealogyNode["certainty"];
};

export type GenealogyTreeLayout = {
  positions: GenealogyLayoutPosition[];
  byId: Record<string, GenealogyLayoutPosition>;
  edges: GenealogyLayoutEdge[];
  width: number;
  height: number;
};

function childrenOf(
  nodes: readonly ProphetsGenealogyNode[],
  parentId: string,
): ProphetsGenealogyNode[] {
  return nodes.filter((n) => n.parentId === parentId);
}

/** Sibling partners that should sit beside a root (e.g. Harun beside Musa). */
function siblingPeers(
  nodes: readonly ProphetsGenealogyNode[],
  nodeId: string,
): ProphetsGenealogyNode[] {
  return nodes.filter((n) => n.siblingOf === nodeId && !n.parentId);
}

/**
 * Top-down tree layout for the prophets genealogy forest.
 * Roots are ordered by branch order; siblings without a parent sit beside their peer.
 */
export function layoutProphetsGenealogy(
  nodes: readonly ProphetsGenealogyNode[],
  branchOrder: readonly ProphetsGenealogyNode["branch"][],
): GenealogyTreeLayout {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const placed = new Set<string>();
  const positions: GenealogyLayoutPosition[] = [];
  const edges: GenealogyLayoutEdge[] = [];

  const subtreeWidth = (id: string): number => {
    const kids = childrenOf(nodes, id);
    if (kids.length === 0) return GENEALOGY_NODE_WIDTH;
    let sum = 0;
    for (let i = 0; i < kids.length; i++) {
      sum += subtreeWidth(kids[i].id);
      if (i < kids.length - 1) sum += GENEALOGY_H_GAP;
    }
    return Math.max(GENEALOGY_NODE_WIDTH, sum);
  };

  const placeNode = (id: string, left: number, depth: number): number => {
    const node = byId[id];
    if (!node) return left;
    const kids = childrenOf(nodes, id);
    const y = GENEALOGY_PAD + depth * (GENEALOGY_NODE_HEIGHT + GENEALOGY_V_GAP);
    const right = left + GENEALOGY_NODE_WIDTH;

    if (kids.length === 0) {
      positions.push({
        id,
        x: left,
        y,
        width: GENEALOGY_NODE_WIDTH,
        height: GENEALOGY_NODE_HEIGHT,
        depth,
        branch: node.branch,
      });
      placed.add(id);
      return right;
    }

    let cursor = left;
    for (let i = 0; i < kids.length; i++) {
      cursor = placeNode(kids[i].id, cursor, depth + 1) + GENEALOGY_H_GAP;
    }
    cursor -= GENEALOGY_H_GAP;

    const firstChild = positions.find((p) => p.id === kids[0].id);
    const lastChild = positions.find((p) => p.id === kids[kids.length - 1].id);
    const midX =
      firstChild && lastChild
        ? (firstChild.x + lastChild.x + GENEALOGY_NODE_WIDTH) / 2 - GENEALOGY_NODE_WIDTH / 2
        : left;
    const x = Math.max(left, midX);

    positions.push({
      id,
      x,
      y,
      width: GENEALOGY_NODE_WIDTH,
      height: GENEALOGY_NODE_HEIGHT,
      depth,
      branch: node.branch,
    });
    placed.add(id);

    for (const kid of kids) {
      edges.push({
        id: `${id}->${kid.id}`,
        fromId: id,
        toId: kid.id,
        kind: "parent",
        certainty: kid.certainty,
      });
    }

    return Math.max(cursor, x + GENEALOGY_NODE_WIDTH, right);
  };

  /** Roots: no parent, and not a sibling-of peer (those hang beside their partner). */
  const roots = nodes.filter((n) => !n.parentId && !n.siblingOf);
  roots.sort((a, b) => {
    const ai = branchOrder.indexOf(a.branch);
    const bi = branchOrder.indexOf(b.branch);
    if (ai !== bi) return ai - bi;
    return a.id.localeCompare(b.id);
  });

  let cursorX = GENEALOGY_PAD;
  for (const root of roots) {
    if (placed.has(root.id)) continue;

    const peers = siblingPeers(nodes, root.id);
    const unitWidth =
      peers.length === 0
        ? subtreeWidth(root.id)
        : subtreeWidth(root.id) +
          peers.reduce((sum, p) => sum + GENEALOGY_H_GAP + subtreeWidth(p.id), 0);

    let localLeft = cursorX;
    localLeft = placeNode(root.id, localLeft, 0);

    for (const peer of peers) {
      localLeft += GENEALOGY_H_GAP;
      const peerStart = localLeft;
      localLeft = placeNode(peer.id, peerStart, 0);
      edges.push({
        id: `${root.id}~${peer.id}`,
        fromId: root.id,
        toId: peer.id,
        kind: "sibling",
        certainty: peer.certainty,
      });
    }

    cursorX = Math.max(cursorX + unitWidth, localLeft) + GENEALOGY_COMPONENT_GAP;
  }

  // Any orphan still unplaced (defensive).
  for (const node of nodes) {
    if (placed.has(node.id)) continue;
    placeNode(node.id, cursorX, 0);
    cursorX += GENEALOGY_NODE_WIDTH + GENEALOGY_COMPONENT_GAP;
  }

  let maxX = 0;
  let maxY = 0;
  const map: Record<string, GenealogyLayoutPosition> = {};
  for (const p of positions) {
    map[p.id] = p;
    maxX = Math.max(maxX, p.x + p.width);
    maxY = Math.max(maxY, p.y + p.height);
  }

  return {
    positions,
    byId: map,
    edges,
    width: maxX + GENEALOGY_PAD,
    height: maxY + GENEALOGY_PAD,
  };
}

/** Soft cubic from parent bottom-center to child top-center. */
export function parentEdgePath(from: GenealogyLayoutPosition, to: GenealogyLayoutPosition): string {
  const x1 = from.x + from.width / 2;
  const y1 = from.y + from.height;
  const x2 = to.x + to.width / 2;
  const y2 = to.y;
  const midY = y1 + (y2 - y1) * 0.55;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

/** Slight arch between sibling midpoints so the band reads as a bond, not a grid line. */
export function siblingEdgePath(
  from: GenealogyLayoutPosition,
  to: GenealogyLayoutPosition,
): string {
  const y = from.y + from.height / 2;
  const x1 = from.x + from.width;
  const x2 = to.x;
  const midX = (x1 + x2) / 2;
  const arch = Math.min(14, Math.abs(x2 - x1) * 0.12);
  return `M ${x1} ${y} Q ${midX} ${y - arch}, ${x2} ${y}`;
}

/** Walk parent links from `nodeId` up to a root (inclusive). */
export function genealogyAncestorIds(
  nodeId: string,
  nodes: readonly ProphetsGenealogyNode[],
): Set<string> {
  const byId: Record<string, ProphetsGenealogyNode> = Object.fromEntries(
    nodes.map((n) => [n.id, n]),
  );
  const ids = new Set<string>();
  let cur: string | null | undefined = nodeId;
  while (cur) {
    const node: ProphetsGenealogyNode | undefined = byId[cur];
    if (!node) break;
    ids.add(cur);
    cur = node.parentId ?? node.siblingOf ?? null;
  }
  return ids;
}

/** Ancestor chain plus sibling peers (e.g. Musa ↔ Harun) for path emphasis. */
export function genealogyLineageIds(
  nodeId: string,
  nodes: readonly ProphetsGenealogyNode[],
): Set<string> {
  const ids = genealogyAncestorIds(nodeId, nodes);
  for (const n of nodes) {
    if (n.siblingOf && ids.has(n.siblingOf)) ids.add(n.id);
  }
  return ids;
}

/** First letter for monogram avatars (skips leading punctuation). */
export function genealogyMonogram(name: string): string {
  const trimmed = name.trim();
  const match = trimmed.match(/[\p{L}\p{N}]/u);
  return (match?.[0] ?? "?").toLocaleUpperCase();
}
