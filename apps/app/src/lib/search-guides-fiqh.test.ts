import { getFiqhDifference } from "@munib-tracker/shared/fiqh";

import i18n from "@/i18n";
import { fiqhDifferenceSearchTopic, searchGuideGroups } from "@/lib/search-guides";

/** NF-3.0a §4.1.4 "Search": the difference catalog is indexed and opens `/fiqh/[id]`. */
function fiqhHits(query: string) {
  return searchGuideGroups(query, 200).learn.results.filter((r) => r.href === "/fiqh/[id]");
}

describe("fiqh difference search", () => {
  it.each([
    ["witr wajib", "witr-status"],
    ["qasr distance", "qasr-distance"],
    ["tawarruk", "salah-lastSitting"],
    ["muwalat", "wudu-muwalat"],
  ])('"%s" finds the comparison card %s', (query, slug) => {
    const hits = fiqhHits(query);
    expect(hits.map((h) => h.params?.id)).toContain(slug);
    const hit = hits.find((h) => h.params?.id === slug);
    expect(hit).toMatchObject({
      category: "learn",
      badge: "Fiqh",
      key: `learn:/fiqh/[id]:${slug}`,
    });
  });

  it("indexes the title, every school's position and the school names", () => {
    const doc = fiqhDifferenceSearchTopic(getFiqhDifference("witr.status"), (k) => i18n.t(k));
    expect(doc.id).toBe("witr-status");
    expect(doc.title).toBe("Ruling of Witr");
    const body = doc.body.join(" ");
    expect(body).toContain("Hanafi Wajib");
    expect(body).toContain("Hanbali Sunnah mu'akkadah");
  });

  it("does not match unrelated queries", () => {
    expect(fiqhHits("surah kahf friday")).toEqual([]);
  });
});
