import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";

import { encodeMap, encodeRecord } from "./memorization-codec";
import {
  asMemorizationMap,
  asPracticeHistory,
  EMPTY_HISTORY,
  EMPTY_MEMORIZATION,
  MAX_HISTORY,
  mergeMemorization,
  mergeSessions,
  normalizeHistory,
} from "./merge";
import type { MemorizationRecord, PracticeSummary } from "./types";

function rec(updatedAt: string, intervalDays = 1): MemorizationRecord {
  return {
    status: "practising",
    successStreak: 1,
    intervalDays,
    nextReviewAt: "2026-11-18",
    lastAttemptAt: updatedAt,
    lapses: 0,
    updatedAt,
  };
}

function summary(id: string, endedAt: string): PracticeSummary {
  return {
    id,
    mode: "check",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    startedAt: endedAt,
    endedAt,
    durationMs: 1000,
    engine: "tilawa-zipformer",
    engineVersion: "x",
    matched: 4,
    uncertain: 0,
    confirmedMismatch: 0,
    corrected: 0,
    notReached: 0,
    weakAyahs: [],
  };
}

describe("mergeMemorization (D7)", () => {
  it("keeps different ayahs from both devices", () => {
    const a = encodeMap({ "1:1": rec("2026-11-17T08:00:00.000Z") });
    const b = encodeMap({ "1:2": rec("2026-11-17T09:00:00.000Z") });
    expect(Object.keys(mergeMemorization(a, b).records).sort()).toEqual(["1:1", "1:2"]);
  });

  it("converges on the later record for the same ayah, from either side", () => {
    const older = encodeMap({ "1:1": rec("2026-11-17T08:00:00.000Z", 1) });
    const newer = encodeMap({ "1:1": rec("2026-11-17T09:00:00.000Z", 3) });
    expect(mergeMemorization(older, newer).records["1:1"].i).toBe(3);
    expect(mergeMemorization(newer, older).records["1:1"].i).toBe(3);
  });

  it("leaves a newer-schema local blob untouched", () => {
    const future = { schemaVersion: 2, records: { "1:1": "opaque" } };
    expect(mergeMemorization(future, encodeMap({}))).toBe(future);
  });

  it("6,236 compact records stay under 600 KB", () => {
    const records: Record<string, ReturnType<typeof encodeRecord>> = {};
    let n = 0;
    for (let s = 1; s <= 114 && n < 6236; s++) {
      for (let a = 1; a <= 286 && n < 6236; a++, n++) {
        records[`${s}:${a}`] = encodeRecord(rec("2026-11-17T09:00:00.000Z", 30));
      }
    }
    const bytes = JSON.stringify({ schemaVersion: 1, records }).length;
    expect(n).toBe(6236);
    expect(bytes).toBeLessThan(600_000);
  });
});

describe("mergeSessions (D7)", () => {
  it("unions by id and keeps the newest 30", () => {
    const local = {
      schemaVersion: 1,
      items: Array.from({ length: 20 }, (_, i) =>
        summary(`a${i}`, `2026-11-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`),
      ),
    };
    const remote = {
      schemaVersion: 1,
      items: Array.from({ length: 20 }, (_, i) =>
        summary(`b${i}`, `2026-10-${String(i + 1).padStart(2, "0")}T00:00:00.000Z`),
      ),
    };
    const merged = mergeSessions(local, remote);
    expect(merged.items).toHaveLength(MAX_HISTORY);
    expect(merged.items[0].id).toBe("a19");
  });

  it("a delete on one device propagates and cannot be undone by an offline device", () => {
    const cleared = { schemaVersion: 1, clearedAt: "2026-11-17T12:00:00.000Z", items: [] };
    const offline = { schemaVersion: 1, items: [summary("old", "2026-11-17T10:00:00.000Z")] };
    expect(mergeSessions(offline, cleared).items).toEqual([]);
    expect(mergeSessions(cleared, offline).items).toEqual([]);
    const after = summary("new", "2026-11-17T13:00:00.000Z");
    expect(mergeSessions({ ...offline, items: [after] }, cleared).items.map((i) => i.id)).toEqual([
      "new",
    ]);
  });
});

describe("merge edge cases", () => {
  it.each([null, "x", [1]])("coerces %p to empty blobs", (value) => {
    expect(asMemorizationMap(value)).toEqual(EMPTY_MEMORIZATION);
    expect(asPracticeHistory(value)).toEqual(EMPTY_HISTORY);
  });

  it("returns null for blobs written by a newer schema", () => {
    expect(asMemorizationMap({ schemaVersion: 2 })).toBeNull();
    expect(asPracticeHistory({ schemaVersion: 2 })).toBeNull();
  });

  it("drops malformed fields", () => {
    expect(asMemorizationMap({ records: [1] })).toEqual({ schemaVersion: 1, records: {} });
    expect(asPracticeHistory({ items: "x", clearedAt: 5 })).toEqual({
      schemaVersion: 1,
      items: [],
    });
  });

  it("leaves newer local blobs untouched and ignores newer remote blobs", () => {
    const newer = { schemaVersion: 2, records: { a: 1 } };
    expect(mergeMemorization(newer, {})).toBe(newer);
    expect(mergeMemorization({ records: { "1:1": { u: 1 } } }, newer)).toEqual({
      schemaVersion: 1,
      records: { "1:1": { u: 1 } },
    });
    const newerHistory = { schemaVersion: 2, items: [] };
    expect(mergeSessions(newerHistory, {})).toBe(newerHistory);
    expect(mergeSessions({ items: [] }, newerHistory)).toEqual({ schemaVersion: 1, items: [] });
  });

  it("keeps local records on equal or missing timestamps", () => {
    const merged = mergeMemorization(
      { records: { a: { u: 5, n: "local" }, b: { n: "local-b" } } },
      { records: { a: { u: 5, n: "remote" }, b: { n: "remote-b" } } },
    );
    expect(merged.records.a).toMatchObject({ n: "local" });
    expect(merged.records.b).toMatchObject({ n: "local-b" });
  });

  it("dedupes history by id, keeping the latest copy, and skips invalid items", () => {
    const history = normalizeHistory({
      schemaVersion: 1,
      items: [
        buildPracticeSummary({ id: "a", endedAt: "2026-01-01T00:00:00.000Z" }),
        buildPracticeSummary({ id: "a", endedAt: "2026-01-02T00:00:00.000Z" }),
        buildPracticeSummary({ id: "b", endedAt: "2026-01-02T00:00:00.000Z" }),
        { id: "", endedAt: "x" } as never,
        null as never,
      ],
    });
    expect(history.items.map((i) => `${i.id}@${i.endedAt.slice(0, 10)}`)).toEqual([
      "a@2026-01-02",
      "b@2026-01-02",
    ]);
  });
});
