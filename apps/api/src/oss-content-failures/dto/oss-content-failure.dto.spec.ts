import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { describe, expect, it } from "vitest";
import { ReportOssContentDownloadFailureDto } from "./oss-content-failure.dto";

function makeReport(sourceUrl: string) {
  return plainToInstance(ReportOssContentDownloadFailureDto, {
    contentKind: "quran_edition",
    contentKey: "quran_edition:en-saheehintl:2",
    sourceProvider: "fawazahmed0/quran-api",
    sourceUrl,
    contentMeta: {},
    errorCode: "network_error",
    errorMessage: "timeout",
    appVersion: "1.0.0",
    platform: "ios",
  });
}

function sourceUrlErrors(sourceUrl: string) {
  return validateSync(makeReport(sourceUrl)).filter((e) => e.property === "sourceUrl");
}

describe("ReportOssContentDownloadFailureDto.sourceUrl", () => {
  it.each([
    "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-x/2.json",
    "http://localhost:8081/x.json",
  ])("accepts http(s) URL %s", (url) => {
    expect(sourceUrlErrors(url)).toHaveLength(0);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "JaVaScRiPt://%0aalert(1)",
    "//evil.example/x",
    "https://cdn.example/a b",
  ])("rejects non-http(s) value %s (rendered as a link in admin)", (url) => {
    expect(sourceUrlErrors(url).length).toBeGreaterThan(0);
  });
});
