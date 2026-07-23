import { randomBytes } from "node:crypto";
import { redisNamespace } from "../redis/cacheKeys";
import { getRedisClient } from "../redis/redisClient";
import type { AuthSessionResponseDto } from "./dto/auth.dto";

const TTL_MS = 10 * 60 * 1000;
/** Unambiguous alphabet (no 0/O/1/I). */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export type TvPairingPending = {
  status: "pending";
  createdAt: number;
};

export type TvPairingReady = {
  status: "ready";
  createdAt: number;
  session: AuthSessionResponseDto;
};

export type TvPairingRecord = TvPairingPending | TvPairingReady;

type MemoryEntry = { record: TvPairingRecord; expiresAt: number };

const memory = new Map<string, MemoryEntry>();

function redisKey(code: string): string {
  return `${redisNamespace()}:tv-pair:${code}`;
}

function pruneMemory(now = Date.now()): void {
  for (const [code, entry] of memory) {
    if (entry.expiresAt <= now) memory.delete(code);
  }
}

export function generateTvPairingCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    const byte = bytes[i] ?? 0;
    out += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }
  return out;
}

export function normalizeTvPairingCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function formatTvPairingCode(code: string): string {
  const normalized = normalizeTvPairingCode(code);
  if (normalized.length !== CODE_LENGTH) return normalized;
  return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
}

export async function saveTvPairing(
  code: string,
  record: TvPairingRecord,
  ttlMs = TTL_MS,
): Promise<void> {
  const expiresAt = Date.now() + ttlMs;
  pruneMemory();
  memory.set(code, { record, expiresAt });

  const redis = getRedisClient();
  if (!redis?.isOpen) return;
  try {
    await redis.set(redisKey(code), JSON.stringify(record), {
      EX: Math.max(1, Math.ceil(ttlMs / 1000)),
    });
  } catch {
    // Memory already holds the record.
  }
}

export async function loadTvPairing(code: string): Promise<TvPairingRecord | null> {
  const normalized = normalizeTvPairingCode(code);
  if (!normalized) return null;

  const redis = getRedisClient();
  if (redis?.isOpen) {
    try {
      const raw = await redis.get(redisKey(normalized));
      if (typeof raw === "string" && raw.length > 0) {
        return JSON.parse(raw) as TvPairingRecord;
      }
    } catch {
      // Fall through to memory.
    }
  }

  pruneMemory();
  const entry = memory.get(normalized);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memory.delete(normalized);
    return null;
  }
  return entry.record;
}

export async function deleteTvPairing(code: string): Promise<void> {
  const normalized = normalizeTvPairingCode(code);
  memory.delete(normalized);
  const redis = getRedisClient();
  if (!redis?.isOpen) return;
  try {
    await redis.del(redisKey(normalized));
  } catch {
    // Ignore.
  }
}

/** Test helper. */
export function resetTvPairingMemory(): void {
  memory.clear();
}

export const TV_PAIRING_TTL_MS = TTL_MS;
