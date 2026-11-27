import { describe, expect, expectTypeOf, it } from "vitest";

import { CONTENT_REPORT_KINDS, type ContentReportKind } from "./content-report";

describe("content report kinds", () => {
  it("lists every ContentReportKind exactly once", () => {
    const all = {
      quran_ayah: 1,
      hadith: 1,
      dua: 1,
      zikr: 1,
      durood: 1,
      name: 1,
      salah_guide: 1,
      jannah: 1,
      battles: 1,
      learn_quran: 1,
      learn_dua: 1,
      taharah: 1,
      prophets: 1,
      aqeedah: 1,
      zakat: 1,
      seerah: 1,
      hajj: 1,
      travel: 1,
      excused: 1,
      jahannam: 1,
      last_day: 1,
      screen: 1,
    } satisfies Record<ContentReportKind, 1>;
    expect([...CONTENT_REPORT_KINDS].sort()).toEqual(Object.keys(all).sort());
    expect(new Set(CONTENT_REPORT_KINDS).size).toBe(CONTENT_REPORT_KINDS.length);
  });

  it("has dedicated Jahannam and Last Day kinds and keeps the generic screen kind", () => {
    expectTypeOf<"jahannam">().toMatchTypeOf<ContentReportKind>();
    expectTypeOf<"last_day">().toMatchTypeOf<ContentReportKind>();
    expect(CONTENT_REPORT_KINDS).toEqual(
      expect.arrayContaining(["jahannam", "last_day", "screen"]),
    );
  });
});
