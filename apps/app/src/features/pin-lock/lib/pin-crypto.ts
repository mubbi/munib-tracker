/**
 * Local PIN hashing for app lock (SecureStore).
 *
 * Format: PIN4:<saltHex>:<iterations>:<digestHex> — PBKDF2-HMAC-SHA256.
 * A 6-digit PIN has only ~10^6 candidates, so a fast hash would be trivially
 * brute-forced offline if the SecureStore blob were extracted. A high PBKDF2
 * iteration count makes offline guessing far more expensive.
 */

import * as Crypto from "expo-crypto";

import { ensureWebCrypto } from "@/lib/crypto/ensure-web-crypto";

const PIN_PREFIX = "PIN4:";
const PBKDF2_ITERATIONS = 150_000;
const PBKDF2_KEY_BITS = 256;
export const PIN_LENGTH = 6;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function randomSaltHex(): Promise<string> {
  return bytesToHex(await Crypto.getRandomBytesAsync(16));
}

async function derivePbkdf2(saltHex: string, pin: string, iterations: number): Promise<string> {
  ensureWebCrypto();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: hexToBytes(saltHex), iterations, hash: "SHA-256" },
    keyMaterial,
    PBKDF2_KEY_BITS,
  );
  return bytesToHex(new Uint8Array(bits));
}

/** Normalize to exactly 6 digits (keypad-only input); null when invalid. */
export function normalizePin(pin: string): string | null {
  const digits = pin.replace(/\D/g, "");
  return digits.length === PIN_LENGTH ? digits : null;
}

export async function hashPin(pin: string): Promise<string> {
  const normalized = normalizePin(pin);
  if (!normalized) throw new Error(`PIN must be ${PIN_LENGTH} digits`);
  const saltHex = await randomSaltHex();
  const digest = await derivePbkdf2(saltHex, normalized, PBKDF2_ITERATIONS);
  return `${PIN_PREFIX}${saltHex}:${PBKDF2_ITERATIONS}:${digest}`;
}

export async function verifyPinHash(pin: string, stored: string): Promise<boolean> {
  const normalized = normalizePin(pin);
  if (!normalized || !stored.startsWith(PIN_PREFIX)) return false;

  const [saltHex, iterStr, digest] = stored.slice(PIN_PREFIX.length).split(":");
  const iterations = Number.parseInt(iterStr ?? "", 10);
  if (!saltHex || !Number.isFinite(iterations) || !digest) return false;

  const computed = await derivePbkdf2(saltHex, normalized, iterations).catch(() => "");
  return computed !== "" && timingSafeEqual(computed, digest);
}
