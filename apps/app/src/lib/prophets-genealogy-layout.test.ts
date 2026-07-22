import { describe, expect, it } from "@jest/globals";
import {
  PROPHETS_GENEALOGY_BRANCH_ORDER,
  PROPHETS_GENEALOGY_NODES,
} from "@munib-tracker/shared/content/prophets-genealogy";
import {
  genealogyLineageIds,
  genealogyMonogram,
  layoutProphetsGenealogy,
  parentEdgePath,
} from "@/lib/prophets-genealogy-layout";

describe("prophets genealogy layout", () => {
  it("places every node without overlap identity collisions", () => {
    const layout = layoutProphetsGenealogy(
      PROPHETS_GENEALOGY_NODES,
      PROPHETS_GENEALOGY_BRANCH_ORDER,
    );
    expect(layout.positions).toHaveLength(PROPHETS_GENEALOGY_NODES.length);
    expect(layout.width).toBeGreaterThan(200);
    expect(layout.height).toBeGreaterThan(100);
    const ids = layout.positions.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("draws parent edges for Qur'anic children and a sibling edge for Musa–Harun", () => {
    const layout = layoutProphetsGenealogy(
      PROPHETS_GENEALOGY_NODES,
      PROPHETS_GENEALOGY_BRANCH_ORDER,
    );
    const parentEdges = layout.edges.filter((e) => e.kind === "parent");
    const siblingEdges = layout.edges.filter((e) => e.kind === "sibling");
    expect(parentEdges.some((e) => e.fromId === "ibrahim" && e.toId === "ismail")).toBe(true);
    expect(parentEdges.some((e) => e.fromId === "ibrahim" && e.toId === "ishaq")).toBe(true);
    expect(parentEdges.some((e) => e.fromId === "ishaq" && e.toId === "yaqub")).toBe(true);
    expect(parentEdges.some((e) => e.fromId === "maryam" && e.toId === "isa")).toBe(true);
    expect(parentEdges.some((e) => e.fromId === "imran" && e.toId === "maryam")).toBe(true);
    expect(parentEdges.some((e) => e.fromId === "hashim" && e.toId === "abd-al-muttalib")).toBe(
      true,
    );
    expect(parentEdges.some((e) => e.fromId === "abdullah" && e.toId === "muhammad")).toBe(true);
    expect(siblingEdges.some((e) => e.fromId === "musa" && e.toId === "harun")).toBe(true);
  });

  it("puts children below their parents", () => {
    const layout = layoutProphetsGenealogy(
      PROPHETS_GENEALOGY_NODES,
      PROPHETS_GENEALOGY_BRANCH_ORDER,
    );
    const ibrahim = layout.byId.ibrahim;
    const ismail = layout.byId.ismail;
    expect(ibrahim && ismail).toBeTruthy();
    if (!ibrahim || !ismail) return;
    expect(ismail.y).toBeGreaterThan(ibrahim.y);
  });

  it("builds a soft cubic parent edge", () => {
    const from = {
      id: "a",
      x: 0,
      y: 0,
      width: 100,
      height: 40,
      depth: 0,
      branch: "ibrahim" as const,
    };
    const to = {
      id: "b",
      x: 40,
      y: 120,
      width: 100,
      height: 40,
      depth: 1,
      branch: "ibrahim" as const,
    };
    expect(parentEdgePath(from, to)).toContain("C ");
  });

  it("highlights Yusuf lineage through Yaqub → Ishaq → Ibrahim", () => {
    const ids = genealogyLineageIds("yusuf", PROPHETS_GENEALOGY_NODES);
    expect(ids.has("yusuf")).toBe(true);
    expect(ids.has("yaqub")).toBe(true);
    expect(ids.has("ishaq")).toBe(true);
    expect(ids.has("ibrahim")).toBe(true);
  });

  it("includes Harun when Musa is selected", () => {
    const ids = genealogyLineageIds("musa", PROPHETS_GENEALOGY_NODES);
    expect(ids.has("musa")).toBe(true);
    expect(ids.has("harun")).toBe(true);
  });

  it("builds monograms from the first letter", () => {
    expect(genealogyMonogram("Ibrahim")).toBe("I");
    expect(genealogyMonogram("  yaqub")).toBe("Y");
  });
});
