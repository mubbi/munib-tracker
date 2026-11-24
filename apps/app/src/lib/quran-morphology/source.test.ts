import { readQacFixture } from "@/test-support/quran-morphology";

import {
  MorphologyError,
  morphologyTextHash,
  normalizeLineEndings,
  QAC_MORPHOLOGY,
  toMorphologyErrorCode,
  verifyMorphologyText,
  verifyMorphologyTextChunked,
} from "./source";

const lf = readQacFixture();
const expected = morphologyTextHash(lf);
const noYield = async () => {};

describe("morphology hash verification", () => {
  it("pins the D22 hash and both mirrors", () => {
    expect(QAC_MORPHOLOGY.sha256).toMatch(/^910b721a[0-9a-f]{52}532d$/);
    expect(QAC_MORPHOLOGY.sources).toHaveLength(2);
    for (const url of QAC_MORPHOLOGY.sources) expect(url).toMatch(/\/[0-9a-f]{40}\//);
  });

  it("accepts the LF copy and returns it unchanged", () => {
    expect(verifyMorphologyText(lf, expected)).toBe(lf);
  });

  it("accepts a CRLF copy (same hash after stripping \\r)", () => {
    const crlf = lf.replace(/\n/g, "\r\n");
    expect(normalizeLineEndings(crlf)).toBe(lf);
    expect(verifyMorphologyText(crlf, expected)).toBe(lf);
  });

  it("rejects a copy with one changed byte with the typed error", () => {
    const changed = lf.replace("ROOT:rHm", "ROOT:rHn");
    expect(() => verifyMorphologyText(changed, expected)).toThrow(MorphologyError);
    try {
      verifyMorphologyText(changed, expected);
    } catch (error) {
      expect(toMorphologyErrorCode(error)).toBe("morphology-hash");
    }
  });

  it("verifies in chunks with the same result", async () => {
    await expect(
      verifyMorphologyTextChunked(lf.replace(/\n/g, "\r\n"), noYield, expected),
    ).resolves.toBe(lf);
    await expect(verifyMorphologyTextChunked(`${lf}x`, noYield, expected)).rejects.toMatchObject({
      code: "morphology-hash",
    });
  });

  it("maps unknown errors to download-failed", () => {
    expect(toMorphologyErrorCode(new Error("boom"))).toBe("download-failed");
  });
});
