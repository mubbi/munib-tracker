import { CONTENT_REPORT_KINDS as SHARED_CONTENT_REPORT_KINDS } from "@munib-tracker/shared/types/content-report";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";

import { CONTENT_REPORT_KINDS, ContentReportReferenceDto } from "./content-report.dto";

const reference = (kind: string) =>
  plainToInstance(ContentReportReferenceDto, {
    kind,
    contentId: "fire-depths",
    route: "/jahannam/fire-depths",
    locale: "en",
  });

describe("ContentReportReferenceDto kind", () => {
  it("mirrors the shared ContentReportKind list", () => {
    expect([...CONTENT_REPORT_KINDS]).toEqual([...SHARED_CONTENT_REPORT_KINDS]);
  });

  it.each(["jahannam", "last_day", "screen", "jannah"])("accepts %s", (kind) => {
    expect(validateSync(reference(kind))).toHaveLength(0);
  });

  it.each(["last-day", "learn_jahannam", "", "SCREEN"])("rejects %j", (kind) => {
    expect(validateSync(reference(kind)).map((e) => e.property)).toEqual(["kind"]);
  });
});
