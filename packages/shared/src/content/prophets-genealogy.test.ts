import { describe, expect, it } from "vitest";

import {
  PROPHETS_GENEALOGY_BRANCH_ORDER,
  PROPHETS_GENEALOGY_CONTENT_VERSION,
  PROPHETS_GENEALOGY_NODES,
} from "./prophets-genealogy";

describe("prophets genealogy content", () => {
  it("has a positive content version", () => {
    expect(PROPHETS_GENEALOGY_CONTENT_VERSION).toBeGreaterThan(0);
  });

  it("gives every node a unique id", () => {
    const ids = PROPHETS_GENEALOGY_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every declared branch", () => {
    for (const branch of PROPHETS_GENEALOGY_BRANCH_ORDER) {
      expect(
        PROPHETS_GENEALOGY_NODES.some((n) => n.branch === branch),
        branch,
      ).toBe(true);
    }
  });

  it("only references known parent ids", () => {
    const ids = new Set(PROPHETS_GENEALOGY_NODES.map((n) => n.id));
    for (const node of PROPHETS_GENEALOGY_NODES) {
      if (node.parentId) {
        expect(ids.has(node.parentId), `${node.id} → ${node.parentId}`).toBe(true);
      }
      expect(node.sources.length, node.id).toBeGreaterThan(0);
      expect(node.relationNote.trim().length, node.id).toBeGreaterThan(0);
    }
  });

  it("includes firm Qur'anic parent edges: Ibrahim→Ismail/Ishaq, Ishaq→Yaqub, Yaqub→Yusuf, Dawud→Sulayman, Zakariyya→Yahya, Imran→Maryam→Isa", () => {
    const byId = new Map(PROPHETS_GENEALOGY_NODES.map((n) => [n.id, n]));
    const requireNode = (id: string) => {
      const node = byId.get(id);
      if (!node) throw new Error(`missing genealogy node: ${id}`);
      return node;
    };
    expect(requireNode("ismail").parentId).toBe("ibrahim");
    expect(requireNode("ismail").certainty).toBe("quran");
    expect(requireNode("ishaq").parentId).toBe("ibrahim");
    expect(requireNode("yaqub").parentId).toBe("ishaq");
    expect(requireNode("yusuf").parentId).toBe("yaqub");
    expect(requireNode("sulayman").parentId).toBe("dawud");
    expect(requireNode("yahya").parentId).toBe("zakariyya");
    expect(requireNode("maryam").parentId).toBe("imran");
    expect(requireNode("maryam").certainty).toBe("quran");
    expect(requireNode("isa").parentId).toBe("maryam");
    expect(requireNode("isa").certainty).toBe("quran");
  });

  it("does not invent a human father for Isa", () => {
    const isa = PROPHETS_GENEALOGY_NODES.find((n) => n.id === "isa");
    expect(isa?.parentId).toBe("maryam");
    expect(isa?.relationNote.toLowerCase()).toMatch(/without a human father|no human father/);
  });

  it("adds classical Hashim→Muhammad spine and does not invent Adnan→Ismail parent edge", () => {
    const byId = new Map(PROPHETS_GENEALOGY_NODES.map((n) => [n.id, n]));
    expect(byId.get("sheeth")?.parentId).toBe("adam");
    expect(byId.get("idris")?.parentId ?? null).toBeNull();
    expect(byId.get("adnan")?.parentId ?? null).toBeNull();
    expect(byId.get("hashim")?.parentId ?? null).toBeNull();
    expect(byId.get("abd-al-muttalib")?.parentId).toBe("hashim");
    expect(byId.get("abdullah")?.parentId).toBe("abd-al-muttalib");
    expect(byId.get("muhammad")?.parentId).toBe("abdullah");
  });

  it("does not draw Isra'iliyyat Adam→Ibrahim intermediate names as nodes", () => {
    const ids = new Set(PROPHETS_GENEALOGY_NODES.map((n) => n.id));
    for (const speculative of ["sam", "lamik", "azar", "nahur", "arfakhshadh", "anush", "qinan"]) {
      expect(ids.has(speculative), speculative).toBe(false);
    }
  });
});
