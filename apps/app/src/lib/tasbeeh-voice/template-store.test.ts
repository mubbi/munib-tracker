import { FEATURE_DIM, FEATURE_VERSION } from "./features";
import {
  base64ToBytes,
  bytesToBase64,
  capPatterns,
  decodePattern,
  encodePattern,
  MAX_TAUGHT_ZIKRS,
  type StoredPatterns,
  sanitizeStoredPatterns,
  toStoredFile,
} from "./template-store";

function matrix(frames: number, seed = 1) {
  const data = new Float32Array(frames * FEATURE_DIM);
  for (let i = 0; i < data.length; i++) data[i] = Math.sin(i * 0.37 + seed) * 3;
  return { frames, dim: FEATURE_DIM, data };
}

describe("taught voice pattern storage (D48)", () => {
  it("round-trips base64", () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 255, 128, 7]);
    for (let n = 0; n <= bytes.length; n++) {
      const sub = bytes.subarray(0, n);
      expect(Array.from(base64ToBytes(bytesToBase64(sub)) ?? [])).toEqual(Array.from(sub));
    }
    expect(base64ToBytes("not*base64")).toBeNull();
  });

  it("keeps numbers only, quantised to within one step", () => {
    const pattern = { templates: [matrix(40), matrix(35, 2)], threshold: 0.5 };
    const stored = encodePattern(pattern, "2026-11-24T00:00:00.000Z");
    expect(Object.keys(stored).sort()).toEqual(["at", "templates", "threshold"]);
    const back = decodePattern(stored);
    expect(back?.threshold).toBe(0.5);
    expect(back?.templates).toHaveLength(2);
    const a = pattern.templates[0].data;
    const b = back?.templates[0].data ?? new Float32Array();
    let worst = 0;
    for (let i = 0; i < a.length; i++) worst = Math.max(worst, Math.abs(a[i] - b[i]));
    expect(worst).toBeLessThanOrEqual(1 / 16 / 2 + 1e-6);
  });

  it("drops patterns from another feature recipe and malformed entries", () => {
    const good = encodePattern({ templates: [matrix(20)], threshold: 0.5 }, "2026-11-24T00:00:00Z");
    expect(sanitizeStoredPatterns({ fv: FEATURE_VERSION + 1, zikrs: { "zikr:a": good } })).toEqual(
      {},
    );
    expect(sanitizeStoredPatterns(null)).toEqual({});
    expect(
      sanitizeStoredPatterns(
        toStoredFile({ "zikr:a": good, "zikr:b": { ...good, threshold: "x" } as never }),
      ),
    ).toEqual({ "zikr:a": good });
    expect(
      decodePattern({ ...good, templates: [{ frames: 99, q: good.templates[0].q }] }),
    ).toBeNull();
  });

  it(`keeps the ${MAX_TAUGHT_ZIKRS} most recently taught zikr`, () => {
    const patterns: StoredPatterns = {};
    for (let i = 0; i < MAX_TAUGHT_ZIKRS + 3; i++) {
      const at = new Date(Date.UTC(2026, 0, 1 + i)).toISOString();
      patterns[`zikr:${i}`] = encodePattern({ templates: [matrix(5)], threshold: 0.5 }, at);
    }
    const kept = capPatterns(patterns);
    expect(Object.keys(kept)).toHaveLength(MAX_TAUGHT_ZIKRS);
    expect(kept["zikr:0"]).toBeUndefined();
    expect(kept[`zikr:${MAX_TAUGHT_ZIKRS + 2}`]).toBeDefined();
  });

  it("keeps learned templates beside the taught ones, and old data reads unchanged", () => {
    const learned = [matrix(30, 3), matrix(31, 4)];
    const stored = encodePattern(
      { templates: [matrix(40)], threshold: 0.6, learned },
      "2026-11-26T00:00:00.000Z",
    );
    expect(stored.templates).toHaveLength(1);
    expect(stored.learned).toHaveLength(2);
    const back = decodePattern(stored);
    expect(back?.learned).toHaveLength(2);
    expect(back?.templates).toHaveLength(1);
    // Data written before adaptive templates (no `learned`) is still a valid pattern.
    const legacy = { templates: stored.templates, threshold: 0.6, at: stored.at };
    expect(sanitizeStoredPatterns(toStoredFile({ "zikr:a": legacy }))).toEqual({
      "zikr:a": legacy,
    });
    expect(decodePattern(legacy)?.learned).toBeUndefined();
  });

  it("drops only a malformed learned list, never the taught pattern", () => {
    const stored = encodePattern(
      { templates: [matrix(20)], threshold: 0.5 },
      "2026-11-24T00:00:00Z",
    );
    const broken = { ...stored, learned: [{ frames: "x" }] } as never;
    expect(sanitizeStoredPatterns(toStoredFile({ "zikr:a": broken }))).toEqual({
      "zikr:a": stored,
    });
    const many = encodePattern(
      {
        templates: [matrix(20)],
        threshold: 0.5,
        learned: Array.from({ length: 9 }, (_, i) => matrix(10, i)),
      },
      "2026-11-24T00:00:00Z",
    );
    expect(many.learned).toHaveLength(5);
  });
});
