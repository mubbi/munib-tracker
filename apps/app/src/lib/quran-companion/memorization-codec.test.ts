import { buildMemorizationRecord } from "@/test-support/fixtures/quran-companion";

import { decodeMap, decodeRecord, encodeMap, encodeRecord } from "./memorization-codec";

describe("memorization codec", () => {
  it("round-trips a record, including lastSuccessAt", () => {
    const record = buildMemorizationRecord({
      lastAttemptAt: "2026-01-01T00:00:00.000Z",
      lastSuccessAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });
    expect(decodeRecord(encodeRecord(record))).toEqual(record);
  });

  it.each(["learning", "practising", "needs_revision"] as const)(
    "round-trips status %s",
    (status) => {
      const decoded = decodeRecord(encodeRecord(buildMemorizationRecord({ status })));
      expect(decoded?.status).toBe(status);
    },
  );

  it("encodes missing / invalid timestamps as 0 and omits lastSuccessAt", () => {
    const stored = encodeRecord(
      buildMemorizationRecord({
        lastAttemptAt: "nope",
        lastSuccessAt: undefined,
        updatedAt: undefined as never,
      }),
    );
    expect(stored).toMatchObject({ a: 0, u: 0 });
    expect(stored).not.toHaveProperty("w");
    expect(encodeRecord(buildMemorizationRecord({ status: "mystery" as never })).s).toBe("l");
  });

  it("decodes with defaults and rejects records without a review date", () => {
    expect(decodeRecord({ s: "x", n: "2026-01-01" } as never)).toMatchObject({
      status: "learning",
      successStreak: 0,
      intervalDays: 0,
      lapses: 0,
      lastAttemptAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      lastSuccessAt: undefined,
    });
    expect(decodeRecord(null as never)).toBeNull();
    expect(decodeRecord({ s: "l" } as never)).toBeNull();
  });

  it("decodes maps, dropping invalid records", () => {
    const map = encodeMap({ "1:1": buildMemorizationRecord() });
    const decoded = decodeMap({ ...map, records: { ...map.records, "1:2": { s: "l" } as never } });
    expect(Object.keys(decoded)).toEqual(["1:1"]);
    expect(decodeMap({ schemaVersion: 1 } as never)).toEqual({});
  });
});
