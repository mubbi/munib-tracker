import type { AyahNote } from "@munib-tracker/shared/types";

import { createQuranNotesSearch, filterQuranNotes } from "./notes-search";

const at = "2026-11-01T00:00:00.000Z";
const notes: AyahNote[] = [
  {
    id: "a",
    surah: 38,
    ayah: 29,
    body: "Reflect on its verses daily",
    tags: ["tadabbur"],
    color: "gold",
    createdAt: at,
    updatedAt: at,
  },
  {
    id: "b",
    surah: 47,
    ayah: 24,
    body: "Hearts and locks",
    tags: ["heart"],
    createdAt: at,
    updatedAt: at,
  },
  {
    id: "c",
    surah: 2,
    ayah: 255,
    body: "آیت الکرسی کی حفاظت",
    tags: ["protection"],
    color: "green",
    createdAt: at,
    updatedAt: at,
  },
];

describe("quran notes search", () => {
  const index = createQuranNotesSearch(notes);

  it("finds notes by body, tag and ref", () => {
    expect(
      filterQuranNotes(notes, index, { query: "reflect", tag: null, color: null }).map((n) => n.id),
    ).toEqual(["a"]);
    expect(
      filterQuranNotes(notes, index, { query: "heart", tag: null, color: null }).map((n) => n.id),
    ).toContain("b");
    expect(
      filterQuranNotes(notes, index, { query: "الکرسی", tag: null, color: null }).map((n) => n.id),
    ).toEqual(["c"]);
  });

  it("filters by tag and colour without a query", () => {
    expect(
      filterQuranNotes(notes, index, { query: "", tag: "protection", color: null }).map(
        (n) => n.id,
      ),
    ).toEqual(["c"]);
    expect(
      filterQuranNotes(notes, index, { query: "", tag: null, color: "gold" }).map((n) => n.id),
    ).toEqual(["a"]);
    expect(filterQuranNotes(notes, index, { query: "", tag: null, color: null })).toHaveLength(3);
  });
});
