import type {
  MemorizationMap,
  MemorizationRecord,
  MemorizationRecords,
  MemorizationStatus,
  StoredMemorizationRecord,
} from "./types";

const TO_CODE: Record<MemorizationStatus, StoredMemorizationRecord["s"]> = {
  learning: "l",
  practising: "p",
  needs_revision: "r",
};
const FROM_CODE: Record<StoredMemorizationRecord["s"], MemorizationStatus> = {
  l: "learning",
  p: "practising",
  r: "needs_revision",
};

function toSeconds(iso: string | undefined): number | undefined {
  if (!iso) return undefined;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : undefined;
}

function toIso(seconds: number | undefined): string | undefined {
  return typeof seconds === "number" && Number.isFinite(seconds)
    ? new Date(seconds * 1000).toISOString()
    : undefined;
}

export function encodeRecord(r: MemorizationRecord): StoredMemorizationRecord {
  const out: StoredMemorizationRecord = {
    s: TO_CODE[r.status] ?? "l",
    k: r.successStreak,
    i: r.intervalDays,
    n: r.nextReviewAt,
    a: toSeconds(r.lastAttemptAt) ?? 0,
    l: r.lapses,
    u: toSeconds(r.updatedAt) ?? 0,
  };
  const w = toSeconds(r.lastSuccessAt);
  if (w != null) out.w = w;
  return out;
}

export function decodeRecord(s: StoredMemorizationRecord): MemorizationRecord | null {
  if (!s || typeof s !== "object" || typeof s.n !== "string") return null;
  return {
    status: FROM_CODE[s.s] ?? "learning",
    successStreak: Number(s.k) || 0,
    intervalDays: Number(s.i) || 0,
    nextReviewAt: s.n,
    lastAttemptAt: toIso(s.a) ?? new Date(0).toISOString(),
    lastSuccessAt: toIso(s.w),
    lapses: Number(s.l) || 0,
    updatedAt: toIso(s.u) ?? new Date(0).toISOString(),
  };
}

export function encodeMap(records: MemorizationRecords): MemorizationMap {
  const out: MemorizationMap["records"] = {};
  for (const [key, record] of Object.entries(records)) out[key] = encodeRecord(record);
  return { schemaVersion: 1, records: out };
}

export function decodeMap(map: MemorizationMap): MemorizationRecords {
  const out: MemorizationRecords = {};
  for (const [key, stored] of Object.entries(map.records ?? {})) {
    const record = decodeRecord(stored);
    if (record) out[key] = record;
  }
  return out;
}
