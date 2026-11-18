import { buildContentReportRef } from "@/lib/content-report-ref";

describe("buildContentReportRef", () => {
  it("builds a reference without optional fields", () => {
    expect(buildContentReportRef("dua", "dua-1", "/dua/detail/dua-1", "en")).toEqual({
      kind: "dua",
      contentId: "dua-1",
      parentId: undefined,
      route: "/dua/detail/dua-1",
      locale: "en",
      snapshot: undefined,
    });
  });

  it("carries the parent id and snapshot", () => {
    const snapshot = { title: "Morning dua" } as never;
    expect(
      buildContentReportRef("hadith", "h1", "/hadith/bukhari", "ur", {
        parentId: "bukhari",
        snapshot,
      }),
    ).toMatchObject({ parentId: "bukhari", snapshot });
  });
});
