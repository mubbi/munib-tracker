import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import {
  getGenealogyChildren,
  getGenealogySiblings,
  getProphetsGenealogyBranchOrder,
  getProphetsGenealogyByBranch,
  getProphetsGenealogyNodes,
  resetProphetsGenealogySearchIndex,
  searchProphetsGenealogy,
} from "@/lib/prophets-genealogy";
import { mockLocalizeList, resetContentI18nMock } from "@/test-support/mocks/content-i18n";

jest.mock("@/lib/content-i18n", () => require("@/test-support/mocks/content-i18n").contentI18nMock);
const localizeList = mockLocalizeList;

afterEach(resetContentI18nMock);

const node = (over: Partial<ProphetsGenealogyNode>): ProphetsGenealogyNode =>
  ({
    id: "n",
    name: "Name",
    branch: "adam",
    relationNote: "",
    sources: [],
    ...over,
  }) as ProphetsGenealogyNode;

beforeEach(() => resetProphetsGenealogySearchIndex());

describe("prophets genealogy", () => {
  it("groups real nodes by branch", () => {
    const nodes = getProphetsGenealogyNodes();
    const grouped = getProphetsGenealogyByBranch();
    expect(Object.keys(grouped)).toEqual([...getProphetsGenealogyBranchOrder()]);
    expect(Object.values(grouped).flat()).toHaveLength(nodes.length);
  });

  it("drops nodes on unknown branches", () => {
    localizeList.mockImplementationOnce(() => [node({ branch: "nowhere" as never })]);
    expect(Object.values(getProphetsGenealogyByBranch()).flat()).toEqual([]);
  });

  it("finds children and siblings", () => {
    const nodes = [
      node({ id: "a" }),
      node({ id: "b", parentId: "a" }),
      node({ id: "c", parentId: "a" }),
      node({ id: "d", siblingOf: "b" }),
    ];
    expect(getGenealogyChildren(nodes, "a").map((n) => n.id)).toEqual(["b", "c"]);
    expect(getGenealogySiblings(nodes, "b").map((n) => n.id)).toEqual(["d"]);
    expect(getGenealogyChildren(nodes, "z")).toEqual([]);
  });

  it("returns every node for a blank query", () => {
    const nodes = [node({ id: "a" })];
    expect(searchProphetsGenealogy("   ", 10, nodes)).toBe(nodes);
  });

  it("fuzzy searches names, notes and sources, rebuilding on list change", () => {
    const nodes = [
      node({ id: "ibrahim", name: "Ibrahim", sources: ["Qur'an 2:124"] }),
      node({ id: "musa", name: "Musa", relationNote: "brother of Harun" }),
    ];
    expect(searchProphetsGenealogy("Ibrahim", 10, nodes).map((n) => n.id)).toEqual(["ibrahim"]);
    expect(searchProphetsGenealogy("Harun", 10, nodes).map((n) => n.id)).toEqual(["musa"]);
    const renamed = [node({ id: "yusuf", name: "Yusuf" })];
    expect(searchProphetsGenealogy("Yusuf", 10, renamed).map((n) => n.id)).toEqual(["yusuf"]);
  });

  it("searches the localized real list by default", () => {
    const [first] = getProphetsGenealogyNodes();
    const hits = searchProphetsGenealogy(first.name);
    expect(hits.map((n) => n.id)).toContain(first.id);
  });
});
